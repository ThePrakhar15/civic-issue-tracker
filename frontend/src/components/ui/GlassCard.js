import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hover = true, ...props }) => {
  return (
    <motion.div
      className={`glass-card rounded-2xl p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] // Optimized easing
      }}
      whileHover={hover ? { 
        y: -4, 
        transition: { 
          duration: 0.15,
          ease: "easeOut"
        } 
      } : {}}
      style={{
        willChange: hover ? 'transform' : 'auto',
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
