import React from 'react';

interface FlashcardChoiceModalProps {
  isOpen: boolean;
  onChoose: (choice: 'flashcard' | 'random') => void;
  onCancel: () => void;
  learnedWordsCount: number;
}

export const FlashcardChoiceModal: React.FC<FlashcardChoiceModalProps> = ({
  isOpen,
  onChoose,
  onCancel,
  learnedWordsCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2>Choose Question Source</h2>
        </div>

        <div className="modal-body">
          <p className="modal-subtitle">
            You have learned {learnedWordsCount} words from flashcards
          </p>

          <div className="choice-buttons">
            <button
              className="choice-btn flashcard-choice"
              onClick={() => {
                console.log('User chose: Practice Learned Words');
                onChoose('flashcard');
              }}
            >
              <div className="choice-title">📚 Practice Learned Words</div>
              <div className="choice-desc">
                Test yourself on the {learnedWordsCount} words from your flashcard session
              </div>
            </button>

            <button
              className="choice-btn random-choice"
              onClick={() => {
                console.log('User chose: Random Words');
                onChoose('random');
              }}
            >
              <div className="choice-title">Random Words</div>
              <div className="choice-desc">Questions from all vocabulary</div>
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardChoiceModal;
