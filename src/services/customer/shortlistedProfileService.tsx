import { getAuthAxiosConfig } from '@/utils/apiHeader';
import axios, { AxiosError } from 'axios';

// TypeScript interface for User details
export interface CandidateUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string | null;
  phone: string;
  profilePic: string | null;
  profileVideo: string | null;
  location: string | null;
  country: string | null;
  createdAt: string;
  updatedAt: string;
}

// Interface for Coding Test results
export interface CodingTest {
  id: string;
  question: string;
  totalScore: number;
  evaluationResult: string;
}

// Interface for MCQ category performance
export interface CategoryPerformance {
  category: string;
  score: number;
  total: number;
}

// Interface for MCQ difficulty performance
export interface DifficultyPerformance {
  difficulty: string;
  score: number;
  total: number;
}

// Interface for MCQ Submissions
export interface McqSubmission {
  id: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  attemptedQuestions: number;
  totalTimeInMinutes: number;
  categoryPerformance: CategoryPerformance[];
  difficultyPerformance: DifficultyPerformance[];
  submittedAt: string;
}

interface Capability {
  id: string;
  score: number;
  matchPercentage: number;
  capabilityGapCount: number;
  hasStrongMatch: boolean;
  matchedCapabilities: string[];
  missingCapabilities: string[];
  explanation: string;
  jobTitle: string | null;
  analysisTimestamp: string; // ISO date string
  metadata: {
    jd_source?: string;
    top_skills?: string[];
    current_role?: string;
    candidate_email?: string;
    total_experience_years?: number;
  };
}

// Interface for Interview Preferences
export interface InterviewPreferences {
  preferredinterviewSlot: string[];
  joiningPeriod: string;
  isWillingToRelocate: boolean;
  relocationConfirmed: boolean;
  isOpenToOtherLocations: boolean;
  preferredLocations: string[];
  workMode: string[];
}

// Interface for Interview Slot
export interface InterviewSlot {
  startTime: string; // ISO datetime string
  endTime: string; // ISO datetime string
}

// Interface for Propose Slots Request
export interface ProposeInterviewSlotsRequest {
  candidateId: string;
  slots: InterviewSlot[];
}

// Interface for Propose Slots Response
export interface ProposeInterviewSlotsResponse {
  success: boolean;
  message: string;
  data?: {
    interviewId?: string;
    proposedSlots?: InterviewSlot[];
  };
}

// Interface for Slot Selection (for UI)
export interface SlotSelection {
  date: string; // formatted date
  time: string; // formatted time
  fullDateTime: Date; // full date object
}

// TypeScript interface for Shortlisted Candidate Profile
export interface ShortlistedCandidateProfile {
  id: string; // This is the profile ID
  roleTitle: string;
  summary: string;
  experienceYears: number;
  currentDesignation: string;
  currentCompany: string;
  preferredMonthlySalary: string | number;
  currencyType: string;
  workMode: string[];
  preferredLocations: string[];
  skills: string[];
  resumeUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  vettingStatus: string;
  vettingScore: number;
  expectedSalary: number;
  location: string;
  user: CandidateUser;
  capabilities: Capability[];
  InterviewScheduled: boolean;
  customerInterview: boolean;
  hireStatus: 'pending' | 'hired' | 'rejected' | 'shortlisted';
  codingTests: CodingTest[];
  mcqSubmissions: McqSubmission[];
  interviewPreferences: InterviewPreferences;
}

// Interface for API response
export interface ShortlistedProfileResponse {
  data?: ShortlistedCandidateProfile;
  message?: string;
  status?: string;
}

// Validation error interface
export interface ValidationError {
  field: string;
  message: string;
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
    message:
      error instanceof Error ? error.message : 'An unexpected error occurred',
  };
}

