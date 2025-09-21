import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  MessageSquare,
  Users,
  TrendingUp,
  Eye,
  ShoppingCart,
  Star,
  Calendar,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';

interface DashboardStats {
  totalProducts: number;
  totalReviews: number;
  totalUsers: number;
  averageRating: number;
  pendingReviews: number;
  outOfStockProducts: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalReviews: 0,
    totalUsers: 0,
    averageRating: 0,
    pendingReviews: 0,
    outOfStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  // Sample data for charts
  const salesData = [
    { name: 'Jan', sales: 4000, visitors: 2400 },
    { name: 'Feb', sales: 3000, visitors: 1398 },
    { name: 'Mar', sales: 2000, visitors: 9800 },
    { name: 'Apr', sales: 2780, visitors: 3908 },
    { name: 'May', sales: 1890, visitors: 4800 },
    { name: 'Jun', sales: 2390, visitors: 3800 },
  ];

  const categoryData = [
    { name: 'Smartphones', value: 45, color: '#3B82F6' },
    { name: 'Accessories', value: 30, color: '#10B981' },
    { name: 'Audio', value: 15, color: '#F59E0B' },
    { name: 'Wearables', value: 10, color: '#EF4444' },
  ];

  const recentActivity = [
    { id: 1, action: 'New product added', item: 'iPhone 15 Pro Max', time: '2 hours ago', type: 'product' },
    { id: 2, action: 'Review approved', item: 'Samsung Galaxy S24', time: '4 hours ago', type: 'review' },
    { id: 3, action: 'User registered', item: 'john@example.com', time: '6 hours ago', type: 'user' },
    { id: 4, action: 'Product updated', item: 'OnePlus 12', time: '8 hours ago', type: 'product' },
    { id: 5, action: 'Review rejected', item: 'Spam review', time: '1 day ago', type: 'review' },
  ];

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, you would fetch from your Supabase tables
      // For now, using mock data
      setStats({
        totalProducts: 156,
        totalReviews: 342,
        totalUsers: 1247,
        averageRating: 4.6,
        pendingReviews: 12,
        outOfStockProducts: 8,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'Total Reviews',
      value: stats.totalReviews,
      icon: MessageSquare,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive',
    },
    {
      title: 'Website Visitors',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-purple-500',
      change: '+23%',
      changeType: 'positive',
    },
    {
      title: 'Average Rating',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: 'bg-yellow-500',
      change: '+0.2',
      changeType: 'positive',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="admin-card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <div className="flex items-center mt-1">
                    <span className={`text-sm font-medium ${
                      card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {card.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="admin-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales & Visitors</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="visitors" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="admin-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 admin-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full ${
                  activity.type === 'product' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'review' ? 'bg-green-100 text-green-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {activity.type === 'product' ? <Package className="w-4 h-4" /> :
                   activity.type === 'review' ? <MessageSquare className="w-4 h-4" /> :
                   <Users className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.item}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="admin-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full admin-button-primary">
              <Package className="w-4 h-4 mr-2" />
              Add New Product
            </button>
            <button className="w-full admin-button-secondary">
              <MessageSquare className="w-4 h-4 mr-2" />
              Review Pending ({stats.pendingReviews})
            </button>
            <button className="w-full admin-button-secondary">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Analytics
            </button>
            <button className="w-full admin-button-secondary">
              <Eye className="w-4 h-4 mr-2" />
              Preview Website
            </button>
          </div>

          {/* Alerts */}
          <div className="mt-6 space-y-2">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-800">
                {stats.outOfStockProducts} products are out of stock
              </p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-800">
                {stats.pendingReviews} reviews need approval
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;