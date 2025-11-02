import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from '../components/ToastContainer';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';

const ReportIssue = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    issue_type: 'pothole',
    latitude: '28.6139',
    longitude: '77.2090'
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [classifying, setClassifying] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.warning('Please login to report an issue');
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('issue_type', formData.issue_type);
      submitData.append('latitude', parseFloat(formData.latitude).toString());
      submitData.append('longitude', parseFloat(formData.longitude).toString());
      
      if (image) {
        submitData.append('image', image);
      }

      const { API_ENDPOINTS } = await import('../utils/config');
      await axios.post(API_ENDPOINTS.ISSUES.CREATE, submitData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Issue reported successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error details:', error.response?.data);
      const errorMessage = error.response?.data?.detail || 'Please check all fields and try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          });
          toast.success('Location captured successfully!');
        },
        (error) => {
          toast.error('Unable to get your location. Please enable location services or enter coordinates manually.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        toast.error('Image size should be less than 5MB');
        return;
      }
      setImage(file);
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIClassification = async () => {
    if (!image) {
      toast.warning('Please upload an image first');
      return;
    }

    setClassifying(true);
    try {
      const { API_ENDPOINTS } = await import('../utils/config');
      const formData = new FormData();
      formData.append('image', image);

      const response = await axios.post(
        API_ENDPOINTS.AI.CLASSIFY,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const prediction = response.data;
      setFormData({
        ...formData,
        issue_type: prediction.predicted_type
      });
      
      toast.success(
        `AI detected: ${prediction.predicted_type} (${Math.round(prediction.confidence * 100)}% confidence)`
      );
    } catch (error) {
      console.error('AI classification error:', error);
      toast.error('AI classification failed. Please select type manually.');
    } finally {
      setClassifying(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-16 md:pt-20 flex items-center justify-center px-4">
        <GlassCard className="text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-theme mb-4">Please Login</h2>
          <p className="text-theme-secondary mb-6">You need to be logged in to report issues.</p>
          <Button variant="primary" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 md:pt-20 relative pb-12">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-pink-950/40"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-8 text-theme"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            📝 Report a Civic Issue
          </motion.h2>
          
          {error && (
            <motion.div
              className="mb-6 glass-card p-4 border-l-4 border-red-500"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <p className="text-red-400 font-semibold">Error: {error}</p>
            </motion.div>
          )}
          
          <GlassCard>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Issue Title *"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Brief description of the issue"
              />

              <Textarea
                label="Description *"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Detailed description of the issue..."
              />

              <Select
                label="Issue Type *"
                name="issue_type"
                value={formData.issue_type}
                onChange={handleChange}
              >
                <option value="pothole">🕳️ Pothole</option>
                <option value="garbage">🗑️ Garbage Accumulation</option>
                <option value="streetlight">💡 Streetlight Issue</option>
                <option value="other">🔧 Other</option>
              </Select>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold text-theme">
                  Upload Image (Optional)
                </label>
                <div className="flex flex-col sm:flex-row gap-3 mb-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  />
                  {image && (
                    <Button
                      type="button"
                      onClick={handleAIClassification}
                      disabled={classifying}
                      variant="secondary"
                    >
                      {classifying ? '🤖 Detecting...' : '🤖 Auto-Detect Type'}
                    </Button>
                  )}
                </div>
                {imagePreview && (
                  <motion.div
                    className="mt-4 rounded-xl overflow-hidden border border-white/20"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-h-64 object-cover"
                    />
                  </motion.div>
                )}
                <p className="mt-2 text-sm text-theme-secondary">
                  Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
                  {image && ' • Click "Auto-Detect Type" to use AI classification'}
                </p>
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold text-theme">
                  Location Coordinates
                </label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Input
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="Latitude"
                    className="mb-0"
                  />
                  <Input
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="Longitude"
                    className="mb-0"
                  />
                </div>
                <Button
                  type="button"
                  onClick={getCurrentLocation}
                  variant="success"
                  size="sm"
                >
                  📍 Use Current Location
                </Button>
                <p className="mt-2 text-sm text-theme-secondary">
                  Default: Delhi coordinates. Use current location or enter specific coordinates.
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                size="lg"
                className="w-full"
              >
                {loading ? '⏳ Reporting Issue...' : '📝 Submit Issue Report'}
              </Button>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportIssue;