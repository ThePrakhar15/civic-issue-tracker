import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../utils/config';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(API_ENDPOINTS.AUTH.VERIFY, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUser(response.data.user);
      })
      .catch(() => {
        localStorage.removeItem('token');
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, formData);
    const { access_token, user } = response.data;
    
    localStorage.setItem('token', access_token);
    setUser(user);
    
    return user;
  };

  const signup = async (name, email, password, role = 'citizen') => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);

    const response = await axios.post(API_ENDPOINTS.AUTH.SIGNUP, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};