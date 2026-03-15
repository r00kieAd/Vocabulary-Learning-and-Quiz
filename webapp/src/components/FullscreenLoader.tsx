import React, { useEffect, useMemo, useState } from 'react';
import power from '../assets/server.svg';
import { useGlobal } from '../context/globalContext';

export const FullscreenLoader: React.FC = () => {

  const [loadingText, setLoadingText] = useState<string>("Please wait, connecting to server.");
  const [textChanged, setTextChanged] = useState<boolean>(false);

  const [gradientStart, setGradientStart] = useState<string>('');
  const [gradientEnd, setGradientEnd] = useState<string>('');
  const { activeTheme } = useGlobal();
  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    setGradientStart(styles.getPropertyValue('--bg-gradient-start'));
    setGradientEnd(styles.getPropertyValue('--bg-gradient-end'));
  }, [activeTheme]);
  useEffect(() => {
    const interval = setInterval(() => {
      setTextChanged((prev) => {
        const next = !prev;
        setLoadingText(
          next
            ? 'Please wait, connecting to server.'
            : 'Waking up server, this may take upto 90s.'
        );
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const gradientStyle = useMemo(() => {
    const start = gradientStart.trim();
    const end = gradientEnd.trim();

    if (start && end) {
      return {
        background: `linear-gradient(135deg, ${start} 0%, ${end} 100%)`,
      };
    }

    return undefined;
  }, [gradientStart, gradientEnd]);

  return (
    <div className="fullscreen-loader" style={gradientStyle}>
      <div className="loading-div">
        <div className="loading-img"><img src={power} alt="" /></div>
        <div className="text">{loadingText}<span className="ellipses"></span></div>
      </div>
    </div>
  );
};

export default FullscreenLoader;
