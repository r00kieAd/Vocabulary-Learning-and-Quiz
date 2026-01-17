import API from '../config/endpoints.json';
import { axiosInstance, handleError } from './types';
import type { ApiResponse } from './types';

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

export default pingServer;
