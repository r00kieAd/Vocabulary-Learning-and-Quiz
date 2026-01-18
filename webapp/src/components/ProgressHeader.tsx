import React from 'react';

interface ProgressHeaderProps {
  current: number;
  total: number;
  hearts: number;
  quizMode?: 'flashcard' | 'random';
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  current,
  total,
  hearts,
  quizMode = 'random',
}) => {
  return (
    <div className="progress-header">
      <div className="question-counter">
        {quizMode === 'flashcard' && <span className="mode-badge">📚 Learned Words</span>}
        Question {current} of {total}
      </div>
      {hearts > 0 && (
        <div className="hearts">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={`heart ${i < hearts ? '' : 'empty'}`}>
              {i < hearts ? 'Heart' : 'Empty'}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressHeader;
