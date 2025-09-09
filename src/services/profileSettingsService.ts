import { getAuthAxiosConfig } from '@/utils/apiHeader';
import axios, { AxiosResponse, AxiosError } from 'axios';

// ----------------------
// Profile Settings Form Types
// ----------------------
export interface ProfileSettingsFormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  preferredLocations?: Array<string>;
  expectedSalary?: number | null;
}

// ----------------------
// Profile Update Request/Response Types
// ----------------------
export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  preferredLocations?: Array<string>;
  expectedSalary?: number | null;
}

export interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    preferredLocations: Array<string>;
    expectedSalary: number | null;
    updatedAt: string;
  };
}

// ----------------------
// Profile Get Response Types
// ----------------------
export interface ProfileGetResponse {
  message: string;
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    preferredLocations: Array<string> | null;
    candidate?: {
      expectedSalary: number;
    };
  };
}

// ----------------------
// Candidate Update Request/Response Types
// ----------------------
export interface CandidateUpdateRequest {
  preferredLocations?: Array<string>;
  expectedSalary?: number;
}

export interface CandidateUpdateResponse {
  experienceYears: number;
  currentDesignation: string;
  currentCompany: string;
  expectedSalary: number;
  preferredLocations: Array<string>;
  skills: Array<string>;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  roleId: string;
  isWillingToRelocate: boolean;
  isOpenToOtherLocations: boolean;
  relocationConfirmed: boolean;
  interviewSlot: Array<string>;
  workMode: Array<string>;
  roleTitle: string;
  joiningPeriod: string;
  preferredMonthlySalary: string;
  currencyType: string;
  profileStep: number;
}

// ----------------------
// API Error Types
// ----------------------
export interface ProfileApiError {
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
      } as ProfileApiError;
    } else if (axiosError.request) {
      throw {
        status: 0,
        message: 'Network error',
        code: 'NETWORK_ERROR',
      } as ProfileApiError;
    } else {
      throw {
        status: 0,
        message: axiosError.message || 'Request setup error',
        code: 'REQUEST_ERROR',
      } as ProfileApiError;
    }
  }
  throw {
    status: 0,
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  } as ProfileApiError;
}

// ----------------------
// Get Profile API - auth/profile endpoint
// ----------------------
export async function getProfileApi(): Promise<ProfileGetResponse> {
  try {
    const config = getAuthAxiosConfig();
    const response: AxiosResponse<ProfileGetResponse> = await axios.get(
      '/auth/profile',
      config
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

// ----------------------
// Update Candidate API - /api/candidates endpoint
// ----------------------
export async function updateCandidateApi(
  candidateData: CandidateUpdateRequest
): Promise<CandidateUpdateResponse> {
  try {
    const config = getAuthAxiosConfig();
    const response: AxiosResponse<CandidateUpdateResponse> = await axios.put(
      '/candidates/user',
      candidateData,
      config
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}
