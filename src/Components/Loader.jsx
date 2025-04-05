import React from 'react';
import '../Style/loader.css';

const Loader = ({ size = 'medium', text = 'Loading events...' }) => {
  // Map size to actual pixel values
  const sizeMap = {
    small: { container: 40, text: '14px' },
    medium: { container: 60, text: '16px' },
    large: { container: 80, text: '18px' }
  };

  const dimensions = sizeMap[size] || sizeMap.medium;

  return (
    <div className="loader-container">
      <div 
        className="ticket-loader"
        style={{ 
          width: dimensions.container,
          height: dimensions.container * 0.75
        }}
      >
        <div className="ticket-inner">
          <div className="ticket-stars">
            <div className="star star1"></div>
            <div className="star star2"></div>
            <div className="star star3"></div>
          </div>
        </div>
        <div className="ticket-shine"></div>
      </div>
      {text && (
        <div className="loader-text" style={{ fontSize: dimensions.text }}>
          {text}
        </div>
      )}
    </div>
  );
};

export default Loader;