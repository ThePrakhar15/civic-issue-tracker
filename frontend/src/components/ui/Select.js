import React from 'react';

const Select = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block mb-2 text-sm font-semibold text-theme">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-theme focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        style={{
          color: 'var(--text-primary)'
        }}
        {...props}
      >
        {React.Children.map(props.children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              style: {
                backgroundColor: 'var(--card-bg)',
                color: 'var(--text-primary)',
                padding: '8px 12px'
              }
            });
          }
          return child;
        })}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Select;
