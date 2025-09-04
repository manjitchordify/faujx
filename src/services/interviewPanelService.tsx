import { getAuthAxiosConfig, getAuthToken } from '@/utils/apiHeader';
import axios, { AxiosError } from 'axios';

// TypeScript interfaces for List API response
export interface Interview {
  id: string;
  candidateName: string;
  candidateEmail: string;
  scheduledSlotTime: string;
  interviewStatus: string;
  myAction: string;
}

export interface InterviewListPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface InterviewListSorting {
  sortBy: string;
  sortOrder: string;
}

export interface InterviewListResponse {
  data: Interview[];
  pagination: InterviewListPagination;
  sorting: InterviewListSorting;
}

// TypeScript interfaces for Details API response
export interface AttendeeInfo {
  email: string;
  interviewerName: string;
}

export interface AttendeeStatus {
  action: string;
  note: string | null;
  rating: number | null;
}

export interface Attendee {
  [key: string]: AttendeeInfo | AttendeeStatus;
  status: AttendeeStatus;
}

export interface InterviewDetails {
  myAction: string;
  candidateName: string;
  candidateEmail: string;
  resumeUrl: string | null;
  candidateReport: string | null;
  scheduledDateandTime: string;
  meetingLink: string;
  interviewstatus: string;
  attendees: Attendee[];
  candidateRole: string;
  userId?: string;
}

// Query parameters interface for list API
export interface InterviewListParams {
  page?: number;
  limit?: number;
  myAction?: 'pending' | 'confirmed' | 'rejected' | 'completed' | string;
  sortBy?: 'candidateName' | 'scheduledAt' | 'createdAt' | string;
  sortOrder?: 'ASC' | 'DESC';
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

/**
 * Get list of interviews for interview panel
 */
export const getInterviewPanelInterviews = async (
  params?: InterviewListParams
): Promise<InterviewListResponse> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };

    // Build query parameters
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.myAction) queryParams.append('myAction', params.myAction);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const queryString = queryParams.toString();
    const url = queryString
      ? `https://devapi.faujx.com/api/interview-panel/interviews/list?${queryString}`
      : 'https://devapi.faujx.com/api/interview-panel/interviews/list';

    const response = await axios.get(url, config);
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

/**
 * Get specific interview details
 */
export const getInterviewDetails = async (
  interviewId: string
): Promise<InterviewDetails> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(
      `https://devapi.faujx.com/api/interview-panel/interviews/details/${interviewId}`,
      config
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

/**
 * Confirm an interview
 */
export const confirmInterview = async (
  interviewId: string
): Promise<{ message: string; status?: string }> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.post(
      `https://devapi.faujx.com/api/interview-panel/interviews/${interviewId}/confirm`,
      {},
      config
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

/**
 * Reject an interview
 */
export const rejectInterview = async (
  interviewId: string,
  reason?: string
): Promise<{ message: string; status?: string }> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };

    const payload = reason ? { reason } : {};

    const response = await axios.post(
      `https://devapi.faujx.com/api/interview-panel/interviews/${interviewId}/reject`,
      payload,
      config
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

/**
 * Submit interview feedback
 */
export const submitInterviewFeedback = async (
  interviewId: string,
  feedbackData: {
    message: string;
    rating: number;
  }
): Promise<{ message: string }> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.post(
      `https://devapi.faujx.com/api/interview-panel/interviews/${interviewId}/feedback`,
      feedbackData,
      config
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

export const interviewPanelService = {
  getInterviewPanelInterviews,
  getInterviewDetails,
  confirmInterview,
  rejectInterview,
  submitInterviewFeedback,
};
