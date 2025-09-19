import { getAuthAxiosConfig, getAuthToken } from '@/utils/apiHeader';
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
  hireStatus: 'pending' | 'hired' | 'rejected' | 'shortlisted';
  codingTests: CodingTest[];
  mcqSubmissions: McqSubmission[];
}

// Interface for API response
export interface ShortlistedProfileResponse {
  data?: ShortlistedCandidateProfile;
  message?: string;
  status?: string;
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

/**
 * Get shortlisted candidate profile by profile ID
 * Returns profile data including user.id needed for interview scheduling
 */
export const getShortlistedCandidateProfile = async (
  profileId: string // This is the profile ID from URL params
): Promise<ShortlistedCandidateProfile> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };

    console.log(`Fetching profile for profileId: ${profileId}`);

    const response = await axios.get(
      `https://devapi.faujx.com/api/customer/shortlisted/${profileId}`,
      config
    );

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

      console.log(
        `Profile fetched successfully. User ID: ${profileData.user.id}`
      );
      return profileData;
    }

    throw new Error('Invalid response structure');
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// Export the service
export const shortlistedProfileService = {
  getShortlistedCandidateProfile,
};

export default shortlistedProfileService;
