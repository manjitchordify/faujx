import { getAuthAxiosConfig } from '@/utils/apiHeader';
import axios, { AxiosResponse, AxiosError } from 'axios';
import {
  ResumeUploadResponse,
  ResumeGetResponse,
  ResumeDeleteResponse,
  ApiError,
} from '@/types/resume.types';
import { AI_API_BASE_URL } from '@/utils/apiHeader';

// ----------------------
// Profile submission types
// ----------------------
export interface ProfileSubmissionData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  location?: string;
  currentDesignation?: string;
  currentCompany?: string;
  expectedSalary?: number | null;
  skills?: string[];
  experienceYears?: number | null;
  preferredLocations?: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  summary?: string;
  category?: string;
  websiteUrl?: string;
  experience?: Array<{
    title: string;
    company: string;
    start_date: string;
    end_date: string;
    description: string;
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    start_date: string;
    end_date: string;
    grade: string;
  }>;
  projects?: Array<{
    title: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
  resumeUrl?: string;
  resumeKey?: string;
  resumeParseScore?: number;
  vettingScore?: number;
  resumeParsedAt?: string;
  resumeParseErrors?: string[];
  watchedVideos?: Array<{
    title: string;
    description: string;
    link: string;
    kind: string;
  }>;
  isWatched?: number;
  isVetted?: number;
}

export interface ProfileSubmissionResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

// ----------------------
// Capability Matching Types
// ----------------------

// Define the resume data structure expected by the capability matching API
export interface ResumeDataForMatching {
  personal_info?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  experience?: Array<{
    title: string;
    company: string;
    duration?: string;
    start_date?: string;
    end_date?: string;
    description?: string;
    responsibilities?: string[];
    key_roles?: string[];
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    field?: string;
    year?: string;
    gpa?: string;
  }>;
  skills?: {
    technical?: string[];
    soft?: string[];
    tools?: string[];
    frameworks?: string[];
    languages?: string[];
    certifications?: string[];
  };
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    repository?: string;
    role?: string;
  }>;
  summary?: string;
  total_experience_years?: number;
  current_role?: string;
  [key: string]: unknown; // Allow for additional fields
}

export interface CapabilityMatchingRequest {
  jd_s3_key: string;
  resume_data: ResumeDataForMatching;
}

export interface CapabilityMatchingResponse {
  score: number;
  jd_capabilities: string[];
  resume_capabilities: string[];
  matched_capabilities: string[];
  missing_capabilities: string[];
  explanation: string;
  job_title: string | null;
  candidate_name: string;
  analysis_timestamp: string;
  metadata: {
    jd_source: string;
    candidate_email: string;
    current_role: string;
    top_skills: string[];
    total_experience_years: number;
  };
}
// ----------------------
// Submit Capabilities Types
// ----------------------
// Reusing CapabilityMatchingResponse since the structure is identical
export type SubmitCapabilitiesData = CapabilityMatchingResponse;

export interface SubmitCapabilitiesResponse {
  success: boolean;
  message: string;
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
// Upload Resume API - Candidate ID will be decoded from token on backend
// ----------------------
export async function uploadResumeApi(
  file: File
): Promise<ResumeUploadResponse> {
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

    const response: AxiosResponse<ResumeUploadResponse> = await axios.post(
      '/candidates/resume',
      formData,
      uploadConfig
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

// ----------------------
// Submit Profile API - Update missing profile fields
// ----------------------
export async function submitProfileApi(
  profileData: ProfileSubmissionData
): Promise<ProfileSubmissionResponse> {
  try {
    const config = getAuthAxiosConfig();

    const response: AxiosResponse<ProfileSubmissionResponse> = await axios.post(
      '/auth/submit-profile',
      profileData,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

// ----------------------
// Match Capabilities API - Analyze resume against job requirements
// ----------------------
export async function matchCapabilitiesApi(
  jdCandidate: string,
  resumeData: ResumeDataForMatching
): Promise<CapabilityMatchingResponse> {
  try {
    const config = getAuthAxiosConfig();

    const requestData: CapabilityMatchingRequest = {
      jd_s3_key: jdCandidate,
      resume_data: resumeData,
    };

    const response: AxiosResponse<CapabilityMatchingResponse> =
      await axios.post(
        `${AI_API_BASE_URL}/match-capabilities-s3`,
        requestData,
        config
      );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}
// ----------------------
// Submit Capabilities API - Store capability matching results (runs in background)
// ----------------------
export async function submitCapabilitiesApi(
  capabilityData: SubmitCapabilitiesData
): Promise<SubmitCapabilitiesResponse> {
  try {
    const config = getAuthAxiosConfig();

    const response: AxiosResponse<SubmitCapabilitiesResponse> =
      await axios.post(
        '/candidates/submit-capabilities',
        capabilityData,
        config
      );

    return response.data;
  } catch (error: unknown) {
    console.warn('Failed to submit capabilities:', error);
    handleApiError(error);
  }
}
// ----------------------
// Submit Capabilities in Background
// ----------------------
export function submitCapabilitiesInBackground(
  capabilityData: SubmitCapabilitiesData
): void {
  submitCapabilitiesApi(capabilityData).catch(error => {
    console.warn('Background capability submission failed:', error);
  });
}
// ----------------------
// Get Resume API - Candidate ID from token
// ----------------------
export async function getResumeApi(): Promise<ResumeGetResponse> {
  try {
    const config = getAuthAxiosConfig();
    const response: AxiosResponse<ResumeGetResponse> = await axios.get(
      '/candidates/resume',
      config
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

// ----------------------
// Delete Resume API - Candidate ID from token
// ----------------------
export async function deleteResumeApi(): Promise<ResumeDeleteResponse> {
  try {
    const config = getAuthAxiosConfig();
    const response: AxiosResponse<ResumeDeleteResponse> = await axios.delete(
      '/candidates/resume',
      config
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}
