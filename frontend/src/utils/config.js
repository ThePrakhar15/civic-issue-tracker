// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Export API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    VERIFY: `${API_BASE_URL}/auth/verify`
  },
  ISSUES: {
    LIST: `${API_BASE_URL}/issues`,
    CREATE: `${API_BASE_URL}/issues`,
    MY_ISSUES: `${API_BASE_URL}/users/me/issues`,
    UPDATE_STATUS: (id) => `${API_BASE_URL}/issues/${id}/status`,
    RESOLVE: (id) => `${API_BASE_URL}/issues/${id}/resolve`,
    DELETE: (id) => `${API_BASE_URL}/issues/${id}`
  },
  AI: {
    CLASSIFY: `${API_BASE_URL}/ai/classify`
  }
};

