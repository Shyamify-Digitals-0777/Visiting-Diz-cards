import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Percent, Clock, Star, ShoppingCart, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PopupOffer {
  id: string;
  title: string;
  description: string;
  discount: string;
  code?: string;
  image?: string;
  backgroundColor: string;
  textColor: string;
  buttonText: string;
  buttonColor: string;
  expiryDate?: string;
  isActive: boolean;
  showOnLoad: boolean;
  delaySeconds: number;
  maxShowsPerUser: number;
  targetUrl?: string;
}

interface PopupNotificationProps {
  isDarkMode?: boolean;
}

const PopupNotification: React.FC<PopupNotificationProps> = ({ isDarkMode = false }) => {
  const [currentOffer, setCurrentOffer] = useState<PopupOffer | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Sample popup offers - in production, these would come from admin panel
  const sampleOffers: PopupOffer[] = [
    {
      id: 'welcome-discount',
      title: '🎉 Welcome to Harvinder Telecom!',
      description: 'Get exclusive discount on your first purchase. Limited time offer for new customers!',
      discount: '10% OFF',
      code: 'WELCOME10',
      backgroundColor: 'bg-gradient-to-r from-blue-600 to-purple-600',
      textColor: 'text-white',
      buttonText: 'Claim Discount',
      buttonColor: 'bg-white text-blue-600 hover:bg-gray-100',
      expiryDate: '2024-12-31',
      isActive: true,
      showOnLoad: true,
      delaySeconds: 3,
      maxShowsPerUser: 3,
      targetUrl: 'https://wa.me/919876543210?text=Hi! I want to use the WELCOME10 discount code'
    },
    {
      id: 'flash-sale',
      title: '⚡ Flash Sale Alert!',
      description: 'Massive discounts on smartphones! Hurry up, limited stock available.',
      discount: 'Up to 25% OFF',
      backgroundColor: 'bg-gradient-to-r from-red-500 to-orange-500',
      textColor: 'text-white',
      buttonText: 'Shop Now',
      buttonColor: 'bg-white text-red-600 hover:bg-gray-100',
      expiryDate: '2024-02-01',
      isActive: true,
      showOnLoad: true,
      delaySeconds: 5,
      maxShowsPerUser: 2,
      targetUrl: '#products'
    },
    {
      id: 'emi-offer',
      title: '💳 Zero Cost EMI Available',
      description: 'Buy your favorite smartphone with 0% interest EMI. No hidden charges!',
      discount: '0% EMI',
      backgroundColor: 'bg-gradient-to-r from-green-500 to-teal-500',
      textColor: 'text-white',
      buttonText: 'Check EMI Options',
      buttonColor: 'bg-white text-green-600 hover:bg-gray-100',
      isActive: true,
      showOnLoad: true,
      delaySeconds: 10,
      maxShowsPerUser: 1,
      targetUrl: '#finance'
    }
  ];

  // Load popup settings from localStorage or API
  useEffect(() => {
    const loadPopupSettings = async () => {
      try {
        // In production, fetch from Supabase
        // const { data, error } = await supabase
        //   .from('popup_offers')
        //   .select('*')
        //   .eq('is_active', true)
        //   .order('created_at', { ascending: false })
        //   .limit(1)
        //   .single();

        // For now, use sample data
        const activeOffer = sampleOffers.find(offer => offer.isActive && offer.showOnLoad);
        
        if (activeOffer) {
          // Check if user has seen this popup before
          const viewCount = getPopupViewCount(activeOffer.id);
          
          if (viewCount < activeOffer.maxShowsPerUser) {
            // Show popup after delay
            setTimeout(() => {
              setCurrentOffer(activeOffer);
              setShowPopup(true);
              incrementPopupViewCount(activeOffer.id);
            }, activeOffer.delaySeconds * 1000);
          }
        }
      } catch (error) {
        console.error('Error loading popup settings:', error);
      }
    };

    loadPopupSettings();
  }, []);

  // Countdown timer for expiry
  useEffect(() => {
    if (currentOffer?.expiryDate) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const expiry = new Date(currentOffer.expiryDate!).getTime();
        const difference = expiry - now;

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        } else {
          setTimeLeft('Expired');
          setShowPopup(false);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentOffer]);

  // Helper functions for localStorage
  const getPopupViewCount = (offerId: string): number => {
    const count = localStorage.getItem(`popup_views_${offerId}`);
    return count ? parseInt(count, 10) : 0;
  };

  const incrementPopupViewCount = (offerId: string) => {
    const currentCount = getPopupViewCount(offerId);
    localStorage.setItem(`popup_views_${offerId}`, (currentCount + 1).toString());
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    
    // Track close event
    if (currentOffer) {
      // In production, track analytics
      console.log('Popup closed:', currentOffer.id);
    }
  };

  const handleOfferClick = () => {
    if (currentOffer?.targetUrl) {
      if (currentOffer.targetUrl.startsWith('#')) {
        // Scroll to section
        const element = document.querySelector(currentOffer.targetUrl);
        element?.scrollIntoView({ behavior: 'smooth' });
      } else if (currentOffer.targetUrl.startsWith('http')) {
        // Open external link
        window.open(currentOffer.targetUrl, '_blank');
      }
    }
    
    // Track click event
    console.log('Popup offer clicked:', currentOffer?.id);
    setShowPopup(false);
  };

  const copyDiscountCode = () => {
    if (currentOffer?.code) {
      navigator.clipboard.writeText(currentOffer.code);
      // Show temporary feedback
      const button = document.getElementById('copy-code-btn');
      if (button) {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    }
  };

  if (!currentOffer) return null;

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClosePopup}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`${currentOffer.backgroundColor} rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClosePopup}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-200"
              aria-label="Close popup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-16 h-16 bg-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white rounded-full"></div>
            </div>

            <div className="relative z-10 p-8 text-center">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6"
              >
                {currentOffer.id.includes('discount') && <Gift className="w-8 h-8 text-white" />}
                {currentOffer.id.includes('sale') && <Percent className="w-8 h-8 text-white" />}
                {currentOffer.id.includes('emi') && <ShoppingCart className="w-8 h-8 text-white" />}
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`text-2xl font-bold ${currentOffer.textColor} mb-4`}
              >
                {currentOffer.title}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`${currentOffer.textColor} text-opacity-90 mb-6 leading-relaxed`}
              >
                {currentOffer.description}
              </motion.p>

              {/* Discount Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-6"
              >
                <div className="text-3xl font-bold text-white mb-2">
                  {currentOffer.discount}
                </div>
                {currentOffer.code && (
                  <div className="bg-white/30 rounded-lg p-2">
                    <p className="text-white/80 text-sm mb-1">Use Code:</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-mono font-bold text-white text-lg">
                        {currentOffer.code}
                      </span>
                      <button
                        id="copy-code-btn"
                        onClick={copyDiscountCode}
                        className="bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded text-xs transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Countdown Timer */}
              {timeLeft && timeLeft !== 'Expired' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white/20 rounded-lg p-3 mb-6"
                >
                  <div className="flex items-center justify-center gap-2 text-white">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Offer expires in: {timeLeft}</span>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-3"
              >
                <button
                  onClick={handleOfferClick}
                  className={`w-full ${currentOffer.buttonColor} py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105`}
                >
                  {currentOffer.buttonText}
                </button>
                
                <button
                  onClick={handleClosePopup}
                  className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-2 px-4 rounded-lg font-medium transition-all duration-300"
                >
                  Maybe Later
                </button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-6 flex items-center justify-center gap-4 text-white/80 text-sm"
              >
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>4.8 Rating</span>
                </div>
                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                <div>1000+ Happy Customers</div>
                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                <div>Genuine Products</div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PopupNotification;