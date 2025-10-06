import { getAuthAxiosConfig } from '@/utils/apiHeader';
import axios, { AxiosResponse, AxiosError } from 'axios';

// ----------------------
// Data Types
// ----------------------
export interface HiredCandidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hireDate: string;
  interviewFeedback: string | null;
  interviewDate: string;
  candidateRole: string;
  profilePic: string | null;
  userId: string; // Added userId field
}

// Detailed candidate response types
export interface UserDetails {
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
  dateOfBirth: string | null;
  location: string | null;
  country: string | null;
  userType: string;
  currentStatus: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isSubscribed: boolean;
  subscribedAt: string | null;
  isPremium: boolean;
  premiumSince: string | null;
  premiumUntil: string | null;
  companyWebsite: string | null;
  companyName: string | null;
  candidate: CandidateDetails;
}

export interface CandidateDetails {
  id: string;
  userId: string;
  preferredMonthlySalary: string;
  currencyType: string;
  workMode: string[];
  experienceYears: number;
  currentDesignation: string;
  currentCompany: string;
  expectedSalary: number;
  preferredLocations: string[];
  interviewSlot: string[];
  skills: string[];
  resumeUrl: string;
  resumeKey: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  vettingStatus: string;
  vettingScore: number;
  roleTitle: string;
  joiningPeriod: string;
  isWillingToRelocate: boolean;
  isOpenToOtherLocations: boolean;
  relocationConfirmed: boolean;
  phone: string;
  location: string;
  websiteUrl: string;
  isPreliminaryVideoCompleted: boolean;
  summary: string;
  category: string;
  resumeParseScore: number;
  parsedEducation: ParsedEducation[];
  parsedExperience: ParsedExperience[];
  parsedProjects: ParsedProject[];
  parsedSkills: ParsedSkills;
  resumeParsedAt: string;
  resumeParseErrors: ResumeParseError[];
  missingFields: string[];
  profileStages: {
    lastStage: string;
    lastStatus: string;
  };
  createdAt: string;
  updatedAt: string;
  codingTestLink: string | null;
  codingTestFiles: string | null;
  isWatched: number;
  profileStep: number;
  isPublished: boolean;
  isHired: boolean;
  phase1Completed: boolean;
}

export interface ParsedEducation {
  gpa: string | null;
  year: string;
  field: string | null;
  degree: string;
  honors: string[];
  location: string | null;
  institution: string | null;
}

export interface ParsedExperience {
  title: string;
  company: string;
  end_date: string;
  start_date: string;
  description: string;
}

export interface ParsedProject {
  title: string;
  description: string;
  technologies: string[];
}

export interface ParsedSkills {
  soft: string[];
  tools: string[];
  languages: string[];
  technical: string[];
  frameworks: string[];
  certifications: string[];
  specializations: string[];
  area_of_expertise: string[];
  project_management: string[];
}

export interface ResumeParseError {
  field?: string;
  message: string;
  code?: string;
  severity?: 'error' | 'warning' | 'info';
}

export interface HiredCandidateDetailsResponse {
  candidate: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    hireDate: string;
    interviewFeedback: string | null;
    interviewDate: string;
    userDetails: UserDetails;
    candidateDetails: CandidateDetails;
    interviewId: string;
    meetingLink: string;
    status: string;
  };
}

// ----------------------
// Request Types
// ----------------------
export interface GetHiredCandidatesRequest {
  page?: number;
  limit?: number;
}

// ----------------------
// Response Types
// ----------------------
export interface GetHiredCandidatesResponse {
  candidates: HiredCandidate[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  data?: unknown;
}

// ----------------------
// Common error handling
// ----------------------
function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    if (axiosError.response) {
      throw {
        status: axiosError.response.status,
        message: axiosError.response.data?.message || axiosError.message,
        data: axiosError.response.data,
      } as ApiError;
    } else if (axiosError.request) {
      throw {
        status: 0,
        message: 'Network error',
        code: 'NETWORK_ERROR',
      } as ApiError;
    } else {
      throw {
        status: 0,
        message: axiosError.message || 'Request setup error',
        code: 'REQUEST_ERROR',
      } as ApiError;
    }
  }
  throw {
    status: 0,
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  } as ApiError;
}

// ----------------------
// Get Hired Candidates API
// ----------------------
export async function getHiredCandidatesApi(
  params: GetHiredCandidatesRequest = {}
): Promise<GetHiredCandidatesResponse> {
  try {
    const config = getAuthAxiosConfig();

    // Build query parameters
    const queryParams = new URLSearchParams();
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    const url = `/customer/hired-candidates${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response: AxiosResponse<GetHiredCandidatesResponse> = await axios.get(
      url,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

// ----------------------
// Get Hired Candidate Details API
// ----------------------
export async function getHiredCandidateDetailsApi(
  userId: string
): Promise<HiredCandidateDetailsResponse> {
  try {
    const config = getAuthAxiosConfig();

    const url = `/customer/hired-candidates/${userId}`;

    const response: AxiosResponse<HiredCandidateDetailsResponse> =
      await axios.get(url, config);

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}
