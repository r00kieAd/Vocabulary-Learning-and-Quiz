/**
 * Learned Words Service
 * Manages persistence of learned word IDs in localStorage
 */

const LEARNED_WORDS_KEY = 'vocab_learned_words';

/**
 * Get all learned word IDs
 */
export const getLearnedWordIds = (): Set<number> => {
  const stored = localStorage.getItem(LEARNED_WORDS_KEY);
  if (!stored) return new Set();
  
  try {
    const ids = JSON.parse(stored);
    return new Set(ids);
  } catch {
    return new Set();
  }
};

/**
 * Add a word ID to learned words
 */
export const addLearnedWord = (vocabId: number): void => {
  const learnedIds = getLearnedWordIds();
  learnedIds.add(vocabId);
  localStorage.setItem(LEARNED_WORDS_KEY, JSON.stringify(Array.from(learnedIds)));
};

/**
 * Remove a word ID from learned words
 */
export const removeLearnedWord = (vocabId: number): void => {
  const learnedIds = getLearnedWordIds();
  learnedIds.delete(vocabId);
  localStorage.setItem(LEARNED_WORDS_KEY, JSON.stringify(Array.from(learnedIds)));
};

/**
 * Clear all learned words
 */
export const clearLearnedWords = (): void => {
  localStorage.removeItem(LEARNED_WORDS_KEY);
};

/**
 * Get count of learned words
 */
export const getLearnedWordCount = (): number => {
  return getLearnedWordIds().size;
};

/**
 * Check if a word is learned
 */
export const isWordLearned = (vocabId: number): boolean => {
  return getLearnedWordIds().has(vocabId);
};

/**
 * Add multiple word IDs to learned words
 */
export const addMultipleLearnedWords = (vocabIds: number[]): void => {
  const learnedIds = getLearnedWordIds();
  vocabIds.forEach(id => learnedIds.add(id));
  localStorage.setItem(LEARNED_WORDS_KEY, JSON.stringify(Array.from(learnedIds)));
};

export default {
  getLearnedWordIds,
  addLearnedWord,
  removeLearnedWord,
  clearLearnedWords,
  getLearnedWordCount,
  isWordLearned,
  addMultipleLearnedWords,
};
