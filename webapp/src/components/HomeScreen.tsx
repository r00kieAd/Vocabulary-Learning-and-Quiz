import React, { useEffect, useState } from 'react';
import GradientText from './GradientText';
import Toggle from './toggle';
import vocab from '../assets/book1.svg';
import { useGlobal } from '../context/globalContext';
import type { Score } from '../services';

interface HomeScreenProps {
  onSelectMode: (mode: 'flashcard' | 'mcq') => void;
  highScore: number;
  highScorer: string;
  topScores: Score[];
  onRefreshHighScores: () => void;
  isRefreshingHighScores: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectMode,
  highScore,
  highScorer,
  topScores,
  onRefreshHighScores,
  isRefreshingHighScores,
}) => {
  const [color1, setColor1] = useState<string>('');
  const [color2, setColor2] = useState<string>('');
  const [color3, setColor3] = useState<string>('');
  const { activeTheme } = useGlobal();
  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    setColor1(styles.getPropertyValue('--accent-primary'));
    setColor2(styles.getPropertyValue('--accent-secondary'));
    setColor3(styles.getPropertyValue('--accent-dark-blue'));
  }, [activeTheme])
  return (
    <div className="home-screen">
      <div className="header">
        <div className="header-container">
          <div className="header-img">
            <img src={vocab} alt="" />
          </div>
          <GradientText animationSpeed={4} className="custom-class" colors={[color1, color2, color3]}>
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
        <div className="high-score-card">
          <div className="high-score-card-header">
            <span className="label">
              {isRefreshingHighScores ? 'refreshing...' : 'Leaderboard'}
            </span>
            <button
              type="button"
              className="refresh-button"
              onClick={onRefreshHighScores}
              disabled={isRefreshingHighScores}
            >
              <i
                className={`fa-solid fa-arrows-rotate ${
                  isRefreshingHighScores ? 'fa-spin' : ''
                }`}
              ></i>
            </button>
          </div>
          <div className="high-score-card-content">
            {isRefreshingHighScores && (
              <div className="high-score-mask" aria-hidden="true" />
            )}
            {topScores.length > 0 ? (
              <table className="scores-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {topScores.map((item, idx) => (
                  <tr
                    key={item.high_scorer + item.high_score}
                    className={idx === 0 ? 'leader-row' : ''}
                  >
                    <td>{`#${idx + 1}`}</td>
                    <td>{item.high_scorer}</td>
                    <td>{item.high_score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : highScore > 0 ? (
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
          ) : (
            <p className="no-scores">No scores yet. Be the first!</p>
          )}
          </div>
        </div>
      </div>

      <Toggle />

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
