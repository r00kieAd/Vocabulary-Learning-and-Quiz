import React, { useState, useEffect } from 'react';
import { useUsername } from '../hooks/useUsername';
import {
  getVocabTypes,
  getVocabCountByType,
  getWordsByType,
  getAllVocabs,
  type VocabWord,
} from '../services/vocabTypes';
import { getDefaultWordCount, formatWordTypeLabel } from '../utils/vocabHelpers';
import QuizScreen from './QuizScreen';
import { getLearnedWordCount, getLearnedWordIds } from '../services/learnedWords';
import type { QuizOption, QuizQuestion } from '../types/quiz';

const FALLBACK_DISTRACTOR_MEANINGS = [
  'A completely different meaning',
  'The opposite of the correct answer',
  'An unrelated definition',
  'A synonym that is not exact',
];

const shuffleQuizOptions = (options: QuizOption[]): QuizOption[] => {
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.map((option, index) => ({
    ...option,
    id: `${index + 1}`,
  }));
};

const getDistractorMeanings = (
  allWords: VocabWord[],
  correctMeaning: string,
  count: number
): string[] => {
  const uniqueMeanings = Array.from(
    new Set(allWords.map((word) => word.meaning))
  ).filter((meaning) => meaning !== correctMeaning);

  const selected: string[] = [];
  const available = [...uniqueMeanings];

  while (selected.length < count && available.length > 0) {
    const index = Math.floor(Math.random() * available.length);
    selected.push(available[index]);
    available.splice(index, 1);
  }

  let fallbackIndex = 0;
  while (selected.length < count && fallbackIndex < FALLBACK_DISTRACTOR_MEANINGS.length) {
    const fallback = FALLBACK_DISTRACTOR_MEANINGS[fallbackIndex];
    if (!selected.includes(fallback)) {
      selected.push(fallback);
    }
    fallbackIndex += 1;
  }

  return selected;
};

const buildQuizOptions = (word: VocabWord, allWords: VocabWord[]): QuizOption[] => {
  const distractors = getDistractorMeanings(allWords, word.meaning, 3);
  const baseOptions: QuizOption[] = [
    { id: 'correct', text: word.meaning },
    ...distractors.map((meaning, index) => ({
      id: `distractor-${index}`,
      text: meaning,
    })),
  ];

  return shuffleQuizOptions(baseOptions);
};

interface QuizSectionProps {
  onExit: () => void;
}

type QuizFlowStep = 'username' | 'category-selection' | 'count-selection' | 'quiz' | 'results';
type QuizMode = 'all' | 'learned' | string; // 'all', 'learned', or specific word type

