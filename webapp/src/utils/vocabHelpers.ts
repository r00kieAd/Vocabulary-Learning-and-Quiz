/**
 * Calculate default word count based on total available
 */
export const getDefaultWordCount = (totalAvailable: number): number => {
  const DEFAULT_COUNT = 10;
  return totalAvailable >= DEFAULT_COUNT ? DEFAULT_COUNT : totalAvailable;
};

/**
 * Get all word types with their counts
 */
export interface WordTypeOption {
  label: string;
  type: string;
  count: number;
}

export const formatWordTypeLabel = (wordType: string): string => {
  return wordType.charAt(0).toUpperCase() + wordType.slice(1);
};
