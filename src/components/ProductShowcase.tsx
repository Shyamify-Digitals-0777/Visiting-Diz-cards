import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Eye, MessageCircle, Star, Zap, Camera, Battery, Smartphone } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ProductShowcaseProps {
  animationConfig: any;
  isDarkMode?: boolean;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({ animationConfig, isDarkMode = false }) => {
  const [selectedCategory, setSelectedCategory] = useState('smartphones');
  const [showAllProducts, setShowAllProducts] = useState(false);

  const categories = [
    { id: 'smartphones', name: 'Smartphones', icon: Smartphone },
    { id: 'accessories', name: 'Accessories', icon: ShoppingBag },
    { id: 'audio', name: 'Audio', icon: Zap },
    { id: 'gadgets', name: 'Gadgets', icon: Camera }
  ];

  const products = {
    smartphones: [
      {
        id: 1,
        name: 'Samsung Galaxy S24 Ultra',
        price: '₹1,29,999',
        originalPrice: '₹1,49,999',
        image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.8,
        features: ['200MP Camera', '12GB RAM', '256GB Storage', '5000mAh Battery'],
        badge: 'Hot Deal'
      },
      {
        id: 2,
        name: 'iPhone 15 Pro Max',
        price: '₹1,59,900',
        originalPrice: '₹1,69,900',
        image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.9,
        features: ['48MP Pro Camera', '8GB RAM', '256GB Storage', 'A17 Pro Chip'],
        badge: 'Premium'
      },
      {
        id: 3,
        name: 'OnePlus 12',
        price: '₹64,999',
        originalPrice: '₹69,999',
        image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.7,
        features: ['50MP Triple Camera', '12GB RAM', '256GB Storage', '100W Charging'],
        badge: 'Best Value'
      },
      {
        id: 4,
        name: 'Xiaomi 14 Ultra',
        price: '₹99,999',
        originalPrice: '₹1,09,999',
        image: 'https://images.pexels.com/photos/1482476/pexels-photo-1482476.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.6,
        features: ['50MP Leica Camera', '16GB RAM', '512GB Storage', '90W Charging'],
        badge: 'Camera Pro'
      }
    ],
    accessories: [
      {
        id: 5,
        name: 'Premium Phone Cases',
        price: '₹1,999',
        originalPrice: '₹2,499',
        image: 'https://images.pexels.com/photos/1275229/pexels-photo-1275229.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.5,
        features: ['Drop Protection', 'Wireless Charging', 'Premium Material', 'All Brands'],
        badge: 'Bestseller'
      },
      {
        id: 6,
        name: 'Screen Protectors',
        price: '₹899',
        originalPrice: '₹1,199',
        image: 'https://images.pexels.com/photos/1164572/pexels-photo-1164572.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.4,
        features: ['Tempered Glass', '9H Hardness', 'Anti-Fingerprint', 'Easy Install'],
        badge: 'Protection'
      }
    ],
    audio: [
      {
        id: 7,
        name: 'Premium Earbuds',
        price: '₹8,999',
        originalPrice: '₹11,999',
        image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.7,
        features: ['Active Noise Cancellation', '30hr Battery', 'Quick Charge', 'Premium Sound'],
        badge: 'Audio Pro'
      },
      {
        id: 8,
        name: 'Bluetooth Speakers',
        price: '₹4,999',
        originalPrice: '₹6,999',
        image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.6,
        features: ['360° Sound', 'Waterproof', '20hr Battery', 'Bass Boost'],
        badge: 'Party Ready'
      }
    ],
    gadgets: [
      {
        id: 9,
        name: 'Wireless Chargers',
        price: '₹2,499',
        originalPrice: '₹3,499',
        image: 'https://images.pexels.com/photos/4498456/pexels-photo-4498456.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.5,
        features: ['15W Fast Charging', 'Universal Compatible', 'LED Indicator', 'Safe Charging'],
        badge: 'Convenient'
      },
      {
        id: 10,
        name: 'Power Banks',
        price: '₹3,999',
        originalPrice: '₹4,999',
        image: 'https://images.pexels.com/photos/4498456/pexels-photo-4498456.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.4,
        features: ['20000mAh Capacity', 'Fast Charging', 'Multiple Ports', 'Digital Display'],
        badge: 'High Capacity'
      }
    ]
  };

  const handleContactForProduct = (productName: string) => {
    const message = `Hi! I'm interested in ${productName}. Please share more details and best price.`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
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
          <h2 className="text-4xl font-bold text-blue-900 dark:text-blue-400 mb-4">Product Showcase</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our latest collection of smartphones, accessories, and gadgets at unbeatable prices.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                {category.name}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Desktop Grid */}
            <div className="hidden md:block">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products[selectedCategory as keyof typeof products]
                  ?.slice(0, showAllProducts ? undefined : 4)
                  .map((product, index) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      index={index} 
                      animationConfig={animationConfig} 
                      handleContactForProduct={handleContactForProduct}
                      isDarkMode={isDarkMode}
                    />
                  ))}
              </div>
              
              {/* View More Button for Desktop */}
              {products[selectedCategory as keyof typeof products]?.length > 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-8"
                >
                  <motion.button
                    onClick={() => setShowAllProducts(!showAllProducts)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {showAllProducts ? 'View Less' : `View More (${products[selectedCategory as keyof typeof products]?.length - 4} more)`}
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Mobile Slider - Keep existing mobile slider code */}
            <div className="md:hidden">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1.2}
                centeredSlides={false}
                navigation={true}
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                breakpoints={{
                  480: {
                    slidesPerView: 1.5,
                    spaceBetween: 20,
                  },
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                }}
                className="product-swiper"
              >
                {products[selectedCategory as keyof typeof products]?.map((product, index) => (
                  <SwiperSlide key={product.id}>
                    <ProductCard 
                      product={product} 
                      index={index} 
                      animationConfig={animationConfig} 
                      handleContactForProduct={handleContactForProduct}
                      isDarkMode={isDarkMode}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-lg mb-6 text-white/90">
              We have access to thousands of products. Contact us for personalized recommendations!
            </p>
            <motion.a
              href="https://wa.me/919876543210?text=Hi! I need help finding a specific product"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Get Personal Assistant
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Product Card Component
const ProductCard: React.FC<{
  product: any;
  index: number;
  animationConfig: any;
  handleContactForProduct: (name: string) => void;
  isDarkMode?: boolean;
}> = ({ product, index, animationConfig, handleContactForProduct, isDarkMode = false }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: animationConfig.motionDuration,
        delay: index * animationConfig.motionStagger,
        ease: animationConfig.motionEasing
      }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-3xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 h-full`}
    >
      {/* Product Badge */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {product.badge}
          </span>
        </div>
        
        {/* Product Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>

      <div className="p-6 flex flex-col h-full">
        {/* Product Name & Rating */}
        <div className="mb-3">
          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-900'} mb-2 group-hover:text-blue-700 transition-colors`}>
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>({product.rating})</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-green-600">{product.price}</span>
          {product.originalPrice && (
            <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} line-through`}>{product.originalPrice}</span>
          )}
        </div>

        {/* Features */}
        <div className="mb-6 flex-grow">
          <div className="grid grid-cols-2 gap-2">
            {product.features.slice(0, 4).map((feature: string, idx: number) => (
              <div key={idx} className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleContactForProduct(product.name)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:from-blue-700 hover:to-green-700 transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4" />
            Buy Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`${isDarkMode ? 'bg-gray-600 text-blue-400 hover:bg-gray-500' : 'bg-gray-100 text-blue-600 hover:bg-blue-50'} p-3 rounded-xl transition-colors duration-300`}
          >
            <Eye className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
                <ProductCard key={product.id} product={product} index={index} animationConfig={animationConfig} handleContactForProduct={handleContactForProduct} />
              ))}
            </div>

            {/* Mobile Slider */}
            <div className="md:hidden">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1.2}
                centeredSlides={false}
                navigation={true}
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                breakpoints={{
                  480: {
                    slidesPerView: 1.5,
                    spaceBetween: 20,
                  },
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                }}
                className="product-swiper"
              >
                {products[selectedCategory as keyof typeof products]?.map((product, index) => (
                  <SwiperSlide key={product.id}>
                    <ProductCard product={product} index={index} animationConfig={animationConfig} handleContactForProduct={handleContactForProduct} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-lg mb-6 text-white/90">
              We have access to thousands of products. Contact us for personalized recommendations!
            </p>
            <motion.a
              href="https://wa.me/919876543210?text=Hi! I need help finding a specific product"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Get Personal Assistant
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Product Card Component
const ProductCard: React.FC<{
  product: any;
  index: number;
  animationConfig: any;
  handleContactForProduct: (name: string) => void;
}> = ({ product, index, animationConfig, handleContactForProduct }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: animationConfig.motionDuration,
        delay: index * animationConfig.motionStagger,
        ease: animationConfig.motionEasing
      }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className="bg-white rounded-3xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 h-full"
    >
      {/* Product Badge */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {product.badge}
          </span>
        </div>
        
        {/* Product Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>

      <div className="p-6 flex flex-col h-full">
        {/* Product Name & Rating */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-blue-900 mb-2 group-hover:text-blue-700 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-sm text-gray-600">({product.rating})</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-green-600">{product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
          )}
        </div>

        {/* Features */}
        <div className="mb-6 flex-grow">
          <div className="grid grid-cols-2 gap-2">
            {product.features.slice(0, 4).map((feature: string, idx: number) => (
              <div key={idx} className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="text-xs text-gray-600 truncate">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleContactForProduct(product.name)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:from-blue-700 hover:to-green-700 transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4" />
            Buy Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-gray-100 text-blue-600 p-3 rounded-xl hover:bg-blue-50 transition-colors duration-300"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductShowcase;