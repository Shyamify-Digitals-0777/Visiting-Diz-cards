import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Heart, 
  Eye, 
  ShoppingCart, 
  Crown, 
  Zap, 
  Award,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Timer
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import QuickViewButton from './QuickViewButton';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

interface FeaturedProduct {
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
  badge: 'Featured' | 'Best Seller' | 'Limited Time' | 'Editor\'s Choice';
  badgeColor: string;
  discount?: string;
  brand: string;
  description: string;
  salesCount?: number;
  timeLeft?: string;
}

interface FeaturedProductsProps {
  animationConfig: any;
  isDarkMode?: boolean;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ animationConfig, isDarkMode = false }) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState<Record<number, string>>({});

  // Featured products data - hand-picked promotional items
  const featuredProducts: FeaturedProduct[] = [
    {
      id: 201,
      name: "iPhone 15 Pro Max",
      price: "₹1,59,900",
      originalPrice: "₹1,69,900",
      image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Smartphones",
      rating: 4.9,
      reviews: 2847,
      features: ["A17 Pro Chip", "Titanium Design", "Action Button", "48MP Pro Camera"],
      inStock: true,
      badge: "Editor's Choice",
      badgeColor: "bg-gradient-to-r from-purple-500 to-pink-500",
      discount: "6% OFF",
      brand: "Apple",
      description: "The ultimate iPhone with titanium design and professional camera system.",
      salesCount: 1247
    },
    {
      id: 202,
      name: "Samsung Galaxy S24 Ultra",
      price: "₹1,24,999",
      originalPrice: "₹1,34,999",
      image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Smartphones",
      rating: 4.8,
      reviews: 1923,
      features: ["200MP Camera", "S Pen", "Galaxy AI", "5000mAh Battery"],
      inStock: true,
      badge: "Best Seller",
      badgeColor: "bg-gradient-to-r from-orange-500 to-red-500",
      discount: "7% OFF",
      brand: "Samsung",
      description: "Experience the power of Galaxy AI with S Pen and 200MP camera.",
      salesCount: 1856
    },
    {
      id: 203,
      name: "OnePlus 12",
      price: "₹64,999",
      originalPrice: "₹69,999",
      image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Smartphones",
      rating: 4.7,
      reviews: 1456,
      features: ["Snapdragon 8 Gen 3", "100W Charging", "Hasselblad Camera", "120Hz Display"],
      inStock: true,
      badge: "Limited Time",
      badgeColor: "bg-gradient-to-r from-red-500 to-pink-500",
      discount: "8% OFF",
      brand: "OnePlus",
      description: "Never Settle with flagship performance and Hasselblad cameras.",
      timeLeft: "2 days left"
    },
    {
      id: 204,
      name: "AirPods Pro (3rd Gen)",
      price: "₹26,900",
      image: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Audio",
      rating: 4.8,
      reviews: 892,
      features: ["Adaptive Audio", "Conversation Awareness", "USB-C", "Spatial Audio"],
      inStock: true,
      badge: "Featured",
      badgeColor: "bg-gradient-to-r from-blue-500 to-cyan-500",
      brand: "Apple",
      description: "Next-generation AirPods Pro with adaptive audio technology.",
      salesCount: 634
    },
    {
      id: 205,
      name: "Google Pixel 8 Pro",
      price: "₹1,06,999",
      image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Smartphones",
      rating: 4.6,
      reviews: 734,
      features: ["Google Tensor G3", "AI Photography", "7 Years Updates", "Magic Eraser"],
      inStock: true,
      badge: "Editor's Choice",
      badgeColor: "bg-gradient-to-r from-green-500 to-teal-500",
      brand: "Google",
      description: "Pure Android experience with advanced AI photography features.",
      salesCount: 423
    },
    {
      id: 206,
      name: "Apple Watch Series 9",
      price: "₹41,900",
      image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Wearables",
      rating: 4.7,
      reviews: 567,
      features: ["S9 Chip", "Double Tap", "Always-On Display", "Health Monitoring"],
      inStock: true,
      badge: "Best Seller",
      badgeColor: "bg-gradient-to-r from-yellow-500 to-orange-500",
      brand: "Apple",
      description: "Most advanced Apple Watch with revolutionary health features.",
      salesCount: 789
    },
    {
      id: 207,
      name: "Sony WH-1000XM5",
      price: "₹29,990",
      originalPrice: "₹34,990",
      image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Audio",
      rating: 4.5,
      reviews: 623,
      features: ["Industry Leading ANC", "30Hr Battery", "Multipoint", "LDAC Support"],
      inStock: true,
      badge: "Limited Time",
      badgeColor: "bg-gradient-to-r from-indigo-500 to-purple-500",
      discount: "14% OFF",
      brand: "Sony",
      description: "Premium noise-cancelling headphones with exceptional sound quality.",
      timeLeft: "5 days left"
    },
    {
      id: 208,
      name: "Xiaomi 14 Ultra",
      price: "₹99,999",
      image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Smartphones",
      rating: 4.6,
      reviews: 445,
      features: ["Leica Camera", "Snapdragon 8 Gen 3", "90W Charging", "2K Display"],
      inStock: true,
      badge: "Featured",
      badgeColor: "bg-gradient-to-r from-emerald-500 to-green-500",
      brand: "Xiaomi",
      description: "Photography redefined with Leica professional cameras.",
      salesCount: 267
    }
  ];

  // Countdown timer for limited time offers
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft: Record<number, string> = {};
      
      featuredProducts.forEach(product => {
        if (product.badge === 'Limited Time' && product.timeLeft) {
          // Simulate countdown (in production, use actual end dates)
          const days = parseInt(product.timeLeft.split(' ')[0]);
          const hours = Math.floor(Math.random() * 24);
          const minutes = Math.floor(Math.random() * 60);
          newTimeLeft[product.id] = `${days}d ${hours}h ${minutes}m`;
        }
      });
      
      setTimeLeft(newTimeLeft);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleContact = (product: FeaturedProduct) => {
    const message = `Hi! I'm interested in the featured ${product.name} (${product.price}). Please provide more details.`;
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

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'Featured': return <Star className="w-4 h-4" />;
      case 'Best Seller': return <Crown className="w-4 h-4" />;
      case 'Limited Time': return <Zap className="w-4 h-4" />;
      case "Editor's Choice": return <Award className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  return (
    <section className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'} transition-colors duration-300`}>
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
            <Crown className={`w-8 h-8 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
            <h2 className={`text-4xl font-bold ${isDarkMode ? 'text-yellow-400' : 'text-indigo-900'}`}>
              Featured Products
            </h2>
            <Crown className={`w-8 h-8 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
          </div>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Hand-picked premium products with exclusive offers and bestselling items
          </p>
        </motion.div>

        {/* Desktop Grid View */}
        <div className="hidden lg:block">
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <FeaturedProductCard
                key={product.id}
                product={product}
                index={index}
                animationConfig={animationConfig}
                isDarkMode={isDarkMode}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={() => toggleFavorite(product.id)}
                onContact={() => handleContact(product)}
                renderStars={renderStars}
                getBadgeIcon={getBadgeIcon}
                timeLeft={timeLeft[product.id]}
              />
            ))}
          </div>
        </div>

        {/* Mobile/Tablet Carousel */}
        <div className="lg:hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative"
          >
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
              spaceBetween={20}
              slidesPerView={1.2}
              centeredSlides={true}
              navigation={{
                nextEl: '.featured-next',
                prevEl: '.featured-prev',
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              effect="coverflow"
              coverflowEffect={{
                rotate: 20,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              breakpoints={{
                480: {
                  slidesPerView: 1.4,
                  spaceBetween: 20,
                },
                640: {
                  slidesPerView: 1.8,
                  spaceBetween: 24,
                },
                768: {
                  slidesPerView: 2.2,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 2.5,
                  spaceBetween: 32,
                },
              }}
              className="featured-slideshow"
              onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
            >
              {featuredProducts.map((product, index) => (
                <SwiperSlide key={product.id}>
                  <FeaturedProductCard
                    product={product}
                    index={index}
                    animationConfig={animationConfig}
                    isDarkMode={isDarkMode}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={() => toggleFavorite(product.id)}
                    onContact={() => handleContact(product)}
                    renderStars={renderStars}
                    getBadgeIcon={getBadgeIcon}
                    timeLeft={timeLeft[product.id]}
                    isCarousel={true}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation */}
            <button className="featured-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 border border-white/30">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="featured-next absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 border border-white/30">
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        </div>

        {/* Featured Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
        >
          <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-xl p-4 text-center shadow-lg`}>
            <TrendingUp className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-500'} mx-auto mb-2`} />
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {featuredProducts.reduce((sum, p) => sum + (p.salesCount || 0), 0)}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Sales</div>
          </div>
          
          <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-xl p-4 text-center shadow-lg`}>
            <Star className={`w-6 h-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'} mx-auto mb-2`} />
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {(featuredProducts.reduce((sum, p) => sum + p.rating, 0) / featuredProducts.length).toFixed(1)}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Rating</div>
          </div>
          
          <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-xl p-4 text-center shadow-lg`}>
            <Crown className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'} mx-auto mb-2`} />
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {featuredProducts.length}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Featured Items</div>
          </div>
          
          <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-xl p-4 text-center shadow-lg`}>
            <Zap className={`w-6 h-6 ${isDarkMode ? 'text-orange-400' : 'text-orange-500'} mx-auto mb-2`} />
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {featuredProducts.filter(p => p.badge === 'Limited Time').length}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Limited Offers</div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-12"
        >
          <div className={`${isDarkMode ? 'bg-gradient-to-r from-purple-800 to-indigo-800' : 'bg-gradient-to-r from-purple-600 to-indigo-600'} rounded-2xl p-8 text-white`}>
            <h3 className="text-2xl font-bold mb-4">Don't Miss Out!</h3>
            <p className="text-lg mb-6 text-white/90">
              These featured products are flying off our shelves. Get yours before they're gone!
            </p>
            <motion.a
              href="https://wa.me/919876543210?text=Hi! I'm interested in your featured products. Please share more details."
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              Shop Featured Products
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Featured Product Card Component
const FeaturedProductCard: React.FC<{
  product: FeaturedProduct;
  index: number;
  animationConfig: any;
  isDarkMode: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onContact: () => void;
  renderStars: (rating: number) => JSX.Element[];
  getBadgeIcon: (badge: string) => JSX.Element;
  timeLeft?: string;
  isCarousel?: boolean;
}> = ({ 
  product, 
  index, 
  animationConfig, 
  isDarkMode, 
  isFavorite, 
  onToggleFavorite, 
  onContact, 
  renderStars,
  getBadgeIcon,
  timeLeft,
  isCarousel = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: animationConfig.motionDuration,
        delay: isCarousel ? 0 : index * 0.1,
        ease: animationConfig.motionEasing
      }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group relative ${isCarousel ? 'h-full' : ''}`}
    >
      {/* Featured Badge */}
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: (isCarousel ? 0 : index * 0.1) + 0.3, type: "spring" }}
        className="absolute top-4 left-4 z-10"
      >
        <div className={`${product.badgeColor} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5`}>
          {getBadgeIcon(product.badge)}
          {product.badge}
        </div>
      </motion.div>

      {/* Product Image */}
      <div className="relative overflow-hidden h-56">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-4 right-4">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
              {product.discount}
            </span>
          </div>
        )}

        {/* Countdown Timer for Limited Time */}
        {product.badge === 'Limited Time' && timeLeft && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-red-500/90 backdrop-blur-sm text-white text-center py-2 px-3 rounded-lg">
              <div className="flex items-center justify-center gap-1 text-xs font-bold">
                <Timer className="w-3 h-3" />
                {timeLeft}
              </div>
            </div>
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleFavorite}
              className={`p-3 rounded-full ${
                isFavorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 text-gray-700'
              } shadow-lg backdrop-blur-sm`}
              aria-label={`${isFavorite ? 'Remove from' : 'Add to'} favorites`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
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
        <div className="absolute bottom-4 right-4">
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
      <div className="p-6">
        {/* Category and Brand */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
            {product.category}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-600'}`}>
            {product.brand}
          </span>
        </div>

        {/* Product Name */}
        <h3 className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors`}>
          {product.name}
        </h3>

        {/* Description */}
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3 line-clamp-2`}>
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">{renderStars(product.rating)}</div>
          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {product.rating}
          </span>
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-2xl font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
            {product.price}
          </span>
          {product.originalPrice && (
            <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} line-through`}>
              {product.originalPrice}
            </span>
          )}
        </div>

        {/* Features */}
        <div className="space-y-1 mb-6">
          {product.features.slice(0, 4).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-indigo-400' : 'bg-indigo-600'}`} />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Sales Count for Best Sellers */}
        {product.badge === 'Best Seller' && product.salesCount && (
          <div className="flex items-center gap-2 mb-4 text-sm">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {product.salesCount}+ sold this month
            </span>
          </div>
        )}

        {/* Action Button */}
        <motion.button
          onClick={onContact}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!product.inStock}
          className={`w-full flex items-center justify-center gap-2 ${
            product.inStock
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
              : 'bg-gray-400 cursor-not-allowed'
          } text-white py-4 px-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl`}
        >
          <ShoppingCart className="w-5 h-5" />
          {product.inStock ? 'Get Best Price' : 'Out of Stock'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FeaturedProducts;