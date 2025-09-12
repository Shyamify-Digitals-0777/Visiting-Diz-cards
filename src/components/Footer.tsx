import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, MessageCircle, Heart } from 'lucide-react';

interface FooterProps {
  animationConfig: any;
}

const Footer: React.FC<FooterProps> = ({ animationConfig }) => {
  const currentYear = new Date().getFullYear();

  const contactInfo = [
    { icon: Phone, label: 'Call Us', value: '+91 98765 43210', href: 'tel:+919876543210' },
    { icon: MessageCircle, label: 'WhatsApp', value: '+91 98765 43210', href: 'https://wa.me/919876543210' },
    { icon: Mail, label: 'Email', value: 'info@harvi nder-telecom.com', href: 'mailto:info@harvinder-telecom.com' },
    { icon: MapPin, label: 'Address', value: 'Shop No. 15, Main Market, Sector 22, Chandigarh', href: 'https://maps.google.com/?q=Harvinder+Telecom+Chandigarh' }
  ];

  const businessHours = [
    { day: 'Mon - Sat', time: '10:00 AM - 9:00 PM' },
    { day: 'Sunday', time: '11:00 AM - 8:00 PM' }
  ];

  const quickLinks = [
    { name: 'Smartphones', href: '#products' },
    { name: 'Accessories', href: '#products' },
    { name: 'EMI Options', href: '#finance' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' }
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/harvindertelecom', color: 'hover:text-blue-600' },
    { icon: Instagram, href: 'https://instagram.com/harvindertelecom', color: 'hover:text-pink-500' },
    { icon: Twitter, href: 'https://twitter.com/harvindertelecom', color: 'hover:text-blue-400' },
    { icon: MessageCircle, href: 'https://wa.me/919876543210', color: 'hover:text-green-500' }
  ];

  const brands = ['Samsung', 'Apple', 'Xiaomi', 'OnePlus', 'Oppo', 'Vivo', 'Realme', 'Motorola'];

  return (
    <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Business Info */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: animationConfig.motionDuration,
              delay: 0.1,
              ease: animationConfig.motionEasing
            }}
            className="space-y-6"
          >
            <div>
              <motion.h3 
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold mb-4 text-yellow-400"
              >
                Harvinder Telecom
              </motion.h3>
              <p className="text-blue-100 leading-relaxed mb-4">
                Your trusted partner for all mobile and electronics needs. Quality products, best prices, and expert service since 2014.
              </p>
              
              {/* Business Hours */}
              <div className="bg-blue-800/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold text-yellow-400">Business Hours</span>
                </div>
                {businessHours.map((hour, index) => (
                  <div key={index} className="flex justify-between items-center text-sm mb-1">
                    <span className="text-blue-200">{hour.day}</span>
                    <span className="text-white font-medium">{hour.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: animationConfig.motionDuration,
              delay: 0.2,
              ease: animationConfig.motionEasing
            }}
            className="space-y-6"
          >
            <h4 className="text-xl font-bold text-yellow-400 mb-4">Get In Touch</h4>
            <div className="space-y-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.a
                    key={index}
                    href={info.href}
                    target={info.href.startsWith('http') ? '_blank' : undefined}
                    rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    className="flex items-start gap-3 text-blue-100 hover:text-white transition-colors duration-300 group"
                  >
                    <Icon className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200" />
                    <div>
                      <div className="text-sm text-blue-300">{info.label}</div>
                      <div className="font-medium">{info.value}</div>
                    </div>
                  </motion.a>
                );
              })}
            </div>

            {/* Social Media */}
            <div className="pt-4">
              <h5 className="font-semibold text-yellow-400 mb-3">Follow Us</h5>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className={`bg-blue-800/50 p-3 rounded-full text-blue-200 ${social.color} transition-all duration-300 hover:bg-blue-700/50`}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: animationConfig.motionDuration,
              delay: 0.3,
              ease: animationConfig.motionEasing
            }}
            className="space-y-6"
          >
            <h4 className="text-xl font-bold text-yellow-400 mb-4">Quick Links</h4>
            <div className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  className="block text-blue-200 hover:text-white transition-colors duration-300 font-medium"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 mt-6">
              <h5 className="font-semibold text-red-300 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Emergency Support
              </h5>
              <p className="text-sm text-red-200 mb-2">24/7 Customer Support</p>
              <a 
                href="tel:+919876543210"
                className="text-white font-bold hover:text-yellow-400 transition-colors duration-300"
              >
                +91 98765 43210
              </a>
            </div>
          </motion.div>

          {/* Our Brands */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: animationConfig.motionDuration,
              delay: 0.4,
              ease: animationConfig.motionEasing
            }}
            className="space-y-6"
          >
            <h4 className="text-xl font-bold text-yellow-400 mb-4">Authorized Brands</h4>
            <div className="grid grid-cols-2 gap-2">
              {brands.map((brand, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-blue-800/30 rounded-lg p-2 text-center text-sm font-medium text-blue-200 hover:text-white hover:bg-blue-700/50 transition-all duration-300 cursor-pointer"
                >
                  {brand}
                </motion.div>
              ))}
            </div>

            {/* Certifications */}
            <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4">
              <h5 className="font-semibold text-green-300 mb-2">Certifications</h5>
              <div className="space-y-1 text-sm text-green-200">
                <div>✓ Authorized Dealer</div>
                <div>✓ GST Registered</div>
                <div>✓ ISO Certified Service</div>
                <div>✓ 10+ Years Experience</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: animationConfig.motionDuration,
            delay: 0.5,
            ease: animationConfig.motionEasing
          }}
          className="border-t border-blue-700 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-blue-200 text-sm">
                © {currentYear} Harvinder Telecom. All rights reserved.
              </p>
              <p className="text-blue-300 text-xs mt-1">
                Design & Development by{' '}
                <span className="text-yellow-400 font-medium">Digital Solutions Team</span>
              </p>
            </div>

            <div className="flex items-center gap-2 text-blue-200 text-sm">
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Heart className="w-4 h-4 text-red-400 fill-red-400" />
              </motion.div>
              <span>for our customers</span>
            </div>

            <div className="text-center md:text-right">
              <p className="text-blue-200 text-sm">
                Visit us for genuine products & best service
              </p>
              <p className="text-yellow-400 text-sm font-semibold">
                #YourTrustedMobilePartner
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <motion.a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg z-50 hover:bg-green-600 transition-colors duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.a>
    </footer>
  );
};

export default Footer;