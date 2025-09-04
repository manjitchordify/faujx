import { getAuthAxiosConfig, getAuthToken } from '@/utils/apiHeader';
import axios, { AxiosError } from 'axios';

// TypeScript interfaces for API responses
export interface AvailableTiming {
  day: string;
  startTime: string;
  endTime: string;
  timezone: string;
}

// User interface for panelist listing
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string | null;
  phone: string;
  profilePic: string | null;
  profilePicKey: string | null;
  profileVideoKey: string | null;
  profileVideo: string | null;
  dateOfBirth: string;
  location: string;
  country: string | null;
  userType: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isSubscribed: boolean;
  subscribedAt: string | null;
  isPremium: boolean;
  premiumSince: string | null;
  premiumUntil: string | null;
  currentSubscriptionId: string | null;
}

// Panelist interface for listing (matches API response structure)
export interface PanelistFromAPI {
  id: string;
  userId: string;
  designation: string;
  department: string;
  seniorityLevel: string;
  availableTimings: AvailableTiming[];
  interviewTypes: string[];
  skills: string[];
  maxInterviewsPerDay: number;
  isActive: boolean;
  timezone: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

// Transformed panelist interface for UI consumption
export interface Panelist {
  id: string;
  user_id: string;
  designation: string;
  department: string;
  seniority_level: 'junior' | 'mid' | 'senior' | 'principal' | 'staff';
  available_timings: AvailableTiming[];
  interview_types: string[];
  skills: string[];
  max_interviews_per_day: number;
  is_active: boolean;
  timezone: string;
  created_at: string;
  updated_at: string;
  // Additional fields for display
  name?: string;
  email?: string;
  avatar?: string;
  total_interviews?: number;
  rating?: number;
  experience_years?: number;
}

// Interview List Interface - Updated to include resume fields
export interface Interview {
  id: string;
  candidate_name: string;
  interview_date: string;
  interview_time: string;
  position: string;
  status:
    | 'scheduled'
    | 'completed'
    | 'cancelled'
    | 'in_progress'
    | 'pending'
    | 'confirmed'
    | 'rejected';
  interview_type: string;
  duration: number;
  meeting_link?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  resumeUrl?: string; // Added new field
  resumeKey?: string; // Added new field
}

export interface InterviewListResponse {
  interviews: Interview[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Interface for interview status update responses
export interface InterviewStatusUpdateResponse {
  id: string;
  status: string;
  message: string;
  updatedAt: string;
}

// Interview feedback interfaces
export interface InterviewFeedbackData {
  feedback: Record<string, number>;
  rating: number;
  evaluationStatus: string;
}

export interface InterviewFeedbackResponse {
  id: string;
  interviewId: string;
  feedback: string;
  rating: number;
  submittedAt: string;
  message: string;
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

// Transform API response to UI format
const transformPanelistForUI = (apiPanelist: PanelistFromAPI): Panelist => {
  return {
    id: apiPanelist.id,
    user_id: apiPanelist.userId,
    designation: apiPanelist.designation,
    department: apiPanelist.department,
    seniority_level: apiPanelist.seniorityLevel as Panelist['seniority_level'],
    available_timings: apiPanelist.availableTimings,
    interview_types: apiPanelist.interviewTypes,
    skills: apiPanelist.skills,
    max_interviews_per_day: apiPanelist.maxInterviewsPerDay,
    is_active: apiPanelist.isActive,
    timezone: apiPanelist.timezone,
    created_at: apiPanelist.createdAt,
    updated_at: apiPanelist.updatedAt,
    // Transform user data for display
    name:
      apiPanelist.user.fullName ||
      `${apiPanelist.user.firstName} ${apiPanelist.user.lastName}`,
    email: apiPanelist.user.email,
    total_interviews: 0, // This would come from another API call if available
    rating: 0, // This would come from another API call if available
    experience_years: 0, // This would need to be calculated or come from user profile
  };
};

// Get all panelists
export const getAllPanelists = async (
  page: number = 1,
  limit: number = 10,
  filters?: {
    department?: string;
    seniorityLevel?: string;
    isActive?: boolean;
    search?: string;
  }
): Promise<{
  panelists: Panelist[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };

    // Build query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    // Add filters if provided
    if (filters) {
      if (filters.department && filters.department !== 'all') {
        params.append('department', filters.department);
      }
      if (filters.seniorityLevel && filters.seniorityLevel !== 'all') {
        params.append('seniorityLevel', filters.seniorityLevel);
      }
      if (filters.isActive !== undefined) {
        params.append('isActive', filters.isActive.toString());
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
    }

    const response = await axios.get(
      `https://devapi.faujx.com/api/interview-panel?${params.toString()}`,
      config
    );

    // Handle different response structures
    let panelistsData: PanelistFromAPI[];
    let total = 0;
    let totalPages = 1;

    if (Array.isArray(response.data)) {
      // If response is direct array
      panelistsData = response.data;
      total = panelistsData.length;
      totalPages = Math.ceil(total / limit);
    } else if (response.data.panelists) {
      // If response is wrapped in object
      panelistsData = response.data.panelists;
      total = response.data.total || panelistsData.length;
      totalPages = response.data.totalPages || Math.ceil(total / limit);
    } else {
      // Fallback
      panelistsData = [];
    }

    // Transform API response to UI format
    const transformedPanelists = panelistsData.map(transformPanelistForUI);

    return {
      panelists: transformedPanelists,
      total,
      page,
      limit,
      totalPages,
    };
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// Get panelist by ID
export const getPanelistById = async (id: string): Promise<Panelist> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(
      `https://devapi.faujx.com/api/interview-panel/${id}`,
      config
    );

    return transformPanelistForUI(response.data);
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// Get interview panel interviews list - UPDATED with proper pagination and parameter handling
export const getInterviewPanelInterviews = async (
  page: number = 1,
  limit: number = 10,
  myAction?: string // Changed from status to myAction to match frontend usage
): Promise<InterviewListResponse | Interview[]> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };

    // Build query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    // Map myAction to appropriate API parameter
    if (myAction) {
      // Based on your API endpoints, the parameter should be 'myAction'
      // Valid values: 'confirmed', 'completed', 'pending', 'no_action'
      params.append('myAction', myAction);
    }

    const apiUrl = `https://devapi.faujx.com/api/interview-panel/interviews/list?${params.toString()}`;
    console.log('API Call:', apiUrl);
    console.log('Parameters:', { page, limit, myAction });

    const response = await axios.get(apiUrl, config);

    console.log('Raw API Response:', response.data);
    console.log(
      'Response type:',
      Array.isArray(response.data) ? 'Array' : 'Object'
    );

    // Handle the case where API returns array directly
    if (Array.isArray(response.data)) {
      console.log(
        'API returned direct array with',
        response.data.length,
        'items'
      );
      return response.data; // Return the array directly
    }

    // If it returns the structured response, return as is
    if (response.data && typeof response.data === 'object') {
      console.log('API returned structured response');

      // Log the structure to help debug
      console.log('Response keys:', Object.keys(response.data));

      if ('interviews' in response.data) {
        console.log(
          'Found interviews array with',
          response.data.interviews?.length || 0,
          'items'
        );
        console.log('Total count:', response.data.total);
        console.log('Total pages:', response.data.totalPages);
      } else if ('data' in response.data) {
        console.log(
          'Found data array with',
          response.data.data?.length || 0,
          'items'
        );
      }

      return response.data;
    }

    // Fallback: return empty array
    console.warn('API returned unexpected format, returning empty array');
    return [];
  } catch (error: unknown) {
    console.error('API Error in getInterviewPanelInterviews:', error);

    // Log additional error details for debugging
    if (axios.isAxiosError(error)) {
      console.error('Request config:', error.config);
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
    }

    handleApiError(error);
  }
};

// Confirm interview - NEW API
export const confirmInterview = async (
  interviewId: string
): Promise<InterviewStatusUpdateResponse> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };

