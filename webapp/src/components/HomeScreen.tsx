import React from 'react';
import GradientText from './GradientText';
import vocab from '../assets/vocab.png';

interface HomeScreenProps {
  onSelectMode: (mode: 'flashcard' | 'mcq') => void;
  highScore: number;
  highScorer: string;
  topScores: Array<{ score: number; username: string }>;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectMode,
  highScore,
  highScorer,
  topScores,
}) => {
  return (
    <div className="home-screen">
      <div className="header">
        <div className="header-container">
          <div className="header-img">
            <img src={vocab} alt="" />
          </div>
          <GradientText animationSpeed={5} className="custom-class">
            <h1 className='header-title'>Vocabulary</h1>
          </GradientText>
        </div>
        <p>Learn and test your vocabulary skills</p>
      </div>

      <div className="mode-selector">
        <button
          className="mode-card flashcard-mode"
          onClick={() => onSelectMode('flashcard')}
        >
          <div className="mode-icon">Card</div>
          <h2>Flashcards</h2>
          <p>Flip through cards to memorize words</p>
        </button>

        <button
          className="mode-card mcq-mode"
          onClick={() => onSelectMode('mcq')}
        >
          <div className="mode-icon">MCQ</div>
          <h2>Multiple Choice</h2>
          <p>Answer multiple choice questions</p>
        </button>
      </div>

      <div className="scores-section">
        {highScore > 0 && (
          <div className="high-score-card">
            <div className="label">High Score</div>
            <table className="scores-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{highScorer}</td>
                  <td>{highScore}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {topScores.length > 0 && (
          <div className="top-scores-card">
            <div className="label">Top Scores</div>
            <div className="top-scores-list">
              {topScores.map((item, idx) => (
                <div key={idx} className="top-score-item">
                  <span className="rank">#{idx + 1}</span>
                  <span className="username">{item.username}</span>
                  <span className="score">{item.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Debug: Show learned words from localStorage - COMMENTED OUT */}
      {/* <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        background: '#f0f0f0', 
        borderRadius: '4px',
        fontSize: '12px',
        textAlign: 'center'
      }}>
        <div style={{ color: '#666' }}>
          Learned words stored: {(() => {
            try {
              const stored = localStorage.getItem('vocabLearned');
              const words = stored ? JSON.parse(stored) : [];
              return `${words.length} words`;
            } catch {
              return 'Error loading';
            }
          })()}
        </div>
      </div> */}
    </div>
  );
};

export default HomeScreen;
