import { axiosInstance } from './types';
import API from '../config/endpoints.json';

export interface VocabType {
  word_type: string;
  count: number;
}

export interface VocabWord {
  id: number;
  word: string;
  word_type: string;
  meaning: string;
  example: string;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch all unique vocabulary word types
 * GET /vocabs/read/vocab_types
 */
export const getVocabTypes = async (): Promise<string[]> => {
  try {
    const response = await axiosInstance.get<{ word_types: string[] }>(
      API.VOCAB_TYPES
    );
    return response.data.word_types || [];
  } catch (error) {
    console.error('Error fetching vocab types:', error);
    throw error;
  }
};

/**
 * Get count of words for a specific word type
 * GET /vocabs/read/count/:word_type
 */
export const getVocabCountByType = async (wordType: string): Promise<VocabType> => {
  try {
    const endpoint = API.VOCAB_TYPE_COUNT.replace('{word_type}', wordType);
    const response = await axiosInstance.get<VocabType>(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Error fetching count for ${wordType}:`, error);
    throw error;
  }
};

/**
 * Get vocabulary words by type, optionally limited by count
 * GET /vocabs/read/:word_type?word_count=<n>
 */
export const getWordsByType = async (
  wordType: string,
  wordCount?: number
): Promise<VocabWord[]> => {
  try {
    const endpoint = API.VOCAB_BY_TYPE.replace('{word_type}', wordType);
    const finalEndpoint = wordCount ? `${endpoint}${wordCount}` : endpoint;
    const response = await axiosInstance.get<VocabWord[]>(finalEndpoint);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching words for ${wordType}:`, error);
    throw error;
  }
};

/**
 * Fetch all words (no type filter)
 * GET /vocabs/read/
 */
export const getAllVocabs = async (wordCount?: number): Promise<VocabWord[]> => {
  try {
    let endpoint = API.VOCABS;
    if (wordCount) {
      endpoint = `${endpoint}?word_count=${wordCount}`;
    }
    const response = await axiosInstance.get<VocabWord[]>(endpoint);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching all vocabs:', error);
    throw error;
  }
};
