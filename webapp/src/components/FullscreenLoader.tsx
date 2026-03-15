import React, { useEffect, useState } from 'react';
import power from '../assets/power.png';
import { useGlobal } from '../context/globalContext';

export const FullscreenLoader: React.FC = () => {

  const [loadingText, setLoadingText] = useState<string>("Please wait, connecting to server.");
  const [textChanged, setTextChanged] = useState<boolean>(false);

    const [color1, setColor1] = useState<string>('');
    const [color2, setColor2] = useState<string>('');
    const [color3, setColor3] = useState<string>('');
    const { activeTheme } = useGlobal();
    useEffect(() => {
      const styles = getComputedStyle(document.documentElement);
      setColor1(styles.getPropertyValue('--accent-primary'));
      setColor2(styles.getPropertyValue('--accent-secondary'));
      setColor3(styles.getPropertyValue('--accent-dark-blue'));
    }, [activeTheme])

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
