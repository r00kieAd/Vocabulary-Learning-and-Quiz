import React from 'react';

interface TopBarProps {
  playerName: string;
  highScore: number;
  onViewScores?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  playerName,
  highScore,
  onViewScores,
}) => {
  return (
    <div className="top-bar">
      <div className="logo">📚</div>
      <div className="player-info">
        <span className="username">{playerName}</span>
        <span className="score-badge">⭐ {highScore}</span>
      </div>
      <div className="action-buttons">
        {onViewScores && (
          <button onClick={onViewScores} title="View Scores">
            🏆
          </button>
        )}
        <button title="Menu">☰</button>
      </div>
    </div>
  );
};

export default TopBar;
