import React from 'react';

interface ProgressHeaderProps {
  current: number;
  total: number;
  hearts: number;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  current,
  total,
  hearts,
}) => {
  return (
    <div className="progress-header">
      <div className="question-counter">
        Question {current} of {total}
      </div>
      <div className="hearts">
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={i} className={`heart ${i < hearts ? '' : 'empty'}`}>
            ❤️
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProgressHeader;
