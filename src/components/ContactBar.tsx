import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, MapPin, Share2 } from 'lucide-react';

interface ContactBarProps {
  animationConfig: any;
}

const ContactBar: React.FC<ContactBarProps> = ({ animationConfig }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Harvinder Telecom - Digital Visiting Card',
          text: 'Check out Harvinder Telecom for all your mobile and electronics needs!',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const contactButtons = [
    {
      icon: Phone,
      label: 'Call',
      href: 'tel:+919876543210',
      color: 'bg-blue-600 hover:bg-blue-700',
      delay: 0.1
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      href: 'https://wa.me/919876543210',
      color: 'bg-green-600 hover:bg-green-700',
      delay: 0.2
    },
    {
      icon: MapPin,
      label: 'Directions',
      href: 'https://maps.google.com/?q=Harvinder+Telecom',
      color: 'bg-red-600 hover:bg-red-700',
      delay: 0.3
    },
    {
      icon: Share2,
      label: 'Share',
      onClick: handleShare,
      color: 'bg-purple-600 hover:bg-purple-700',
      delay: 0.4
    }
  ];

  return (
    <section className="py-6 bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-40 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
          {contactButtons.map((button, index) => {
            const Icon = button.icon;
            const Component = button.href ? motion.a : motion.button;
            
            return (
              <Component
                key={index}
                href={button.href}
                target={button.href?.startsWith('http') ? '_blank' : undefined}
                rel={button.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                onClick={button.onClick}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: animationConfig.motionDuration,
                  delay: button.delay,
                  ease: animationConfig.motionEasing
                }}
                whileHover={{
                  scale: animationConfig.hoverScale,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: animationConfig.tapScale }}
                className={`${button.color} text-white p-3 md:p-4 rounded-xl md:rounded-2xl text-center transition-all duration-300 shadow-lg hover:shadow-xl group w-full`}
              >
                <Icon className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-semibold text-xs md:text-base block">{button.label}</span>
              </Component>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContactBar;