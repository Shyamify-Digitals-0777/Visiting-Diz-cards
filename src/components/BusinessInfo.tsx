import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Award } from 'lucide-react';

interface BusinessInfoProps {
  animationConfig: any;
}

const BusinessInfo: React.FC<BusinessInfoProps> = ({ animationConfig }) => {
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
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="absolute inset-0 bg-blue-900/20 flex items-center justify-center cursor-pointer"
                  onClick={() => window.open('https://maps.google.com/?q=Harvinder+Telecom+Chandigarh', '_blank')}
                >
                  <div className="bg-white rounded-full p-3 shadow-lg">
                    <MapPin className="w-6 h-6 text-red-500" />
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
      </div>
    </section>
  );
};

export default BusinessInfo;