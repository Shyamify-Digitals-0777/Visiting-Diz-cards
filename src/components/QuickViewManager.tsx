import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import ProductModal from './ProductModal';

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  reviews: number;
  features: string[];
  inStock: boolean;
  isNew?: boolean;
  discount?: string;
  brand: string;
  description?: string;
  sizes?: string[];
  colors?: string[];
  stockCount?: number;
}

interface QuickViewManagerProps {
  isDarkMode?: boolean;
}

const QuickViewManager: React.FC<QuickViewManagerProps> = ({ isDarkMode = false }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sample product database - in production, this would come from an API
  const productDatabase: Record<number, Product> = {
    1: {
      id: 1,
      name: "iPhone 15 Pro Max",
      price: "₹1,59,900",
      originalPrice: "₹1,69,900",
      image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=500",
      images: [
        "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=500",
        "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=500",
        "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=500"
      ],
      category: "Smartphones",
      rating: 4.8,
      reviews: 1247,
      features: ["A17 Pro Chip", "Titanium Design", "48MP Camera", "Action Button"],
      inStock: true,
      isNew: true,
      discount: "6% OFF",
      brand: "Apple",
      description: "The ultimate iPhone with titanium design, A17 Pro chip, and revolutionary camera system for professional photography.",
      sizes: ["128GB", "256GB", "512GB", "1TB"],
      colors: ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"],
      stockCount: 15
    },
    2: {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      price: "₹1,24,999",
      originalPrice: "₹1,34,999",
      image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=500",
      images: [
        "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=500",
        "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=500"
      ],
      category: "Smartphones",
      rating: 4.7,
      reviews: 892,
      features: ["200MP Camera", "S Pen", "5000mAh Battery", "Galaxy AI"],
      inStock: true,
      isNew: true,
      discount: "7% OFF",
      brand: "Samsung",
      description: "Experience the power of Galaxy AI with S Pen, 200MP camera, and all-day battery life in this premium flagship.",
      sizes: ["256GB", "512GB", "1TB"],
      colors: ["Titanium Black", "Titanium Gray", "Titanium Violet", "Titanium Yellow"],
      stockCount: 8
    },
    3: {
      id: 3,
      name: "OnePlus 12",
      price: "₹64,999",
      originalPrice: "₹69,999",
      image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=500",
      category: "Smartphones",
      rating: 4.6,
      reviews: 634,
      features: ["Snapdragon 8 Gen 3", "100W Charging", "Hasselblad Camera"],
      inStock: true,
      discount: "8% OFF",
      brand: "OnePlus",
      description: "Never Settle with Snapdragon 8 Gen 3, Hasselblad camera system, and 100W SuperVOOC charging technology.",
      sizes: ["128GB", "256GB", "512GB"],
      colors: ["Silky Black", "Flowy Emerald", "Sunset Dune"],
      stockCount: 12
    }
  };

  // Initialize event listeners when component mounts
  useEffect(() => {
    const handleQuickViewClick = async (event: Event) => {
      const target = event.target as HTMLElement;
      const button = target.closest('.quick-view-btn') as HTMLElement;
      
      if (!button) return;

      event.preventDefault();
      event.stopPropagation();

      const productId = button.getAttribute('data-product-id');
      
      if (!productId) {
        setError('Product ID not found');
        return;
      }

      await handleQuickView(parseInt(productId));
    };

    // Add event listeners to existing quick view buttons
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');
    quickViewButtons.forEach(button => {
      button.addEventListener('click', handleQuickViewClick);
    });

    // Use MutationObserver to handle dynamically added buttons
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            const newButtons = element.querySelectorAll('.quick-view-btn');
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
  const handleQuickView = async (productId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const product = productDatabase[productId];
      
      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }

      // Validate product data
      if (!product.name || !product.price) {
        throw new Error('Invalid product data: missing required fields');
      }

      setSelectedProduct(product);
      setShowModal(true);
      
      // Analytics tracking (optional)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'quick_view', {
          event_category: 'product',
          event_label: product.name,
          product_id: productId
        });
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load product details';
      setError(errorMessage);
      console.error('Quick view error:', err);
      
      // Show user-friendly error message
      alert(`Sorry, we couldn't load the product details. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setError(null);
  };

  // This component doesn't render anything visible, it just manages the quick view functionality
  return (
    <>
      {/* Loading indicator for quick view */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700 dark:text-gray-300">Loading product details...</span>
          </div>
        </div>
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