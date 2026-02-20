import API from '../config/endpoints.json';
import { axiosInstance, handleError } from './types';
import type { ApiResponse, AIChatResponse } from './types';


export async function getAnswers(
    prompt: string,
    word: string,
    word_type: string,
    meaning: string,
    example: string,
    instruction: string
): Promise<ApiResponse<AIChatResponse>> {
    try {
        const response = await axiosInstance.post<AIChatResponse>(
            API.GET_ANSWER,
            {
                prompt,
                word,
                word_type,
                meaning,
                example,
                instruction
            }
        );
        const req_succeeded = response.status >= 200 && response.status < 300;
        if (req_succeeded) {
            console.log(`AI Response: ${response.data}`);
            return { status: true, data: response.data };
        }
        return {
            status: false,
            statusCode: response.status,
            resp: 'Failed to get answer',
        };
    } catch (error) {
        return handleError(error);
    }
}

export default getAnswers;
