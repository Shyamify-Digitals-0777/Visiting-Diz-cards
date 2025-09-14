import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Star, Heart, Share2 } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating: number;
  features: string[];
  inStock: boolean;
  isNew?: boolean;
  discount?: string;
}

interface BrandProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
  brandColor: string;
  animationConfig: any;
}

const BrandProductModal: React.FC<BrandProductModalProps> = ({ 
  isOpen, 
  onClose, 
  brandName, 
  brandColor,
  animationConfig 
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Brand-specific product data
  const brandProducts: Record<string, Product[]> = {
    Samsung: [
      {
        id: 1,
        name: "Galaxy S24 Ultra",
        price: "₹1,24,999",
        originalPrice: "₹1,34,999",
        image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=300",
        rating: 4.8,
        features: ["200MP Camera", "S Pen", "5000mAh"],
        inStock: true,
        isNew: true,
        discount: "7% OFF"
      },
      {
        id: 2,
        name: "Galaxy S24",
        price: "₹79,999",
        originalPrice: "₹84,999",
        image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=300",
        rating: 4.7,
        features: ["50MP Camera", "120Hz Display", "4000mAh"],
        inStock: true,
        discount: "6% OFF"
      },
      {
        id: 3,
        name: "Galaxy A54 5G",
        price: "₹38,999",
        image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=300",
        rating: 4.5,
        features: ["50MP OIS Camera", "5000mAh", "120Hz AMOLED"],
        inStock: true
      },
      {
        id: 4,
        name: "Galaxy Z Fold 5",
        price: "₹1,54,999",
        image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300",
        rating: 4.6,
        features: ["Foldable Display", "S Pen Support", "4400mAh"],
        inStock: true,
        isNew: true
      }
    ],
    Apple: [
      {
        id: 5,
        name: "iPhone 15 Pro Max",
        price: "₹1,59,900",
        image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=300",
        rating: 4.9,
        features: ["A17 Pro Chip", "Titanium Design", "Action Button"],
        inStock: true,
        isNew: true
      },
      {
        id: 6,
        name: "iPhone 15",
        price: "₹79,900",
        image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=300",
        rating: 4.8,
        features: ["A16 Bionic", "48MP Camera", "USB-C"],
        inStock: true,
        isNew: true
      },
      {
        id: 7,
        name: "iPhone 14",
        price: "₹69,900",
        originalPrice: "₹79,900",
        image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=300",
        rating: 4.7,
        features: ["A15 Bionic", "Dual Camera", "Ceramic Shield"],
        inStock: true,
        discount: "12% OFF"
      },
      {
        id: 8,
        name: "iPhone 13",
        price: "₹59,900",
        originalPrice: "₹69,900",
        image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300",
        rating: 4.6,
        features: ["A15 Bionic", "Cinematic Mode", "12MP Dual Camera"],
        inStock: true,
        discount: "14% OFF"
      }
    ],
    Xiaomi: [
      {
        id: 9,
        name: "Xiaomi 14 Ultra",
        price: "₹99,999",
        image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=300",
        rating: 4.6,
        features: ["Leica Camera", "Snapdragon 8 Gen 3", "90W Charging"],
        inStock: true,
        isNew: true
      },
      {
        id: 10,
        name: "Redmi Note 13 Pro",
        price: "₹25,999",
        image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=300",
        rating: 4.4,
        features: ["200MP Camera", "67W Charging", "120Hz AMOLED"],
        inStock: true
      },
      {
        id: 11,
        name: "POCO X6 Pro",
        price: "₹26,999",
        originalPrice: "₹29,999",
        image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=300",
        rating: 4.3,
        features: ["Dimensity 8300", "64MP OIS", "67W Turbo Charging"],
        inStock: true,
        discount: "10% OFF"
      }
    ],
    OnePlus: [
      {
        id: 12,
        name: "OnePlus 12",
        price: "₹64,999",
        originalPrice: "₹69,999",
        image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=300",
        rating: 4.7,
        features: ["Snapdragon 8 Gen 3", "100W Charging", "Hasselblad Camera"],
        inStock: true,
        discount: "8% OFF"
      },
      {
        id: 13,
        name: "OnePlus 11R",
        price: "₹39,999",
        image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=300",
        rating: 4.5,
        features: ["Snapdragon 8+ Gen 1", "100W SuperVOOC", "50MP IMX890"],
        inStock: true
      }
    ],
    Oppo: [
      {
        id: 14,
        name: "Oppo Find X7 Ultra",
        price: "₹1,09,999",
        image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=300",
        rating: 4.5,
        features: ["Hasselblad Camera", "Snapdragon 8 Gen 3", "100W Charging"],
        inStock: true,
        isNew: true
      },
      {
        id: 15,
        name: "Oppo Reno 11 Pro",
        price: "₹39,999",
        image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=300",
        rating: 4.3,
        features: ["50MP Portrait Camera", "80W SuperVOOC", "Curved Display"],
        inStock: true
      }
    ],
    Vivo: [
      {
        id: 16,
        name: "Vivo X100 Pro",
        price: "₹89,999",
        image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=300",
        rating: 4.6,
        features: ["Zeiss Optics", "Dimensity 9300", "100W Charging"],
        inStock: true,
        isNew: true
      },
      {
        id: 17,
        name: "Vivo V29 Pro",
        price: "₹42,999",
        image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=300",
        rating: 4.4,
        features: ["50MP Eye AF Camera", "80W FlashCharge", "Curved AMOLED"],
        inStock: true
      }
    ],
    Realme: [
      {
        id: 18,
        name: "Realme GT 5 Pro",
        price: "₹54,999",
        image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=300",
        rating: 4.4,
        features: ["Snapdragon 8 Gen 3", "100W SuperDart", "50MP Periscope"],
        inStock: true,
        isNew: true
      },
      {
        id: 19,
        name: "Realme 12 Pro+",
        price: "₹29,999",
        image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=300",
        rating: 4.2,
        features: ["64MP Periscope", "67W SUPERVOOC", "120Hz Curved Display"],
        inStock: true
      }
    ],
    Motorola: [
      {
        id: 20,
        name: "Motorola Edge 50 Ultra",
        price: "₹59,999",
        image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=300",
        rating: 4.3,
        features: ["Snapdragon 8s Gen 3", "125W Charging", "50MP Telephoto"],
        inStock: true,
        isNew: true
      },
      {
        id: 21,
        name: "Moto G84 5G",
        price: "₹19,999",
        originalPrice: "₹22,999",
        image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=300",
        rating: 4.1,
        features: ["50MP OIS Camera", "33W TurboPower", "120Hz pOLED"],
        inStock: true,
        discount: "13% OFF"
      }
    ]
  };

  const products = brandProducts[brandName] || [];

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

  // Handle outside click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle product contact
  const handleContact = (product: Product) => {
    const message = `Hi! I'm interested in ${product.name} (${product.price}). Is it available?`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Render stars
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

  if (!isOpen) return null;

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
        aria-labelledby="brand-modal-title"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          ref={modalRef}
        >
          {/* Header */}
          <div className={`${brandColor} text-white p-6 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h2 id="brand-modal-title" className="text-3xl font-bold mb-2">
                  {brandName} Products
                </h2>
                <p className="text-white/90">
                  Discover our latest {brandName} collection with best prices
                </p>
              </div>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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

                      {/* Stock Status */}
                      <div className="absolute bottom-3 right-3">
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
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">{renderStars(product.rating)}</div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ({product.rating})
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 mb-4">
                        {product.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      <motion.button
                        onClick={() => handleContact(product)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Contact for Price
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <MessageCircle className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  No Products Available
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Products for {brandName} will be available soon.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Need help choosing the right {brandName} device?
                </p>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                  Our experts are here to help!
                </p>
              </div>
              <motion.a
                href="https://wa.me/919876543210?text=Hi! I need help choosing a mobile phone"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
                Get Expert Advice
              </motion.a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BrandProductModal;