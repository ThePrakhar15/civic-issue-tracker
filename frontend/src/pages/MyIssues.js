import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';

const getStatusColor = (status) => {
  switch (status) {
    case 'resolved':
      return { bg: 'from-emerald-500 to-teal-600', color: 'text-white', icon: '✅' };
    case 'in_progress':
      return { bg: 'from-blue-500 to-cyan-600', color: 'text-white', icon: '⏳' };
    case 'rejected':
      return { bg: 'from-red-500 to-rose-600', color: 'text-white', icon: '❌' };
    case 'open':
    default:
      return { bg: 'from-yellow-500 to-orange-600', color: 'text-white', icon: '🔄' };
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'in_progress':
      return 'In Progress';
    case 'open':
      return 'Pending';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

const MyIssues = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (user) {
      fetchMyIssues();
    }
  }, [user]);

  const fetchMyIssues = async () => {
    try {
      const { API_ENDPOINTS } = await import('../utils/config');
      const response = await axios.get(API_ENDPOINTS.ISSUES.MY_ISSUES, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setIssues(response.data);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-16 md:pt-20 flex items-center justify-center px-4">
        <GlassCard className="text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-theme mb-4">Please Login</h2>
          <p className="text-theme-secondary mb-6">You need to be logged in to view your issues.</p>
          <Link to="/login">
            <Button variant="primary">Go to Login</Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner message="Loading your issues..." />;
  }

  const statusCounts = {
    total: issues.length,
    resolved: issues.filter(i => i.status === 'resolved').length,
    in_progress: issues.filter(i => i.status === 'in_progress').length,
    pending: issues.filter(i => i.status === 'open').length,
    rejected: issues.filter(i => i.status === 'rejected').length
  };

  const filteredIssues = filterStatus === 'all' 
    ? issues 
    : issues.filter(issue => issue.status === filterStatus);

  return (
    <div className="min-h-screen pt-16 md:pt-20 relative pb-12">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-pink-950/40"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-theme">My Reported Issues</h2>
            <Link to="/report">
              <Button variant="primary">
                + Report New Issue
              </Button>
            </Link>
          </motion.div>

          {/* Status Summary */}
          {issues.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <GlassCard className="bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 border-purple-500/30">
                <h3 className="text-xl md:text-2xl font-bold text-center mb-6 text-theme">
                  📊 Your Issue Analytics
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {[
                    { label: 'Total', value: statusCounts.total, icon: '📋' },
                    { label: 'Pending', value: statusCounts.pending, icon: '🔄', color: 'text-yellow-400' },
                    { label: 'In Progress', value: statusCounts.in_progress, icon: '⏳', color: 'text-blue-400' },
                    { label: 'Resolved', value: statusCounts.resolved, icon: '✅', color: 'text-emerald-400' },
                    { label: 'Rejected', value: statusCounts.rejected, icon: '❌', color: 'text-red-400' }
                  ].map((stat, idx) => (
                    <motion.div
                      key={stat.label}
                      className="text-center glass-card p-4 rounded-xl"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div className={`text-3xl font-bold mb-2 ${stat.color || 'text-theme'}`}>
                        {stat.value}
                      </div>
                      <div className="text-theme-secondary text-sm">{stat.icon} {stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Filter */}
          {issues.length > 0 && (
            <div className="mb-6">
              <GlassCard className="p-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-theme focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <option value="all" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>All Status</option>
                  <option value="open" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>Open</option>
                  <option value="in_progress" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>In Progress</option>
                  <option value="resolved" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>Resolved</option>
                  <option value="rejected" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>Rejected</option>
                </select>
              </GlassCard>
            </div>
          )}

          {issues.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <GlassCard className="text-center py-12">
                <h3 className="text-2xl font-bold text-theme mb-4">No Issues Reported Yet</h3>
                <p className="text-theme-secondary mb-8">
                  Start making a difference in your community by reporting your first issue!
                </p>
                <Link to="/report">
                  <Button variant="primary" size="lg">
                    Report Your First Issue
                  </Button>
                </Link>
              </GlassCard>
            </motion.div>
          ) : (
            <AnimatePresence>
              <div className="space-y-4">
                {filteredIssues.map((issue, idx) => (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <GlassCard className="hover:scale-[1.02] transition-transform">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                        <h3 className="text-xl font-bold text-white">{issue.title}</h3>
                        <span className={`px-4 py-2 rounded-full bg-gradient-to-r ${getStatusColor(issue.status).bg} ${getStatusColor(issue.status).color} text-sm font-bold flex items-center gap-2`}>
                          <span>{getStatusColor(issue.status).icon}</span>
                          <span>{getStatusLabel(issue.status)}</span>
                        </span>
                      </div>
                      
                      <p className="text-white/80 mb-4">{issue.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-white/60 mb-4">
                        <span><strong>Type:</strong> {issue.issue_type}</span>
                        <span><strong>Priority:</strong> {issue.priority}</span>
                        <span><strong>Date:</strong> {new Date(issue.created_at).toLocaleDateString()}</span>
                      </div>

                      {issue.image && (
                        <div className="mt-4 rounded-xl overflow-hidden border border-white/20">
                          <img
                            src={`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${issue.image}`}
                            alt={issue.title}
                            className="w-full max-h-64 object-cover"
                          />
                        </div>
                      )}
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyIssues;