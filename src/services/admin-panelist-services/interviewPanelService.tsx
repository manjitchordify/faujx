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
  comments?: string;
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

export interface DashboardStats {
  totalInterviews: number;
  pendingInterviews: number;
  confirmedInterviews: number;
  completedInterviews: number;
  rejectedInterviews: number;
  transferredInterviews: number;
}

// Interface for available panelists - Updated to match actual API response
export interface AvailablePanelist {
  id: string;
  userId: string;
  designation: string;
  department: string;
  seniorityLevel: string;
  availableTimings: Array<{
    day: string;
    endTime: string;
    timezone: string;
    startTime: string;
  }>;
  interviewTypes: string[];
  skills: string[];
  maxInterviewsPerDay: number;
  isActive: boolean;
  timezone: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string | null;
    phone: string | null;
    profilePic: string | null;
    profilePicKey: string | null;
    profileVideoKey: string | null;
    profileVideo: string | null;
    dateOfBirth: string | null;
    location: string | null;
    country: string | null;
    passwordHash: string;
    userType: string;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    resetToken: string | null;
    resetTokenExpiry: string | null;
    googleId: string | null;
    verificationToken: string | null;
    verificationTokenExpiry: string | null;
    isSubscribed: boolean;
    subscribedAt: string | null;
    isPremium: boolean;
    premiumSince: string | null;
    premiumUntil: string | null;
    currentSubscriptionId: string | null;
  };
}

// Type alias for available panelists response - API returns array directly
export type AvailablePanelistsResponse = AvailablePanelist[];

// Interface for transfer interview response
export interface TransferInterviewResponse {
  message: string;
  status?: string;
}

// Interview feedback interfaces - Updated to include comments
export interface InterviewFeedbackData {
  feedback: Record<string, number>;
  rating: number;
  evaluationStatus: string;
  comments: string;
}

export interface InterviewFeedbackResponse {
  id: string;
  interviewId: string;
  feedback: string;
  rating: number;
  submittedAt: string;
  message: string;
}

// Query parameters interface for list API
export interface InterviewListParams {
  page?: number;
  limit?: number;
  myAction?:
    | 'pending'
    | 'confirmed'
    | 'rejected'
    | 'completed'
    | 'transferred'
    | string;
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
 * Get available panelists for transfer - NO PARAMETERS
 */
export const getAvailablePanelists =
  async (): Promise<AvailablePanelistsResponse> => {
    try {
      const config = getAuthAxiosConfig();
      const token = getAuthToken();

      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        'https://devapi.faujx.com/api/interview-panel',
        config
      );
      return response.data;
    } catch (error: unknown) {
      handleApiError(error);
    }
  };

/**
 * Transfer interview to another panelist
 * Updated to match API specification: POST /api/interview-panel/interviews/transfer/{interviewId}
 * Body: { newPanelId: string }
 */
export const transferInterview = async (
  interviewId: string,
  panelistId: string
): Promise<TransferInterviewResponse> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };

    const payload = {
      newPanelId: panelistId,
    };

    const response = await axios.post(
      `https://devapi.faujx.com/api/interview-panel/interviews/transfer/${interviewId}`,
      payload,
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
 * Submit interview feedback - Updated to include comments field
 */
export const submitInterviewFeedback = async (
  interviewId: string,
  feedbackData: InterviewFeedbackData
): Promise<InterviewFeedbackResponse> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const requestBody = {
      feedback: JSON.stringify(feedbackData.feedback),
      rating: feedbackData.rating,
      evaluationStatus: feedbackData.evaluationStatus,
      comments: feedbackData.comments,
    };

    console.log('Submitting feedback for interview:', interviewId);
    console.log('Feedback data:', requestBody);

    // Updated URL to include interviewId as query parameter
    const response = await axios.post(
      `https://devapi.faujx.com/api/interview-panel/interviewer-feedback?interviewId=${interviewId}`,
      requestBody, // Send feedback, rating, evaluationStatus, and comments in body
      config
    );

    console.log('Feedback submission response:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('Error submitting feedback:', error);
    handleApiError(error);
  }
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(
      'https://devapi.faujx.com/api/interview-panel/dashboard/stats',
      config
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

export const interviewPanelService = {
  getInterviewPanelInterviews,
  getDashboardStats,
  getInterviewDetails,
  getAvailablePanelists,
  transferInterview,
  confirmInterview,
  rejectInterview,
  submitInterviewFeedback,
};
