import React, { useState, useEffect, useRef } from 'react';

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
  onWordLearned?: (vocabId: number) => void;
}

export const FlashcardScreen: React.FC<FlashcardScreenProps> = ({
  questions,
  onFinish,
  onWordLearned,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const trackedWordsRef = useRef<Set<number>>(new Set());

  const currentCard = questions[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questions.length - 1;

  // Track word when card is viewed (index changes)
  useEffect(() => {
    if (currentCard && !trackedWordsRef.current.has(currentCard.vocabId)) {
      trackedWordsRef.current.add(currentCard.vocabId);
      console.log('Card viewed:', currentCard.word, 'ID:', currentCard.vocabId);
      if (onWordLearned) {
        onWordLearned(currentCard.vocabId);
        console.log('onWordLearned callback called for:', currentCard.word);
      }
    }
  }, [currentIndex, currentCard, onWordLearned]);

  const moveToPrevious = () => {
    if (!isFirst) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

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
          className="btn-secondary btn-large"
          onClick={moveToPrevious}
          disabled={isFirst}
        >
          Previous
        </button>
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