// Validation functions
export const validateInterviewSlots = (
  slots: SlotSelection[]
): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Check if exactly 3 slots are selected
  if (slots.length !== 3) {
    errors.push({
      field: 'slots',
      message: 'Please select exactly 3 interview slots',
    });
    return errors; // Early return if count is wrong
  }

  // Check each slot
  slots.forEach((slot, index) => {
    // Validate slot object structure
    if (!slot.fullDateTime || !(slot.fullDateTime instanceof Date)) {
      errors.push({
        field: `slot_${index}`,
        message: `Slot ${index + 1}: Invalid date/time format`,
      });
      return;
    }

    // Check if date is in the future (at least 1 hour from now)
    const now = new Date();
    const minimumTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    if (slot.fullDateTime <= minimumTime) {
      errors.push({
        field: `slot_${index}`,
        message: `Slot ${index + 1}: Please select a time at least 1 hour in the future`,
      });
    }

    // Check if it's during business hours (9 AM - 6 PM)
    const hours = slot.fullDateTime.getHours();
    if (hours < 9 || hours >= 18) {
      errors.push({
        field: `slot_${index}`,
        message: `Slot ${index + 1}: Please select a time between 9:00 AM and 6:00 PM`,
      });
    }

    // Check if it's a weekday (Monday to Friday)
    const dayOfWeek = slot.fullDateTime.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      errors.push({
        field: `slot_${index}`,
        message: `Slot ${index + 1}: Please select a weekday (Monday to Friday)`,
      });
    }
  });

  // Check for duplicate slots
  const uniqueSlots = new Set(
    slots.map(slot => slot.fullDateTime.toISOString())
  );
  if (uniqueSlots.size !== slots.length) {
    errors.push({
      field: 'slots',
      message: 'Please select different time slots (no duplicates allowed)',
    });
  }

  // Check minimum gap between slots (at least 1 hour)
  if (errors.length === 0) {
    // Only check gaps if all dates are valid
    const sortedSlots = [...slots].sort(
      (a, b) => a.fullDateTime.getTime() - b.fullDateTime.getTime()
    );
    for (let i = 0; i < sortedSlots.length - 1; i++) {
      const timeDiff =
        sortedSlots[i + 1].fullDateTime.getTime() -
        sortedSlots[i].fullDateTime.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      if (hoursDiff < 1) {
        errors.push({
          field: 'slots',
          message: 'Please ensure at least 1 hour gap between interview slots',
        });
        break;
      }
    }
  }

  return errors;
};

// Helper function to convert UI slot selection to API format
export const convertSlotsToApiFormat = (
  slots: SlotSelection[]
): InterviewSlot[] => {
  return slots.map(slot => {
    if (!(slot.fullDateTime instanceof Date)) {
      throw new Error(
        'Invalid slot format: fullDateTime must be a Date object'
      );
    }

    const startTime = new Date(slot.fullDateTime);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Add 1 hour

    return {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    };
  });
};

// Helper function to format date and time for display
export const formatSlotForDisplay = (slot: InterviewSlot): string => {
  try {
    const startDate = new Date(slot.startTime);
    const endDate = new Date(slot.endTime);

    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return 'Invalid date';
    }

    const dateStr = startDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const startTimeStr = startDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const endTimeStr = endDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return `${dateStr} from ${startTimeStr} to ${endTimeStr}`;
  } catch (error) {
    console.error('Error formatting slot for display:', error);
    return 'Invalid date format';
  }
};

/**
 * Get shortlisted candidate profile by profile ID
 * Returns profile data including user.id needed for interview scheduling
 */
