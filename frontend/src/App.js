import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ReportIssue from './pages/ReportIssue';
import MyIssues from './pages/MyIssues';
import AdminDashboard from './pages/AdminDashboard';
import { ToastContainer } from './components/ToastContainer';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
    <AuthProvider>
      <Router>
        <div className="App min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
                <Route 
                  path="/report" 
                  element={
                    <ProtectedRoute>
                      <ReportIssue />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/my-issues" 
                  element={
                    <ProtectedRoute>
                      <MyIssues />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
          </Routes>
              <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;