import React from 'react';

export const FullscreenLoader: React.FC = () => {
  return (
    <div className="fullscreen-loader">
      <div className="spinner"></div>
      <div className="text">Loading...</div>
    </div>
  );
};

export default FullscreenLoader;
