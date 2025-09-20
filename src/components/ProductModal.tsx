import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Heart, ShoppingCart, Plus, Minus, Truck, Shield, RotateCcw, Eye } from 'lucide-react';

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

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  isDarkMode?: boolean;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product, isDarkMode = false }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isQuickView, setIsQuickView] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Sample additional data for demonstration
  const productImages = product?.images || [
    product?.image || '',
    'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400'
  ].filter(Boolean);

  const productSizes = product?.sizes || ['64GB', '128GB', '256GB', '512GB'];
  const productColors = product?.colors || ['Space Black', 'Silver', 'Gold', 'Deep Purple'];

  // Handle escape key press and focus management
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
      
      // Focus management - focus close button when modal opens
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setSelectedSize(productSizes[0] || '');
      setSelectedColor(productColors[0] || '');
      setQuantity(1);
      setIsLoading(false);
    }
  }, [product]);

  // Handle outside click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Keyboard navigation within modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const message = `Hi! I want to purchase ${product?.name} (${selectedSize}, ${selectedColor}) - Quantity: ${quantity}. Price: ${product?.price}`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    setIsLoading(false);
  };

  const handleAddToWishlist = () => {
    setIsFavorite(!isFavorite);
    // Here you would typically save to wishlist
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-yellow-400'
            : index < rating
            ? 'text-yellow-400 fill-yellow-200'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (!isOpen || !product) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-modal-title"
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div>
              <h2 id="product-modal-title" className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Product Details
              </h2>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                {product.brand} • {product.category}
              </p>
            </div>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className={`p-2 hover:bg-gray-100 ${isDarkMode ? 'hover:bg-gray-700' : ''} rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              aria-label="Close product details"
            >
              <X className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>
          </div>

          {/* Content */}
          <div className="grid lg:grid-cols-2 gap-8 p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl overflow-hidden aspect-square`}>
                <img
                  src={productImages[selectedImage]}
                  alt={`${product.name} - Main product image`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              
              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    aria-label={`View image ${index + 1} of ${product.name}`}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : isDarkMode ? 'border-gray-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Product Name and Badges */}
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.isNew && (
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      NEW
                    </span>
                  )}
                  {product.discount && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {product.discount}
                    </span>
                  )}
                  <span className={`${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} text-xs font-medium px-2 py-1 rounded-full`}>
                    {product.category}
                  </span>
                </div>
                
                <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {product.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex">{renderStars(product.rating)}</div>
                  <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {product.rating}
                  </span>
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              {/* Pricing */}
              <div className="flex items-center gap-4">
                <span className={`text-3xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {product.price}
                </span>
                {product.originalPrice && (
                  <span className={`text-xl ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} line-through`}>
                    {product.originalPrice}
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  Description
                </h4>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                  {product.description || `Experience the latest ${product.name} with cutting-edge technology and premium design. This device offers exceptional performance, stunning display quality, and advanced features that make it perfect for both work and entertainment.`}
                </p>
              </div>

              {/* Features */}
              <div>
                <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                  Key Features
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'}`} />
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                  Storage Options
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {productSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`p-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : isDarkMode
                          ? 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                  Color Options
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {productColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`p-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                        selectedColor === color
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : isDarkMode
                          ? 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div>
                <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                  Quantity
                </h4>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={`p-2 rounded-lg border ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} transition-colors`}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className={`text-xl font-semibold px-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className={`p-2 rounded-lg border ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} transition-colors`}
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stock Status */}
              <div className={`p-4 rounded-lg ${product.inStock ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className={`font-semibold ${product.inStock ? 'text-green-800' : 'text-red-800'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                {product.stockCount && (
                  <p className={`text-sm mt-1 ${product.inStock ? 'text-green-700' : 'text-red-700'}`}>
                    {product.stockCount} units available
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <ShoppingCart className="w-5 h-5" />
                  )}
                  {isLoading ? 'Processing...' : 'Contact for Purchase'}
                </button>
                
                <button
                  onClick={handleAddToWishlist}
                  className={`w-full flex items-center justify-center gap-2 border-2 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    isFavorite
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : isDarkMode
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Added to Wishlist' : 'Add to Wishlist'}
                </button>
              </div>

              {/* Additional Info */}
              <div className={`grid grid-cols-3 gap-4 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="text-center">
                  <Truck className={`w-6 h-6 mx-auto mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Free Delivery</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>2-3 days</p>
                </div>
                <div className="text-center">
                  <Shield className={`w-6 h-6 mx-auto mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Warranty</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>1 Year</p>
                </div>
                <div className="text-center">
                  <RotateCcw className={`w-6 h-6 mx-auto mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Returns</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>7 days</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;