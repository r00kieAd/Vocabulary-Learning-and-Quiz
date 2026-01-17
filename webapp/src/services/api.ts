import axios, { AxiosError } from 'axios';
import API from '../config/endpoints.json';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/* ========================================
   TYPES
   ======================================== */

export interface Vocab {
  id: number;
  word: string;
  word_type: string;
  meaning: string;
  example: string;
  created_at: string;
  updated_at: string;
}

export interface Score {
  id: number;
  high_score: number;
  high_scorer: string;
  date_created: string;
}

export interface ApiResponse<T> {
  status: boolean;
  statusCode?: number;
  data?: T;
  resp?: string;
}

/* ========================================
   ERROR HANDLING
   ======================================== */

const handleError = (error: unknown): ApiResponse<never> => {
  const axiosError = error as AxiosError;
  let message = 'Something went wrong';

  if (
    axiosError?.response?.data &&
    typeof axiosError.response.data === 'object' &&
    'message' in axiosError.response.data
  ) {
    const msg = (axiosError.response.data as { message?: string }).message;
    if (typeof msg === 'string') {
      message = msg;
    }
  } else if (typeof axiosError?.message === 'string') {
    message = axiosError.message;
  }

  return {
    status: false,
    statusCode: axiosError?.response?.status || 500,
    resp: message,
  };
};

/* ========================================
   API CALLS
   ======================================== */

/**
 * Ping the server to check if it's alive
 */
export async function pingServer(): Promise<ApiResponse<{ status: string }>> {
  try {
    const response = await axiosInstance.get(API.PING);
    const req_succeeded = response.status >= 200 && response.status < 300;
    if (req_succeeded) {
      return { status: true, data: response.data };
    }
    return {
      status: false,
      statusCode: response.status,
      resp: response.statusText,
    };
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Fetch all vocabularies
 */
export async function fetchVocabs(): Promise<ApiResponse<Vocab[]>> {
  try {
    const response = await axiosInstance.get<Vocab[]>(API.VOCABS);
    const req_succeeded = response.status >= 200 && response.status < 300;
    if (req_succeeded && Array.isArray(response.data)) {
      return { status: true, data: response.data };
    }
    return {
      status: false,
      statusCode: response.status,
      resp: 'Failed to fetch vocabularies',
    };
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Fetch all scores
 */
export async function fetchScores(): Promise<ApiResponse<Score[]>> {
  try {
    const response = await axiosInstance.get<Score[]>(API.SCORES);
    const req_succeeded = response.status >= 200 && response.status < 300;
    if (req_succeeded && Array.isArray(response.data)) {
      return { status: true, data: response.data };
    }
    return {
      status: false,
      statusCode: response.status,
      resp: 'Failed to fetch scores',
    };
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Fetch the high score
 */
export async function fetchHighScore(): Promise<ApiResponse<Score>> {
  try {
    const response = await axiosInstance.get<Score>(API.HIGH_SCORE);
    const req_succeeded = response.status >= 200 && response.status < 300;
    if (req_succeeded) {
      return { status: true, data: response.data };
    }
    return {
      status: false,
      statusCode: response.status,
      resp: 'Failed to fetch high score',
    };
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Insert a new score
 */
export async function insertScore(
  high_score: number,
  high_scorer: string
): Promise<ApiResponse<Score>> {
  try {
    const response = await axiosInstance.post<Score>(
      API.INSERT_SCORE,
      {
        high_score,
        high_scorer,
      }
    );
    const req_succeeded = response.status >= 200 && response.status < 300;
    if (req_succeeded) {
      return { status: true, data: response.data };
    }
    return {
      status: false,
      statusCode: response.status,
      resp: 'Failed to insert score',
    };
  } catch (error) {
    return handleError(error);
  }
}
