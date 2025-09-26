import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, CreditCard as Edit, Trash2, Eye, Package, AlertCircle, CheckCircle, X } from 'lucide-react';
import { supabase, Product } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { AdminAPI } from '../lib/api';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  // Mock data for demonstration
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      price: '₹1,59,900',
      original_price: '₹1,69,900',
      image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Smartphones',
      brand: 'Apple',
      description: 'Latest iPhone with A17 Pro chip',
      features: ['A17 Pro Chip', 'Titanium Design', '48MP Camera'],
      in_stock: true,
      is_new: true,
      discount: '6% OFF',
      rating: 4.8,
      reviews_count: 1247,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra',
      price: '₹1,24,999',
      original_price: '₹1,34,999',
      image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Smartphones',
      brand: 'Samsung',
      description: 'Premium flagship with S Pen',
      features: ['200MP Camera', 'S Pen', '5000mAh Battery'],
      in_stock: true,
      is_new: true,
      discount: '7% OFF',
      rating: 4.7,
      reviews_count: 892,
      created_at: '2024-01-14T10:00:00Z',
      updated_at: '2024-01-14T10:00:00Z',
    },
    {
      id: 3,
      name: 'OnePlus 12',
      price: '₹64,999',
      original_price: '₹69,999',
      image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Smartphones',
      brand: 'OnePlus',
      description: 'Flagship killer with Snapdragon 8 Gen 3',
      features: ['Snapdragon 8 Gen 3', '100W Charging', 'Hasselblad Camera'],
      in_stock: false,
      is_new: false,
      discount: '8% OFF',
      rating: 4.6,
      reviews_count: 634,
      created_at: '2024-01-13T10:00:00Z',
      updated_at: '2024-01-13T10:00:00Z',
    },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const result = await AdminAPI.getProducts({
        search: searchTerm,
        category: selectedCategory === 'all' ? undefined : selectedCategory
      });
      
      setProducts(result.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
      // Fallback to mock data
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await AdminAPI.deleteProduct(id);
      
      setProducts(products.filter(p => p.id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) return;

    try {
      await Promise.all(selectedProducts.map(id => AdminAPI.deleteProduct(id)));
      
      setProducts(products.filter(p => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
      toast.success(`${selectedProducts.length} products deleted successfully`);
    } catch (error) {
      console.error('Error deleting products:', error);
      toast.error('Failed to delete products');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="admin-button-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="admin-card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-input pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="admin-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          {selectedProducts.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="admin-button-danger"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected ({selectedProducts.length})
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
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
                      checked={selectedProducts.length === filteredProducts.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts(filteredProducts.map(p => p.id));
                        } else {
                          setSelectedProducts([]);
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="admin-table-head">Product</th>
                  <th className="admin-table-head">Category</th>
                  <th className="admin-table-head">Price</th>
                  <th className="admin-table-head">Stock</th>
                  <th className="admin-table-head">Rating</th>
                  <th className="admin-table-head">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="admin-table-row"
                  >
                    <td className="admin-table-cell">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts([...selectedProducts, product.id]);
                          } else {
                            setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="admin-table-cell">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.brand}</div>
                          <div className="flex items-center space-x-2 mt-1">
                            {product.is_new && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                New
                              </span>
                            )}
                            {product.discount && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                {product.discount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="admin-table-cell">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="admin-table-cell">
                      <div className="text-sm font-medium text-gray-900">{product.price}</div>
                      {product.original_price && (
                        <div className="text-sm text-gray-500 line-through">{product.original_price}</div>
                      )}
                    </td>
                    <td className="admin-table-cell">
                      <div className="flex items-center">
                        {product.in_stock ? (
                          <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm ${product.in_stock ? 'text-green-700' : 'text-red-700'}`}>
                          {product.in_stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </td>
                    <td className="admin-table-cell">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({product.reviews_count})</span>
                      </div>
                    </td>
                    <td className="admin-table-cell">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-1 text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
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

      {/* Add/Edit Product Modal */}
      {(showAddModal || editingProduct) && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }}
          onSave={(product) => {
            if (editingProduct) {
              setProducts(products.map(p => p.id === product.id ? product : p));
              toast.success('Product updated successfully');
            } else {
              setProducts([...products, { ...product, id: Date.now() }]);
              toast.success('Product added successfully');
            }
            setShowAddModal(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

// Product Modal Component
interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: product?.name || '',
    price: product?.price || '',
    original_price: product?.original_price || '',
    category: product?.category || 'Smartphones',
    brand: product?.brand || '',
    description: product?.description || '',
    features: product?.features || [],
    in_stock: product?.in_stock ?? true,
    is_new: product?.is_new || false,
    discount: product?.discount || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...product,
      ...formData,
      id: product?.id || 0,
      image: product?.image || 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: product?.rating || 0,
      reviews_count: product?.reviews_count || 0,
      created_at: product?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Product);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand *
              </label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="admin-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="text"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="admin-input"
                placeholder="₹99,999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Original Price
              </label>
              <input
                type="text"
                value={formData.original_price}
                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                className="admin-input"
                placeholder="₹1,09,999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="admin-select"
              >
                <option value="Smartphones">Smartphones</option>
                <option value="Audio">Audio</option>
                <option value="Wearables">Wearables</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="admin-textarea"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount
              </label>
              <input
                type="text"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className="admin-input"
                placeholder="10% OFF"
              />
            </div>
            <div className="flex items-center space-x-4 pt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.in_stock}
                  onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">In Stock</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_new}
                  onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">New Product</span>
              </label>
            </div>
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
              {product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Products;