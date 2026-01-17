import API from '../config/endpoints.json';
import { axiosInstance, handleError } from './types';
import type { ApiResponse, Score } from './types';

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

export default fetchHighScore;
