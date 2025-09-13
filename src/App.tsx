import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import HeroSection from './components/HeroSection';
import ContactBar from './components/ContactBar';
import BusinessInfo from './components/BusinessInfo';
import BrandPartners from './components/BrandPartners';
import FinancePartners from './components/FinancePartners';
import ProductShowcase from './components/ProductShowcase';
import ProductGallery from './components/ProductGallery';
import ReviewsSection from './components/ReviewsSection';
import Footer from './components/Footer';
import './App.css';

const animationConfig = {
  motionDuration: 0.6,
  motionStagger: 0.1,
  motionEasing: [0.25, 0.46, 0.45, 0.94],
  hoverScale: 1.05,
  tapScale: 0.95
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document root and body for global effect
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-blue-900 dark:text-blue-400 font-medium">Loading Harvinder Telecom...</p>
        </motion.div>
      </div>
    );
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    
    // Dispatch custom event for components that need to react to theme changes
    window.dispatchEvent(new CustomEvent('themeChange', { 
      detail: { isDarkMode: !isDarkMode } 
    }));
  };

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Theme Toggle Button */}
      <motion.button
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 text-blue-900 dark:text-blue-400 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200 dark:border-gray-600"
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <Sun className="w-6 h-6" />
        ) : (
          <Moon className="w-6 h-6" />
        )}
      </motion.button>

      <HeroSection animationConfig={animationConfig} />
      <ContactBar animationConfig={animationConfig} />
      <BusinessInfo animationConfig={animationConfig} />
      <BrandPartners animationConfig={animationConfig} />
      <FinancePartners animationConfig={animationConfig} />
      <ProductShowcase animationConfig={animationConfig} isDarkMode={isDarkMode} />
      <ProductGallery animationConfig={animationConfig} />
      <ReviewsSection animationConfig={animationConfig} isDarkMode={isDarkMode} />
      <Footer animationConfig={animationConfig} />
    </div>
  );
}

export default App;