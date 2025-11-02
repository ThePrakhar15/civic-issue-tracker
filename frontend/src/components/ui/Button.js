import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 focus:ring-indigo-500 shadow-lg hover:shadow-xl',
    secondary: 'glass-dark text-white hover:bg-opacity-80 focus:ring-purple-500',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 focus:ring-emerald-500 shadow-lg hover:shadow-xl',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 focus:ring-red-500 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-white/30 text-white hover:bg-white/10 focus:ring-purple-500',
    ghost: 'text-white hover:bg-white/10 focus:ring-purple-500',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={!disabled ? { 
        scale: 1.02,
        transition: { duration: 0.15, ease: "easeOut" }
      } : {}}
      whileTap={!disabled ? { 
        scale: 0.98,
        transition: { duration: 0.1 }
      } : {}}
      style={{
        willChange: !disabled ? 'transform' : 'auto',
        transform: 'translateZ(0)', // GPU acceleration
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
