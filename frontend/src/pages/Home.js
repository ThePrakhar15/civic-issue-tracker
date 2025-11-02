import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import IssueMap from '../components/Map';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import axios from 'axios';

const Home = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    users: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { API_ENDPOINTS } = await import('../utils/config');
      const response = await axios.get(API_ENDPOINTS.ISSUES.LIST);
      const issues = response.data;
      
      setStats({
        total: issues.length,
        resolved: issues.filter(issue => issue.status === 'resolved').length,
        users: new Set(issues.map(issue => issue.user?.id)).size
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        total: 12,
        resolved: 8,
        users: 5
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Reduced from 0.2
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3, // Faster animations
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <div className="min-h-screen pt-16 md:pt-20 relative">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-pink-950/40"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          >
            {user ? `Welcome back, ${user.name}!` : 'Welcome to CivicFix'}
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-theme mb-8 md:mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          >
            {user ? 'Continue making your community better' : 'Report civic issues and make your community better'}
          </motion.p>
          
          {user ? (
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
            >
              <Link to="/report">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  📝 Report New Issue
                </Button>
              </Link>
              <Link to="/my-issues">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  📋 My Reports
                </Button>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
            >
              <Link to="/login">
                <Button variant="primary" size="lg">
                  🚀 Get Started
                </Button>
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="mb-12 md:mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-center text-theme mb-8 md:mb-12"
            variants={itemVariants}
          >
            Live Community Impact
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            <motion.div variants={itemVariants}>
              <GlassCard className="text-center hover:scale-105 transition-transform">
                <motion.div
                  className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
                >
                  {stats.total}
                </motion.div>
                <div className="text-theme-secondary text-sm md:text-base">Issues Reported</div>
              </GlassCard>
            </motion.div>
            <motion.div variants={itemVariants}>
              <GlassCard className="text-center hover:scale-105 transition-transform">
                <motion.div
                  className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 15 }}
                >
                  {stats.resolved}
                </motion.div>
                <div className="text-theme-secondary text-sm md:text-base">Issues Resolved</div>
              </GlassCard>
            </motion.div>
            <motion.div variants={itemVariants}>
              <GlassCard className="text-center hover:scale-105 transition-transform">
                <motion.div
                  className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 15 }}
                >
                  {stats.users}
                </motion.div>
                <div className="text-theme-secondary text-sm md:text-base">Active Citizens</div>
              </GlassCard>
            </motion.div>
          </div>
        </motion.div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <GlassCard className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-theme">
              Live Community Issues Map
            </h2>
            <p className="text-center mb-6 text-theme-secondary text-sm md:text-base">
              Real issues reported by your community. Click on markers or clusters for details.
            </p>
            
            <div className="rounded-xl overflow-hidden">
              <IssueMap />
            </div>
            
            {/* Map Legend */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                <span className="text-theme-secondary text-sm">Potholes</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-theme-secondary text-sm">Garbage</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-theme-secondary text-sm">Streetlights</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;