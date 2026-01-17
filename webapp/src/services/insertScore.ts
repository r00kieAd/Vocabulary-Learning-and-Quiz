import API from '../config/endpoints.json';
import { axiosInstance, handleError } from './types';
import type { ApiResponse, Score } from './types';

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

export default insertScore;
