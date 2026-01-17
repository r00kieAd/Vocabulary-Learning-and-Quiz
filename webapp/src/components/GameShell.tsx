import React, { useState } from 'react';
import type { Vocab } from '../services';
import HomeScreen from './HomeScreen';
import PlayerNameModal from './PlayerNameModal';
import QuestionCountModal from './QuestionCountModal';
import QuizScreen from './QuizScreen';
import FlashcardScreen from './FlashcardScreen';
import CompletionScreen from './CompletionScreen';

type Screen = 'home' | 'quiz' | 'flashcard' | 'completion';

interface QuizQuestion {
  vocabId: number;
  word: string;
  wordType: string;
  correctAnswer: string; // This is now the optionId like "option-0"
  options: Array<{ id: string; text: string }>;
}

interface FlashcardQuestion {
  vocabId: number;
  word: string;
  wordType: string;
  meaning: string;
  example: string;
}

interface GameShellProps {
  vocabs: Vocab[];
  highScore: number;
  highScorer: string;
  onScoreInsert: (score: number, name: string) => Promise<any>;
  onRefreshHighScore?: () => void;
}

// Shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const GameShell: React.FC<GameShellProps> = ({
  vocabs,
  highScore,
  highScorer,
  onScoreInsert,
  onRefreshHighScore,
}) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedMode, setSelectedMode] = useState<'flashcard' | 'mcq' | null>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showCountModal, setShowCountModal] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [questionCount, setQuestionCount] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [totalQuestionsInQuiz, setTotalQuestionsInQuiz] = useState(0);

  // Generate MCQ questions
  const generateMCQQuestions = (count: number): QuizQuestion[] => {
    if (vocabs.length === 0) return [];

    const selectedVocabs = shuffleArray(vocabs).slice(0, count);

    return selectedVocabs.map((vocab) => {
      const wrongAnswers = shuffleArray(
        vocabs
          .filter((v) => v.id !== vocab.id)
          .map((v) => v.meaning)
      ).slice(0, Math.min(3, vocabs.length - 1));

      const allOptions = shuffleArray([vocab.meaning, ...wrongAnswers]);

      // Find the index of the correct answer and use its option id
      const correctAnswerId = `option-${allOptions.indexOf(vocab.meaning)}`;

      return {
        vocabId: vocab.id,
        word: vocab.word,
        wordType: vocab.word_type,
        correctAnswer: correctAnswerId,
        options: allOptions.map((text, idx) => ({
          id: `option-${idx}`,
          text,
        })),
      };
    });
  };

  // Generate Flashcard questions
  const generateFlashcardQuestions = (count: number): FlashcardQuestion[] => {
    const selectedVocabs = shuffleArray(vocabs).slice(0, count);
    return selectedVocabs.map((vocab) => ({
      vocabId: vocab.id,
      word: vocab.word,
      wordType: vocab.word_type,
      meaning: vocab.meaning,
      example: vocab.example,
    }));
  };

  const handleModeSelect = (mode: 'flashcard' | 'mcq') => {
    setSelectedMode(mode);
    if (mode === 'flashcard') {
      setShowCountModal(true);
    } else {
      setShowNameModal(true);
    }
  };

  const handleNameConfirm = (name: string) => {
    setPlayerName(name);
    setShowNameModal(false);
    setShowCountModal(true);
  };

  const handleCountConfirm = (count: number) => {
    setQuestionCount(count);
    setTotalQuestionsInQuiz(count);
    setShowCountModal(false);

    if (selectedMode === 'flashcard') {
      setCurrentScreen('flashcard');
    } else {
      setCurrentScreen('quiz');
    }
  };

  const handleQuizEnd = (score: number) => {
    // Flashcard mode: go directly to home (score is 0)
    if (selectedMode === 'flashcard') {
      handleReturnHome();
      return;
    }

    // MCQ mode: show completion screen and save score
    setQuizScore(score);
    setCurrentScreen('completion');

    // Save score if it's higher than current high score
    if (score > highScore) {
      onScoreInsert(score, playerName);
    }
  };

  const handleReturnHome = () => {
    setCurrentScreen('home');
    setSelectedMode(null);
    setPlayerName('');
    setQuestionCount(0);
    // Refresh high score data when returning home
    if (onRefreshHighScore) {
      onRefreshHighScore();
    }
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

      case 'quiz':
        {
          const quizQuestions = generateMCQQuestions(questionCount);
          return (
            <QuizScreen
              questions={quizQuestions}
              onQuizEnd={handleQuizEnd}
              onQuit={handleReturnHome}
            />
          );
        }

      case 'flashcard':
        {
          const flashcardQuestions = generateFlashcardQuestions(questionCount);
          return (
            <FlashcardScreen
              questions={flashcardQuestions}
              onFinish={handleQuizEnd}
            />
          );
        }

      case 'completion':
        return (
          <CompletionScreen
            finalScore={quizScore}
            totalQuestions={totalQuestionsInQuiz}
            highScore={highScore}
            highScorer={highScorer}
            isNewRecord={quizScore > highScore}
            playerName={playerName}
            onPlayAgain={handleReturnHome}
            onHome={handleReturnHome}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="game-shell">
        {renderScreen()}
      </div>

      <PlayerNameModal
        isOpen={showNameModal}
        onConfirm={handleNameConfirm}
        onCancel={() => setShowNameModal(false)}
      />

      <QuestionCountModal
        isOpen={showCountModal}
        maxQuestions={vocabs.length}
        mode={selectedMode || 'mcq'}
        onConfirm={handleCountConfirm}
        onCancel={() => setShowCountModal(false)}
      />
    </>
  );
};

export default GameShell;
