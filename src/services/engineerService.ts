import {
  getAuthAxiosConfig,
  getAuthToken,
  getUserFromCookie,
} from '@/utils/apiHeader';
import axios, { AxiosResponse, AxiosError } from 'axios';

// ----------------------
// Types for engineer profile
// ----------------------
export interface UpdateEngineerProfileParams {
  experienceYears: number;
  currentDesignation: string;
  currentCompany: string;
  expectedSalary: number;
  preferredLocations: string[];
  skills: string[];
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  roleId: string;
  isWillingToRelocate: boolean;
  isOpenToOtherLocations: boolean;
  relocationConfirmed: boolean;
  interviewSlot: string[]; // Array of time preferences like ["morning", "afternoon", "anytime"]
  workMode: string[]; // Array of work modes like ["remote", "hybrid", "onsite"]
  roleTitle: string;
  joiningPeriod: string; // Single joining period like "immediate", "1-month", etc.
  preferredMonthlySalary: string; // Monthly salary as string like "25k"
  currencyType: string; // Currency type like "INR", "USD", etc.
}

export interface EngineerProfile {
  id: string;
  userId: string;
  experienceYears: number;
  currentDesignation: string;
  currentCompany: string;
  expectedSalary: number;
  preferredLocations: string[];
  skills: string[];
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  roleId: string;
  isWillingToRelocate: boolean;
  isOpenToOtherLocations: boolean;
  relocationConfirmed: boolean;
  interviewSlot: string[];
  workMode: string[];
  roleTitle: string;
  joiningPeriod: string;
  preferredMonthlySalary: string;
  currencyType: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateEngineerProfileResponse {
  success: string;
  data: EngineerProfile;
  message?: string;
}

// ----------------------
// Common error interface
// ----------------------
export interface ApiError {
  status: number;
  message: string;
  data?: unknown;
  code?: string;
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
// Update Engineer Profile API
// ----------------------
export async function updateEngineerProfileApi(
  userId: string,
  params: UpdateEngineerProfileParams
): Promise<UpdateEngineerProfileResponse> {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();
    const userData = getUserFromCookie();
    // Ensure the hardcoded token is included
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<UpdateEngineerProfileResponse> =
      await axios.put(`/candidates/user/${userData?.id}`, params, config);

    // Optionally store updated profile in localStorage
    if (response.data.data) {
      localStorage.setItem(
        'engineerProfile',
        JSON.stringify(response.data.data)
      );
    }

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

// ----------------------
// Get Engineer Profile API (Optional - if you need to fetch profile)
// ----------------------
export async function getEngineerProfileApi(
  userId: string
): Promise<EngineerProfile> {
  try {
    const config = getAuthAxiosConfig();
    const response: AxiosResponse<{ data: EngineerProfile }> = await axios.get(
      `/candidates/user/${userId}`,
      config
    );

    return response.data.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

// ----------------------
// Helper function to get stored engineer profile
// ----------------------
export function getStoredEngineerProfile(): EngineerProfile | null {
  try {
    const storedProfile = localStorage.getItem('engineerProfile');
    return storedProfile ? JSON.parse(storedProfile) : null;
  } catch (error) {
    console.error('Error parsing stored engineer profile:', error);
    return null;
  }
}

// ----------------------
// Helper function to clear stored engineer profile
// ----------------------
export function clearStoredEngineerProfile(): void {
  localStorage.removeItem('engineerProfile');
}
