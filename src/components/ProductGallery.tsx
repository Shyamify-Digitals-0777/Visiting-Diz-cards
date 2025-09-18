import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, Share2, Eye, ShoppingCart, Filter, Grid, List, ChevronDown } from 'lucide-react';
import ProductModal from './ProductModal';

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  features: string[];
  inStock: boolean;
  isNew?: boolean;
  discount?: string;
  brand: string;
}

interface ProductGalleryProps {
  animationConfig: any;
  isDarkMode?: boolean;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ animationConfig, isDarkMode = false }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>([]);
  const productsPerPage = 12;
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // Sample product data
  const allProducts: Product[] = [
    {
      id: 1,
      name: "iPhone 15 Pro",
      price: "₹1,34,900",
      originalPrice: "₹1,39,900",
      image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Smartphones",
      rating: 4.8,
      reviews: 1247,
      features: ["A17 Pro Chip", "Titanium Design", "48MP Camera"],
      inStock: true,
      isNew: true,
      discount: "4% OFF",
      brand: "Apple"
    },
    {
      id: 2,
      name: "Samsung Galaxy S24",
      price: "₹79,999",
      originalPrice: "₹84,999",
      image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Smartphones",
      rating: 4.7,
      reviews: 892,
      features: ["Snapdragon 8 Gen 3", "AI Camera", "120Hz Display"],
      inStock: true,
      discount: "6% OFF",
      brand: "Samsung"
    },
    {
      id: 3,
      name: "OnePlus 11R",
      price: "₹39,999",
      image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Smartphones",
      rating: 4.5,
      reviews: 634,
      features: ["Snapdragon 8+ Gen 1", "100W Charging", "50MP Camera"],
      inStock: true,
      brand: "OnePlus"
    },
    {
      id: 4,
      name: "Xiaomi 13 Pro",
      price: "₹79,999",
      originalPrice: "₹84,999",
      image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Smartphones",
      rating: 4.4,
      reviews: 456,
      features: ["Leica Camera", "Snapdragon 8 Gen 2", "120W Charging"],
      inStock: true,
      discount: "6% OFF",
      brand: "Xiaomi"
    },
    {
      id: 5,
      name: "AirPods Pro 2nd Gen",
      price: "₹24,900",
      image: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Audio",
      rating: 4.6,
      reviews: 789,
      features: ["Active Noise Cancellation", "Spatial Audio", "MagSafe"],
      inStock: true,
      isNew: true,
      brand: "Apple"
    },
    {
      id: 6,
      name: "Samsung Galaxy Buds2 Pro",
      price: "₹17,999",
      originalPrice: "₹19,999",
      image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Audio",
      rating: 4.3,
      reviews: 345,
      features: ["ANC", "360 Audio", "IPX7 Rating"],
      inStock: true,
      discount: "10% OFF",
      brand: "Samsung"
    },
    {
      id: 7,
      name: "Apple Watch Series 9",
      price: "₹41,900",
      image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Wearables",
      rating: 4.7,
      reviews: 567,
      features: ["S9 Chip", "Double Tap", "Always-On Display"],
      inStock: true,
      isNew: true,
      brand: "Apple"
    },
    {
      id: 8,
      name: "Samsung Galaxy Watch6",
      price: "₹31,999",
      originalPrice: "₹34,999",
      image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Wearables",
      rating: 4.4,
      reviews: 234,
      features: ["Wear OS", "Health Monitoring", "GPS"],
      inStock: true,
      discount: "9% OFF",
      brand: "Samsung"
    },
    // Add more products to demonstrate pagination
    ...Array.from({ length: 16 }, (_, i) => ({
      id: i + 9,
      name: `Product ${i + 9}`,
      price: `₹${(Math.random() * 100000 + 10000).toFixed(0)}`,
      image: `https://images.pexels.com/photos/${404280 + i}/pexels-photo-${404280 + i}.jpeg?auto=compress&cs=tinysrgb&w=400`,
      category: ['Smartphones', 'Audio', 'Wearables', 'Accessories'][Math.floor(Math.random() * 4)],
      rating: 4 + Math.random(),
      reviews: Math.floor(Math.random() * 1000) + 100,
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
      inStock: Math.random() > 0.1,
      brand: ['Apple', 'Samsung', 'OnePlus', 'Xiaomi'][Math.floor(Math.random() * 4)]
    }))
  ];

  useEffect(() => {
    setProducts(allProducts);
    setFilteredProducts(allProducts);
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Brand filter
    if (selectedBrand !== 'All') {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    // Price range filter
    if (priceRange !== 'All') {
      const price = (product: Product) => parseInt(product.price.replace(/[₹,]/g, ''));
      switch (priceRange) {
        case 'under-25k':
          filtered = filtered.filter(product => price(product) < 25000);
          break;
        case '25k-50k':
          filtered = filtered.filter(product => price(product) >= 25000 && price(product) < 50000);
          break;
        case '50k-100k':
          filtered = filtered.filter(product => price(product) >= 50000 && price(product) < 100000);
          break;
        case 'above-100k':
          filtered = filtered.filter(product => price(product) >= 100000);
          break;
      }
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => parseInt(a.price.replace(/[₹,]/g, '')) - parseInt(b.price.replace(/[₹,]/g, '')));
        break;
      case 'price-high':
        filtered.sort((a, b) => parseInt(b.price.replace(/[₹,]/g, '')) - parseInt(a.price.replace(/[₹,]/g, '')));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default: // popularity
        filtered.sort((a, b) => b.reviews - a.reviews);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, selectedCategory, selectedBrand, priceRange, sortBy]);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const brands = ['All', ...Array.from(new Set(products.map(p => p.brand)))];

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleShare = async (product: Product) => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} at Harvinder Telecom for ${product.price}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareData.title} - ${shareData.text}`)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleContact = (product: Product) => {
    const message = `Hi! I'm interested in ${product.name} (${product.price}). Is it available?`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleCloseModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
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

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  return (
    <section className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: animationConfig.motionDuration,
            ease: animationConfig.motionEasing
          }}
          className="text-center mb-12"
        >
          <h2 className={`text-4xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-900'} mb-4`}>
            Latest Products
          </h2>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Explore our complete collection of premium smartphones, accessories, and gadgets
          </p>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl p-6 mb-8`}
        >
          {/* Filter Toggle Button (Mobile) */}
          <div className="flex items-center justify-between mb-4 md:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} font-semibold`}
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Controls */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block space-y-4 md:space-y-0`}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              {/* Category Filter */}
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Brand
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Price Range
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="All">All Prices</option>
                  <option value="under-25k">Under ₹25,000</option>
                  <option value="25k-50k">₹25,000 - ₹50,000</option>
                  <option value="50k-100k">₹50,000 - ₹1,00,000</option>
                  <option value="above-100k">Above ₹1,00,000</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="popularity">Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>

              {/* View Mode (Desktop) */}
              <div className="hidden md:block">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  View
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-white text-gray-600'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-white text-gray-600'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Showing {startIndex + 1}-{Math.min(startIndex + productsPerPage, filteredProducts.length)} of {filteredProducts.length} products
              </span>
            </div>
          </div>
        </motion.div>

        {/* Product Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${viewMode}-${currentPage}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-6'
            }
          >
            {currentProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                viewMode={viewMode}
                isDarkMode={isDarkMode}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={() => toggleFavorite(product.id)}
                onShare={() => handleShare(product)}
                onContact={() => handleContact(product)}
                onQuickView={() => handleQuickView(product)}
                renderStars={renderStars}
                animationConfig={animationConfig}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center gap-2 mt-12"
          >
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 hover:text-white'} ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'} transition-colors`}
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : isDarkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 hover:text-white'} ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'} transition-colors`}
            >
              Next
            </button>
          </motion.div>
        )}

        {/* Product Modal */}
        <ProductModal
          isOpen={showProductModal}
          onClose={handleCloseModal}
          product={selectedProduct}
          isDarkMode={isDarkMode}
        />
      </div>
    </section>
  );
};

// Product Card Component
const ProductCard: React.FC<{
  product: Product;
  index: number;
  viewMode: 'grid' | 'list';
  isDarkMode: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onShare: () => void;
  onContact: () => void;
  onQuickView: () => void;
  renderStars: (rating: number) => JSX.Element[];
  animationConfig: any;
}> = ({ 
  product, 
  index, 
  viewMode, 
  isDarkMode, 
  isFavorite, 
  onToggleFavorite, 
  onShare, 
  onContact, 
  onQuickView,
  renderStars,
  animationConfig 
}) => {
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: animationConfig.motionDuration,
          delay: index * 0.05,
          ease: animationConfig.motionEasing
        }}
        className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 hover:shadow-lg transition-all duration-300`}
      >
        <div className="flex gap-6">
          <div className="relative flex-shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-32 h-32 object-cover rounded-lg"
              loading="lazy"
            />
            {product.isNew && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                NEW
              </span>
            )}
            {product.discount && (
              <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {product.discount}
              </span>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {product.name}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={onToggleFavorite}
                  className={`p-2 rounded-full ${isFavorite ? 'text-red-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'} hover:bg-gray-100 dark:hover:bg-gray-700`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={onShare}
                  className={`p-2 rounded-full ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} hover:bg-gray-100 dark:hover:bg-gray-700`}
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {product.rating.toFixed(1)} ({product.reviews} reviews)
              </span>
            </div>
            
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {product.price}
              </span>
              {product.originalPrice && (
                <span className={`text-lg ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} line-through`}>
                  {product.originalPrice}
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {product.features.slice(0, 3).map((feature, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                >
                  {feature}
                </span>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onContact}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                Contact
              </button>
              <button className="flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-lg font-semibold transition-colors">
                onClick={onQuickView}
                <Eye className="w-4 h-4" />
                Quick View
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: animationConfig.motionDuration,
        delay: index * 0.05,
        ease: animationConfig.motionEasing
      }}
      whileHover={{ y: -5 }}
      className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group`}
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
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
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={onToggleFavorite}
            className={`p-2 rounded-full ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700'} shadow-lg hover:scale-110 transition-transform`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={onShare}
            className="p-2 rounded-full bg-white/90 text-gray-700 shadow-lg hover:scale-110 transition-transform"
          >
            <Share2 className="w-4 h-4" />
          </button>
          
          <button className="p-2 rounded-full bg-white/90 text-gray-700 shadow-lg hover:scale-110 transition-transform">
            <Eye className="w-4 h-4" />
          </button>
          onClick={onQuickView}
        </div>

        {/* Stock Status */}
        <div className="absolute bottom-3 left-3">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            product.inStock 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
            {product.category}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
            {product.brand}
          </span>
        </div>

        <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 line-clamp-2`}>
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex">{renderStars(product.rating)}</div>
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            ({product.reviews})
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {product.price}
          </span>
          {product.originalPrice && (
            <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} line-through`}>
              {product.originalPrice}
            </span>
          )}
        </div>

        <div className="space-y-1 mb-4">
          {product.features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'}`} />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {feature}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onContact}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <ShoppingCart className="w-4 h-4" />
          Contact for Price
        </button>
      </div>
    </motion.div>
  );
};

export default ProductGallery;