    console.log('Confirming interview:', interviewId);

    const response = await axios.post(
      `https://devapi.faujx.com/api/interview-panel/interviews/${interviewId}/confirm`,
      {}, // Empty body for POST request
      config
    );

    console.log('Confirm interview response:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('Error confirming interview:', error);
    handleApiError(error);
  }
};

// Reject interview - NEW API
export const rejectInterview = async (
  interviewId: string
): Promise<InterviewStatusUpdateResponse> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };

    console.log('Rejecting interview:', interviewId);

    const response = await axios.post(
      `https://devapi.faujx.com/api/interview-panel/interviews/${interviewId}/reject`,
      {}, // Empty body for POST request
      config
    );

    console.log('Reject interview response:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('Error rejecting interview:', error);
    handleApiError(error);
  }
};

// Submit interview feedback - NEW API
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
    };

    console.log('Submitting feedback for interview:', interviewId);
    console.log('Feedback data:', requestBody);

    // Updated URL to include interviewId as query parameter
    const response = await axios.post(
      `https://devapi.faujx.com/api/interview-panel/interviewer-feedback?interviewId=${interviewId}`,
      requestBody, // Send only feedback and rating in body
      config
    );

    console.log('Feedback submission response:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('Error submitting feedback:', error);
    handleApiError(error);
  }
};
