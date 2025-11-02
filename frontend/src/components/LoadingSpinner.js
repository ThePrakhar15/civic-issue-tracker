import React from 'react';

const LoadingSpinner = ({ size = 40, message = 'Loading...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      gap: '1rem'
    }}>
      <div style={{
        width: size,
        height: size,
        border: `4px solid #f3f3f3`,
        borderTop: `4px solid #3b82f6`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      {message && <p style={{ color: '#6b7280', margin: 0 }}>{message}</p>}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;

