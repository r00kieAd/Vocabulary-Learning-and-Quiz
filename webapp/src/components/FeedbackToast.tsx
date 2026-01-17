import React from 'react';

interface FeedbackToastProps {
  type: 'correct' | 'wrong';
  visible: boolean;
  score?: number;
}

export const FeedbackToast: React.FC<FeedbackToastProps> = ({
  type,
  visible,
  score,
}) => {
  if (!visible) return null;

  const icon = type === 'correct' ? 'Correct' : 'Wrong';
  const displayMessage = type === 'correct' ? `Correct ${score}` : 'Wrong, no points';

  return (
    <div className={`feedback-toast ${type}`}>
      <span className="icon">{icon}</span>
      <span className="message">{displayMessage}</span>
    </div>
  );
};

export default FeedbackToast;
