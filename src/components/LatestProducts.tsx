import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Heart, 
  Eye, 
  ShoppingCart, 
  Filter, 
  RefreshCw, 
  Sparkles,
  TrendingUp,
  Clock,
  ChevronDown
} from 'lucide-react';
import QuickViewButton from './QuickViewButton';

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
  addedDate: string;
}

interface LatestProductsProps {
  animationConfig: any;
  isDarkMode?: boolean;
}

const LatestProducts: React.FC<LatestProductsProps> = ({ animationConfig, isDarkMode = false }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Latest products data - sorted by most recent
  const latestProductsData: Product[] = [
    {
      id: 101,
      name: "iPhone 15 Pro Max",
      price: "₹1,59,900",
      originalPrice: "₹1,69,900",
      image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Smartphones",
      rating: 4.9,
      reviews: 2847,
      features: ["A17 Pro Chip", "Titanium Design", "Action Button"],
      inStock: true,
      isNew: true,
      discount: "6% OFF",
      brand: "Apple",
      addedDate: "2024-01-20"
    },
    {
      id: 102,
      name: "Samsung Galaxy S24 Ultra",
      price: "₹1,24,999",
      originalPrice: "₹1,34,999",
      image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Smartphones",
      rating: 4.8,
      reviews: 1923,
      features: ["200MP Camera", "S Pen", "Galaxy AI"],
      inStock: true,
      isNew: true,
      discount: "7% OFF",
      brand: "Samsung",
      addedDate: "2024-01-19"
    },
    {
      id: 103,
      name: "OnePlus 12",
      price: "₹64,999",
      originalPrice: "₹69,999",
      image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Smartphones",
      rating: 4.7,
      reviews: 1456,
      features: ["Snapdragon 8 Gen 3", "100W Charging", "Hasselblad Camera"],
      inStock: true,
      isNew: true,
      discount: "8% OFF",
      brand: "OnePlus",
      addedDate: "2024-01-18"
    },
    {
      id: 104,
      name: "AirPods Pro (3rd Gen)",
      price: "₹26,900",
      image: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Audio",
      rating: 4.8,
      reviews: 892,
      features: ["Adaptive Audio", "Conversation Awareness", "USB-C"],
      inStock: true,
      isNew: true,
      brand: "Apple",
      addedDate: "2024-01-17"
    },
    {
      id: 105,
      name: "Google Pixel 8 Pro",
      price: "₹1,06,999",
      image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Smartphones",
      rating: 4.6,
      reviews: 734,
      features: ["Google Tensor G3", "AI Photography", "7 Years Updates"],
      inStock: true,
      isNew: true,
      brand: "Google",
      addedDate: "2024-01-16"
    },
    {
      id: 106,
      name: "Apple Watch Series 9",
      price: "₹41,900",
      image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Wearables",
      rating: 4.7,
      reviews: 567,
      features: ["S9 Chip", "Double Tap", "Always-On Display"],
      inStock: true,
      isNew: true,
      brand: "Apple",
      addedDate: "2024-01-15"
    },
    {
      id: 107,
      name: "Xiaomi 14 Ultra",
      price: "₹99,999",
      image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Smartphones",
      rating: 4.6,
      reviews: 445,
      features: ["Leica Camera", "Snapdragon 8 Gen 3", "90W Charging"],
      inStock: true,
      isNew: true,
      brand: "Xiaomi",
      addedDate: "2024-01-14"
    },
    {
      id: 108,
      name: "Sony WH-1000XM5",
      price: "₹29,990",
      originalPrice: "₹34,990",
      image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Audio",
      rating: 4.5,
      reviews: 623,
      features: ["Industry Leading ANC", "30Hr Battery", "Multipoint"],
      inStock: true,
      isNew: true,
      discount: "14% OFF",
      brand: "Sony",
      addedDate: "2024-01-13"
    },
    {
      id: 109,
      name: "Samsung Galaxy Watch6",
      price: "₹31,999",
      originalPrice: "₹34,999",
      image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Wearables",
      rating: 4.4,
      reviews: 234,
      features: ["Wear OS", "Health Monitoring", "GPS"],
      inStock: true,
      isNew: true,
      discount: "9% OFF",
      brand: "Samsung",
      addedDate: "2024-01-12"
    },
    {
      id: 110,
      name: "Nothing Phone (2a)",
      price: "₹25,999",
      image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Smartphones",
      rating: 4.3,
      reviews: 189,
      features: ["Glyph Interface", "MediaTek Dimensity", "50MP Dual Camera"],
      inStock: true,
      isNew: true,
      brand: "Nothing",
      addedDate: "2024-01-11"
    },
    {
      id: 111,
      name: "Realme GT 6",
      price: "₹42,999",
      originalPrice: "₹45,999",
      image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Smartphones",
      rating: 4.4,
      reviews: 312,
      features: ["Snapdragon 8s Gen 3", "120W SuperDart", "50MP Sony LYT"],
      inStock: true,
      isNew: true,
      discount: "7% OFF",
      brand: "Realme",
      addedDate: "2024-01-10"
    },
    {
      id: 112,
      name: "JBL Tune 770NC",
      price: "₹7,999",
      originalPrice: "₹9,999",
      image: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Audio",
      rating: 4.2,
      reviews: 156,
      features: ["Active Noise Cancelling", "70Hr Battery", "JBL Pure Bass"],
      inStock: true,
      isNew: true,
      discount: "20% OFF",
      brand: "JBL",
      addedDate: "2024-01-09"
    }
  ];

  useEffect(() => {
    // Sort by most recent first
    const sortedProducts = [...latestProductsData].sort((a, b) => 
      new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
    );
    setProducts(sortedProducts);
    setFilteredProducts(sortedProducts);
  }, []);

  // Filter products based on category and price range
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Price range filter
    if (priceRange !== 'All') {
      const getPrice = (product: Product) => parseInt(product.price.replace(/[₹,]/g, ''));
      switch (priceRange) {
        case 'under-25k':
          filtered = filtered.filter(product => getPrice(product) < 25000);
          break;
        case '25k-50k':
          filtered = filtered.filter(product => getPrice(product) >= 25000 && getPrice(product) < 50000);
          break;
        case '50k-100k':
          filtered = filtered.filter(product => getPrice(product) >= 50000 && getPrice(product) < 100000);
          break;
        case 'above-100k':
          filtered = filtered.filter(product => getPrice(product) >= 100000);
          break;
      }
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, priceRange]);

  // Auto-refresh functionality
  useEffect(() => {
    const interval = setInterval(() => {
      // In production, this would check for new products from API
      setLastRefresh(new Date());
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate API call to fetch latest products
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production: const response = await fetch('/api/products/latest');
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleContact = (product: Product) => {
    const message = `Hi! I'm interested in the latest ${product.name} (${product.price}). Is it available?`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <section className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 to-blue-50'} transition-colors duration-300`}>
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
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className={`w-8 h-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <h2 className={`text-4xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-900'}`}>
              Latest Arrivals
            </h2>
            <Sparkles className={`w-8 h-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto mb-4`}>
            Discover the newest additions to our collection - fresh arrivals with cutting-edge technology
          </p>
          
          {/* Last Updated Info */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
            <motion.button
              onClick={handleRefresh}
              disabled={isRefreshing}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`ml-2 p-1 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 mb-8 border shadow-lg`}
        >
          {/* Filter Toggle (Mobile) */}
          <div className="flex items-center justify-between mb-4 md:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} font-semibold`}
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <TrendingUp className="w-4 h-4" />
              <span>{filteredProducts.length} new products</span>
            </div>
          </div>

          {/* Filter Controls */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Price Range
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                >
                  <option value="All">All Prices</option>
                  <option value="under-25k">Under ₹25,000</option>
                  <option value="25k-50k">₹25,000 - ₹50,000</option>
                  <option value="50k-100k">₹50,000 - ₹1,00,000</option>
                  <option value="above-100k">Above ₹1,00,000</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {filteredProducts.length} of {products.length} products
                </div>
                <motion.button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 ${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-600 hover:bg-purple-700'} text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 disabled:opacity-50`}
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{
                  duration: animationConfig.motionDuration,
                  delay: index * 0.05,
                  ease: animationConfig.motionEasing
                }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group relative`}
              >
                {/* New Badge with Animation */}
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                  className="absolute top-3 left-3 z-10"
                >
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    NEW
                  </div>
                </motion.div>

                {/* Product Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Discount Badge */}
                  {product.discount && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        {product.discount}
                      </span>
                    </div>
                  )}

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleFavorite(product.id)}
                        className={`p-3 rounded-full ${
                          favorites.includes(product.id) 
                            ? 'bg-red-500 text-white' 
                            : 'bg-white/90 text-gray-700'
                        } shadow-lg backdrop-blur-sm`}
                        aria-label={`${favorites.includes(product.id) ? 'Remove from' : 'Add to'} favorites`}
                      >
                        <Heart className={`w-5 h-5 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                      </motion.button>
                      
                      <QuickViewButton
                        productId={product.id}
                        size="lg"
                        variant="icon"
                        label={`Quick view ${product.name}`}
                      />
                    </div>
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

                {/* Product Info */}
                <div className="p-5">
                  {/* Category and Brand */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                      {product.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-600'}`}>
                      {product.brand}
                    </span>
                  </div>

                  {/* Product Name */}
                  <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors`}>
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">{renderStars(product.rating)}</div>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                      {product.price}
                    </span>
                    {product.originalPrice && (
                      <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} line-through`}>
                        {product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-1 mb-4">
                    {product.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-purple-400' : 'bg-purple-600'}`} />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <motion.button
                    onClick={() => handleContact(product)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!product.inStock}
                    className={`w-full flex items-center justify-center gap-2 ${
                      product.inStock
                        ? isDarkMode 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'bg-purple-600 hover:bg-purple-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    } text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {product.inStock ? 'Contact for Price' : 'Out of Stock'}
                  </motion.button>
                </div>

                {/* Added Date Badge */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-white/90 text-gray-600'} text-xs px-2 py-1 rounded-full shadow-lg backdrop-blur-sm`}>
                    Added {new Date(product.addedDate).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* No Products Message */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-400'} mb-4`}>
              <Filter className="w-16 h-16 mx-auto" />
            </div>
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
              No Products Found
            </h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Try adjusting your filters to see more products.
            </p>
          </motion.div>
        )}

        {/* View All Products CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-12"
        >
          <motion.a
            href="#products"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`inline-flex items-center gap-2 ${isDarkMode ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gradient-to-r from-purple-600 to-blue-600'} text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            <Eye className="w-5 h-5" />
            View All Products
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default LatestProducts;