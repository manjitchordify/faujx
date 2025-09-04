import { getAuthAxiosConfig } from '@/utils/apiHeader';
import axios, { AxiosResponse, AxiosError } from 'axios';

// ----------------------
// Data Types
// ----------------------
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  link: string;
  duration: string | null;
  completed: boolean;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

// ----------------------
// Request Types
// ----------------------
export interface WatchVideoRequest {
  videoId: string;
  isPreliminaryVideoCompleted?: boolean;
}

// ----------------------
// Response Types
// ----------------------
export interface VideoSummaryResponse {
  success: boolean;
  message: string;
  data: {
    full_script: string;
    structured_script: Array<{
      section_name: string;
      content: string;
      duration_seconds: number;
      talking_points: string[];
    }>;
    opening_line: string;
    unique_value_proposition: string;
    key_achievements: string[];
    closing_statement: string;
    estimated_duration: string;
    word_count: number;
    speaking_pace: string;
    visual_cues: string[];
    emphasis_points: string[];
    candidate_name: string;
    current_role: string;
    years_of_experience: number;
    generation_timestamp: string;
  };
}

export interface ProfilePicUploadResponse {
  success: boolean;
  message: string;
  data?: {
    profilePicUrl?: string;
    [key: string]: unknown;
  };
}

export interface ProfileVideoUploadResponse {
  success: boolean;
  message: string;
  data?: {
    profileVideoUrl?: string;
    [key: string]: unknown;
  };
}

// Updated to match your actual API response structure
export interface GetAllVideosResponse {
  message: string;
  data: Video[];
  // Optional fields that might be included for pagination
  total?: number;
  page?: number;
  limit?: number;
}

export interface WatchVideoResponse {
  success: boolean;
  message: string;
  data?: {
    [key: string]: unknown;
  };
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
// Upload Profile Picture API
// ----------------------
export async function uploadProfilePicApi(
  file: File
): Promise<ProfilePicUploadResponse> {
  try {
    const config = getAuthAxiosConfig();

    const formData = new FormData();
    formData.append('file', file);

    const uploadConfig = {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      },
    };

    const response: AxiosResponse<ProfilePicUploadResponse> = await axios.post(
      '/users/profilePic',
      formData,
      uploadConfig
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

// ----------------------
// Upload Profile Video API
// ----------------------
export async function uploadProfileVideoApi(
  file: File | Blob
): Promise<ProfileVideoUploadResponse> {
  try {
    const config = getAuthAxiosConfig();

    const formData = new FormData();
    formData.append('file', file);

    const uploadConfig = {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      },
    };

    const response: AxiosResponse<ProfileVideoUploadResponse> =
      await axios.post('/users/profileVideo', formData, uploadConfig);

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

// ----------------------
// Get All Videos API
// ----------------------
export async function getAllVideosApi(): Promise<GetAllVideosResponse> {
  try {
    const config = getAuthAxiosConfig();

    const response: AxiosResponse<GetAllVideosResponse> = await axios.get(
      '/videos/all',
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

// ----------------------
// Watch Video API
// ----------------------
export async function watchVideoApi(
  payload: WatchVideoRequest
): Promise<WatchVideoResponse> {
  try {
    const config = getAuthAxiosConfig();

    const response: AxiosResponse<WatchVideoResponse> = await axios.post(
      '/videos/watch',
      payload,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

// ----------------------
// Get Video Summary API
// ----------------------
export async function getVideoSummaryApi(): Promise<string> {
  try {
    const config = getAuthAxiosConfig();

    const response: AxiosResponse<VideoSummaryResponse> = await axios.get(
      '/candidates/video-summary',
      config
    );

    // Return only the full_script as requested
    return response.data.data.full_script;
  } catch (error: unknown) {
    handleApiError(error);
  }
}
