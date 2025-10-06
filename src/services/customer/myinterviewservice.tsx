import { getAuthAxiosConfig } from '@/utils/apiHeader';
import axios, { AxiosError } from 'axios';

// TypeScript interfaces for My Interviews
export interface Candidate {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string | null;
  phone: string;
  profilePic: string;
  profilePicKey: string;
  profileVideoKey: string;
  profileVideo: string;
  dateOfBirth: string | null;
  location: string | null;
  country: string | null;
  passwordHash: string;
  userType: string;
  currentStatus: string;
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
}

export interface InterviewDetails {
  id: string;
  startTime: string;
  endTime: string;
  status:
    | 'scheduled'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'rescheduled';
  createdAt: string;
  updatedAt: string;
  hireStatus: string;
  meetingId: string | null;
  meetingLink: string | null;
  candidate: Candidate;
}

export interface MyInterviewsResponse {
  scheduled: InterviewDetails[];
  completed: InterviewDetails[];
}

export interface InterviewStats {
  total: number;
  scheduled: number;
  completed: number;
  cancelled: number;
  rescheduled: number;
  inProgress: number;
  upcomingThisWeek: number;
  completedThisMonth: number;
}

export interface InterviewFeedback {
  rating?: number;
  comments?: string;
  strengths?: string[];
  areasForImprovement?: string[];
  recommendation?: 'hire' | 'no_hire' | 'maybe';
  technicalSkillsRating?: number;
  communicationRating?: number;
  problemSolvingRating?: number;
  culturalFitRating?: number;
}

export interface UpdateInterviewStatusRequest {
  status:
    | 'scheduled'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'rescheduled';
  notes?: string;
}

export interface SubmitInterviewFeedbackRequest {
  rating?: number;
  comments?: string;
  strengths?: string[];
  areasForImprovement?: string[];
  recommendation?: 'hire' | 'no_hire' | 'maybe';
  technicalSkillsRating?: number;
  communicationRating?: number;
  problemSolvingRating?: number;
  culturalFitRating?: number;
}

// New interfaces for pending slots
export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
}

export interface PendingSlotGroup {
  slotGroupId: string;
  customer: Customer;
  createdAt: string;
  slots: TimeSlot[];
}

export type PendingSlotsResponse = PendingSlotGroup[];

// Interface for confirm slot request
export interface ConfirmSlotRequest {
  slotId: string;
}

// Interface for confirm slot response (you can adjust this based on your actual API response)
export interface ConfirmSlotResponse {
  success: boolean;
  message: string;
  interviewId?: string;
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

// GET interview statistics
export const getInterviewStats = async (): Promise<InterviewStats> => {
  try {
    const config = getAuthAxiosConfig();
    const response = await axios.get(`/customer/interviews/stats`, config);

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// GET single interview by ID
export const getInterviewById = async (
  interviewId: string
): Promise<InterviewDetails> => {
  try {
    const config = getAuthAxiosConfig();
    const response = await axios.get(
      `/customer/interviews/${interviewId}`,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// GET pending interview slots
export const getPendingSlots = async (): Promise<PendingSlotsResponse> => {
  try {
    const config = getAuthAxiosConfig();
    const response = await axios.get(
      `/customer/interviews/pending-slots`,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// POST confirm interview slot
export const confirmInterviewSlot = async (
  slotId: string
): Promise<ConfirmSlotResponse> => {
  try {
    const config = getAuthAxiosConfig();
    const requestBody: ConfirmSlotRequest = {
      slotId,
    };

    const response = await axios.post(
      `/customer/interviews/confirm-slot`,
      requestBody,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// PATCH update interview status
export const updateInterviewStatus = async (
  interviewId: string,
  statusData: UpdateInterviewStatusRequest
): Promise<InterviewDetails> => {
  try {
    const config = getAuthAxiosConfig();
    const response = await axios.patch(
      `/customer/interviews/${interviewId}/status`,
      statusData,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// POST submit interview feedback
export const submitInterviewFeedback = async (
  interviewId: string,
  feedbackData: SubmitInterviewFeedbackRequest
): Promise<InterviewDetails> => {
  try {
    const config = getAuthAxiosConfig();
    const response = await axios.post(
      `/customer/interviews/${interviewId}/feedback`,
      feedbackData,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// DELETE interview
export const deleteInterview = async (interviewId: string): Promise<void> => {
  try {
    const config = getAuthAxiosConfig();
    await axios.delete(`/customer/interviews/${interviewId}`, config);
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// GET upcoming interviews (next 7 days)
export const getUpcomingInterviews = async (
  limit: number = 5
): Promise<InterviewDetails[]> => {
  try {
    const config = getAuthAxiosConfig();

    const response = await axios.get(
      `/customer/interviews/upcoming?limit=${limit}`,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// Helper functions for common operations

// Mark interview as completed
export const markInterviewCompleted = async (
  interviewId: string,
  notes?: string
): Promise<InterviewDetails> => {
  return updateInterviewStatus(interviewId, {
    status: 'completed',
    notes,
  });
};

// Cancel interview
export const cancelInterview = async (
  interviewId: string,
  reason?: string
): Promise<InterviewDetails> => {
  return updateInterviewStatus(interviewId, {
    status: 'cancelled',
    notes: reason,
  });
};

// Start interview (mark as in progress)
export const startInterview = async (
  interviewId: string
): Promise<InterviewDetails> => {
  return updateInterviewStatus(interviewId, {
    status: 'in_progress',
  });
};
