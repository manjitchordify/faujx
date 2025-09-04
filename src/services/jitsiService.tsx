import axios, { AxiosError } from 'axios';
import { getAuthAxiosConfig } from '@/utils/apiHeader';
import { showToast } from '@/utils/toast/Toast';

export interface LiveSessionTokenRequest {
  role: string;
  sessionId: string;
}

export interface LiveParams {
  userId: string;
  sessionId: string;
  role: string;
}

export interface LiveUrlResponse {
  url: string;
  jwt: string;
}

function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw {
      status: axiosError.response?.status || 0,
      message:
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Network error',
    };
  }
  throw {
    status: 0,
    message: 'An unexpected error occurred',
  };
}

export async function jitsiLiveUrl(
  params: LiveParams
): Promise<LiveUrlResponse> {
  try {
    const config = getAuthAxiosConfig();

    // The API returns the jwt and url directly
    const response = await axios.post<LiveUrlResponse>(
      '/live-session/token',
      params,
      config
    );
    const responseData = response.data;
    if (!responseData?.url || !responseData?.jwt) {
      showToast('Missing URL or JWT token in server response.', 'error');
      throw {
        status: 500,
        message: 'Invalid server response: missing URL or JWT token',
      };
    }

    return responseData;
  } catch (error: unknown) {
    handleApiError(error);
  }
}
