import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from '../components/ToastContainer';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      const errorMsg = 'Invalid email or password';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (type) => {
    const demoEmail = type === 'admin' ? 'admin@civicfix.com' : 'demo@citizen.com';
  const demoPassword =
  type === 'admin'
    ? 'admin123'
    : 'citizen123';   

    
    setEmail(demoEmail);
    setPassword(demoPassword);
    
    setLoading(true);
    setError('');

    try {
      await login(demoEmail, demoPassword);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      const errorMsg = 'Invalid email or password';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 md:pt-20 flex items-center justify-center px-4 relative">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-pink-950/40"></div>
      
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard>
          <motion.h2
            className="text-3xl font-bold text-center mb-6 text-theme"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Login
          </motion.h2>
          
          {error && (
            <motion.div
              className="mb-4 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {error}
            </motion.div>
          )}

          {/* Demo Login Buttons */}
          <div className="mb-6">
            <p className="text-center mb-3 text-theme-secondary text-sm">Quick Demo:</p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                variant="primary"
                size="sm"
                disabled={loading}
              >
                👨‍💼 Admin
              </Button>
              <Button
                type="button"
                onClick={() => handleDemoLogin('citizen')}
                variant="success"
                size="sm"
                disabled={loading}
              >
                👤 Citizen
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your.email@example.com"
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
            
            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              size="lg"
              className="w-full"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-theme-secondary text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-semibold">
                Sign up here
              </Link>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Login;