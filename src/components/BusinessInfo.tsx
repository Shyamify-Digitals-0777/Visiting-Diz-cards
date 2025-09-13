import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Award, X, ExternalLink, Phone, Mail } from 'lucide-react';

interface BusinessInfoProps {
  animationConfig: any;
}

const BusinessInfo: React.FC<BusinessInfoProps> = ({ animationConfig }) => {
  const [showMapPopup, setShowMapPopup] = useState(false);

  const businessData = {
    rating: 4.8,
    totalReviews: 150,
    address: "Shop No. 15, Main Market, Sector 22, Chandigarh - 160022",
    hours: [
      { day: "Monday - Saturday", time: "10:00 AM - 9:00 PM" },
      { day: "Sunday", time: "11:00 AM - 8:00 PM" }
    ],
    achievements: [
      { icon: Award, text: "10+ Years Experience" },
      { icon: Star, text: "Authorized Dealer" },
      { icon: MapPin, text: "Prime Location" }
    ]
  };

  // Handle escape key press to close popup
  React.useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowMapPopup(false);
      }
    };

    if (showMapPopup) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [showMapPopup]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: animationConfig.motionDuration,
            ease: animationConfig.motionEasing
          }}
          className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-12 transition-colors duration-300"
        >
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Business Details */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-400 mb-4 transition-colors duration-300">Business Information</h2>
                
                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex">{renderStars(businessData.rating)}</div>
                  <span className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-400">{businessData.rating}</span>
                  <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">({businessData.totalReviews} reviews)</span>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">{businessData.address}</p>
                </div>

                {/* Hours */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-900 dark:text-blue-400 text-sm md:text-base">Operating Hours</span>
                  </div>
                  {businessData.hours.map((hour, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 rounded-lg px-3 md:px-4 py-2 transition-colors duration-300">
                      <span className="text-gray-700 dark:text-gray-300 text-sm md:text-base">{hour.day}</span>
                      <span className="font-medium text-blue-900 dark:text-blue-400 text-sm md:text-base">{hour.time}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Map and Achievements */}
            <div className="space-y-4 md:space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="bg-gray-100 dark:bg-gray-700 rounded-xl md:rounded-2xl h-48 md:h-64 flex items-center justify-center relative overflow-hidden transition-colors duration-300"
              >
                {/* Static Map Preview */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3429.8674775892937!2d76.7682542!3d30.7333148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDQ0JzAwLjAiTiA3NsKwNDYnMDUuNyJF!5e0!3m2!1sen!2sin!4v1635789123456!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  className="border-0 rounded-2xl"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Harvinder Telecom Location"
                ></iframe>
                
                {/* Interactive Overlay */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="absolute inset-0 bg-blue-900/20 flex items-center justify-center cursor-pointer group"
                  onClick={() => setShowMapPopup(true)}
                >
                  <div className="bg-white rounded-full p-3 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <MapPin className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-medium text-gray-800 text-center">Click to view interactive map</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Achievements */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="grid grid-cols-1 gap-4"
              >
                {businessData.achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-3 bg-blue-50 rounded-xl p-4 hover:bg-blue-100 transition-colors duration-300"
                    >
                      <Icon className="w-6 h-6 text-blue-600" />
                      <span className="font-medium text-blue-900">{achievement.text}</span>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Interactive Map Popup Modal */}
        {showMapPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowMapPopup(false);
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="map-popup-title"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h2 id="map-popup-title" className="text-2xl font-bold text-blue-900 dark:text-blue-400">
                    Harvinder Telecom Location
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Find us and get directions
                  </p>
                </div>
                <button
                  onClick={() => setShowMapPopup(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                  aria-label="Close map popup"
                >
                  <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="grid md:grid-cols-2 gap-6 p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                {/* Interactive Map */}
                <div className="space-y-4">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden h-64 md:h-80">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3429.8674775892937!2d76.7682542!3d30.7333148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDQ0JzAwLjAiTiA3NsKwNDYnMDUuNyJF!5e0!3m2!1sen!2sin!4v1635789123456!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      className="border-0"
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Interactive Harvinder Telecom Location Map"
                    ></iframe>
                  </div>
                  
                  {/* Map Actions */}
                  <div className="flex gap-3">
                    <motion.a
                      href="https://maps.google.com/?q=Harvinder+Telecom+Chandigarh"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold text-center transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Open in Google Maps
                    </motion.a>
                  </div>
                </div>

                {/* Business Information */}
                <div className="space-y-6">
                  {/* Address */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-blue-900 dark:text-blue-400 mb-2">Address</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {businessData.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                    <h3 className="font-semibold text-green-900 dark:text-green-400 mb-3">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-green-600" />
                        <a 
                          href="tel:+919876543210"
                          className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                        >
                          +91 98765 43210
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-green-600" />
                        <a 
                          href="mailto:info@harvinder-telecom.com"
                          className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                        >
                          info@harvinder-telecom.com
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Operating Hours */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-purple-900 dark:text-purple-400">Operating Hours</h3>
                    </div>
                    <div className="space-y-2">
                      {businessData.hours.map((hour, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{hour.day}</span>
                          <span className="font-medium text-purple-900 dark:text-purple-400 text-sm">{hour.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
                    <h3 className="font-semibold text-yellow-900 dark:text-yellow-400 mb-3">Customer Rating</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex">{renderStars(businessData.rating)}</div>
                      <span className="text-xl font-bold text-yellow-900 dark:text-yellow-400">{businessData.rating}</span>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">({businessData.totalReviews} reviews)</span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <motion.a
                      href="tel:+919876543210"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold text-center transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Call Now
                    </motion.a>
                    <motion.a
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold text-center transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      WhatsApp
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BusinessInfo;