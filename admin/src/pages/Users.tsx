import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users as UsersIcon,
  Search,
  Filter,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Eye,
  Ban,
  Trash2,
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  status: 'active' | 'suspended' | 'banned';
  last_sign_in_at?: string;
  created_at: string;
  total_reviews: number;
  total_orders: number;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'banned'>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Mock data for demonstration
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'rajesh.kumar@example.com',
      full_name: 'Rajesh Kumar',
      status: 'active',
      last_sign_in_at: '2024-01-15T10:00:00Z',
      created_at: '2023-06-15T10:00:00Z',
      total_reviews: 5,
      total_orders: 12,
    },
    {
      id: '2',
      email: 'priya.sharma@example.com',
      full_name: 'Priya Sharma',
      status: 'active',
      last_sign_in_at: '2024-01-14T15:30:00Z',
      created_at: '2023-08-22T10:00:00Z',
      total_reviews: 3,
      total_orders: 8,
    },
    {
      id: '3',
      email: 'amit.singh@example.com',
      full_name: 'Amit Singh',
      status: 'suspended',
      last_sign_in_at: '2024-01-10T09:15:00Z',
      created_at: '2023-12-01T10:00:00Z',
      total_reviews: 1,
      total_orders: 2,
    },
    {
      id: '4',
      email: 'spam.user@example.com',
      status: 'banned',
      last_sign_in_at: '2024-01-05T12:00:00Z',
      created_at: '2024-01-01T10:00:00Z',
      total_reviews: 0,
      total_orders: 0,
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // In a real implementation:
      // const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      // if (error) throw error;
      // setUsers(data || []);
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'suspended' | 'banned') => {
    try {
      // In a real implementation:
      // const { error } = await supabase
      //   .from('users')
      //   .update({ status: newStatus })
      //   .eq('id', userId);
      // if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      
      toast.success(`User ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      // In a real implementation:
      // const { error } = await supabase.from('users').delete().eq('id', userId);
      // if (error) throw error;

      setUsers(users.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      case 'banned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <UserCheck className="w-4 h-4 text-green-600" />;
      case 'suspended':
        return <UserX className="w-4 h-4 text-yellow-600" />;
      case 'banned':
        return <Ban className="w-4 h-4 text-red-600" />;
      default:
        return <UsersIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    banned: users.filter(u => u.status === 'banned').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="admin-card">
          <div className="flex items-center">
            <UsersIcon className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <div className="flex items-center">
            <UserCheck className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <div className="flex items-center">
            <UserX className="w-8 h-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Suspended</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.suspended}</p>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <div className="flex items-center">
            <Ban className="w-8 h-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Banned</p>
              <p className="text-2xl font-bold text-red-600">{stats.banned}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-input pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="admin-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-card p-0">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead className="admin-table-header">
                <tr>
                  <th className="admin-table-head">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredUsers.map(u => u.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="admin-table-head">User</th>
                  <th className="admin-table-head">Status</th>
                  <th className="admin-table-head">Activity</th>
                  <th className="admin-table-head">Joined</th>
                  <th className="admin-table-head">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="admin-table-row"
                  >
                    <td className="admin-table-cell">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="admin-table-cell">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt={user.full_name || user.email}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 font-medium text-sm">
                                {(user.full_name || user.email).charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.full_name || 'No name'}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="admin-table-cell">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(user.status)}
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="admin-table-cell">
                      <div className="text-sm">
                        <div className="text-gray-900">{user.total_reviews} reviews</div>
                        <div className="text-gray-500">{user.total_orders} orders</div>
                        {user.last_sign_in_at && (
                          <div className="text-xs text-gray-400">
                            Last seen: {format(new Date(user.last_sign_in_at), 'MMM dd')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="admin-table-cell">
                      <div className="text-sm text-gray-900">
                        {format(new Date(user.created_at), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="admin-table-cell">
                      <div className="flex items-center space-x-2">
                        {user.status === 'active' && (
                          <button
                            onClick={() => handleStatusChange(user.id, 'suspended')}
                            className="p-1 text-yellow-600 hover:text-yellow-900"
                            title="Suspend User"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        )}
                        {user.status === 'suspended' && (
                          <button
                            onClick={() => handleStatusChange(user.id, 'active')}
                            className="p-1 text-green-600 hover:text-green-900"
                            title="Activate User"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                        {user.status !== 'banned' && (
                          <button
                            onClick={() => handleStatusChange(user.id, 'banned')}
                            className="p-1 text-red-600 hover:text-red-900"
                            title="Ban User"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1 text-red-600 hover:text-red-900"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;