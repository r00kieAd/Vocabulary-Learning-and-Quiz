import React from 'react';

interface Level {
  id: number;
  name: string;
  difficulty: string;
  icon: string;
  hearts: number;
  completed?: boolean;
}

interface LevelCardProps {
  level: Level;
  onClick: () => void;
}

export const LevelCard: React.FC<LevelCardProps> = ({ level, onClick }) => {
  return (
    <div className="level-card" onClick={onClick}>
      <div className="gradient-bg">
        <div className="illustration">{level.icon}</div>
        <div className="label">Level {level.id}</div>
        <div className="title">{level.name}</div>
      </div>
      <div className="info">
        <span className="level-title">{level.difficulty}</span>
        <div className="hearts">
          {Array.from({ length: level.hearts }).map((_, i) => (
            <span key={i} className="heart">
              ❤️
            </span>
          ))}
        </div>
      </div>
      <button className="start-btn">Start Game</button>
    </div>
  );
};

export default LevelCard;
