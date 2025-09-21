import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Eye,
  ShoppingCart,
  Calendar,
  Download,
  Filter,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import LoadingSpinner from '../components/LoadingSpinner';

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');

  // Sample data for charts
  const visitorData = [
    { name: 'Mon', visitors: 1200, pageViews: 2400, conversions: 45 },
    { name: 'Tue', visitors: 1100, pageViews: 2200, conversions: 38 },
    { name: 'Wed', visitors: 1400, pageViews: 2800, conversions: 52 },
    { name: 'Thu', visitors: 1300, pageViews: 2600, conversions: 48 },
    { name: 'Fri', visitors: 1600, pageViews: 3200, conversions: 65 },
    { name: 'Sat', visitors: 1800, pageViews: 3600, conversions: 72 },
    { name: 'Sun', visitors: 1500, pageViews: 3000, conversions: 58 },
  ];

  const deviceData = [
    { name: 'Mobile', value: 65, color: '#3B82F6' },
    { name: 'Desktop', value: 25, color: '#10B981' },
    { name: 'Tablet', value: 10, color: '#F59E0B' },
  ];

  const topPages = [
    { page: '/', views: 12500, bounce: 35 },
    { page: '/products', views: 8900, bounce: 28 },
    { page: '/reviews', views: 5600, bounce: 42 },
    { page: '/contact', views: 3200, bounce: 25 },
    { page: '/about', views: 2100, bounce: 38 },
  ];

  const conversionFunnel = [
    { stage: 'Visitors', count: 10000, percentage: 100 },
    { stage: 'Product Views', count: 6500, percentage: 65 },
    { stage: 'Contact Initiated', count: 1200, percentage: 12 },
    { stage: 'Inquiries', count: 450, percentage: 4.5 },
    { stage: 'Conversions', count: 180, percentage: 1.8 },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const stats = [
    {
      title: 'Total Visitors',
      value: '12,345',
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Page Views',
      value: '45,678',
      change: '+8.2%',
      changeType: 'positive',
      icon: Eye,
      color: 'bg-green-500',
    },
    {
      title: 'Inquiries',
      value: '1,234',
      change: '+15.3%',
      changeType: 'positive',
      icon: ShoppingCart,
      color: 'bg-purple-500',
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '+0.5%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  const exportData = () => {
    // In a real implementation, this would generate and download a CSV/PDF report
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Visitors,Page Views,Conversions\n"
      + visitorData.map(row => `${row.name},${row.visitors},${row.pageViews},${row.conversions}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "analytics_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your website performance and user behavior</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="admin-select"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button onClick={exportData} className="admin-button-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="admin-card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-1">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last period</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitor Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="admin-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Visitor Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={visitorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="visitors" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="pageViews" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="admin-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="admin-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
          <div className="space-y-3">
            {conversionFunnel.map((stage, index) => (
              <div key={stage.stage} className="relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                  <span className="text-sm text-gray-500">{stage.count.toLocaleString()} ({stage.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stage.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="admin-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
          <div className="space-y-3">
            {topPages.map((page, index) => (
              <div key={page.page} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{page.page}</div>
                  <div className="text-sm text-gray-500">{page.views.toLocaleString()} views</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{page.bounce}%</div>
                  <div className="text-xs text-gray-500">bounce rate</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Detailed Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="admin-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Metrics</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={visitorData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="visitors" stroke="#3B82F6" strokeWidth={2} name="Visitors" />
            <Line type="monotone" dataKey="pageViews" stroke="#10B981" strokeWidth={2} name="Page Views" />
            <Line type="monotone" dataKey="conversions" stroke="#F59E0B" strokeWidth={2} name="Conversions" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="admin-card"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Real-time Visitors</h4>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-2xl font-bold text-gray-900">23</span>
            <span className="text-sm text-gray-500 ml-2">active now</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="admin-card"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Avg. Session Duration</h4>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">2m 34s</span>
            <span className="text-sm text-green-600 ml-2">+12%</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="admin-card"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Pages per Session</h4>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">3.2</span>
            <span className="text-sm text-green-600 ml-2">+5%</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;