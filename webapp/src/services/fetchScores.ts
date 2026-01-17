import API from '../config/endpoints.json';
import { axiosInstance, handleError } from './types';
import type { ApiResponse, Score } from './types';

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

export default fetchScores;
