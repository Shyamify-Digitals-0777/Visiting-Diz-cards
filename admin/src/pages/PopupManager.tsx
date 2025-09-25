import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Gift,
  Calendar,
  Users,
  BarChart3,
  X,
  Save,
} from 'lucide-react';
import { supabase, PopupOffer } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const PopupManager: React.FC = () => {
  const [popups, setPopups] = useState<PopupOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPopup, setEditingPopup] = useState<PopupOffer | null>(null);
  const [previewPopup, setPreviewPopup] = useState<PopupOffer | null>(null);

  // Sample popup data for demonstration
  const mockPopups: PopupOffer[] = [
    {
      id: 'welcome-discount',
      title: '🎉 Welcome to Harvinder Telecom!',
      description: 'Get exclusive discount on your first purchase. Limited time offer for new customers!',
      discount: '10% OFF',
      code: 'WELCOME10',
      background_color: 'bg-gradient-to-r from-blue-600 to-purple-600',
      text_color: 'text-white',
      button_text: 'Claim Discount',
      button_color: 'bg-white text-blue-600 hover:bg-gray-100',
      expiry_date: '2024-12-31T23:59:59Z',
      is_active: true,
      show_on_load: true,
      delay_seconds: 3,
      max_shows_per_user: 3,
      target_url: 'https://wa.me/919876543210?text=Hi! I want to use the WELCOME10 discount code',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    },
    {
      id: 'flash-sale',
      title: '⚡ Flash Sale Alert!',
      description: 'Massive discounts on smartphones! Hurry up, limited stock available.',
      discount: 'Up to 25% OFF',
      background_color: 'bg-gradient-to-r from-red-500 to-orange-500',
      text_color: 'text-white',
      button_text: 'Shop Now',
      button_color: 'bg-white text-red-600 hover:bg-gray-100',
      expiry_date: '2024-02-01T23:59:59Z',
      is_active: true,
      show_on_load: true,
      delay_seconds: 5,
      max_shows_per_user: 2,
      target_url: '#products',
      created_at: '2024-01-14T10:00:00Z',
      updated_at: '2024-01-14T10:00:00Z',
    },
    {
      id: 'emi-offer',
      title: '💳 Zero Cost EMI Available',
      description: 'Buy your favorite smartphone with 0% interest EMI. No hidden charges!',
      discount: '0% EMI',
      background_color: 'bg-gradient-to-r from-green-500 to-teal-500',
      text_color: 'text-white',
      button_text: 'Check EMI Options',
      button_color: 'bg-white text-green-600 hover:bg-gray-100',
      is_active: false,
      show_on_load: true,
      delay_seconds: 10,
      max_shows_per_user: 1,
      target_url: '#finance',
      created_at: '2024-01-13T10:00:00Z',
      updated_at: '2024-01-13T10:00:00Z',
    },
  ];

  useEffect(() => {
    fetchPopups();
  }, []);

  const fetchPopups = async () => {
    try {
      setLoading(true);
      // In a real implementation:
      // const { data, error } = await supabase.from('popup_offers').select('*').order('created_at', { ascending: false });
      // if (error) throw error;
      // setPopups(data || []);
      
      setPopups(mockPopups);
    } catch (error) {
      console.error('Error fetching popups:', error);
      toast.error('Failed to fetch popup offers');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (popupId: string, isActive: boolean) => {
    try {
      // In a real implementation:
      // const { error } = await supabase
      //   .from('popup_offers')
      //   .update({ is_active: isActive, updated_at: new Date().toISOString() })
      //   .eq('id', popupId);
      // if (error) throw error;

      setPopups(popups.map(popup => 
        popup.id === popupId 
          ? { ...popup, is_active: isActive, updated_at: new Date().toISOString() }
          : popup
      ));
      
      toast.success(`Popup ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating popup status:', error);
      toast.error('Failed to update popup status');
    }
  };

  const handleDeletePopup = async (popupId: string) => {
    if (!confirm('Are you sure you want to delete this popup offer?')) return;

    try {
      // In a real implementation:
      // const { error } = await supabase.from('popup_offers').delete().eq('id', popupId);
      // if (error) throw error;

      setPopups(popups.filter(popup => popup.id !== popupId));
      toast.success('Popup deleted successfully');
    } catch (error) {
      console.error('Error deleting popup:', error);
      toast.error('Failed to delete popup');
    }
  };

  const filteredPopups = popups.filter(popup =>
    popup.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    popup.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: popups.length,
    active: popups.filter(p => p.is_active).length,
    expired: popups.filter(p => p.expiry_date && new Date(p.expiry_date) < new Date()).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Popup Manager</h1>
          <p className="text-gray-600">Manage promotional popups and discount offers</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="admin-button-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Popup
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="admin-card">
          <div className="flex items-center">
            <Gift className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Popups</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="admin-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search popup offers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-input pl-10"
          />
        </div>
      </div>

      {/* Popups Table */}
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
                  <th className="admin-table-head">Popup</th>
                  <th className="admin-table-head">Discount</th>
                  <th className="admin-table-head">Status</th>
                  <th className="admin-table-head">Expiry</th>
                  <th className="admin-table-head">Settings</th>
                  <th className="admin-table-head">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPopups.map((popup) => (
                  <motion.tr
                    key={popup.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="admin-table-row"
                  >
                    <td className="admin-table-cell">
                      <div>
                        <div className="font-medium text-gray-900">{popup.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">{popup.description}</div>
                        {popup.code && (
                          <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mt-1 inline-block">
                            Code: {popup.code}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="admin-table-cell">
                      <span className="font-semibold text-blue-600">{popup.discount}</span>
                    </td>
                    <td className="admin-table-cell">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          popup.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {popup.is_active ? 'Active' : 'Inactive'}
                        </span>
                        {popup.expiry_date && new Date(popup.expiry_date) < new Date() && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Expired
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="admin-table-cell">
                      {popup.expiry_date ? (
                        <div className="text-sm">
                          <div className="text-gray-900">
                            {format(new Date(popup.expiry_date), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-gray-500">
                            {format(new Date(popup.expiry_date), 'HH:mm')}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500">No expiry</span>
                      )}
                    </td>
                    <td className="admin-table-cell">
                      <div className="text-sm space-y-1">
                        <div>Delay: {popup.delay_seconds}s</div>
                        <div>Max shows: {popup.max_shows_per_user}</div>
                        <div>On load: {popup.show_on_load ? 'Yes' : 'No'}</div>
                      </div>
                    </td>
                    <td className="admin-table-cell">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setPreviewPopup(popup)}
                          className="p-1 text-blue-600 hover:text-blue-900"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingPopup(popup)}
                          className="p-1 text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(popup.id, !popup.is_active)}
                          className={`p-1 ${popup.is_active ? 'text-gray-600 hover:text-gray-900' : 'text-green-600 hover:text-green-900'}`}
                          title={popup.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {popup.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeletePopup(popup.id)}
                          className="p-1 text-red-600 hover:text-red-900"
                          title="Delete"
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

      {/* Add/Edit Popup Modal */}
      {(showAddModal || editingPopup) && (
        <PopupFormModal
          popup={editingPopup}
          onClose={() => {
            setShowAddModal(false);
            setEditingPopup(null);
          }}
          onSave={(popup) => {
            if (editingPopup) {
              setPopups(popups.map(p => p.id === popup.id ? popup : p));
              toast.success('Popup updated successfully');
            } else {
              setPopups([popup, ...popups]);
              toast.success('Popup created successfully');
            }
            setShowAddModal(false);
            setEditingPopup(null);
          }}
        />
      )}

      {/* Preview Modal */}
      {previewPopup && (
        <PopupPreviewModal
          popup={previewPopup}
          onClose={() => setPreviewPopup(null)}
        />
      )}
    </div>
  );
};

// Popup Form Modal Component
interface PopupFormModalProps {
  popup: PopupOffer | null;
  onClose: () => void;
  onSave: (popup: PopupOffer) => void;
}

const PopupFormModal: React.FC<PopupFormModalProps> = ({ popup, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<PopupOffer>>({
    id: popup?.id || '',
    title: popup?.title || '',
    description: popup?.description || '',
    discount: popup?.discount || '',
    code: popup?.code || '',
    background_color: popup?.background_color || 'bg-gradient-to-r from-blue-600 to-purple-600',
    text_color: popup?.text_color || 'text-white',
    button_text: popup?.button_text || 'Claim Offer',
    button_color: popup?.button_color || 'bg-white text-blue-600 hover:bg-gray-100',
    expiry_date: popup?.expiry_date || '',
    is_active: popup?.is_active ?? true,
    show_on_load: popup?.show_on_load ?? true,
    delay_seconds: popup?.delay_seconds || 3,
    max_shows_per_user: popup?.max_shows_per_user || 3,
    target_url: popup?.target_url || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.id) {
      formData.id = formData.title?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'popup-' + Date.now();
    }

    onSave({
      ...formData,
      created_at: popup?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as PopupOffer);
  };

  const backgroundOptions = [
    { value: 'bg-gradient-to-r from-blue-600 to-purple-600', label: 'Blue to Purple' },
    { value: 'bg-gradient-to-r from-red-500 to-orange-500', label: 'Red to Orange' },
    { value: 'bg-gradient-to-r from-green-500 to-teal-500', label: 'Green to Teal' },
    { value: 'bg-gradient-to-r from-purple-600 to-pink-600', label: 'Purple to Pink' },
    { value: 'bg-gradient-to-r from-yellow-500 to-orange-500', label: 'Yellow to Orange' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {popup ? 'Edit Popup' : 'Add New Popup'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="admin-input"
                placeholder="🎉 Welcome Offer!"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount *
              </label>
              <input
                type="text"
                required
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className="admin-input"
                placeholder="10% OFF"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="admin-textarea"
              rows={3}
              placeholder="Describe your offer..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Code
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="admin-input"
                placeholder="WELCOME10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Text *
              </label>
              <input
                type="text"
                required
                value={formData.button_text}
                onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                className="admin-input"
                placeholder="Claim Offer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Style
            </label>
            <select
              value={formData.background_color}
              onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
              className="admin-select"
            >
              {backgroundOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delay (seconds)
              </label>
              <input
                type="number"
                min="0"
                max="60"
                value={formData.delay_seconds}
                onChange={(e) => setFormData({ ...formData, delay_seconds: parseInt(e.target.value) })}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Shows per User
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.max_shows_per_user}
                onChange={(e) => setFormData({ ...formData, max_shows_per_user: parseInt(e.target.value) })}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="datetime-local"
                value={formData.expiry_date ? formData.expiry_date.slice(0, 16) : ''}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value ? e.target.value + ':00Z' : '' })}
                className="admin-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target URL
            </label>
            <input
              type="text"
              value={formData.target_url}
              onChange={(e) => setFormData({ ...formData, target_url: e.target.value })}
              className="admin-input"
              placeholder="https://wa.me/919876543210 or #products"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.show_on_load}
                onChange={(e) => setFormData({ ...formData, show_on_load: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Show on page load</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="admin-button-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-button-primary"
            >
              <Save className="w-4 h-4 mr-2" />
              {popup ? 'Update Popup' : 'Create Popup'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Popup Preview Modal Component
interface PopupPreviewModalProps {
  popup: PopupOffer;
  onClose: () => void;
}

const PopupPreviewModal: React.FC<PopupPreviewModalProps> = ({ popup, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Popup Preview</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          {/* Render the actual popup as it would appear */}
          <div className={`${popup.background_color} rounded-xl p-6 text-center relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 bg-white rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Gift className="w-6 h-6 text-white" />
              </div>
              
              <h4 className={`text-xl font-bold ${popup.text_color} mb-3`}>
                {popup.title}
              </h4>
              
              <p className={`${popup.text_color} text-opacity-90 mb-4 text-sm`}>
                {popup.description}
              </p>
              
              <div className="bg-white/20 rounded-lg p-3 mb-4">
                <div className="text-2xl font-bold text-white">
                  {popup.discount}
                </div>
                {popup.code && (
                  <div className="text-white/80 text-sm mt-1">
                    Code: {popup.code}
                  </div>
                )}
              </div>
              
              <button className={`w-full ${popup.button_color} py-3 px-4 rounded-lg font-bold transition-all duration-300`}>
                {popup.button_text}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupManager;