import { getAuthAxiosConfig, getAuthToken } from '@/utils/apiHeader';
import axios, { AxiosResponse, AxiosError } from 'axios';
import {
  GenerateCodingAssignmentsParams,
  CodingAssignmentsResponse,
  ApiError,
} from './codingAssignmentsTypes';

// ----------------------
// Common error handling
// ----------------------
function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    if (axiosError.response) {
      throw {
        status: axiosError.response.status,
        message: axiosError.response.data?.message || axiosError.message,
        data: axiosError.response.data,
      } as ApiError;
    } else if (axiosError.request) {
      throw {
        status: 0,
        message: 'Network error',
        code: 'NETWORK_ERROR',
      } as ApiError;
    } else {
      throw {
        status: 0,
        message: axiosError.message || 'Request setup error',
        code: 'REQUEST_ERROR',
      } as ApiError;
    }
  }

  throw {
    status: 0,
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  } as ApiError;
}

// ----------------------
// Generate Coding Assignments API
// ----------------------
export async function generateCodingAssignmentsApi(
  params: GenerateCodingAssignmentsParams
): Promise<CodingAssignmentsResponse> {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    // Ensure the token is included
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const baseUrl =
      'https://faujx-ai-dev.73eak0edvm4a2.us-east-2.cs.amazonlightsail.com';

    if (!baseUrl) {
      throw new Error(
        'NEXT_PUBLIC_API_GENERATE_MCQ_BASE_URL environment variable is not configured'
      );
    }

    const response: AxiosResponse<CodingAssignmentsResponse> = await axios.post(
      `${baseUrl}/generate-coding-assignments-s3`,
      params,
      config
    );

    // Store coding assignments data in localStorage if needed
    if (response.data) {
      localStorage.setItem('codingAssignments', JSON.stringify(response.data));
    }

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

// ----------------------
// Helper function to get stored coding assignments
// ----------------------
export function getStoredCodingAssignments(): CodingAssignmentsResponse | null {
  try {
    const storedAssignments = localStorage.getItem('codingAssignments');
    return storedAssignments ? JSON.parse(storedAssignments) : null;
  } catch (error) {
    console.error('Error parsing stored coding assignments:', error);
    return null;
  }
}

// ----------------------
// Helper function to clear stored coding assignments
// ----------------------
export function clearStoredCodingAssignments(): void {
  localStorage.removeItem('codingAssignments');
}
