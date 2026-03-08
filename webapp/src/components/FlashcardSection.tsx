import React, { useState, useEffect } from 'react';
import { useUsername } from '../hooks/useUsername';
import { getVocabTypes, getVocabCountByType, getWordsByType, getAllVocabs, type VocabWord } from '../services/vocabTypes';
import { getDefaultWordCount, formatWordTypeLabel } from '../utils/vocabHelpers';
import { getLearnedWordCount, getLearnedWordIds } from '../services/learnedWords';
import FlashcardScreen from './FlashcardScreen';

interface FlashcardSectionProps {
  onExit: () => void;
}

type FlowStep = 'username' | 'type-selection' | 'count-selection' | 'flashcard';

export const FlashcardSection: React.FC<FlashcardSectionProps> = ({ onExit }) => {
  const {
    username,
    isLoading: usernameLoading,
    showUsernameModal,
    usernameInput,
    setUsernameInput,
    handleInitialUsername,
    handleUsernameConfirm,
    handleUsernameCancel,
    handleRename,
  } = useUsername();

  const [currentStep, setCurrentStep] = useState<FlowStep>('username');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Word type selection state
  const [wordTypes, setWordTypes] = useState<string[]>([]);
  const [typeCounts, setTypeCounts] = useState<Record<string, number>>({});
  const [selectedType, setSelectedType] = useState<string>('all');
  const [learnedWordsCount, setLearnedWordsCount] = useState(0);

  // Word count selection state
  const [selectedCount, setSelectedCount] = useState(0);
  const [maxCount, setMaxCount] = useState(0);

  // Flashcard data
  const [flashcardWords, setFlashcardWords] = useState<VocabWord[]>([]);

  // Move to type selection after username is set
  useEffect(() => {
    if (!usernameLoading && username && currentStep === 'username') {
      setCurrentStep('type-selection');
      fetchWordTypesAndCounts();
    }
  }, [usernameLoading, username, currentStep]);

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
      setSelectedType('all');
      setMaxCount(totalCount);
      setSelectedCount(getDefaultWordCount(totalCount));

      // Get learned words count
      const learnedCount = getLearnedWordCount();
      setLearnedWordsCount(learnedCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load word types');
    } finally {
      setLoading(false);
    }
  };

  // Handle type selection change
  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    let count = 0;

    if (type === 'all') {
      count = Object.values(typeCounts).reduce((a, b) => a + b, 0);
    } else if (type === 'learned') {
      count = learnedWordsCount;
    } else {
      count = typeCounts[type] || 0;
    }

    setMaxCount(count);
    setSelectedCount(getDefaultWordCount(count));
  };

  // Handle count change
  const handleCountChange = (count: number) => {
    const boundedCount = Math.min(Math.max(1, count), maxCount);
    setSelectedCount(boundedCount);
  };

  // Start flashcard mode
  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      let words: VocabWord[] = [];

      if (selectedType === 'learned') {
        const learnedIds = getLearnedWordIds();
        if (learnedIds.size === 0) {
          setError('No learned words yet. Start by learning new words!');
          setLoading(false);
          return;
        }

        const allWords = await getAllVocabs();
        words = allWords
          .filter(word => learnedIds.has(word.id))
          .slice(0, selectedCount);
      } else if (selectedType === 'all') {
        // For "All", we need to fetch from each type and combine
        const typePromises = wordTypes.map((type) =>
          getWordsByType(type, selectedCount).catch(() => [])
        );
        const typeResults = await Promise.all(typePromises);
        words = typeResults.flat();
        // Limit to selectedCount if we have duplicate logic
        words = words.slice(0, selectedCount);
      } else {
        words = await getWordsByType(selectedType, selectedCount);
      }

      if (words.length === 0) {
        setError('No words found for this selection');
        return;
      }

      setFlashcardWords(words);
      setCurrentStep('flashcard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load words');
    } finally {
      setLoading(false);
    }
  };

  // Render loading state
  if (usernameLoading) {
    return (
      <div className="flashcard-section-loader">
        <div className="loader-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Username modal
  if (!username && currentStep === 'username') {
    return (
      <>
        <div className="flashcard-section-prompt">
          <div className="prompt-card">
            <h2>Welcome to Flashcard Mode</h2>
            <p>Let's get started! What's your name?</p>
            <div className="buttons-group">
              <button
                className="btn-primary"
                onClick={() => handleInitialUsername()}
              >
                Enter Name
              </button>
              <button className="btn-secondary" onClick={onExit}>
                Back
              </button>
            </div>
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

  // Type selection screen
  if (currentStep === 'type-selection') {
    return (
      <>
        <div className="flashcard-section">
          <div className="flashcard-section-header">
            {loading ? "please wait..." : error ? <><i className="fa-solid fa-bug" style={{ color: "rgb(194, 99, 85)" }}>&nbsp;E&nbsp;rr&nbsp;or</i></> : <>
              <h2>Let's flip some cards, {username}!</h2>
              <button className="btn-link" onClick={() => handleRename()}>
                <i className="fa-solid fa-user-pen"></i>
              </button></>}
          </div>

          <div className="flashcard-section-content">
            {loading ? (
              <div className="loader">
                <div className="loader-spinner"></div>
                <p>Loading word types...</p>
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
                <h3>Select Word Type</h3>
                <div className="word-type-options">
                  {/* All button */}
                  <label className="word-type-option">
                    <input
                      type="radio"
                      name="word-type"
                      value="all"
                      checked={selectedType === 'all'}
                      onChange={(e) => handleTypeChange(e.target.value)}
                    />
                    <span className="label-text">
                      <span className="type-name">All</span>
                      <span className="type-count">
                        ({Object.values(typeCounts).reduce((a, b) => a + b, 0)})
                      </span>
                    </span>
                  </label>

                  {/* Word type buttons */}
                  {wordTypes.map((type) => (
                    <label key={type} className="word-type-option">
                      <input
                        type="radio"
                        name="word-type"
                        value={type}
                        checked={selectedType === type}
                        onChange={(e) => handleTypeChange(e.target.value)}
                      />
                      <span className="label-text">
                        <span className="type-name">{formatWordTypeLabel(type)}</span>
                        <span className="type-count">({typeCounts[type] || 0})</span>
                      </span>
                    </label>
                  ))}

                  {/* Learned Words separator and option */}
                  <div className="category-separator"></div>

                  <label className="word-type-option">
                    <input
                      type="radio"
                      name="word-type"
                      value="learned"
                      checked={selectedType === 'learned'}
                      onChange={() => handleTypeChange('learned')}
                    />
                    <span className="label-text">
                      <span className="type-name">Learned Words</span>
                      <span className="type-count">({learnedWordsCount})</span>
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

        {/* Username Rename Modal */}
        {showUsernameModal && (
          <div className="modal-overlay">
            <div className="modal-content username-modal">
              <h3>Update Your Name</h3>
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

  // Count selection screen
  if (currentStep === 'count-selection') {
    return (
      <div className="flashcard-section">
        <div className="flashcard-section-header">
          <h2>How many words to study?</h2>
        </div>

        <div className="flashcard-section-content">
          <div className="count-selection">
            <div className="count-display">
              <label>Words to Study</label>
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
              {loading ? 'Starting...' : 'Start Flashcards'}
            </button>
            <button
              className="btn-secondary"
              onClick={() => setCurrentStep('type-selection')}
              disabled={loading}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Flashcard screen
  if (currentStep === 'flashcard') {
    return (
      <FlashcardScreen
        questions={flashcardWords.map((word) => ({
          vocabId: word.id,
          word: word.word,
          wordType: word.word_type,
          meaning: word.meaning,
          example: word.example,
        }))}
        onFinish={() => {
          setFlashcardWords([]);
          setCurrentStep('type-selection');
          // Refresh learned words count when returning from flashcards
          const updatedCount = getLearnedWordCount();
          setLearnedWordsCount(updatedCount);
        }}
        onClearLearned={() => {
          setFlashcardWords([]);
          setCurrentStep('type-selection');
        }}
        learnedCount={learnedWordsCount}
        totalCount={flashcardWords.length}
      />
    );
  }

  return null;
};

export default FlashcardSection;
