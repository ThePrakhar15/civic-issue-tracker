import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import Button from './ui/Button';
import Toggle from './ui/Toggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'glass-dark shadow-lg'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        willChange: 'transform, backdrop-filter',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.15 }
              }}
              style={{
                willChange: 'transform',
                transform: 'translateZ(0)',
              }}
            >
              🚀 CivicFix
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/report">
                  <Button variant="outline" size="sm" className={isActive('/report') ? 'bg-white/20' : ''}>
                    Report Issue
                  </Button>
                </Link>
                <Link to="/my-issues">
                  <Button variant="ghost" size="sm" className={isActive('/my-issues') ? 'bg-white/20' : ''}>
                    My Issues
                  </Button>
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin">
                    <Button variant="secondary" size="sm" className={isActive('/admin') ? 'bg-white/20' : ''}>
                      Admin
                    </Button>
                  </Link>
                )}
                <div className="flex items-center space-x-2 px-4 py-2 rounded-lg glass-dark">
                  <span className="text-sm text-white">Hello, {user.name}</span>
                </div>
                <Button variant="danger" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/report">
                  <Button variant="outline" size="sm">
                    Report Issue
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden glass-dark border-t border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-4 space-y-3">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-semibold">Theme</span>
                <Toggle />
              </div>
              
              {user ? (
                <>
                  <Link to="/report" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      Report Issue
                    </Button>
                  </Link>
                  <Link to="/my-issues" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">
                      My Issues
                    </Button>
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="secondary" size="sm" className="w-full">
                        Admin
                      </Button>
                    </Link>
                  )}
                  <div className="px-4 py-2 text-white text-sm">
                    Hello, {user.name}
                  </div>
                  <Button variant="danger" size="sm" className="w-full" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/report" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      Report Issue
                    </Button>
                  </Link>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;