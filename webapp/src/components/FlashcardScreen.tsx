import React, { useState } from 'react';
import ProgressHeader from './ProgressHeader';

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
  const [knowCount, setKnowCount] = useState(0);

  const currentCard = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleKnow = () => {
    setKnowCount((prev) => prev + 1);
    moveToNext();
  };

  const handleDontKnow = () => {
    moveToNext();
  };

  const moveToNext = () => {
    if (isLast) {
      onFinish(knowCount);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  return (
    <div className="quiz-screen flashcard-mode-screen">
      <ProgressHeader
        current={currentIndex + 1}
        total={questions.length}
        hearts={3}
      />

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
          className="btn-secondary btn-large"
          onClick={handleDontKnow}
        >
          Don't Know
        </button>
        <button
          className="btn-primary btn-large"
          onClick={handleKnow}
        >
          I Know This ({knowCount})
        </button>
      </div>

      {isLast && (
        <div className="quiz-summary">
          <p>You marked {knowCount} out of {questions.length} as known</p>
        </div>
      )}
    </div>
  );
};

export default FlashcardScreen;
