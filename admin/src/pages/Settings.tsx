import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Lock,
  Bell,
  Globe,
  Database,
  Shield,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    bio: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    reviewAlerts: true,
    orderAlerts: true,
    systemAlerts: false,
  });

  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Harvinder Telecom',
    siteDescription: 'Your trusted mobile and electronics partner',
    contactEmail: 'info@harvinder-telecom.com',
    contactPhone: '+91 98765 43210',
    address: 'Shop No. 15, Main Market, Sector 22, Chandigarh',
    maintenanceMode: false,
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'site', label: 'Site Settings', icon: Globe },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'security-logs', label: 'Security Logs', icon: Shield },
  ];

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real implementation:
      // const { error } = await supabase.auth.updateUser({
      //   data: { full_name: profileData.fullName }
      // });
      // if (error) throw error;

      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      // In a real implementation:
      // const { error } = await supabase.auth.updateUser({
      //   password: passwordData.newPassword
      // });
      // if (error) throw error;

      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setLoading(true);

    try {
      // In a real implementation, save to database
      toast.success('Notification settings updated');
    } catch (error) {
      toast.error('Failed to update notification settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSiteSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real implementation, save to database
      toast.success('Site settings updated successfully');
    } catch (error) {
      toast.error('Failed to update site settings');
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="admin-input bg-gray-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="admin-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                rows={4}
                className="admin-textarea"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="admin-button-primary"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="admin-input pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="admin-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="admin-input"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="admin-button-primary"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Two-factor authentication is not yet enabled. This feature will be available in a future update.
                </p>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
            
            <div className="space-y-4">
              {Object.entries(notificationSettings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <p className="text-xs text-gray-500">
                      {key === 'emailNotifications' && 'Receive email notifications for important updates'}
                      {key === 'pushNotifications' && 'Receive push notifications in your browser'}
                      {key === 'reviewAlerts' && 'Get notified when new reviews are submitted'}
                      {key === 'orderAlerts' && 'Get notified about new orders and inquiries'}
                      {key === 'systemAlerts' && 'Receive system maintenance and security alerts'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        [key]: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNotificationUpdate}
                disabled={loading}
                className="admin-button-primary"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>
        );

      case 'site':
        return (
          <form onSubmit={handleSiteSettingsUpdate} className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Site Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={siteSettings.siteName}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={siteSettings.contactEmail}
                  onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                  className="admin-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Description
              </label>
              <textarea
                value={siteSettings.siteDescription}
                onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })}
                rows={3}
                className="admin-textarea"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={siteSettings.contactPhone}
                  onChange={(e) => setSiteSettings({ ...siteSettings, contactPhone: e.target.value })}
                  className="admin-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Address
              </label>
              <textarea
                value={siteSettings.address}
                onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                rows={2}
                className="admin-textarea"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div>
                <label className="text-sm font-medium text-red-800">Maintenance Mode</label>
                <p className="text-xs text-red-600">Enable to show maintenance page to visitors</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={siteSettings.maintenanceMode}
                  onChange={(e) => setSiteSettings({ ...siteSettings, maintenanceMode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="admin-button-primary"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        );

      case 'database':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Database Management</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="admin-card">
                <h4 className="font-medium text-gray-900 mb-2">Database Status</h4>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Connected</span>
                </div>
              </div>
              
              <div className="admin-card">
                <h4 className="font-medium text-gray-900 mb-2">Last Backup</h4>
                <p className="text-sm text-gray-600">January 15, 2024 at 3:00 AM</p>
              </div>
            </div>

            <div className="space-y-4">
              <button className="admin-button-primary">
                <Database className="w-4 h-4 mr-2" />
                Create Backup
              </button>
              
              <button className="admin-button-secondary">
                <Database className="w-4 h-4 mr-2" />
                View Backup History
              </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Database Maintenance</h4>
              <p className="text-sm text-yellow-700">
                Regular database maintenance is performed automatically. Manual maintenance should only be performed by experienced administrators.
              </p>
            </div>
          </div>
        );

      case 'security-logs':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Security Activity</h3>
            
            <div className="space-y-4">
              {[
                { action: 'Admin login', user: 'admin@example.com', time: '2 hours ago', ip: '192.168.1.1', status: 'success' },
                { action: 'Password change', user: 'admin@example.com', time: '1 day ago', ip: '192.168.1.1', status: 'success' },
                { action: 'Failed login attempt', user: 'unknown@example.com', time: '2 days ago', ip: '10.0.0.1', status: 'failed' },
                { action: 'Product updated', user: 'admin@example.com', time: '3 days ago', ip: '192.168.1.1', status: 'success' },
              ].map((log, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{log.action}</div>
                    <div className="text-sm text-gray-500">{log.user} • {log.ip}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">{log.time}</div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your admin panel configuration and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${
                    activeTab === tab.id ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="admin-card"
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;