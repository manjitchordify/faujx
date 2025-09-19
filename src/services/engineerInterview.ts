import { getAuthAxiosConfig } from '@/utils/apiHeader';
import axios, { AxiosResponse, AxiosError } from 'axios';

// ----------------------
// Data Types
// ----------------------
export interface Candidate {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string | null;
  phone: string;
  profilePic?: string;
  profilePicKey?: string;
  profileVideo?: string;
  profileVideoKey?: string;
  dateOfBirth?: string | null;
  location?: string | null;
  country?: string | null;
  userType: string;
  currentStatus: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isSubscribed: boolean;
  subscribedAt?: string | null;
  isPremium: boolean;
  premiumSince?: string | null;
  premiumUntil?: string | null;
  currentSubscriptionId?: string | null;
}

export interface Customer extends Candidate {
  companyName?: string | null;
}

export interface Interview {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  hireStatus: string;
  meetingId?: string | null;
  meetingLink?: string | null;
  candidate: Candidate;
  customer: Customer;
  position?: string | null;
}

export interface MyInterviewsResponse {
  scheduled: Interview[];
  completed: Interview[];
}

// ----------------------
// Error Type
// ----------------------
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
// Get My Interviews API
// ----------------------
export async function getMyInterviewsApi(): Promise<MyInterviewsResponse> {
  try {
    const config = getAuthAxiosConfig();

    const response: AxiosResponse<MyInterviewsResponse> = await axios.get(
      '/customer/myInterviews',
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}
