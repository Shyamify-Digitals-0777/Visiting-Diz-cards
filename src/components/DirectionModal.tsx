import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Navigation, Phone, Clock, ExternalLink, AlertCircle } from 'lucide-react';

interface DirectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessData: {
    name: string;
    address: string;
    phone: string;
    hours: Array<{ day: string; time: string }>;
    coordinates?: { lat: number; lng: number };
  };
}

const DirectionModal: React.FC<DirectionModalProps> = ({ isOpen, onClose, businessData }) => {
  const [mapError, setMapError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle escape key press
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

  // Handle map loading
  const handleMapLoad = () => {
    setIsLoading(false);
    setMapError(false);
  };

  const handleMapError = () => {
    setIsLoading(false);
    setMapError(true);
  };

  // Generate Google Maps URLs
  const getDirectionsUrl = () => {
    const encodedAddress = encodeURIComponent(businessData.address);
    return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  };

  const getMapEmbedUrl = () => {
    const encodedAddress = encodeURIComponent(businessData.address);
    return `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'demo'}&q=${encodedAddress}&zoom=15`;
  };

  // Handle outside click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Keyboard navigation within modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="direction-modal-title"
        aria-describedby="direction-modal-description"
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 id="direction-modal-title" className="text-2xl font-bold text-blue-900 dark:text-blue-400 flex items-center gap-2">
                <Navigation className="w-6 h-6" />
                Get Directions
              </h2>
              <p id="direction-modal-description" className="text-gray-600 dark:text-gray-300 mt-1">
                Find your way to {businessData.name}
              </p>
            </div>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close directions modal"
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="grid lg:grid-cols-2 gap-6 p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            {/* Interactive Map */}
            <div className="space-y-4">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden h-80 lg:h-96 relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600 dark:text-gray-300">Loading map...</span>
                  </div>
                )}
                
                {mapError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 text-center p-4">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Map Unavailable
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Unable to load the interactive map. You can still get directions using the button below.
                    </p>
                    <a
                      href={getDirectionsUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                ) : (
                  <iframe
                    src={getMapEmbedUrl()}
                    width="100%"
                    height="100%"
                    className="border-0"
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map showing location of ${businessData.name}`}
                    onLoad={handleMapLoad}
                    onError={handleMapError}
                  />
                )}
              </div>
              
              {/* Map Actions */}
              <div className="flex gap-3">
                <a
                  href={getDirectionsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold text-center transition-colors duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  Get Directions
                </a>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(businessData.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold text-center transition-colors duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <MapPin className="w-5 h-5" />
                  View on Maps
                </a>
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
                <h3 className="font-semibold text-green-900 dark:text-green-400 mb-3 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <a 
                      href={`tel:${businessData.phone}`}
                      className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 focus:outline-none focus:underline"
                    >
                      {businessData.phone}
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

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${businessData.phone}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold text-center transition-colors duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </a>
                <a
                  href={`https://wa.me/${businessData.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold text-center transition-colors duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  WhatsApp
                </a>
              </div>

              {/* Additional Info */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-400 mb-2">
                  Navigation Tips
                </h3>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• Located in Main Market, Sector 22</li>
                  <li>• Parking available nearby</li>
                  <li>• Easily accessible by public transport</li>
                  <li>• Look for the blue signboard</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DirectionModal;