import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Search,
  Filter,
  Check,
  X,
  Star,
  Calendar,
  User,
  Eye,
  Trash2,
} from 'lucide-react';
import { supabase, Review } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { AdminAPI } from '../lib/api';

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedReviews, setSelectedReviews] = useState<number[]>([]);
  const [viewingReview, setViewingReview] = useState<Review | null>(null);

  // Mock data for demonstration
  const mockReviews: Review[] = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      rating: 5,
      title: 'Excellent Service & Genuine Products',
      message: 'Bought Samsung Galaxy S24 from Harvinder Telecom. Best price in the market and completely genuine product. Highly recommended!',
      status: 'approved',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya@example.com',
      rating: 5,
      title: 'Quick Service & Great Support',
      message: 'Amazing experience! Got my iPhone 15 with best EMI options. The staff is very helpful and knowledgeable.',
      status: 'pending',
      created_at: '2024-01-14T10:00:00Z',
      updated_at: '2024-01-14T10:00:00Z',
    },
    {
      id: 3,
      name: 'Amit Singh',
      email: 'amit@example.com',
      rating: 4,
      title: 'Good Quality Accessories',
      message: 'Purchased phone case and screen protector. Good quality products at reasonable prices.',
      status: 'approved',
      created_at: '2024-01-13T10:00:00Z',
      updated_at: '2024-01-13T10:00:00Z',
    },
    {
      id: 4,
      name: 'Anonymous User',
      rating: 1,
      title: 'Spam Review',
      message: 'This is clearly a spam review with inappropriate content.',
      status: 'rejected',
      created_at: '2024-01-12T10:00:00Z',
      updated_at: '2024-01-12T10:00:00Z',
    },
  ];

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const result = await AdminAPI.getReviews({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchTerm
      });
      
      setReviews(result.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to fetch reviews');
      // Fallback to mock data
      setReviews(mockReviews);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reviewId: number, newStatus: 'approved' | 'rejected') => {
    try {
      await AdminAPI.updateReviewStatus(reviewId, newStatus);

      setReviews(reviews.map(review => 
        review.id === reviewId 
          ? { ...review, status: newStatus, updated_at: new Date().toISOString() }
          : review
      ));
      
      toast.success(`Review ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating review status:', error);
      toast.error('Failed to update review status');
    }
  };

  const handleBulkStatusChange = async (newStatus: 'approved' | 'rejected') => {
    if (selectedReviews.length === 0) return;

    try {
      // In a real implementation:
      // const { error } = await supabase
      //   .from('reviews')
      //   .update({ status: newStatus, updated_at: new Date().toISOString() })
      //   .in('id', selectedReviews);
      // if (error) throw error;

      setReviews(reviews.map(review => 
        selectedReviews.includes(review.id)
          ? { ...review, status: newStatus, updated_at: new Date().toISOString() }
          : review
      ));
      
      setSelectedReviews([]);
      toast.success(`${selectedReviews.length} reviews ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating review statuses:', error);
      toast.error('Failed to update review statuses');
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await AdminAPI.deleteReview(reviewId);

      setReviews(reviews.filter(review => review.id !== reviewId));
      toast.success('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
    averageRating: reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
          <p className="text-gray-600">Manage customer reviews and feedback</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="admin-card">
          <div className="flex items-center">
            <MessageSquare className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 font-bold">!</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <div className="flex items-center">
            <Check className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <div className="flex items-center">
            <X className="w-8 h-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <div className="flex items-center">
            <Star className="w-8 h-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
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
                placeholder="Search reviews..."
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          {selectedReviews.length > 0 && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkStatusChange('approved')}
                className="admin-button-primary"
              >
                <Check className="w-4 h-4 mr-2" />
                Approve ({selectedReviews.length})
              </button>
              <button
                onClick={() => handleBulkStatusChange('rejected')}
                className="admin-button-danger"
              >
                <X className="w-4 h-4 mr-2" />
                Reject ({selectedReviews.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews List */}
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
                      checked={selectedReviews.length === filteredReviews.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedReviews(filteredReviews.map(r => r.id));
                        } else {
                          setSelectedReviews([]);
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="admin-table-head">Review</th>
                  <th className="admin-table-head">Rating</th>
                  <th className="admin-table-head">Status</th>
                  <th className="admin-table-head">Date</th>
                  <th className="admin-table-head">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((review) => (
                  <motion.tr
                    key={review.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="admin-table-row"
                  >
                    <td className="admin-table-cell">
                      <input
                        type="checkbox"
                        checked={selectedReviews.includes(review.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedReviews([...selectedReviews, review.id]);
                          } else {
                            setSelectedReviews(selectedReviews.filter(id => id !== review.id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="admin-table-cell">
                      <div className="max-w-md">
                        <div className="flex items-center space-x-2 mb-1">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{review.name}</span>
                          {review.email && (
                            <span className="text-sm text-gray-500">({review.email})</span>
                          )}
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{review.message}</p>
                      </div>
                    </td>
                    <td className="admin-table-cell">
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                        <span className="text-sm font-medium text-gray-900 ml-1">
                          {review.rating}
                        </span>
                      </div>
                    </td>
                    <td className="admin-table-cell">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                      </span>
                    </td>
                    <td className="admin-table-cell">
                      <div className="text-sm text-gray-900">
                        {format(new Date(review.created_at), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(review.created_at), 'HH:mm')}
                      </div>
                    </td>
                    <td className="admin-table-cell">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setViewingReview(review)}
                          className="p-1 text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {review.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(review.id, 'approved')}
                              className="p-1 text-green-600 hover:text-green-900"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(review.id, 'rejected')}
                              className="p-1 text-red-600 hover:text-red-900"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteReview(review.id)}
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

      {/* Review Detail Modal */}
      {viewingReview && (
        <ReviewDetailModal
          review={viewingReview}
          onClose={() => setViewingReview(null)}
          onStatusChange={(status) => {
            handleStatusChange(viewingReview.id, status);
            setViewingReview(null);
          }}
        />
      )}
    </div>
  );
};

// Review Detail Modal Component
interface ReviewDetailModalProps {
  review: Review;
  onClose: () => void;
  onStatusChange: (status: 'approved' | 'rejected') => void;
}

const ReviewDetailModal: React.FC<ReviewDetailModalProps> = ({ review, onClose, onStatusChange }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Review Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Review Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-900">{review.name}</span>
                {review.email && (
                  <span className="text-sm text-gray-500">({review.email})</span>
                )}
              </div>
              <div className="flex items-center space-x-2 mb-2">
                {renderStars(review.rating)}
                <span className="font-medium text-gray-900">{review.rating}/5</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {format(new Date(review.created_at), 'MMMM dd, yyyy \'at\' HH:mm')}
                </span>
              </div>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(review.status)}`}>
              {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
            </span>
          </div>

          {/* Review Content */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{review.title}</h3>
            <p className="text-gray-700 leading-relaxed">{review.message}</p>
          </div>

          {/* Actions */}
          {review.status === 'pending' && (
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                onClick={() => onStatusChange('rejected')}
                className="admin-button-danger"
              >
                <X className="w-4 h-4 mr-2" />
                Reject Review
              </button>
              <button
                onClick={() => onStatusChange('approved')}
                className="admin-button-primary"
              >
                <Check className="w-4 h-4 mr-2" />
                Approve Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;