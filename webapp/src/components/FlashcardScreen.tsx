import React, { useState, useEffect, useRef } from 'react';
import { AIChatPanel } from './AIChatPanel';

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
  learnedCount?: number;
  totalCount?: number;
  onClearLearned?: () => void;
}

export const FlashcardScreen: React.FC<FlashcardScreenProps> = ({
  questions,
  onFinish,
  onWordLearned,
  learnedCount = 0,
  totalCount = 0,
  onClearLearned,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [shouldShrink, setShouldShrink] = useState(false);
  const trackedWordsRef = useRef<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const currentCard = questions[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questions.length - 1;

  // Reset tracking ref when new session starts (questions change)
  useEffect(() => {
    trackedWordsRef.current = new Set();
    // console.log('Fresh flashcard session started - tracking ref reset');
  }, [questions.length]);

  // Check if flashcard needs to shrink when chat opens
  useEffect(() => {
    if (isChatOpen && containerRef.current) {
      const viewportHeight = window.innerHeight;
      // Estimate required space: header (~80px) + progress bar (~60px) + flashcard (~300px) + chat panel (~350px) + gaps (~60px)
      const requiredSpace = 80 + 60 + 300 + 350 + 60;
      const needsShrinking = requiredSpace > viewportHeight;
      setShouldShrink(needsShrinking);
    } else {
      setShouldShrink(false);
    }
  }, [isChatOpen]);

  // Track word when card is FLIPPED (meaning revealed) - not just viewed
  useEffect(() => {
    if (currentCard && isFlipped && !trackedWordsRef.current.has(currentCard.vocabId)) {
      trackedWordsRef.current.add(currentCard.vocabId);
      // console.log('Card FLIPPED and learned:', currentCard.word, 'ID:', currentCard.vocabId);
      if (onWordLearned) {
        onWordLearned(currentCard.vocabId);
        // console.log('onWordLearned callback called for:', currentCard.word);
      }
    }
  }, [currentIndex, currentCard, isFlipped, onWordLearned]);

  // Handle empty questions
  if (!questions || questions.length === 0) {
    return (
      <div className="quiz-screen flashcard-mode-screen">
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h2>All words learned!</h2>
          <p>You've learned all available words. Clear learned words to start fresh.</p>
          {onClearLearned && (
            <button className="btn-primary" onClick={onClearLearned}>
              Clear Learned Words & Go Home
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return null;
  }

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
    <div 
      ref={containerRef}
      className={`quiz-screen flashcard-mode-screen ${isChatOpen && shouldShrink ? 'shrink-for-chat' : ''}`}
    >
      <div className={`flashcard-header ${isChatOpen ? 'chat-open' : ''}`}>
        {!isChatOpen && (
          <>
            <div className="progress-info">
              <span className="progress-badge">{learnedCount}</span>
              <span className="progress-text">Word {currentIndex + 1} of {questions.length}</span>
            </div>
            <div className="header-buttons">
              <button
                className="btn-ask-ai"
                onClick={() => setIsChatOpen(true)}
                title="Ask AI about this word"
              >
                Ask AI
              </button>
              {onClearLearned && (
                <button className="btn-clear-learned" onClick={onClearLearned}>
                  Clear & Home
                </button>
              )}
            </div>
          </>
        )}
        {isChatOpen && (
          <AIChatPanel
            word={currentCard.word}
            wordType={currentCard.wordType}
            meaning={currentCard.meaning}
            example={currentCard.example}
            onClose={() => setIsChatOpen(false)}
          />
        )}
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(learnedCount / (totalCount || questions.length)) * 100}%` }}></div>
        </div>
        <span className="progress-label">{learnedCount} / {totalCount || questions.length} words learned</span>
      </div>
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
          className="btn-secondary btn-small"
          onClick={moveToPrevious}
          disabled={isFirst}
        >
          ← Previous
        </button>
        <button
          className="btn-primary btn-small"
          onClick={moveToNext}
        >
          {isLast ? 'Finish' : 'Next'} →
        </button>
      </div>
    </div>
  );
};

export default FlashcardScreen;
