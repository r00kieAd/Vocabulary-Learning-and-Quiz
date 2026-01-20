import React, { useState, useEffect, useMemo } from 'react';
import type { Vocab } from '../services';
import HomeScreen from './HomeScreen';
import PlayerNameModal from './PlayerNameModal';
import QuestionCountModal from './QuestionCountModal';
import FlashcardChoiceModal from './FlashcardChoiceModal';
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
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [questionCount, setQuestionCount] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [totalQuestionsInQuiz, setTotalQuestionsInQuiz] = useState(0);
  const [learnedWords, setLearnedWords] = useState<number[]>(() => {
    // Load learned words from localStorage on mount
    try {
      const stored = localStorage.getItem('vocabLearned');
      const words = stored ? JSON.parse(stored) : [];
      // console.log('🔄 GameShell MOUNTED: Loaded from localStorage:', words);
      return words;
    } catch {
      return [];
    }
  });
  const [mcqMode, setMcqMode] = useState<'flashcard' | 'random'>('random');

  // Persist learned words to localStorage whenever they change
  useEffect(() => {
    // console.log('Saving learnedWords to localStorage:', learnedWords);
    localStorage.setItem('vocabLearned', JSON.stringify(learnedWords));
  }, [learnedWords]);

  // Log on mount to verify initialization
  useEffect(() => {
    // console.log('GameShell mounted, learnedWords initialized to:', learnedWords);
  }, []);

  // Clear learned words on page reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      setLearnedWords([]);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Generate MCQ questions
  const generateMCQQuestions = (count: number): QuizQuestion[] => {
    if (vocabs.length === 0) return [];

    let selectedVocabs: Vocab[];
    
    // If MCQ mode is 'flashcard', use all learned words
    if (mcqMode === 'flashcard' && learnedWords.length > 0) {
      selectedVocabs = vocabs.filter((v) => learnedWords.includes(v.id));
      // console.log('MCQ Flashcard Mode: filtering to learned words:', learnedWords, 'Found vocabs:', selectedVocabs.length);
      selectedVocabs = shuffleArray(selectedVocabs);
    } else {
      // Random mode: select 'count' random vocabs from all
      // console.log('MCQ Random Mode: selecting', count, 'from', vocabs.length, 'total vocabs');
      selectedVocabs = shuffleArray(vocabs).slice(0, Math.min(count, vocabs.length));
    }

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
  // Each session starts fresh with all vocabulary available
  // Session-wide repetition is handled by FlashcardScreen's trackedWordsRef
  const generateFlashcardQuestions = (count: number): FlashcardQuestion[] => {
    if (vocabs.length === 0) return [];
    
    // Use all vocabulary - no filtering by learnedWords
    // This ensures question pool doesn't shrink as user learns words during session
    const selectedVocabs = shuffleArray(vocabs).slice(0, Math.min(count, vocabs.length));
    
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
      // ALWAYS reset learned words for fresh flashcard session
      setLearnedWords([]);
      setShowCountModal(true);
    } else {
      setShowNameModal(true);
    }
  };

  const handleNameConfirm = (name: string) => {
    setPlayerName(name);
    setShowNameModal(false);
    setMcqMode('random'); // Reset to random for new quiz
    
    // Get fresh value from localStorage in case it was updated
    const freshLearnedWords = (() => {
      try {
        const stored = localStorage.getItem('vocabLearned');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    })();
    
    // console.log('=== MCQ NAME CONFIRMED ===');
    // console.log('Player name:', name);
    // console.log('Current learnedWords state:', learnedWords);
    // console.log('Fresh localStorage value:', freshLearnedWords);
    
    // Show choice modal if there are learned words, otherwise show count modal
    if (freshLearnedWords.length > 0) {
      // console.log('✅ Showing choice modal with', freshLearnedWords.length, 'learned words');
      setShowChoiceModal(true);
    } else {
      // console.log('❌ No learned words found, showing count modal instead');
      setShowCountModal(true);
    }
  };

  const handleChoiceConfirm = (choice: 'flashcard' | 'random') => {
    setShowChoiceModal(false);
    
    if (choice === 'flashcard') {
      // Use all learned words - set count and go directly to quiz
      const count = learnedWords.length;
      setQuestionCount(count);
      setTotalQuestionsInQuiz(count);
      setMcqMode('flashcard');
      setCurrentScreen('quiz');
    } else {
      // Random mode - show count modal
      setMcqMode('random');
      setShowCountModal(true);
    }
  };

  const handleCountConfirm = (count: number) => {
    setQuestionCount(count);
    setTotalQuestionsInQuiz(count);
    setShowCountModal(false);

    if (selectedMode === 'flashcard') {
      setCurrentScreen('flashcard');
    } else {
      // For MCQ - if mcqMode wasn't set by choice modal, default to random
      if (mcqMode === 'flashcard') {
        setMcqMode('random');
      }
      setCurrentScreen('quiz');
    }
  };

  const handleQuizEnd = (score: number) => {
    // Flashcard mode: go directly to home
    // DO NOT clear learned words - they should persist for MCQ practice
    if (selectedMode === 'flashcard') {
      handleReturnHome();
      return;
    }

    // MCQ mode: show completion screen and save score
    setQuizScore(score);
    setCurrentScreen('completion');
    // NOTE: Do NOT clear learned words here for MCQ - they're shown in completion screen
    // They will be cleared when user clicks "Go Home" from completion screen
    setMcqMode('random');

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
    // DO NOT clear learned words here - they should persist after flashcard session
    // so user can practice them in MCQ mode
    // They will be cleared when user explicitly starts a NEW flashcard session
    setMcqMode('random');
    // Refresh high score data when returning home
    if (onRefreshHighScore) {
      onRefreshHighScore();
    }
  };

  // Memoize flashcard questions so they don't regenerate when learnedWords changes during session
  const memoizedFlashcardQuestions = useMemo(() => {
    if (currentScreen === 'flashcard') {
      return generateFlashcardQuestions(questionCount);
    }
    return [];
  }, [currentScreen, questionCount]);

  // Memoize MCQ questions similarly
  const memoizedMCQQuestions = useMemo(() => {
    if (currentScreen === 'quiz') {
      return generateMCQQuestions(questionCount);
    }
    return [];
  }, [currentScreen, questionCount, mcqMode]);

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
          return (
            <QuizScreen
              questions={memoizedMCQQuestions}
              onQuizEnd={handleQuizEnd}
              onQuit={handleReturnHome}
              quizMode={mcqMode}
            />
          );
        }

      case 'flashcard':
        {
          return (
            <FlashcardScreen
              questions={memoizedFlashcardQuestions}
              onFinish={handleQuizEnd}
              onWordLearned={(vocabId) => {
                setLearnedWords((prev) => [...new Set([...prev, vocabId])]);
              }}
              learnedCount={learnedWords.length}
              totalCount={questionCount}
              onClearLearned={() => {
                // Clear and go home
                setLearnedWords([]);
                handleReturnHome();
              }}
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
            onPlayAgain={() => {
              // Play again: restart the quiz with the same settings
              setCurrentScreen('quiz');
            }}
            onHome={() => {
              // Go home: only clear learned words if quiz was in flashcard mode
              if (mcqMode === 'flashcard') {
                // console.log('🗑️ Clearing learned words after completing learned words quiz');
                setLearnedWords([]);
              } else {
                // console.log('✅ Keeping learned words - quiz was in random mode');
              }
              handleReturnHome();
            }}
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

      <FlashcardChoiceModal
        isOpen={showChoiceModal}
        onChoose={handleChoiceConfirm}
        onCancel={() => {
          setShowChoiceModal(false);
          setShowNameModal(true);
        }}
        learnedWordsCount={learnedWords.length}
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
