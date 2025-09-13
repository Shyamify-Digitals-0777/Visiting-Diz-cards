import React from 'react';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

interface HeroSectionProps {
  animationConfig: any;
}

const HeroSection: React.FC<HeroSectionProps> = ({ animationConfig }) => {
  return (
    <section className="min-h-screen parallax-bg flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-green-500/10 rounded-full blur-xl"></div>
      </motion.div>

      <div className="container mx-auto px-4 text-center z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: animationConfig.motionDuration,
            ease: animationConfig.motionEasing,
            delay: 0.2
          }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center glass-effect">
            <Phone className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: animationConfig.motionDuration,
            ease: animationConfig.motionEasing,
            delay: 0.4
          }}
          className="text-4xl md:text-6xl font-bold text-white mb-4 text-shadow"
        >
          Harvinder Telecom
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: animationConfig.motionDuration,
            ease: animationConfig.motionEasing,
            delay: 0.6
          }}
          className="text-xl md:text-2xl text-white/90 mb-8 text-shadow max-w-2xl mx-auto"
        >
          Your Trusted Mobile & Electronics Partner
          <br />
          <span className="text-lg md:text-xl text-green-300">
            Quality Products • Best Prices • Expert Service
          </span>
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: animationConfig.motionDuration,
            ease: animationConfig.motionEasing,
            delay: 0.8
          }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.a
            href="tel:+919876543210"
            whileHover={{ scale: animationConfig.hoverScale }}
            whileTap={{ scale: animationConfig.tapScale }}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all duration-300 btn-large"
          >
            Call Now: +91 98765 43210
          </motion.a>
          <motion.a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: animationConfig.hoverScale }}
            whileTap={{ scale: animationConfig.tapScale }}
            className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg glass-effect transition-all duration-300 btn-large"
          >
            WhatsApp Chat
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;