export const QuizSection: React.FC<QuizSectionProps> = ({ onExit }) => {
  const {
    username,
    isLoading: usernameLoading,
    showUsernameModal,
    usernameInput,
    setUsernameInput,
    handleInitialUsername,
    handleUsernameConfirm,
    handleUsernameCancel,
  } = useUsername();

  const [currentStep, setCurrentStep] = useState<QuizFlowStep>('username');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quiz category selection state
  const [wordTypes, setWordTypes] = useState<string[]>([]);
  const [typeCounts, setTypeCounts] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<QuizMode>('all');
  const [learnedWordsCount, setLearnedWordsCount] = useState(0);

  // Word count selection state
  const [selectedCount, setSelectedCount] = useState(0);
  const [maxCount, setMaxCount] = useState(0);

  // Quiz data
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizScore, setQuizScore] = useState(0);

  const refreshLearnedWordsCount = (): number => {
    const count = getLearnedWordCount();
    setLearnedWordsCount(count);
    return count;
  };

  // Move to category selection after username is set
  useEffect(() => {
    if (!usernameLoading && username && currentStep === 'username') {
      setCurrentStep('category-selection');
      fetchWordTypesAndCounts();
    }
  }, [usernameLoading, username, currentStep]);

  useEffect(() => {
    if (currentStep === 'category-selection') {
      refreshLearnedWordsCount();
    }
  }, [currentStep]);

  // Fetch word types and their counts in parallel
  const fetchWordTypesAndCounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const types = await getVocabTypes();
      setWordTypes(types);

      // Fetch counts in parallel
      const countPromises = types.map((type) => getVocabCountByType(type));
      const counts = await Promise.all(countPromises);

      const countMap: Record<string, number> = {};
      let totalCount = 0;
      counts.forEach((result) => {
        countMap[result.word_type] = result.count;
        totalCount += result.count;
      });

      setTypeCounts(countMap);
      setSelectedCategory('all');
      setMaxCount(totalCount);
      setSelectedCount(getDefaultWordCount(totalCount));
      refreshLearnedWordsCount();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // Handle category selection change
  const handleCategoryChange = (category: QuizMode) => {
    setSelectedCategory(category);
    let count = 0;

    if (category === 'all') {
      count = Object.values(typeCounts).reduce((a, b) => a + b, 0);
    } else if (category === 'learned') {
      count = refreshLearnedWordsCount();
    } else {
      count = typeCounts[category as string] || 0;
    }

    setMaxCount(count);
    setSelectedCount(getDefaultWordCount(count));
  };

  // Handle count change
  const handleCountChange = (count: number) => {
    const boundedCount = Math.min(Math.max(1, count), maxCount);
    setSelectedCount(boundedCount);
  };

  // Start quiz mode
  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const allWords = await getAllVocabs();
      if (allWords.length === 0) {
        setError('No words available for quiz');
        return;
      }

      let words: VocabWord[] = [];

      if (selectedCategory === 'learned') {
        const learnedIds = getLearnedWordIds();
        if (learnedIds.size === 0) {
          setError('No learned words yet. Learn some words first!');
          return;
        }

        words = allWords.filter((word) => learnedIds.has(word.id));
        if (words.length === 0) {
          setError('No learned words yet. Learn some words first!');
          return;
        }

        words = words.slice(0, selectedCount);
      } else if (selectedCategory === 'all') {
        // For "All", fetch from each type and combine
        const typePromises = wordTypes.map((type) =>
          getWordsByType(type, selectedCount).catch(() => [])
        );
        const typeResults = await Promise.all(typePromises);
        words = typeResults.flat();
        words = words.slice(0, selectedCount);
      } else {
        words = await getWordsByType(selectedCategory as string, selectedCount);
      }

      if (words.length === 0) {
        setError('No words found for this selection');
        return;
      }

      // Convert to quiz format with options
      const generatedQuizQuestions = words.map((word) => ({
        vocabId: word.id,
        word: word.word,
        wordType: word.word_type,
        correctAnswer: word.meaning,
        options: buildQuizOptions(word, allWords),
      }));

      setQuizQuestions(generatedQuizQuestions);
      setCurrentStep('quiz');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load words');
    } finally {
      setLoading(false);
    }
  };

  // Render loading state
  if (usernameLoading) {
    return (
      <div className="quiz-section-loader">
        <div className="loader-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If no username, prompt for it
  if (!username && currentStep === 'username') {
    return (
      <>
        <div className="quiz-section-prompt">
          <div className="prompt-card">
            <h2>Welcome to Quiz Mode</h2>
            <p>Let's get started! What's your name?</p>
            <div className="buttons-group">
              <button
                className="btn-primary"
                onClick={() => handleInitialUsername()}
              >
                Enter Name
              </button>
            </div>
            <button className="btn-secondary" onClick={onExit}>
              Back
            </button>
          </div>
        </div>

        {/* Username Modal */}
        {showUsernameModal && (
          <div className="modal-overlay">
            <div className="modal-content username-modal">
              <h3>Enter Your Name</h3>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Your name"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleUsernameConfirm();
                  }
                }}
                autoFocus
              />
              <div className="modal-buttons">
                <button className="btn-primary" onClick={handleUsernameConfirm}>
                  Confirm
                </button>
                <button className="btn-secondary" onClick={handleUsernameCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Category selection screen
  if (currentStep === 'category-selection') {
    return (
      <>
        <div className="quiz-section">
          <div className="quiz-section-header">
            {loading ? "please wait..." : error ? <><i className="fa-solid fa-bug" style={{ color: "rgb(194, 99, 85)" }}>&nbsp;E&nbsp;rr&nbsp;or</i></> : <>
              <h2>Put your memory on trial, {username}!</h2></>}
          </div>

          <div className="quiz-section-content">
            {loading ? (
              <div className="loader">
                <div className="loader-spinner"></div>
                <p>Loading categories...</p>
              </div>
            ) : error ? (
              <div className="error-message">
                <p>{error}</p>
                <button className="btn-primary" onClick={fetchWordTypesAndCounts}>
                  Retry
                </button>
              </div>
            ) : (
              <>
                <h3>Select Quiz Category</h3>
                <div className="quiz-category-options">
                  {/* All button */}
                  <label className="quiz-category-option">
                    <input
                      type="radio"
                      name="quiz-category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                    />
                    <span className="label-text">
                      <span className="category-name">All</span>
                      <span className="category-count">
                        ({Object.values(typeCounts).reduce((a, b) => a + b, 0)})
                      </span>
                    </span>
                  </label>

                  {/* Word type buttons */}
                  {wordTypes.map((type) => (
                    <label key={type} className="quiz-category-option">
                      <input
                        type="radio"
                        name="quiz-category"
                        value={type}
                        checked={selectedCategory === type}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                      />
                      <span className="label-text">
                        <span className="category-name">{formatWordTypeLabel(type)}</span>
                        <span className="category-count">({typeCounts[type] || 0})</span>
                      </span>
                    </label>
                  ))}

                  {/* Learned Words separator and option */}
                  <div className="category-separator"></div>

                  <label className="quiz-category-option">
                    <input
                      type="radio"
                      name="quiz-category"
                      value="learned"
                      checked={selectedCategory === 'learned'}
                      onChange={() => handleCategoryChange('learned')}
                    />
                    <span className="label-text">
                      <span className="category-name">Learned Words</span>
                      <span className="category-count">({learnedWordsCount})</span>
                    </span>
                  </label>
                </div>

                <div className="buttons-group">
                  <button
                    className="btn-primary"
                    onClick={() => setCurrentStep('count-selection')}
                  >
                    Next
                  </button>
                  <button className="btn-secondary" onClick={onExit}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

      </>
    );
  }

  // Count selection screen
  if (currentStep === 'count-selection') {
    return (
      <div className="quiz-section">
        <div className="quiz-section-header">
          <h2>How many words to quiz on?</h2>
        </div>

        <div className="quiz-section-content">
          <div className="count-selection">
            <div className="count-display">
              <label>Words to Quiz</label>
              <div className="count-input-group">
                <button
                  className="btn-count-control"
                  onClick={() => handleCountChange(selectedCount - 1)}
                  disabled={selectedCount <= 1}
                >
                  −
                </button>
                <input
                  type="number"
                  value={selectedCount}
                  onChange={(e) => handleCountChange(Number(e.target.value))}
                  min={1}
                  max={maxCount}
                  className="count-input"
                />
                <button
                  className="btn-count-control"
                  onClick={() => handleCountChange(selectedCount + 1)}
                  disabled={selectedCount >= maxCount}
                >
                  +
                </button>
              </div>
              <p className="count-info">
                Maximum available: <strong>{maxCount}</strong>
              </p>
            </div>
          </div>

          <div className="buttons-group">
            <button
              className="btn-primary"
              onClick={handleStart}
              disabled={loading}
            >
              {loading ? 'Starting...' : 'Start Quiz'}
            </button>
            <button
              className="btn-secondary"
              onClick={() => setCurrentStep('category-selection')}
              disabled={loading}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz screen
  if (currentStep === 'quiz') {
    return (
      <QuizScreen
        questions={quizQuestions}
        onQuizEnd={(score) => {
          setQuizScore(score);
          setCurrentStep('results');
        }}
        onQuit={() => {
          setQuizQuestions([]);
          setCurrentStep('category-selection');
        }}
        quizMode={selectedCategory === 'learned' ? 'flashcard' : 'random'}
      />
    );
  }

  // Results screen
  if (currentStep === 'results') {
    const totalQuestions = quizQuestions.length;
    const percentage = totalQuestions > 0 ? Math.round((quizScore / totalQuestions) * 100) : 0;

    return (
      <div className="quiz-section">
        <div className="quiz-result-card">
          <h2>Quiz Complete!</h2>
          <div className="quiz-result-score">
            <div className="score-display">
              <span className="score-value">{quizScore}</span>
              <span className="score-total">out of {totalQuestions}</span>
            </div>
            <div className="score-percentage">
              <span className="percentage-value">{percentage}%</span>
            </div>
          </div>

          <div className="quiz-result-message">
            {percentage === 100 && <p>🎉 Perfect score! Amazing work!</p>}
            {percentage >= 80 && percentage < 100 && <p>🌟 Great job! Keep it up!</p>}
            {percentage >= 60 && percentage < 80 && <p>😊 Good effort! Practice more to improve.</p>}
            {percentage < 60 && <p>💪 Keep practicing! You'll improve with more attempts.</p>}
          </div>

          <div className="buttons-group">
            <button
              className="btn-primary"
              onClick={() => {
                setQuizQuestions([]);
                setCurrentStep('category-selection');
              }}
            >
              Try Another Quiz
            </button>
            <button
              className="btn-secondary"
              onClick={onExit}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default QuizSection;
