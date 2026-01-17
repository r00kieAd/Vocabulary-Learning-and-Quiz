import React from 'react';
import LevelCard from './LevelCard';

interface Level {
  id: number;
  name: string;
  difficulty: string;
  icon: string;
  hearts: number;
  completed?: boolean;
}

interface LevelScreenProps {
  levels: Level[];
  onLevelSelect: (levelId: number) => void;
}

export const LevelScreen: React.FC<LevelScreenProps> = ({
  levels,
  onLevelSelect,
}) => {
  return (
    <div className="level-screen">
      <div className="header">
        <h1>Let's Play</h1>
        <p>Choose a level and start learning new words!</p>
      </div>
      <div className="levels-grid">
        {levels.map((level) => (
          <LevelCard
            key={level.id}
            level={level}
            onClick={() => onLevelSelect(level.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default LevelScreen;
