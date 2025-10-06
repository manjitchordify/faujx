import { getAuthAxiosConfig } from '@/utils/apiHeader';
import axios, { AxiosResponse, AxiosError } from 'axios';
import {
  SubmitCodingTestParams,
  SubmitCodingTestParamsForAI,
  CodingTestSubmissionResponse,
  CodingTestSubmissionData,
  CodingTestAISubmissionResponse,
  FetchEvaluationParams,
  ApiError,
  CodingTestAIMLSubmissionResponse,
  SubmitCodingTestParamsForAIML,
} from '../types/codingTestTypes';
import { AI_API_BASE_URL } from '@/utils/apiHeader';

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
// Submit Coding Test API
// ----------------------
export async function submitCodingTestApi(
  params: SubmitCodingTestParams
): Promise<CodingTestSubmissionResponse> {
  try {
    const config = getAuthAxiosConfig();

    // Ensure the hardcoded token is included
    const response: AxiosResponse<CodingTestSubmissionResponse> =
      await axios.post('/candidates/submit-coding-test', params, config);

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function submitAIMLCodingTestApi(
  params: SubmitCodingTestParamsForAIML
): Promise<CodingTestSubmissionResponse> {
  try {
    const config = {
      ...getAuthAxiosConfig(),
      headers: {
        ...getAuthAxiosConfig().headers,
        'Content-Type': 'multipart/form-data', // override only for this call
      },
    };
    const formData = new FormData();
    params.files.forEach((file: File) => {
      formData.append('files', file);
    });
    formData.append('problem_statement', params.problem_statement);

    const response: AxiosResponse<CodingTestSubmissionResponse> =
      await axios.post('/candidates/submit-ml-coding-test', formData, config);

    // Store coding test submission data in localStorage if needed

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}
export async function submitCodingTestToAI(
  params: SubmitCodingTestParamsForAI
): Promise<CodingTestAISubmissionResponse> {
  try {
    const config = getAuthAxiosConfig();
    const response: AxiosResponse<CodingTestAISubmissionResponse> =
      await axios.post(
        `${AI_API_BASE_URL}/FBFS_analyze-assessment`,
        params,
        config
      );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function fetchAIMLCodingEvaluation(
  params: FetchEvaluationParams
): Promise<CodingTestAIMLSubmissionResponse> {
  try {
    const config = getAuthAxiosConfig();
    const response: AxiosResponse<CodingTestAIMLSubmissionResponse> =
      await axios.post('/candidates/evaluate-ml-coding-test', params, config);
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

// ----------------------
// Get Coding Test Submission API (Optional - if you need to fetch submission details)
// ----------------------
export async function getCodingTestSubmissionApi(
  submissionId: string
): Promise<CodingTestSubmissionData> {
  try {
    const config = getAuthAxiosConfig();
    const response: AxiosResponse<{ data: CodingTestSubmissionData }> =
      await axios.get(
        `/candidates/coding-test-submission/${submissionId}`,
        config
      );

    return response.data.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

// ----------------------
// Helper function to get stored coding test submission
// ----------------------
export function getStoredCodingTestSubmission(): CodingTestSubmissionData | null {
  try {
    const storedSubmission = localStorage.getItem('codingTestSubmission');
    return storedSubmission ? JSON.parse(storedSubmission) : null;
  } catch (error) {
    console.error('Error parsing stored coding test submission:', error);
    return null;
  }
}

// ----------------------
// Helper function to clear stored coding test submission
// ----------------------
export function clearStoredCodingTestSubmission(): void {
  localStorage.removeItem('codingTestSubmission');
}
