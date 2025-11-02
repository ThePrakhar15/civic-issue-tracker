import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const Toggle = ({ checked, onChange, className = '' }) => {
  const { isDark, toggleTheme } = useTheme();
  const isChecked = checked !== undefined ? checked : isDark;

  const handleToggle = () => {
    if (onChange) {
      onChange();
    } else {
      toggleTheme();
    }
  };

  return (
    <motion.button
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${isChecked ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-gray-300'} ${className}`}
      onClick={handleToggle}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform`}
        animate={{ x: isChecked ? 28 : 4 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );
};

export default Toggle;
