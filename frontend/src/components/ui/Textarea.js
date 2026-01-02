import React from 'react';

const Textarea = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block mb-2 text-sm font-semibold text-theme">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-theme placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-y ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        style={{ color: 'var(--text-primary)' }}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Textarea;
