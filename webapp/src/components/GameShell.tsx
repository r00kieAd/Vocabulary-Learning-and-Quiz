import React, { useState, useEffect } from 'react';
import type { Vocab } from '../services';
import HomeScreen from './HomeScreen';
import CompletionScreen from './CompletionScreen';
import FlashcardSection from './FlashcardSection';
import QuizSection from './QuizSection';

type Screen = 'home' | 'flashcard-section' | 'quiz-section' | 'completion';

interface GameShellProps {
  vocabs: Vocab[];
  highScore: number;
  highScorer: string;
  onScoreInsert: (score: number, name: string) => Promise<any>;
  onRefreshHighScore?: () => void;
}

export const GameShell: React.FC<GameShellProps> = ({
  vocabs,
  highScore,
  highScorer,
  onScoreInsert,
  onRefreshHighScore,
}) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [quizScore, setQuizScore] = useState(0);
  const [totalQuestionsInQuiz, setTotalQuestionsInQuiz] = useState(0);
  const [playerName, setPlayerName] = useState('');

  // Persist learned words to localStorage whenever they change
  useEffect(() => {
    // Note: Learned words are now tracked within FlashcardScreen
    // and persisted per session
  }, []);

  // Navigation handlers
  const handleModeSelect = (mode: 'flashcard' | 'mcq') => {
    if (mode === 'flashcard') {
      setCurrentScreen('flashcard-section');
    } else {
      setCurrentScreen('quiz-section');
    }
  };

  const handleReturnHome = () => {
    setCurrentScreen('home');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onSelectMode={handleModeSelect}
            highScore={highScore}
            highScorer={highScorer}
            topScores={vocabs.length > 0 ? [] : []}
          />
        );

      case 'flashcard-section':
        return <FlashcardSection onExit={handleReturnHome} />;

      case 'quiz-section':
        return <QuizSection onExit={handleReturnHome} />;

      case 'completion':
        return (
          <CompletionScreen
            finalScore={quizScore}
            totalQuestions={totalQuestionsInQuiz}
            highScore={highScore}
            highScorer={highScorer}
            isNewRecord={quizScore > highScore}
            playerName={playerName}
            onPlayAgain={() => {
              handleReturnHome();
            }}
            onHome={handleReturnHome}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="game-shell">
      {renderScreen()}
    </div>
  );
};

export default GameShell;
