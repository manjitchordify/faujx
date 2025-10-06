import { McqUserResponse, resumeDataType } from '@/types/mcq';
import { getAuthAxiosConfig } from '@/utils/apiHeader';
import axios, { AxiosError } from 'axios';
import { AI_API_BASE_URL } from '@/utils/apiHeader';

// Enhanced error interface for better error handling
interface ApiError {
  status: number;
  message: string;
  code?: string;
  data?: unknown;
}

function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      message?: string;
      error?: string;
    }>;

    if (axiosError.response) {
      // Server responded with error status
      const status = axiosError.response.status;
      let message =
        axiosError.response.data?.message || axiosError.response.data?.error;

      // Provide user-friendly messages for common errors
      switch (status) {
        case 502:
          message =
            'Server is temporarily unavailable. Please try again in a few moments.';
          break;
        case 503:
          message = 'Service temporarily unavailable. Please try again later.';
          break;
        case 429:
          message =
            'Too many requests. Please wait a moment before trying again.';
          break;
        case 500:
          message = 'Internal server error. Please try again later.';
          break;
        case 400:
          message =
            message ||
            'Invalid request. Please check your input and try again.';
          break;
        case 401:
          message = 'Authentication required. Please log in again.';
          break;
        case 403:
          message = 'You do not have permission to access this resource.';
          break;
        case 404:
          message =
            'Service not found. Please contact support if this persists.';
          break;
        default:
          message = message || `Server error (${status}). Please try again.`;
      }

      throw {
        status,
        message,
        data: axiosError.response.data,
      } as ApiError;
    } else if (axiosError.request) {
      throw {
        status: 0,
        message:
          'Network connection issue. Please check your internet connection and try again.',
        code: 'NETWORK_ERROR',
      } as ApiError;
    } else {
      throw {
        status: 0,
        message: 'Request configuration error. Please try again.',
        code: 'REQUEST_ERROR',
      } as ApiError;
    }
  }
  throw {
    status: 0,
    message: 'An unexpected error occurred. Please try again.',
    code: 'UNKNOWN_ERROR',
  } as ApiError;
}

const REQUEST_TIMEOUT = 60000;

export const getUserMCQSubmission = async (userId: string) => {
  try {
    const config = {
      ...getAuthAxiosConfig(),
      timeout: REQUEST_TIMEOUT,
    };

    const res = await axios.get(`/mcq/submissions/${userId}`, config);
    return res.data;
  } catch (error: unknown) {
    console.error('Error fetching MCQ submission:', error);
    handleApiError(error);
  }
};

export const generateMCQs = async (payload: {
  jd_s3_key: string;
  resume_data: resumeDataType;
  num_questions: number;
  session_id?: string;
}) => {
  try {
    // Add retry logic specifically for 502 errors
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const res = await axios.post(
          `${AI_API_BASE_URL}/generate-mcqs-s3`,
          payload,
          {
            timeout: REQUEST_TIMEOUT,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        return res.data;
      } catch (error: unknown) {
        const shouldRetry =
          axios.isAxiosError(error) &&
          (error.response?.status === 502 ||
            error.response?.status === 503 ||
            !error.response); // Network error

        if (shouldRetry && attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          console.log(
            `Retrying MCQ generation in ${delay}ms (attempt ${attempt}/${maxRetries})`
          );
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // If we can't retry or this is the last attempt, throw the error
        throw error;
      }
    }

    // This should never be reached due to the logic above, but TypeScript needs it
    throw new Error('Maximum retry attempts exceeded');
  } catch (error: unknown) {
    console.error('Error generating MCQs:', error);
    handleApiError(error);
  }
};

export const submitMCQs = async (payload: McqUserResponse[]) => {
  try {
    const config = {
      ...getAuthAxiosConfig(),
      timeout: REQUEST_TIMEOUT,
    };

    const res = await axios.post(`/mcq/submit`, { questions: payload }, config);
    return res.data;
  } catch (error: unknown) {
    console.error('Error submitting MCQs:', error);
    handleApiError(error);
  }
};
