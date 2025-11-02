import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import IssueMap from '../components/Map';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from '../components/ToastContainer';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    in_progress: 0,
    resolved: 0,
    rejected: 0
  });
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }
    if (user?.role === 'admin') {
      fetchIssues();
    }
  }, [user, filterStatus, filterType]);

  const fetchIssues = async () => {
    try {
      const { API_ENDPOINTS } = await import('../utils/config');
      let url = API_ENDPOINTS.ISSUES.LIST;
      const params = new URLSearchParams();
      
      params.append('admin_only', 'true');
      
      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }
      if (filterType !== 'all') {
        params.append('issue_type', filterType);
      }
      
      if (params.toString()) {
        url += '?' + params.toString();
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const issuesData = response.data;
      setIssues(issuesData);
      
      setStats({
        total: issuesData.length,
        open: issuesData.filter(i => i.status === 'open').length,
        in_progress: issuesData.filter(i => i.status === 'in_progress').length,
        resolved: issuesData.filter(i => i.status === 'resolved').length,
        rejected: issuesData.filter(i => i.status === 'rejected').length
      });
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (issueId, newStatus) => {
    const statusLabels = {
      'open': 'Open',
      'in_progress': 'In Progress',
      'resolved': 'Resolved',
      'rejected': 'Rejected'
    };

    if (!window.confirm(`Change issue status to "${statusLabels[newStatus]}"?`)) {
      return;
    }

    try {
      const { API_ENDPOINTS } = await import('../utils/config');
      const formData = new FormData();
      formData.append('status', newStatus);
      
      await axios.patch(
        API_ENDPOINTS.ISSUES.UPDATE_STATUS(issueId),
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      toast.success(`Issue status updated to ${statusLabels[newStatus]}`);
      fetchIssues();
    } catch (error) {
      toast.error('Failed to update status: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  const handleDelete = async (issueId) => {
    if (!window.confirm('Are you sure you want to delete this issue? This action cannot be undone.')) {
      return;
    }

    try {
      const { API_ENDPOINTS } = await import('../utils/config');
      await axios.delete(API_ENDPOINTS.ISSUES.DELETE(issueId), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Issue deleted successfully!');
      fetchIssues();
    } catch (error) {
      toast.error('Failed to delete issue: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen pt-16 md:pt-20 flex items-center justify-center px-4">
        <GlassCard className="text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-theme mb-4">Access Denied</h2>
          <p className="text-theme-secondary mb-6">You need administrator privileges to access this page.</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </GlassCard>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen pt-16 md:pt-20 relative pb-12">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-pink-950/40"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-theme"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          📊 Admin Dashboard
        </motion.h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
          {[
            { label: 'Total Issues', value: stats.total, gradient: 'from-indigo-500 to-purple-600', icon: '📋' },
            { label: 'Open Issues', value: stats.open, gradient: 'from-pink-500 to-rose-600', icon: '🔄' },
            { label: 'In Progress', value: stats.in_progress, gradient: 'from-blue-500 to-cyan-600', icon: '⏳' },
            { label: 'Resolved', value: stats.resolved, gradient: 'from-emerald-500 to-teal-600', icon: '✅' },
            { label: 'Rejected', value: stats.rejected, gradient: 'from-red-500 to-rose-600', icon: '❌' }
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <GlassCard className={`bg-gradient-to-r ${stat.gradient} text-white text-center hover:scale-105 transition-transform`}>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm md:text-base opacity-90">{stat.icon} {stat.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <GlassCard className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center flex-wrap">
            <label className="font-semibold text-theme">Filters:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-theme focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{ color: 'var(--text-primary)' }}
            >
              <option value="all" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>All Status</option>
              <option value="open" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>Open</option>
              <option value="in_progress" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>In Progress</option>
              <option value="resolved" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>Resolved</option>
              <option value="rejected" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>Rejected</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-theme focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{ color: 'var(--text-primary)' }}
            >
              <option value="all" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>All Types</option>
              <option value="pothole" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>Pothole</option>
              <option value="garbage" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>Garbage</option>
              <option value="streetlight" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>Streetlight</option>
              <option value="other" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>Other</option>
            </select>
            <Button variant="secondary" onClick={fetchIssues}>
              🔄 Refresh
            </Button>
          </div>
        </GlassCard>

        {/* Issues List */}
        <GlassCard className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-theme">
            📋 Citizen Reported Issues Only
          </h2>
          <p className="text-theme-secondary mb-6 text-sm md:text-base">
            Showing only issues reported by citizens. You can update status or delete issues.
          </p>
          {issues.length === 0 ? (
            <div className="text-center py-12 text-theme-secondary">
              <p>No issues found with the selected filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {issues.map((issue, idx) => (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <GlassCard className="border-l-4 border-purple-500">
                      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-theme mb-2">{issue.title}</h3>
                          <p className="text-theme-secondary mb-3">{issue.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-theme-secondary mb-4">
                            <span><strong>Type:</strong> {issue.issue_type}</span>
                            <span><strong>Priority:</strong> {issue.priority}</span>
                            <span><strong>Status:</strong> {issue.status}</span>
                            <span><strong>Reported by:</strong> {issue.user?.name || 'Unknown'}</span>
                            <span><strong>Date:</strong> {new Date(issue.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${
                          issue.status === 'resolved' ? 'bg-gradient-to-r from-emerald-500 to-teal-600' :
                          issue.status === 'in_progress' ? 'bg-gradient-to-r from-blue-500 to-cyan-600' :
                          issue.status === 'rejected' ? 'bg-gradient-to-r from-red-500 to-rose-600' :
                          'bg-gradient-to-r from-yellow-500 to-orange-600'
                        }`}>
                          {issue.status === 'in_progress' ? 'In Progress' : issue.status}
                        </span>
                      </div>

                      {issue.image && (
                        <div className="mb-4 rounded-xl overflow-hidden border border-white/20">
                          <img
                            src={`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${issue.image}`}
                            alt={issue.title}
                            className="w-full max-h-64 object-cover"
                          />
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <label className="font-semibold text-theme text-sm">Update Status:</label>
                        <select
                          value={issue.status}
                          onChange={(e) => handleStatusUpdate(issue.id, e.target.value)}
                          className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-theme focus:outline-none focus:ring-2 focus:ring-purple-500 flex-1 sm:flex-initial min-w-[150px]"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          <option value="open" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>🔄 Open / Pending</option>
                          <option value="in_progress" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>⏳ In Progress</option>
                          <option value="resolved" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>✅ Resolved</option>
                          <option value="rejected" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>❌ Rejected</option>
                        </select>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(issue.id)}
                        >
                          🗑️ Delete
                        </Button>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </GlassCard>

        {/* Map View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard>
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-theme">Issues Map</h2>
            <div className="rounded-xl overflow-hidden">
              <IssueMap />
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;