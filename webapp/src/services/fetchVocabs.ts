import API from '../config/endpoints.json';
import { axiosInstance, handleError } from './types';
import type { ApiResponse, Vocab } from './types';

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

export default fetchVocabs;
