import React from 'react';
import power from '../assets/power.png';

export const FullscreenLoader: React.FC = () => {
  return (
    <div className="fullscreen-loader">
      <div className="spinner"></div>
      <div className="loading-div">
        <div className="text">Please wait, connecting to server...</div>
        <div className="loading-img"><img src={power} alt="" /></div>
      </div>
    </div>
  );
};

export default FullscreenLoader;
