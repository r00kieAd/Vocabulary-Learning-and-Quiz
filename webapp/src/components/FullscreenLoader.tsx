import React, { useEffect, useState } from 'react';
import power from '../assets/power.png';

export const FullscreenLoader: React.FC = () => {

  const [loadingText, setLoadingText] = useState<string>("Please wait, connecting to server.");
  const [textChanged, setTextChanged] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      if (textChanged) {
        setLoadingText("Please wait, connecting to server.");
        setTextChanged(true);
      } else {
        setLoadingText("Waking up server, this may take upto 90s.");
        setTextChanged(false);
      }
    }, 5000);
  }, [])

  return (
    <div className="fullscreen-loader">
      <div className="loading-div">
        <div className="loading-img"><img src={power} alt="" /></div>
        <div className="text">{loadingText}<span className="ellipses"></span></div>
      </div>
    </div>
  );
};

export default FullscreenLoader;
