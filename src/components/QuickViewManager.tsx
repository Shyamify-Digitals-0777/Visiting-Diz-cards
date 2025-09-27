import React, { useState, useEffect } from 'react';
import { Eye, AlertCircle, Loader2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductModal from './ProductModal';
import { validateProductData, extractProductId, trackQuickViewEvent, QuickViewError } from '../utils/quickViewUtils';
import { useAdminData } from '../hooks/useAdminData';

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  reviews_count: number;
  features: string[];
  in_stock: boolean;
  isNew?: boolean;
  discount?: string;
  brand: string;
  description?: string;
  sizes?: string[];
  colors?: string[];
  stock_count?: number;
}

interface QuickViewManagerProps {
  isDarkMode?: boolean;
}

const QuickViewManager: React.FC<QuickViewManagerProps> = ({ isDarkMode = false }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const maxRetryAttempts = 3;
  
  // Get dynamic product data from Supabase
  const { products } = useAdminData();

  // Enhanced error handling with retry mechanism
  const showErrorNotification = (message: string, isRetryable: boolean = false) => {
    setError(message);
    
    // Auto-hide error after 5 seconds
    setTimeout(() => {
      setError(null);
    }, 5000);
    
    // Show browser notification if available
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Quick View Error', {
        body: message,
        icon: '/favicon.ico'
      });
    }
  };

  // Initialize event listeners when component mounts
  useEffect(() => {
    const handleQuickViewClick = async (event: Event) => {
      const target = event.target as HTMLElement;
      const button = target.closest('.quick-view-btn, [data-quick-view]') as HTMLElement;
      
      if (!button) return;

      event.preventDefault();
      event.stopPropagation();

      const productId = extractProductId(button);
      
      if (!productId) {
        showErrorNotification('Product ID not found. Please try again.');
        return;
      }

      await handleQuickView(productId);
    };

    // Add event listeners to existing quick view buttons with enhanced selectors
    const quickViewButtons = document.querySelectorAll('.quick-view-btn, [data-quick-view], .product-quick-view');
    quickViewButtons.forEach(button => {
      button.addEventListener('click', handleQuickViewClick);
    });

    // Use MutationObserver to handle dynamically added buttons
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            const newButtons = element.querySelectorAll('.quick-view-btn, [data-quick-view], .product-quick-view');
            newButtons.forEach(button => {
              button.addEventListener('click', handleQuickViewClick);
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Cleanup function
    return () => {
      quickViewButtons.forEach(button => {
        button.removeEventListener('click', handleQuickViewClick);
      });
      observer.disconnect();
    };
  }, []);

  // Handle quick view functionality
  const handleQuickView = async (productId: number, retryCount: number = 0) => {
    setIsLoading(true);
    setError(null);
    setRetryAttempts(retryCount);

    try {
      // Simulate API call delay with progressive timeout
      const timeout = Math.min(300 + (retryCount * 200), 1000);
      await new Promise(resolve => setTimeout(resolve, timeout));

      // Find product in dynamic data
      const rawProduct = products.find(p => p.id === productId);
      
      if (!rawProduct) {
        throw new QuickViewError(`Product with ID ${productId} not found`, 'PRODUCT_NOT_FOUND');
      }

      // Transform product data to match expected interface
      const product: Product = {
        id: rawProduct.id,
        name: rawProduct.name,
        price: rawProduct.price,
        originalPrice: rawProduct.original_price || undefined,
        image: rawProduct.image_url,
        images: rawProduct.images ? JSON.parse(rawProduct.images) : [rawProduct.image_url],
        category: rawProduct.category,
        rating: rawProduct.rating || 4.5,
        reviews_count: rawProduct.reviews_count || 0,
        features: rawProduct.features ? JSON.parse(rawProduct.features) : [],
        in_stock: rawProduct.in_stock,
        isNew: rawProduct.is_new || false,
        discount: rawProduct.discount || undefined,
        brand: rawProduct.brand,
        description: rawProduct.description || undefined,
        sizes: rawProduct.sizes ? JSON.parse(rawProduct.sizes) : [],
        colors: rawProduct.colors ? JSON.parse(rawProduct.colors) : [],
        stock_count: rawProduct.stock_count || undefined
      };

      // Validate product data using utility function
      validateProductData(product);

      setSelectedProduct(product);
      setShowModal(true);
      setRetryAttempts(0);
      
      // Enhanced analytics tracking
      trackQuickViewEvent('quick_view_opened', productId, product.name, {
        category: product.category,
        brand: product.brand,
        price: product.price,
        retryAttempts: retryCount
      });

    } catch (err) {
      const error = err instanceof QuickViewError ? err : new QuickViewError('Failed to load product details');
      console.error('Quick view error:', err);
      
      // Implement retry logic for network errors
      if (retryCount < maxRetryAttempts && error.code !== 'PRODUCT_NOT_FOUND') {
        console.log(`Retrying quick view... Attempt ${retryCount + 1}/${maxRetryAttempts}`);
        setTimeout(() => {
          handleQuickView(productId, retryCount + 1);
        }, 1000 * (retryCount + 1)); // Progressive delay
        return;
      }
      
      // Show error notification with retry option
      const isRetryable = retryCount < maxRetryAttempts && error.code !== 'PRODUCT_NOT_FOUND';
      showErrorNotification(error.message, isRetryable);
      
      // Track error for analytics
      trackQuickViewEvent('quick_view_error', productId, undefined, {
        error: error.message,
        code: error.code,
        retryAttempts: retryCount
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setError(null);
    setRetryAttempts(0);
    
    // Track modal close event
    if (selectedProduct) {
      trackQuickViewEvent('quick_view_closed', selectedProduct.id, selectedProduct.name);
    }
  };

  // Retry function for failed requests
  const handleRetry = () => {
    if (selectedProduct) {
      handleQuickView(selectedProduct.id, 0);
    }
  };

  // This component doesn't render anything visible, it just manages the quick view functionality
  return (
    <>
      {/* Loading indicator for quick view */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 flex flex-col items-center gap-4 max-w-sm mx-4 shadow-2xl"
          >
            <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
            <div className="text-center">
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Loading product details...
              </span>
              {retryAttempts > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Retry attempt {retryAttempts}/{maxRetryAttempts}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Enhanced Error notification */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg max-w-sm"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800">Quick View Error</h4>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              {retryAttempts < maxRetryAttempts && (
                <button
                  onClick={handleRetry}
                  className="text-sm text-red-600 hover:text-red-800 font-medium mt-2 underline"
                >
                  Try Again
                </button>
              )}
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={showModal}
        onClose={handleCloseModal}
        product={selectedProduct}
        isDarkMode={isDarkMode}
      />
    </>
  );
};

export default QuickViewManager;