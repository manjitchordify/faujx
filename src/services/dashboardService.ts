import { getAuthAxiosConfig } from '@/utils/apiHeader';
import axios, { AxiosResponse, AxiosError } from 'axios';

// ----------------------
// Response Types
// ----------------------
export interface DashboardCounts {
  candidates: number;
  favorites: number;
  shortlisted: number;
  scheduled: number;
  interviewed: number;
  hired: number;
}

export interface DashboardResponse {
  counts: DashboardCounts;
}

// ----------------------
// API Error Type
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
// Get Dashboard Counts API
// ----------------------
export async function getDashboardCountsApi(): Promise<DashboardResponse> {
  try {
    const config = getAuthAxiosConfig();

    const response: AxiosResponse<DashboardResponse> = await axios.get(
      '/customer/dashboard',
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}
