import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, Share2, ShoppingCart } from 'lucide-react';
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
}

interface ProductCardProps {
  product: Product;
  index?: number;
  onFavoriteToggle?: (productId: number) => void;
  onShare?: (product: Product) => void;
  onContact?: (product: Product) => void;
  isFavorite?: boolean;
  isDarkMode?: boolean;
  animationConfig?: any;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index = 0,
  onFavoriteToggle,
  onShare,
  onContact,
  isFavorite = false,
  isDarkMode = false,
  animationConfig = { motionDuration: 0.6, motionStagger: 0.1, motionEasing: [0.25, 0.46, 0.45, 0.94] }
}) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: animationConfig.motionDuration,
        delay: index * animationConfig.motionStagger,
        ease: animationConfig.motionEasing
      }}
      whileHover={{ y: -5 }}
      className={`${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } rounded-xl border shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group`}
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
          {onFavoriteToggle && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onFavoriteToggle(product.id)}
              className={`p-2 rounded-full ${
                isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700'
              } shadow-lg`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </motion.button>
          )}
          
          {onShare && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onShare(product)}
              className="p-2 rounded-full bg-white/90 text-gray-700 shadow-lg"
              aria-label="Share product"
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
          )}
          
          {/* Quick View Button */}
          <QuickViewButton
            productId={product.id}
            size="md"
            variant="icon"
            label={`Quick view ${product.name}`}
          />
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
          <span className={`text-xs px-2 py-1 rounded-full ${
            isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
          }`}>
            {product.category}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'
          }`}>
            {product.brand}
          </span>
        </div>

        <h3 className={`font-bold text-lg ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        } mb-2 line-clamp-2`}>
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex">{renderStars(product.rating)}</div>
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            ({product.reviews})
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xl font-bold ${
            isDarkMode ? 'text-blue-400' : 'text-blue-600'
          }`}>
            {product.price}
          </span>
          {product.originalPrice && (
            <span className={`text-sm ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            } line-through`}>
              {product.originalPrice}
            </span>
          )}
        </div>

        <div className="space-y-1 mb-4">
          {product.features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${
                isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
              }`} />
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {feature}
              </span>
            </div>
          ))}
        </div>

        {onContact && (
          <motion.button
            onClick={() => onContact(product)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            disabled={!product.inStock}
          >
            <ShoppingCart className="w-4 h-4" />
            {product.inStock ? 'Contact for Price' : 'Out of Stock'}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;