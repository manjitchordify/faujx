import { getAuthAxiosConfig } from '@/utils/apiHeader';
import axios, { AxiosError } from 'axios';

export interface CandidateProfile {
  id: string;
  roleTitle: string | null;
}

export interface Candidate {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string | null;
  phone: string;
  profilePic: string | null;
  location: string | null;
  candidate?: CandidateProfile;
}

export interface InterviewDetails {
  id: string;
  startTime: string;
  endTime: string;
  meetingLink: string;
  meeetingId: string;
  interviewScore?: number;
  interviewResult?: string;
  candidate: Candidate;
}

export interface MyInterviewsResponse {
  scheduled: InterviewDetails[];
  completed: InterviewDetails[];
}

// Error handling function
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

// GET all interviews for the current user
export const getMyInterviews = async (): Promise<MyInterviewsResponse> => {
  try {
    const config = getAuthAxiosConfig();
    const response = await axios.get(`/customer/interviews`, config);

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};
