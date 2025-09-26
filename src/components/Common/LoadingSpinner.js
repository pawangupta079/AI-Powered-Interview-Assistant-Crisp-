import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  message = '', 
  fullScreen = false 
}) => {
  const sizeClass = `spinner-${size}`;
  const colorClass = `spinner-${color}`;
  const containerClass = fullScreen ? 'spinner-fullscreen' : 'spinner-container';

  return (
    <div className={containerClass}>
      <div className={`loading-spinner ${sizeClass} ${colorClass}`}>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
      </div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
