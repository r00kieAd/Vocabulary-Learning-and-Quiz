import API from '../config/endpoints.json';
import axios from 'axios';
// import { useGlobal } from '../utils/global_context'

async function pingServer() {
    const base = import.meta.env.VITE_API_BASE_URL;
    const ping = API.PING;
    const url = `${base}${ping}`
    alert(url);
    const options = {
        method: 'GET',
        url: url,
        headers: {
            "content-type": "application/json",
            "accept": "application/json"
        }
    }

    try {
        const response = await axios.request(options);
        const req_succeeded = response.status >= 200 && response.status < 300;
        if (req_succeeded) {
            // console.log(response.data);
            return {status: req_succeeded, resp: response.data};
        }
        return {status: req_succeeded, statusCode: response.status, resp: response.statusText}
    } catch (error) {
        const axiosError = error as import("axios").AxiosError;
        const message = (axiosError?.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data ? (axiosError.response.data as {message?: string}).message : undefined) || axiosError?.message || "Something went wrong";
        return {
            status: false,
            statusCode: axiosError?.response?.status || 500,
            resp: message
        };
    }
}

export default pingServer