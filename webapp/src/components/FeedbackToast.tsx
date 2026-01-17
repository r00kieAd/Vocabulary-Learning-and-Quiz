import React from 'react';

interface FeedbackToastProps {
  message: string;
  type: 'correct' | 'wrong';
  visible: boolean;
}

export const FeedbackToast: React.FC<FeedbackToastProps> = ({
  message,
  type,
  visible,
}) => {
  if (!visible) return null;

  const icon = type === 'correct' ? 'Correct' : 'Wrong';

  return (
    <div className={`feedback-toast ${type}`}>
      <span className="icon">{icon}</span>
      <span className="message">{message}</span>
    </div>
  );
};

export default FeedbackToast;
