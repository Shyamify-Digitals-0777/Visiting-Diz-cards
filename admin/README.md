# Admin Panel - Harvinder Telecom

A comprehensive administrative interface for managing the Harvinder Telecom digital visiting card website.

## 🚀 Features

### Authentication & Security
- ✅ Secure login/logout with Supabase Auth
- ✅ Role-based access control (Admin, Super Admin)
- ✅ Session management with automatic timeout
- ✅ Password reset functionality
- ✅ Activity logging for audit trails
- ✅ CSRF protection and input validation

### Content Management
- ✅ **Product Management**: Add, edit, delete, and organize products
- ✅ **Review Moderation**: Approve, reject, and manage customer reviews
- ✅ **User Management**: View and manage user accounts
- ✅ **Category Management**: Organize products by categories
- ✅ **Brand Management**: Manage brand information
- ✅ **Media Management**: Upload and organize images

### Dashboard & Analytics
- ✅ **Real-time Dashboard**: Key metrics and performance indicators
- ✅ **Analytics**: Visitor tracking, conversion rates, and user behavior
- ✅ **Charts & Graphs**: Visual representation of data
- ✅ **Export Functionality**: Download reports in CSV/PDF format

### Admin Interface
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Dark/Light Mode**: Theme switching capability
- ✅ **Search & Filtering**: Advanced search across all content
- ✅ **Bulk Actions**: Efficient management of multiple items
- ✅ **Real-time Updates**: Live data synchronization

## 🛠 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Build Tool**: Vite
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

### Setup Instructions

1. **Clone and navigate to admin directory**
   ```bash
   cd admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_ADMIN_URL=http://localhost:3002
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

4. **Database Setup**
   
   Run the migration file in your Supabase SQL editor:
   ```bash
   # Copy the contents of supabase/migrations/create_admin_tables.sql
   # and run it in your Supabase project's SQL editor
   ```

5. **Create Admin User**
   
   In Supabase SQL editor, create your first admin user:
   ```sql
   -- First, create the user in Supabase Auth (do this via Supabase dashboard)
   -- Then add them to admin_users table:
   INSERT INTO admin_users (id, email, role, full_name, is_active)
   VALUES (
     'your-auth-user-id', -- Get this from auth.users table
     'admin@example.com',
     'super_admin',
     'Admin User',
     true
   );
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

7. **Access Admin Panel**
   
   Open http://localhost:3002 and login with your admin credentials.

## 🔐 Security Features

### Authentication
- Secure session management with Supabase Auth
- Automatic session timeout after inactivity
- Password strength requirements
- Account lockout after failed attempts

### Authorization
- Role-based access control (RBAC)
- Resource-level permissions
- Admin activity logging
- IP address tracking

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF token validation

## 📊 Database Schema

### Core Tables
- `admin_users` - Administrator accounts
- `products` - Product catalog
- `reviews` - Customer reviews
- `categories` - Product categories
- `brands` - Brand information
- `activity_logs` - Admin activity tracking
- `site_settings` - Website configuration

### Security Features
- Row Level Security (RLS) enabled
- Admin-only access policies
- Audit trail logging
- Data encryption at rest

## 🎯 Usage Guide

### Dashboard
- View key metrics and performance indicators
- Monitor real-time visitor activity
- Track conversion rates and user behavior
- Export analytics reports

### Product Management
- Add new products with images and details
- Edit existing product information
- Manage inventory and stock levels
- Organize products by categories and brands

### Review Moderation
- Review pending customer feedback
- Approve or reject reviews
- Bulk actions for efficient moderation
- Export review data

### User Management
- View registered users
- Manage user accounts and permissions
- Track user activity and engagement
- Handle user-related issues

### Settings
- Configure site-wide settings
- Manage admin user accounts
- Set up notification preferences
- Database maintenance tools

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

### Environment Variables (Production)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
VITE_ADMIN_URL=https://admin.yourdomain.com
VITE_API_BASE_URL=https://api.yourdomain.com
NODE_ENV=production
```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the migration SQL file
3. Configure authentication settings
4. Set up Row Level Security policies
5. Create admin users

### Custom Branding
- Update logo and favicon in `public/` directory
- Modify color scheme in `tailwind.config.js`
- Customize site name and description in settings

## 📈 Performance Optimization

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Automatic image compression
- **Caching**: Browser and CDN caching strategies
- **Bundle Analysis**: Monitor bundle size and dependencies

## 🛡️ Security Best Practices

1. **Regular Updates**: Keep dependencies updated
2. **Access Control**: Implement least privilege principle
3. **Monitoring**: Set up security monitoring and alerts
4. **Backups**: Regular database backups
5. **SSL/TLS**: Use HTTPS in production
6. **Environment Variables**: Never commit secrets to version control

## 🐛 Troubleshooting

### Common Issues

**Login Issues**
- Verify Supabase credentials in `.env`
- Check if admin user exists in `admin_users` table
- Ensure RLS policies are correctly configured

**Database Connection**
- Verify Supabase URL and keys
- Check network connectivity
- Review database logs in Supabase dashboard

**Build Errors**
- Clear node_modules and reinstall dependencies
- Check for TypeScript errors
- Verify all environment variables are set

### Support
For technical support or questions:
- Check the documentation
- Review error logs
- Contact the development team

## 📝 License

This admin panel is part of the Harvinder Telecom Digital Visiting Card project.
All rights reserved.

---

**Made with ❤️ for Harvinder Telecom**  
*Secure • Scalable • User-Friendly*