import { getAuthAxiosConfig } from '@/utils/apiHeader';
import axios, { AxiosResponse, AxiosError } from 'axios';

// ----------------------
// Types for expert profile
// ----------------------
export interface UpdateProfileParams {
  role?: string;
  rating?: number;
  skills?: string[];
  experience?: string;
  price?: number;
  profilePic?: string;
  availableSlots?: string[];
  isAvailable?: boolean;
}

export interface ExpertProfile {
  id: string;
  role: string;
  rating: number;
  skills: string[];
  experience: string;
  price: number;
  profilePic?: string;
  availableSlots: string[];
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileResponse {
  message: string;
  data: {
    profile: ExpertProfile;
  };
}

// ----------------------
// Types for resume upload
// ----------------------
export interface ResumeUploadResponse {
  message: string;
  data: {
    resumeUrl: string;
    fileName: string;
    fileSize: number;
    uploadedAt: string;
  };
}

// ----------------------
// Types for profile picture upload
// ----------------------
export interface ProfilePicUploadResponse {
  message: string;
  data: {
    profilePicUrl: string;
    fileName: string;
    fileSize: number;
    uploadedAt: string;
  };
}

// ----------------------
// Types for intro video upload
// ----------------------
export interface IntroVideoUploadResponse {
  message: string;
  data: {
    introVideoUrl: string;
    fileName: string;
    fileSize: number;
    duration?: number;
    uploadedAt: string;
  };
}

// ----------------------
// Error interface
// ----------------------
export interface ApiError {
  status: number;
  message: string;
  data?: unknown;
  code?: string;
}

// ----------------------
// Error handling
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
// Update Expert Profile API
// ----------------------
export async function updateExpertProfile(
  params: UpdateProfileParams
): Promise<UpdateProfileResponse> {
  try {
    const config = getAuthAxiosConfig();
    const response: AxiosResponse<UpdateProfileResponse> = await axios.put(
      'experts/update-profile',
      params,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

// ----------------------
// Upload Resume API
// ----------------------
export async function uploadResume(file: File): Promise<ResumeUploadResponse> {
  try {
    const config = getAuthAxiosConfig();

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', file);

    // Update config for multipart/form-data
    const uploadConfig = {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      },
    };

    const response: AxiosResponse<ResumeUploadResponse> = await axios.post(
      'experts/resume',
      formData,
      uploadConfig
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

// ----------------------
// Upload Profile Picture API
// ----------------------
export async function uploadProfilePic(
  file: File
): Promise<ProfilePicUploadResponse> {
  try {
    const config = getAuthAxiosConfig();

    // Validate file type for images
    const allowedImageTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];
    if (!allowedImageTypes.includes(file.type)) {
      throw {
        status: 400,
        message:
          'Invalid file type. Please upload a valid image file (JPEG, PNG, or WebP)',
        code: 'INVALID_FILE_TYPE',
      } as ApiError;
    }

    // Validate file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw {
        status: 400,
        message: 'File size too large. Maximum size allowed is 5MB',
        code: 'FILE_TOO_LARGE',
      } as ApiError;
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', file);

    // Update config for multipart/form-data
    const uploadConfig = {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      },
    };

    const response: AxiosResponse<ProfilePicUploadResponse> = await axios.post(
      'experts/upload-profile-pic',
      formData,
      uploadConfig
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

// ----------------------
// Upload Intro Video API
// ----------------------
export async function uploadIntroVideo(
  file: File
): Promise<IntroVideoUploadResponse> {
  try {
    const config = getAuthAxiosConfig();

    // Validate file type for videos
    const allowedVideoTypes = [
      'video/mp4',
      'video/mpeg',
      'video/quicktime',
      'video/webm',
      'video/ogg',
    ];
    if (!allowedVideoTypes.includes(file.type)) {
      throw {
        status: 400,
        message:
          'Invalid file type. Please upload a valid video file (MP4, MOV, WebM, or OGG)',
        code: 'INVALID_FILE_TYPE',
      } as ApiError;
    }

    // Validate file size (e.g., max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw {
        status: 400,
        message: 'File size too large. Maximum size allowed is 50MB',
        code: 'FILE_TOO_LARGE',
      } as ApiError;
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', file);

    // Update config for multipart/form-data
    const uploadConfig = {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      },
    };

    const response: AxiosResponse<IntroVideoUploadResponse> = await axios.post(
      'experts/upload-intro-video',
      formData,
      uploadConfig
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}
