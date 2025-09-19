import { getAuthAxiosConfig, getAuthToken } from '@/utils/apiHeader';
import axios, { AxiosError } from 'axios';

// Customer feedback interface
interface FeedbackService {
  rating: number;
  hireStatus: string;
  comments: string;
}

// Define proper response structure instead of using 'any'
interface FeedbackData {
  id: string;
  interviewId: string;
  rating: number;
  hireStatus: string;
  comments: string;
  createdAt?: string;
  updatedAt?: string;
}

interface FeedbackResponse {
  data?: FeedbackData;
  message: string;
}

interface InterviewDetailsData {
  id: string;
  candidateId: string;
  customerId: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

interface InterviewDetailsResponse {
  data?: InterviewDetailsData;
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

// POST - Submit customer interview feedback
export const submitCustomerInterviewFeedback = async (
  interviewId: string,
  feedback: FeedbackService
): Promise<FeedbackResponse> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.post(
      `https://devapi.faujx.com/api/customer/interviews/${interviewId}/feedback`,
      feedback,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// GET - Get interview details (if needed)
export const getInterviewDetails = async (
  interviewId: string
): Promise<InterviewDetailsResponse> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(
      `https://devapi.faujx.com/api/customer/interviews/${interviewId}`,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// Named export object to fix ESLint warning
const feedbackService = {
  submitCustomerInterviewFeedback,
  getInterviewDetails,
};

export default feedbackService;
