import React, { useState } from 'react';

interface FlashcardQuestion {
  vocabId: number;
  word: string;
  wordType: string;
  meaning: string;
  example: string;
}

interface FlashcardScreenProps {
  questions: FlashcardQuestion[];
  onFinish: (score: number) => void;
}

export const FlashcardScreen: React.FC<FlashcardScreenProps> = ({
  questions,
  onFinish,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const moveToNext = () => {
    if (isLast) {
      onFinish(0); // Flashcards don't have scoring
    } else {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  return (
    <div className="quiz-screen flashcard-mode-screen">
      <div className="flashcard-container">
        <div
          className={`flashcard ${isFlipped ? 'flipped' : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="flashcard-inner">
            <div className="flashcard-front">
              <div className="word">{currentCard.word}</div>
              <div className="word-type">{currentCard.wordType}</div>
              <div className="hint">Click to reveal meaning</div>
            </div>
            <div className="flashcard-back">
              <div className="meaning">{currentCard.meaning}</div>
              <div className="example">
                <strong>Example:</strong> {currentCard.example}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flashcard-actions">
        <button
          className="btn-primary btn-large"
          onClick={moveToNext}
        >
          {isLast ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default FlashcardScreen;
