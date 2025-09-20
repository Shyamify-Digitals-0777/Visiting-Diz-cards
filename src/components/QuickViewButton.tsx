import React from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

interface QuickViewButtonProps {
  productId: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button' | 'floating';
  label?: string;
  disabled?: boolean;
}

const QuickViewButton: React.FC<QuickViewButtonProps> = ({
  productId,
  className = '',
  size = 'md',
  variant = 'icon',
  label = 'Quick View',
  disabled = false
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-3'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const baseClasses = `
    quick-view-btn
    inline-flex items-center justify-center
    rounded-full
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${disabled ? 'pointer-events-none' : 'cursor-pointer'}
  `;

  const variantClasses = {
    icon: `
      bg-white/90 hover:bg-white
      text-gray-700 hover:text-blue-600
      shadow-lg hover:shadow-xl
      backdrop-blur-sm
      border border-white/20
    `,
    button: `
      bg-blue-600 hover:bg-blue-700
      text-white
      shadow-lg hover:shadow-xl
      px-4 py-2 rounded-lg
      font-medium
    `,
    floating: `
      bg-blue-600 hover:bg-blue-700
      text-white
      shadow-lg hover:shadow-xl
      fixed bottom-4 right-4 z-40
      ${sizeClasses.lg}
    `
  };

  if (variant === 'button') {
    return (
      <motion.button
        className={`${baseClasses} ${variantClasses.button} ${className}`}
        data-product-id={productId}
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        aria-label={`${label} for product ${productId}`}
        role="button"
        tabIndex={0}
      >
        <Eye className={iconSizes[size]} />
        <span className="ml-2">{label}</span>
      </motion.button>
    );
  }

  if (variant === 'floating') {
    return (
      <motion.button
        className={`${baseClasses} ${variantClasses.floating} ${className}`}
        data-product-id={productId}
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.1 }}
        whileTap={{ scale: disabled ? 1 : 0.9 }}
        aria-label={`${label} for product ${productId}`}
        role="button"
        tabIndex={0}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <Eye className={iconSizes[size]} />
      </motion.button>
    );
  }

  // Default icon variant
  return (
    <motion.button
      className={`${baseClasses} ${variantClasses.icon} ${sizeClasses[size]} ${className}`}
      data-product-id={productId}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      aria-label={`${label} for product ${productId}`}
      role="button"
      tabIndex={0}
    >
      <Eye className={iconSizes[size]} />
    </motion.button>
  );
};

export default QuickViewButton;