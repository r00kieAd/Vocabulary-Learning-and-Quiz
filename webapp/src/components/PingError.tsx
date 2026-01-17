import React from 'react';

interface PingErrorProps {
  error: string;
  onRetry: () => void;
}

export const PingError: React.FC<PingErrorProps> = ({ error, onRetry }) => {
  return (
    <div className="error-panel">
      <div className="error-icon">⚠️</div>
      <h2>Connection Error</h2>
      <p>{error}</p>
      <button className="btn-primary" onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
};

export default PingError;
