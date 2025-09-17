import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Eye } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface FeaturedProduct {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  category: string;
  isNew?: boolean;
  discount?: string;
  features: string[];
}

interface FeaturedSlideshowProps {
  animationConfig: any;
  isDarkMode?: boolean;
}

const FeaturedSlideshow: React.FC<FeaturedSlideshowProps> = ({ animationConfig, isDarkMode = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredProducts: FeaturedProduct[] = [
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      price: "₹1,59,900",
      originalPrice: "₹1,69,900",
      image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "The ultimate iPhone with titanium design, A17 Pro chip, and revolutionary camera system for professional photography.",
      rating: 4.9,
      reviews: 2847,
      category: "Smartphones",
      isNew: true,
      discount: "6% OFF",
      features: ["A17 Pro Chip", "Titanium Design", "Action Button", "48MP Main Camera"]
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      price: "₹1,24,999",
      originalPrice: "₹1,34,999",
      image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Experience the power of Galaxy AI with S Pen, 200MP camera, and all-day battery life in this premium flagship.",
      rating: 4.8,
      reviews: 1923,
      category: "Smartphones",
      isNew: true,
      discount: "7% OFF",
      features: ["200MP Camera", "S Pen Included", "Galaxy AI", "5000mAh Battery"]
    },
    {
      id: 3,
      name: "OnePlus 12",
      price: "₹64,999",
      originalPrice: "₹69,999",
      image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Never Settle with Snapdragon 8 Gen 3, Hasselblad camera system, and 100W SuperVOOC charging technology.",
      rating: 4.7,
      reviews: 1456,
      category: "Smartphones",
      discount: "8% OFF",
      features: ["Snapdragon 8 Gen 3", "100W Charging", "Hasselblad Camera", "120Hz Display"]
    },
    {
      id: 4,
      name: "Xiaomi 14 Ultra",
      price: "₹99,999",
      image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Photography redefined with Leica professional cameras, Snapdragon 8 Gen 3, and premium build quality.",
      rating: 4.6,
      reviews: 892,
      category: "Smartphones",
      isNew: true,
      features: ["Leica Camera", "Snapdragon 8 Gen 3", "90W Charging", "2K Display"]
    },
    {
      id: 5,
      name: "Google Pixel 8 Pro",
      price: "₹1,06,999",
      image: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Pure Android experience with Google Tensor G3, AI-powered photography, and 7 years of updates guaranteed.",
      rating: 4.5,
      reviews: 734,
      category: "Smartphones",
      features: ["Google Tensor G3", "AI Photography", "7 Years Updates", "Magic Eraser"]
    }
  ];

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

  const handleQuickView = (product: FeaturedProduct) => {
    // Implement quick view functionality
    console.log('Quick view for:', product.name);
  };

  const handleAddToCart = (product: FeaturedProduct) => {
    // Implement add to cart functionality
    const message = `Hi! I'm interested in ${product.name} (${product.price}). Please provide more details.`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className={`py-8 md:py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'} transition-colors duration-300`}>
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
          className="text-center mb-8 md:mb-12"
        >
          <h2 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-900'} mb-4`}>
            Featured Products
          </h2>
          <p className={`text-lg md:text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Discover our handpicked selection of premium smartphones with the latest technology and best prices
          </p>
        </motion.div>

        {/* Featured Product Slideshow */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: animationConfig.motionDuration,
            delay: 0.2,
            ease: animationConfig.motionEasing
          }}
          className="relative"
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            spaceBetween={0}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
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
            effect="fade"
            fadeEffect={{
              crossFade: true
            }}
            loop={true}
            className="main-gallery-swiper rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl"
            onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
          >
            {featuredProducts.map((product, index) => (
              <SwiperSlide key={product.id}>
                <div className="relative h-[400px] md:h-[600px] overflow-hidden">
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${product.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
                  </div>

                  {/* Content Overlay */}
                  <div className="relative z-10 h-full flex items-center">
                    <div className="container mx-auto px-4 md:px-8">
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Product Information */}
                        <motion.div
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3, duration: 0.8 }}
                          className="text-white space-y-4 md:space-y-6"
                        >
                          {/* Badges */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {product.isNew && (
                              <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                NEW ARRIVAL
                              </span>
                            )}
                            {product.discount && (
                              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                {product.discount}
                              </span>
                            )}
                            <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                              {product.category}
                            </span>
                          </div>

                          {/* Product Name */}
                          <h3 className="text-2xl md:text-4xl font-bold leading-tight">
                            {product.name}
                          </h3>

                          {/* Rating */}
                          <div className="flex items-center gap-3">
                            <div className="flex">{renderStars(product.rating)}</div>
                            <span className="text-lg font-semibold">{product.rating}</span>
                            <span className="text-white/80">({product.reviews} reviews)</span>
                          </div>

                          {/* Description */}
                          <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-lg">
                            {product.description}
                          </p>

                          {/* Features */}
                          <div className="grid grid-cols-2 gap-2">
                            {product.features.slice(0, 4).map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span className="text-white/90 text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>

                          {/* Pricing */}
                          <div className="flex items-center gap-4">
                            <span className="text-2xl md:text-3xl font-bold text-green-400">
                              {product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-lg text-white/60 line-through">
                                {product.originalPrice}
                              </span>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <motion.button
                              onClick={() => handleAddToCart(product)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                              <ShoppingCart className="w-5 h-5" />
                              Contact for Price
                            </motion.button>
                            
                            <motion.button
                              onClick={() => handleQuickView(product)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-white/30"
                            >
                              <Eye className="w-5 h-5" />
                              Quick View
                            </motion.button>
                          </div>
                        </motion.div>

                        {/* Product Image (Mobile Enhancement) */}
                        <motion.div
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                          className="hidden md:block"
                        >
                          <div className="relative">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-64 object-cover rounded-xl shadow-2xl"
                                loading="lazy"
                              />
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 border border-white/30">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 border border-white/30">
            <ChevronRight className="w-6 h-6" />
          </button>
        </motion.div>

        {/* Slide Counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-6"
        >
          <div className={`inline-flex items-center gap-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-full px-4 py-2 shadow-lg`}>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {currentSlide + 1} of {featuredProducts.length}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedSlideshow;