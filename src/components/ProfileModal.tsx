import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Award, Download, Share2 } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: {
    name: string;
    title: string;
    image: string;
    description?: string;
    achievements?: string[];
  };
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, profileData }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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

  // Handle image download
  const handleDownload = async () => {
    try {
      const response = await fetch(profileData.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${profileData.name.replace(/\s+/g, '_')}_profile.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  // Handle image sharing
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profileData.name} - ${profileData.title}`,
          text: profileData.description || `Check out ${profileData.name}'s profile`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Profile link copied to clipboard!');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
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
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        aria-describedby="profile-modal-description"
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 id="profile-modal-title" className="text-2xl font-bold text-blue-900 dark:text-blue-400 flex items-center gap-2">
                <User className="w-6 h-6" />
                Profile
              </h2>
              <p id="profile-modal-description" className="text-gray-600 dark:text-gray-300 mt-1">
                {profileData.name} - {profileData.title}
              </p>
            </div>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close profile modal"
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            {/* Profile Image */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <motion.img
                  src={profileData.image}
                  alt={`${profileData.name} profile picture`}
                  className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover shadow-2xl mx-auto border-4 border-white dark:border-gray-700"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                />
                
                {/* Image overlay with actions */}
                <motion.div
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ opacity: 1 }}
                >
                  <div className="flex gap-3">
                    <button
                      onClick={handleDownload}
                      className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
                      aria-label="Download profile picture"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
                      aria-label="Share profile"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {profileData.name}
              </h3>
              <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold mb-4">
                {profileData.title}
              </p>
              
              {profileData.description && (
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg mx-auto">
                  {profileData.description}
                </p>
              )}
            </div>

            {/* Achievements */}
            {profileData.achievements && profileData.achievements.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Achievements & Certifications
                </h4>
                <div className="grid gap-3">
                  {profileData.achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-3 bg-white/50 dark:bg-gray-700/50 rounded-lg p-3"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300">{achievement}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleDownload}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Download className="w-5 h-5" />
                Download Image
              </button>
              <button
                onClick={handleShare}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <Share2 className="w-5 h-5" />
                Share Profile
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileModal;