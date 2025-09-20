import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Headphones, Watch, Camera, Heart, Share2, MessageCircle, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import ProductModal from './ProductModal';

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  category: string;
  features: string[];
  inStock: boolean;
  isNew?: boolean;
  discount?: string;
}

interface ProductShowcaseProps {
  animationConfig: any;
  isDarkMode?: boolean;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({ animationConfig, isDarkMode = false }) => {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  const products: Product[] = [
    {
      id: 1,
      name: "Samsung Galaxy S24 Ultra",
      price: "₹1,24,999",
      originalPrice: "₹1,34,999",
      image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=500",
      category: "Smartphones",
      features: ["200MP Camera", "S Pen", "5000mAh Battery"],
      inStock: true,
      isNew: true,
      discount: "7% OFF"
    },
    {
      id: 2,
      name: "iPhone 15 Pro Max",
      price: "₹1,59,900",
      image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=500",
      category: "Smartphones",
      features: ["A17 Pro Chip", "Titanium Design", "Action Button"],
      inStock: true,
      isNew: true
    },
    {
      id: 3,
      name: "OnePlus 12",
      price: "₹64,999",
      originalPrice: "₹69,999",
      image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=500",
      category: "Smartphones",
      features: ["Snapdragon 8 Gen 3", "100W Charging", "Hasselblad Camera"],
      inStock: true,
      discount: "8% OFF"
    },
    {
      id: 4,
      name: "AirPods Pro (2nd Gen)",
      price: "₹24,900",
      image: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=500",
      category: "Audio",
      features: ["Active Noise Cancellation", "Spatial Audio", "MagSafe Charging"],
      inStock: true
    },
    {
      id: 5,
      name: "Apple Watch Series 9",
      price: "₹41,900",
      image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500",
      category: "Wearables",
      features: ["S9 Chip", "Double Tap", "Always-On Display"],
      inStock: true,
      isNew: true
    },
    {
      id: 6,
      name: "Sony WH-1000XM5",
      price: "₹29,990",
      originalPrice: "₹34,990",
      image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500",
      category: "Audio",
      features: ["Industry Leading ANC", "30Hr Battery", "Multipoint Connection"],
      inStock: true,
      discount: "14% OFF"
    }
  ];

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Smartphones': return <Smartphone className="w-5 h-5" />;
      case 'Audio': return <Headphones className="w-5 h-5" />;
      case 'Wearables': return <Watch className="w-5 h-5" />;
      default: return <Camera className="w-5 h-5" />;
    }
  };

  const displayedProducts = showAllProducts ? products : products.slice(0, 4);

  return (
    <section className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: animationConfig.motionDuration,
            ease: animationConfig.motionEasing
          }}
          className="text-center mb-12"
        >
          <h2 className={`text-4xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-900'} mb-4`}>
            Featured Products
          </h2>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Discover our latest collection of premium smartphones, accessories, and gadgets
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden md:block">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {displayedProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  animationConfig={animationConfig}
                  isDarkMode={isDarkMode}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={() => toggleFavorite(product.id)}
                  onShare={() => handleShare(product)}
                  onContact={() => handleContact(product)}
                  onQuickView={() => handleQuickView(product)}
                  getCategoryIcon={getCategoryIcon}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* View More Button for Desktop */}
          {products.length > 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-8"
            >
              <motion.button
                onClick={() => setShowAllProducts(!showAllProducts)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 mx-auto ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl`}
              >
                {showAllProducts ? (
                  <>
                    <ChevronUp className="w-5 h-5" />
                    View Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-5 h-5" />
                    View More Products ({products.length - 4} more)
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Mobile Slider - Keep existing mobile functionality */}
        <div className="md:hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
            {products.map((product, index) => (
              <div key={product.id} className="flex-shrink-0 w-72 snap-start">
                <ProductCard
                  product={product}
                  index={index}
                  animationConfig={animationConfig}
                  isDarkMode={isDarkMode}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={() => toggleFavorite(product.id)}
                  onShare={() => handleShare(product)}
                  onContact={() => handleContact(product)}
                  onQuickView={() => handleQuickView(product)}
                  getCategoryIcon={getCategoryIcon}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={showProductModal}
        onClose={handleCloseModal}
        product={selectedProduct}
        isDarkMode={isDarkMode}
      />
    </section>
  );
};

// Product Card Component
const ProductCard: React.FC<{
  product: Product;
  index: number;
  animationConfig: any;
  isDarkMode: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onShare: () => void;
  onContact: () => void;
  onQuickView: () => void;
  getCategoryIcon: (category: string) => JSX.Element;
}> = ({ 
  product, 
  index, 
  animationConfig, 
  isDarkMode, 
  isFavorite, 
  onToggleFavorite, 
  onShare, 
  onContact, 
  onQuickView,
  getCategoryIcon 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{
        duration: animationConfig.motionDuration,
        delay: index * animationConfig.motionStagger,
        ease: animationConfig.motionEasing
      }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border overflow-hidden group`}
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
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
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleFavorite}
            className={`p-2 rounded-full ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700'} shadow-lg`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onShare}
            className="p-2 rounded-full bg-white/90 text-gray-700 shadow-lg"
          >
            <Share2 className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onQuickView}
            className="p-2 rounded-full bg-white/90 text-gray-700 shadow-lg"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
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

      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <div className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {getCategoryIcon(product.category)}
          </div>
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>
            {product.category}
          </span>
        </div>

        <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 line-clamp-2`}>
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <span className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
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

        <motion.button
          onClick={onContact}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full flex items-center justify-center gap-2 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl btn-medium`}
        >
          <MessageCircle className="w-4 h-4" />
          Contact for Price
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductShowcase;