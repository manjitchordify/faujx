import { getAuthAxiosConfig, getAuthToken } from '@/utils/apiHeader';
import axios, { AxiosError } from 'axios';

// TypeScript interfaces for Schedule Interview API
export interface ScheduleInterviewRequest {
  candidateId: string; // This should be the user.id, not the profile id
  startTime: string; // ISO date string format
  endTime: string; // ISO date string format
}

// Define proper response structure instead of using 'any'
export interface InterviewData {
  id: string;
  candidateId: string;
  customerId: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ScheduleInterviewResponse {
  data?: InterviewData;
  message: string;
}

// Error handling function
function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      message?: string;
      error?: string;
    }>;
    throw {
      status: axiosError.response?.status || 0,
      message:
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        axiosError.message ||
        'Network error',
    };
  }
  throw {
    status: 0,
    message: 'An unexpected error occurred',
  };
}

// POST - Schedule an interview with a candidate
export const scheduleInterview = async (
  interviewData: ScheduleInterviewRequest
): Promise<ScheduleInterviewResponse> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.post(
      'https://devapi.faujx.com/api/customer/interviews/schedule',
      interviewData,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// Named export object to fix ESLint warning
const interviewService = {
  scheduleInterview,
};

export default interviewService;
