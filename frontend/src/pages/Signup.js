import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from '../components/ToastContainer';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'citizen'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (formData.name.length < 2) {
      setError('Name must be at least 2 characters long');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await signup(formData.name, formData.email, formData.password, formData.role);
      toast.success('Account created successfully! Please login.');
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to create account. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 md:pt-20 flex items-center justify-center px-4 py-8 relative">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-pink-950/40"></div>
      
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-8 text-theme"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          🎯 Create Account
        </motion.h2>
        
        {error && (
          <motion.div
            className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <strong>Error:</strong> {error}
          </motion.div>
        )}
        
        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name *"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />

            <Input
              label="Email Address *"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@example.com"
            />

            <Input
              label="Password *"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Minimum 6 characters"
            />

            <Input
              label="Confirm Password *"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter your password"
            />

            <Select
              label="Account Type *"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="citizen">👤 Citizen (Report Issues)</option>
              <option value="admin">👨‍💼 Admin (Manage Issues)</option>
            </Select>
            <p className="text-sm text-theme-secondary -mt-3">
              Select your role. Citizens can report issues, Admins can manage them.
            </p>

            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              size="lg"
              className="w-full mt-6"
            >
              {loading ? '⏳ Creating Account...' : '✅ Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-theme-secondary text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
                Login here
              </Link>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Signup;