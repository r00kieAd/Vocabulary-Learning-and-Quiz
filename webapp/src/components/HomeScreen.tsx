import React from 'react';

interface HomeScreenProps {
  onSelectMode: (mode: 'flashcard' | 'mcq') => void;
  highScore: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectMode,
  highScore,
}) => {
  return (
    <div className="home-screen">
      <div className="header">
        <h1>Vocabulary Quiz</h1>
        <p>Learn and test your vocabulary skills</p>
      </div>

      <div className="mode-selector">
        <button
          className="mode-card flashcard-mode"
          onClick={() => onSelectMode('flashcard')}
        >
          <div className="mode-icon">🎴</div>
          <h2>Flashcards</h2>
          <p>Flip through cards to memorize words</p>
        </button>

        <button
          className="mode-card mcq-mode"
          onClick={() => onSelectMode('mcq')}
        >
          <div className="mode-icon">❓</div>
          <h2>Multiple Choice</h2>
          <p>Answer multiple choice questions</p>
        </button>
      </div>

      {highScore > 0 && (
        <div className="high-score-info">
          <span className="label">Your High Score:</span>
          <span className="score">⭐ {highScore}</span>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
