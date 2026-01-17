import React from 'react';

interface CompletionScreenProps {
  finalScore: number;
  totalQuestions: number;
  highScore: number;
  highScorer: string;
  isNewRecord: boolean;
  onPlayAgain: () => void;
  onHome: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  finalScore,
  totalQuestions,
  highScore,
  highScorer,
  isNewRecord,
  onPlayAgain,
  onHome,
}) => {
  const percentage = Math.round((finalScore / totalQuestions) * 100);
  const celebration =
    percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good!' : 'Great!';

  return (
    <div className="completion-screen">
      <div className="celebration">{celebration}</div>
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
            by {highScorer}
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