export const getShortlistedCandidateProfile = async (
  profileId: string // This is the profile ID from URL params
): Promise<ShortlistedCandidateProfile> => {
  try {
    // Validate input
    if (
      !profileId ||
      typeof profileId !== 'string' ||
      profileId.trim() === ''
    ) {
      throw new Error('Profile ID is required and must be a valid string');
    }

    const config = getAuthAxiosConfig();

    console.log(`Fetching profile for profileId: ${profileId}`);

    const response = await axios.get(`/customer/shortlisted/${profileId}`, {
      ...config,
      timeout: 10000, // 10 second timeout
    });

    console.log('API Response:', response.data);

    // Handle different response structures
    if (response.data && typeof response.data === 'object') {
      let profileData: ShortlistedCandidateProfile;

      // If API returns data wrapped in an object
      if (response.data.data) {
        profileData = response.data.data;
      } else {
        // If API returns the profile directly
        profileData = response.data;
      }

      // Validate that we have the required user ID
      if (!profileData.user || !profileData.user.id) {
        throw new Error('Profile data is missing user information');
      }

      // Set default values for optional fields to prevent UI errors
      profileData.capabilities = profileData.capabilities || [];
      profileData.skills = profileData.skills || [];
      profileData.codingTests = profileData.codingTests || [];
      profileData.mcqSubmissions = profileData.mcqSubmissions || [];
      profileData.InterviewScheduled = profileData.InterviewScheduled || false;
      profileData.customerInterview = profileData.customerInterview || false;
      profileData.hireStatus = profileData.hireStatus || 'pending';

      console.log(
        `Profile fetched successfully. User ID: ${profileData.user.id}`
      );
      return profileData;
    }

    throw new Error('Invalid response structure from API');
  } catch (error: unknown) {
    console.error('Error fetching profile:', error);
    handleApiError(error);
  }
};

/**
 * Propose interview slots to a candidate
 * Requires exactly 3 slots as per API specification
 */
export const proposeInterviewSlots = async (
  candidateId: string,
  selectedSlots: SlotSelection[]
): Promise<ProposeInterviewSlotsResponse> => {
  try {
    // Validate input
    if (
      !candidateId ||
      typeof candidateId !== 'string' ||
      candidateId.trim() === ''
    ) {
      throw new Error('Candidate ID is required and must be a valid string');
    }

    if (!Array.isArray(selectedSlots)) {
      throw new Error('Selected slots must be an array');
    }

    // Validate slots
    const validationErrors = validateInterviewSlots(selectedSlots);
    if (validationErrors.length > 0) {
      throw new Error(
        `Validation failed: ${validationErrors.map(e => e.message).join(', ')}`
      );
    }

    // Convert slots to API format
    const apiSlots = convertSlotsToApiFormat(selectedSlots);

    // Prepare request payload
    const payload: ProposeInterviewSlotsRequest = {
      candidateId: candidateId.trim(),
      slots: apiSlots,
    };

    console.log('Proposing interview slots:', payload);

    // Get auth config
    const config = getAuthAxiosConfig();

    // Make API call
    const response = await axios.post(
      '/customer/interviews/propose-slots',
      payload,
      {
        ...config,
        timeout: 15000, // 15 second timeout
      }
    );

    console.log('Propose slots API Response:', response.data);

    // Handle successful response
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        message:
          response.data?.message || 'Interview slots proposed successfully',
        data: response.data?.data || {
          proposedSlots: apiSlots,
        },
      };
    } else {
      throw new Error(`API returned status ${response.status}`);
    }
  } catch (error: unknown) {
    console.error('Error proposing interview slots:', error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{
        message?: string;
        errors?: unknown;
      }>;

      const status = axiosError.response?.status;
      let message = 'Failed to propose interview slots';

      if (status === 400) {
        message = 'Invalid request data. Please check your selections.';
      } else if (status === 401) {
        message = 'Authentication failed. Please log in again.';
      } else if (status === 403) {
        message = 'You do not have permission to schedule interviews.';
      } else if (status === 404) {
        message = 'Candidate not found.';
      } else if (status === 429) {
        message = 'Too many requests. Please try again later.';
      } else if (status && status >= 500) {
        message = 'Server error. Please try again later.';
      }

      return {
        success: false,
        message: axiosError.response?.data?.message || message,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

// Export the service
export const shortlistedProfileService = {
  getShortlistedCandidateProfile,
  proposeInterviewSlots,
  validateInterviewSlots,
  convertSlotsToApiFormat,
  formatSlotForDisplay,
};

export default shortlistedProfileService;
