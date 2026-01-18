import React from 'react';
import excellent from '../assets/excellent.png'
import fair from '../assets/fair.png'
import great from '../assets/great.png'
import poor from '../assets/poor.png'

interface CompletionScreenProps {
  finalScore: number;
  totalQuestions: number;
  highScore: number;
  highScorer: string;
  isNewRecord: boolean;
  playerName?: string;
  onPlayAgain: () => void;
  onHome: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  finalScore,
  totalQuestions,
  highScore,
  highScorer,
  isNewRecord,
  playerName,
  onPlayAgain,
  onHome,
}) => {
  const percentage = Math.round((finalScore / totalQuestions) * 100);
  const celebration =
    percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good!' : percentage <= 30 ? 'Poor' : 'Fair';
  // Show current player name as high scorer if it's a new record
  const celebration_img = celebration === 'Excellent!' ? excellent : celebration === 'Good!' ? great : celebration === 'Poor' ? poor : fair;
  const displayHighScorer = isNewRecord && playerName ? playerName : highScorer;

  return (
    <div className="completion-screen">
      <div className="celebration">
        <div className="celebration-inner">
          <span>{celebration}</span>
          <img src={celebration_img} alt="celebration" />
        </div>
      </div>
      <h1>Quiz Completed!</h1>

      <div className="final-score">
        <div className="label">Your Score</div>
        <div className="score">
          {finalScore} / {totalQuestions}
        </div>
        <div style={{ marginTop: '8px', fontSize: '14px' }}>
          {percentage}% Correct
        </div>
      </div>

      <div className="high-score-compare">
        <div className="compare-row">
          <div className="score-item">
            <span className="label">Your Score</span>
            <span className="value">{finalScore}</span>
          </div>
          <div className="score-item">
            <span className="label">vs</span>
          </div>
          <div className={`score-item ${isNewRecord ? 'is-new' : ''}`}>
            <span className="label">High Score</span>
            <span className="value">{highScore}</span>
          </div>
        </div>
        {highScore > 0 && (
          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: '#6b7280' }}>
            by {displayHighScorer}
          </div>
        )}
        {isNewRecord && (
          <div
            style={{
              textAlign: 'center',
              marginTop: '12px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#22c55e',
            }}
          >
            🏆 New Record!
          </div>
        )}
      </div>

      <div className="action-buttons">
        <button className="btn-play-again" onClick={onPlayAgain}>
          Play Again
        </button>
        <button className="btn-home" onClick={onHome}>
          Go Home
        </button>
      </div>
    </div>
  );
};

export default CompletionScreen;
