import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Percent, Clock, CheckCircle } from 'lucide-react';

interface FinancePartnersProps {
  animationConfig: any;
}

const FinancePartners: React.FC<FinancePartnersProps> = ({ animationConfig }) => {
  const financePartners = [
    { name: 'Bajaj Finserv', offer: '0% EMI up to 24 months', color: 'bg-blue-600' },
    { name: 'HDFC Bank', offer: '12 months no cost EMI', color: 'bg-red-600' },
    { name: 'ICICI Bank', offer: '18 months easy EMI', color: 'bg-orange-500' },
    { name: 'SBI Cards', offer: '24 months flexible EMI', color: 'bg-blue-800' },
    { name: 'Axis Bank', offer: '15 months 0% interest', color: 'bg-purple-600' },
    { name: 'Kotak Bank', offer: '20 months easy payment', color: 'bg-red-500' }
  ];

  const emiFeatures = [
    { icon: Percent, title: '0% Interest', description: 'No additional charges on select EMIs' },
    { icon: Clock, title: 'Quick Approval', description: 'Instant approval in minutes' },
    { icon: CheckCircle, title: 'Easy Process', description: 'Simple documentation required' },
    { icon: CreditCard, title: 'Multiple Options', description: 'Various EMI tenure options' }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
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
          <h2 className="text-4xl font-bold text-blue-900 mb-4">Finance Partners</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Make your dream purchase affordable with our flexible EMI options from trusted financial partners.
          </p>
        </motion.div>

        {/* Finance Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
          {financePartners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: animationConfig.motionDuration,
                delay: index * 0.1,
                ease: animationConfig.motionEasing
              }}
              whileHover={{
                scale: animationConfig.hoverScale,
                transition: { duration: 0.3 }
              }}
              className={`${partner.color} rounded-2xl p-6 text-white relative overflow-hidden group cursor-pointer hover-lift`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <div className="relative z-10 text-center">
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{partner.name}</h3>
                <p className="text-sm text-white/90 font-medium">{partner.offer}</p>
              </div>
              
              {/* Animated background effect */}
              <motion.div
                className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        {/* EMI Features */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: animationConfig.motionDuration,
            delay: 0.6,
            ease: animationConfig.motionEasing
          }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
        >
          <h3 className="text-3xl font-bold text-blue-900 text-center mb-8">EMI Benefits</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {emiFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: animationConfig.motionEasing
                  }}
                  className="text-center group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="bg-gradient-to-br from-blue-500 to-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow duration-300"
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h4 className="text-lg font-bold text-blue-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: animationConfig.motionDuration,
              delay: 0.8,
              ease: animationConfig.motionEasing
            }}
            className="mt-12 text-center"
          >
            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-6 text-white">
              <h4 className="text-2xl font-bold mb-4">Ready to Purchase?</h4>
              <p className="text-lg mb-6">Get instant EMI approval and take home your favorite device today!</p>
              <motion.a
                href="https://wa.me/919876543210?text=Hi! I'm interested in EMI options for mobile purchase"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-300"
              >
                Check EMI Options
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinancePartners;