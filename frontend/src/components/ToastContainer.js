import React, { useState, useEffect } from 'react';

let toastId = 0;
let listeners = [];

export const toast = {
  success: (message) => addToast(message, 'success'),
  error: (message) => addToast(message, 'error'),
  info: (message) => addToast(message, 'info'),
  warning: (message) => addToast(message, 'warning')
};

const addToast = (message, type = 'info') => {
  const id = ++toastId;
  const toast = { id, message, type };
  listeners.forEach(listener => listener(toast));
  return id;
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const listener = (toast) => {
      setToasts(prev => [...prev, toast]);
      // Auto remove after 5 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 5000);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getToastStyle = (type) => {
    const baseStyle = {
      padding: '1rem 1.5rem',
      borderRadius: '8px',
      marginBottom: '0.75rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minWidth: '300px',
      maxWidth: '500px',
      animation: 'slideIn 0.3s ease-out',
      cursor: 'pointer'
    };

    const typeStyles = {
      success: {
        background: '#10b981',
        color: 'white',
        borderLeft: '4px solid #059669'
      },
      error: {
        background: '#ef4444',
        color: 'white',
        borderLeft: '4px solid #dc2626'
      },
      info: {
        background: '#3b82f6',
        color: 'white',
        borderLeft: '4px solid #2563eb'
      },
      warning: {
        background: '#f59e0b',
        color: 'white',
        borderLeft: '4px solid #d97706'
      }
    };

    return { ...baseStyle, ...typeStyles[type] };
  };

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      pointerEvents: 'none'
    }}>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      {toasts.map(toast => (
        <div
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          style={{
            ...getToastStyle(toast.type),
            pointerEvents: 'auto'
          }}
        >
          <div style={{ flex: 1 }}>
            <strong>{toast.message}</strong>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeToast(toast.id);
            }}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              marginLeft: '1rem',
              fontSize: '1.2rem',
              lineHeight: '1'
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

