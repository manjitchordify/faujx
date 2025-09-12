import { getAuthAxiosConfig, getAuthToken } from '@/utils/apiHeader';
import axios, { AxiosError } from 'axios';

// TypeScript interfaces for API responses and requests
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

// User registration interfaces
export interface RegisterUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  fullName: string;
  userType: 'interview_panel';
}

export interface RegisterUserResponse {
  userId: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  message?: string;
}

// Create panelist interfaces
export interface CreatePanelistRequest {
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
}

export interface CreatePanelistResponse {
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
  message?: string;
}

export interface AddPanelistFormData {
  // User registration data
  email: string;
  password: string;
  firstName: string;
  lastName: string;

  // Panelist specific data
  designation: string;
  department: string;
  seniorityLevel: string;
  availableTimings: AvailableTiming[];
  interviewTypes: string[];
  skills: string[];
  maxInterviewsPerDay: number;
  isActive: boolean;
  timezone: string;
}

// Utility Functions
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
    name: `${apiPanelist.user.firstName} ${apiPanelist.user.lastName}`,
    email: apiPanelist.user.email,
    total_interviews: 0, // This would come from another API call if available
    rating: 0, // This would come from another API call if available
    experience_years: 0, // This would need to be calculated or come from user profile
  };
};

// Service Functions

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

// Submit interview feedback
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

// Register user API call
export const registerUser = async (
  userData: RegisterUserRequest
): Promise<RegisterUserResponse> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    // For registration, we might not need auth token, but keeping consistent
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    config.headers = {
      ...config.headers,
      'Content-Type': 'application/json',
    };

    const response = await axios.post(
      'https://devapi.faujx.com/api/auth/register',
      userData,
      config
    );

    return {
      userId: response.data.userId || response.data.user?.id,
      user: response.data.user,
      message: response.data.message,
    };
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// Create panelist API call
export const createPanelist = async (
  panelistData: CreatePanelistRequest
): Promise<CreatePanelistResponse> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.post(
      'https://devapi.faujx.com/api/interview-panel',
      panelistData,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// Combined function to add a complete panelist (register + create panelist)
export const addPanelist = async (
  formData: AddPanelistFormData
): Promise<CreatePanelistResponse> => {
  try {
    // Step 1: Register the user
    const registrationData: RegisterUserRequest = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      fullName: `${formData.firstName} ${formData.lastName}`,
      userType: 'interview_panel',
    };

    const registrationResponse = await registerUser(registrationData);

    if (!registrationResponse.userId) {
      throw new Error('User registration failed - no userId returned');
    }

    // Step 2: Create panelist profile
    const panelistData: CreatePanelistRequest = {
      userId: registrationResponse.userId,
      designation: formData.designation,
      department: formData.department,
      seniorityLevel: formData.seniorityLevel,
      availableTimings: formData.availableTimings,
      interviewTypes: formData.interviewTypes,
      skills: formData.skills,
      maxInterviewsPerDay: formData.maxInterviewsPerDay,
      isActive: formData.isActive,
      timezone: formData.timezone,
    };

    const panelistResponse = await createPanelist(panelistData);

    return panelistResponse;
  } catch (error: unknown) {
    // Re-throw with proper error handling
    if (error && typeof error === 'object' && 'message' in error) {
      throw error;
    }
    throw {
      status: 0,
      message:
        error instanceof Error ? error.message : 'Failed to add panelist',
    };
  }
};

// Update panelist information
export const updatePanelist = async (
  panelistId: string,
  formData: AddPanelistFormData
): Promise<CreatePanelistResponse> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // Prepare update data for panelist
    const panelistUpdateData = {
      designation: formData.designation,
      department: formData.department,
      seniorityLevel: formData.seniorityLevel,
      availableTimings: formData.availableTimings,
      interviewTypes: formData.interviewTypes,
      skills: formData.skills,
      maxInterviewsPerDay: formData.maxInterviewsPerDay,
      isActive: formData.isActive,
      timezone: formData.timezone,
    };

    // Prepare user data if we need to update user information
    const userUpdateData: {
      firstName: string;
      lastName: string;
      fullName: string;
      email: string;
      password?: string;
    } = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      fullName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
    };

    // Only include password if it's provided (not empty)
    if (formData.password && formData.password.trim() !== '') {
      userUpdateData.password = formData.password;
    }

    // Step 1: Update panelist profile
    const panelistResponse = await axios.put(
      `https://devapi.faujx.com/api/interview-panel/${panelistId}`,
      panelistUpdateData,
      config
    );

    // Step 2: Update user information (if we have the user ID)
    // Note: You might need to get the userId from the panelist record first
    // or include it in the update request. This is a simplified version.
    try {
      // Get current panelist to find userId
      const currentPanelistResponse = await axios.get(
        `https://devapi.faujx.com/api/interview-panel/${panelistId}`,
        config
      );

      const userId = currentPanelistResponse.data.userId;

      if (userId) {
        await axios.put(
          `https://devapi.faujx.com/api/users/${userId}`,
          userUpdateData,
          config
        );
      }
    } catch (userUpdateError) {
      // Log user update error but don't fail the entire operation
      console.warn('Failed to update user information:', userUpdateError);
    }

    return panelistResponse.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// Update panelist status (activate/deactivate)
export const updatePanelistStatus = async (
  panelistId: string,
  isActive: boolean
): Promise<{ success: boolean; message: string }> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    await axios.patch(
      `https://devapi.faujx.com/api/interview-panel/${panelistId}/status`,
      { isActive },
      config
    );

    return {
      success: true,
      message: `Panelist ${isActive ? 'activated' : 'deactivated'} successfully`,
    };
  } catch (error: unknown) {
    // If PATCH to /status endpoint fails, try alternative approach
    try {
      await axios.put(
        `https://devapi.faujx.com/api/interview-panel/${panelistId}`,
        { isActive }
      );

      return {
        success: true,
        message: `Panelist ${isActive ? 'activated' : 'deactivated'} successfully`,
      };
    } catch {
      handleApiError(error);
    }
  }
};
