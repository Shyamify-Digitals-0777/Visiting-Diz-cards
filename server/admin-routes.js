import express from 'express';
import { supabase } from '../admin/src/lib/supabase.js';

const router = express.Router();

// Middleware to verify admin authentication
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check if user is admin
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .eq('is_active', true)
      .single();

    if (adminError || !adminUser) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.user = user;
    req.adminUser = adminUser;
    next();
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Dashboard stats
router.get('/dashboard/stats', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('get_dashboard_stats');
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Products CRUD
router.get('/products', verifyAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, brand } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.textSearch('name', search);
    }
    if (category) {
      query = query.eq('category', category);
    }
    if (brand) {
      query = query.eq('brand', brand);
    }

    const { data, error, count } = await query;
    
    if (error) throw error;
    
    res.json({
      products: data,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.post('/products', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([req.body])
      .select()
      .single();
    
    if (error) throw error;
    
    // Log activity
    await supabase.rpc('log_admin_activity', {
      p_admin_user_id: req.adminUser.id,
      p_action: 'create',
      p_resource_type: 'product',
      p_resource_id: data.id.toString(),
      p_details: { name: data.name }
    });
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.put('/products/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('products')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Log activity
    await supabase.rpc('log_admin_activity', {
      p_admin_user_id: req.adminUser.id,
      p_action: 'update',
      p_resource_type: 'product',
      p_resource_id: id,
      p_details: { name: data.name }
    });
    
    res.json(data);
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/products/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get product name for logging
    const { data: product } = await supabase
      .from('products')
      .select('name')
      .eq('id', id)
      .single();
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // Log activity
    await supabase.rpc('log_admin_activity', {
      p_admin_user_id: req.adminUser.id,
      p_action: 'delete',
      p_resource_type: 'product',
      p_resource_id: id,
      p_details: { name: product?.name }
    });
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Product deletion error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Reviews CRUD
router.get('/reviews', verifyAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,title.ilike.%${search}%,message.ilike.%${search}%`);
    }

    const { data, error, count } = await query;
    
    if (error) throw error;
    
    res.json({
      reviews: data,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Reviews fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

router.put('/reviews/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const { data, error } = await supabase
      .from('reviews')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Log activity
    await supabase.rpc('log_admin_activity', {
      p_admin_user_id: req.adminUser.id,
      p_action: `review_${status}`,
      p_resource_type: 'review',
      p_resource_id: id,
      p_details: { title: data.title, status }
    });
    
    res.json(data);
  } catch (error) {
    console.error('Review status update error:', error);
    res.status(500).json({ error: 'Failed to update review status' });
  }
});

router.delete('/reviews/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get review title for logging
    const { data: review } = await supabase
      .from('reviews')
      .select('title')
      .eq('id', id)
      .single();
    
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // Log activity
    await supabase.rpc('log_admin_activity', {
      p_admin_user_id: req.adminUser.id,
      p_action: 'delete',
      p_resource_type: 'review',
      p_resource_id: id,
      p_details: { title: review?.title }
    });
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Review deletion error:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// Activity logs
router.get('/activity-logs', verifyAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('activity_logs')
      .select(`
        *,
        admin_users!inner(email, full_name)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    res.json({
      logs: data,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Activity logs fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
});

// Site settings
router.get('/settings', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('key');
    
    if (error) throw error;
    
    // Convert to key-value object
    const settings = {};
    data.forEach(setting => {
      settings[setting.key] = setting.value;
    });
    
    res.json(settings);
  } catch (error) {
    console.error('Settings fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.put('/settings', verifyAdmin, async (req, res) => {
  try {
    const updates = [];
    
    for (const [key, value] of Object.entries(req.body)) {
      updates.push({
        key,
        value: JSON.stringify(value),
        updated_at: new Date().toISOString()
      });
    }
    
    const { error } = await supabase
      .from('site_settings')
      .upsert(updates, { onConflict: 'key' });
    
    if (error) throw error;
    
    // Log activity
    await supabase.rpc('log_admin_activity', {
      p_admin_user_id: req.adminUser.id,
      p_action: 'update',
      p_resource_type: 'site_settings',
      p_details: { keys: Object.keys(req.body) }
    });
    
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Analytics endpoints
router.get('/analytics/overview', verifyAdmin, async (req, res) => {
  try {
    // In a real implementation, you would fetch actual analytics data
    // For now, returning mock data
    const mockData = {
      visitors: {
        total: 12345,
        change: 12.5,
        data: [
          { date: '2024-01-01', count: 1200 },
          { date: '2024-01-02', count: 1100 },
          { date: '2024-01-03', count: 1400 },
          { date: '2024-01-04', count: 1300 },
          { date: '2024-01-05', count: 1600 },
          { date: '2024-01-06', count: 1800 },
          { date: '2024-01-07', count: 1500 }
        ]
      },
      pageViews: {
        total: 45678,
        change: 8.2,
        data: [
          { date: '2024-01-01', count: 2400 },
          { date: '2024-01-02', count: 2200 },
          { date: '2024-01-03', count: 2800 },
          { date: '2024-01-04', count: 2600 },
          { date: '2024-01-05', count: 3200 },
          { date: '2024-01-06', count: 3600 },
          { date: '2024-01-07', count: 3000 }
        ]
      },
      conversions: {
        total: 1234,
        change: 15.3,
        rate: 3.2
      }
    };
    
    res.json(mockData);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;