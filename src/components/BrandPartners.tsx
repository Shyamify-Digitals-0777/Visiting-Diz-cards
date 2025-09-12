import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone } from 'lucide-react';

interface BrandPartnersProps {
  animationConfig: any;
}

const BrandPartners: React.FC<BrandPartnersProps> = ({ animationConfig }) => {
  const brands = [
    { name: 'Samsung', description: 'Premium smartphones and accessories', color: 'bg-blue-500' },
    { name: 'Apple', description: 'iPhone, iPad, MacBook and accessories', color: 'bg-gray-800' },
    { name: 'Xiaomi', description: 'Mi and Redmi series smartphones', color: 'bg-orange-500' },
    { name: 'OnePlus', description: 'Flagship smartphones and audio', color: 'bg-red-500' },
    { name: 'Oppo', description: 'Camera-focused smartphones', color: 'bg-green-500' },
    { name: 'Vivo', description: 'Stylish smartphones and accessories', color: 'bg-blue-600' },
    { name: 'Realme', description: 'Youth-focused mobile devices', color: 'bg-yellow-500' },
    { name: 'Motorola', description: 'Durable and reliable phones', color: 'bg-indigo-500' }
  ];

  return (
    <section className="py-16 bg-white">
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
          <h2 className="text-4xl font-bold text-blue-900 mb-4">Authorized Brand Partners</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We are proud authorized dealers for premium mobile brands, ensuring authentic products and warranty support.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {brands.map((brand, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: animationConfig.motionDuration,
                delay: index * animationConfig.motionStagger,
                ease: animationConfig.motionEasing
              }}
              whileHover={{
                scale: animationConfig.hoverScale,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              className="group cursor-pointer"
            >
              <div className={`${brand.color} rounded-3xl p-6 text-white relative overflow-hidden hover-lift`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-white/20 rounded-full p-3">
                      <Smartphone className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-center">{brand.name}</h3>
                  <p className="text-sm text-white/90 text-center leading-relaxed">
                    {brand.description}
                  </p>
                </div>
                
                {/* Hover effect overlay */}
                <motion.div
                  className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.05 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: animationConfig.motionDuration,
            delay: 0.8,
            ease: animationConfig.motionEasing
          }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Why Choose Our Authorized Products?</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✓</span>
                </div>
                <h4 className="font-semibold mb-2">100% Authentic</h4>
                <p className="text-white/90 text-sm">Genuine products with official warranty</p>
              </div>
              <div>
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛠️</span>
                </div>
                <h4 className="font-semibold mb-2">Service Support</h4>
                <p className="text-white/90 text-sm">Official service center support</p>
              </div>
              <div>
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💯</span>
                </div>
                <h4 className="font-semibold mb-2">Best Prices</h4>
                <p className="text-white/90 text-sm">Competitive pricing with offers</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BrandPartners;