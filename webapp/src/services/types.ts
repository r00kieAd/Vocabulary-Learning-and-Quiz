import axios, { AxiosError } from 'axios';

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
   BASE SETUP
   ======================================== */

export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/* ========================================
   ERROR HANDLING
   ======================================== */

export const handleError = (error: unknown): ApiResponse<never> => {
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
