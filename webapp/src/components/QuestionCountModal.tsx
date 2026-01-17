import React, { useState } from 'react';

interface QuestionCountModalProps {
  isOpen: boolean;
  maxQuestions: number;
  mode: 'flashcard' | 'mcq';
  onConfirm: (count: number) => void;
  onCancel: () => void;
}

export const QuestionCountModal: React.FC<QuestionCountModalProps> = ({
  isOpen,
  maxQuestions,
  mode,
  onConfirm,
  onCancel,
}) => {
  const [count, setCount] = useState(Math.min(10, maxQuestions).toString());
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const num = parseInt(count, 10);
    if (isNaN(num) || num < 1) {
      setError('Please enter a valid number');
      return;
    }
    if (num > maxQuestions) {
      setError(`Maximum ${maxQuestions} questions available`);
      return;
    }
    onConfirm(num);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  const modeTitle = mode === 'flashcard' ? 'Flashcard' : 'Multiple Choice';

  return (
    <div className="modal-overlay">
      <div className="modal-content question-count-modal">
        <h2>How Many Questions?</h2>
        <p>You have {maxQuestions} words available</p>

        <div className="input-group">
          <input
            type="number"
            className="modal-input"
            min="1"
            max={maxQuestions}
            value={count}
            onChange={(e) => {
              setCount(e.target.value);
              setError('');
            }}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          <span className="input-hint">/ {maxQuestions}</span>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <p className="modal-info">
          You'll see {count} {modeTitle === 'Flashcard' ? 'flashcards' : 'questions'}
        </p>

        <div className="modal-buttons">
          <button className="btn-secondary" onClick={onCancel}>
            Back
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            Start {modeTitle}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCountModal;
