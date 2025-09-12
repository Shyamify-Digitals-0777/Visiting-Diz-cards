import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSection from './components/HeroSection';
import ContactBar from './components/ContactBar';
import BusinessInfo from './components/BusinessInfo';
import BrandPartners from './components/BrandPartners';
import FinancePartners from './components/FinancePartners';
import ProductShowcase from './components/ProductShowcase';
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

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-blue-900 font-medium">Loading Harvinder Telecom...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <HeroSection animationConfig={animationConfig} />
      <ContactBar animationConfig={animationConfig} />
      <BusinessInfo animationConfig={animationConfig} />
      <BrandPartners animationConfig={animationConfig} />
      <FinancePartners animationConfig={animationConfig} />
      <ProductShowcase animationConfig={animationConfig} />
      <ReviewsSection animationConfig={animationConfig} />
      <Footer animationConfig={animationConfig} />
    </div>
  );
}

export default App;