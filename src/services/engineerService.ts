import { CodingTestAISubmissionResponse } from '@/types/codingTestTypes';
import { Interview } from '@/types/interview';
import { MCQData } from '@/types/mcq';
import {
  getAuthAxiosConfig,
  getAuthToken,
  getUserFromCookie,
} from '@/utils/apiHeader';
import axios, { AxiosResponse, AxiosError } from 'axios';

// ----------------------
// Stage tracking types
// ----------------------
export type StageKey =
  | 'knowBetter'
  | 'resumeUpload'
  | 'mcq'
  | 'codingTest'
  | 'interview';

export type StageStatus = 'passed' | 'failed';

export interface ProfileStages {
  lastStage: StageKey;
  lastStatus: StageStatus;
}

// ----------------------
// Types for engineer profile
// ----------------------
export interface UpdateEngineerProfileParams {
  experienceYears?: number;
  currentDesignation?: string;
  currentCompany?: string;
  expectedSalary?: number;
  preferredLocations?: string[];
  skills?: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  roleId?: string;
  isWillingToRelocate?: boolean;
  isOpenToOtherLocations?: boolean;
  relocationConfirmed?: boolean;
  interviewSlot?: string[]; // Array of time preferences like ["morning", "afternoon", "anytime"]
  workMode?: string[]; // Array of work modes like ["remote", "hybrid", "onsite"]
  roleTitle?: string;
  joiningPeriod?: string; // Single joining period like "immediate", "1-month", etc.
  preferredMonthlySalary?: string; // Monthly salary as string like "25k"
  currencyType?: string; // Currency type like "INR", "USD", etc.
  profileStages?: ProfileStages; // Add stage tracking
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
  profileStages?: ProfileStages; // Add stage tracking
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
// Get Engineer Profile API
// ----------------------
export async function getEngineerProfileApi(): Promise<EngineerProfile | null> {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();
    const userData = getUserFromCookie();

    if (!userData?.id) {
      return null;
    }

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<{ data: EngineerProfile }> = await axios.get(
      `/candidates/user/${userData.id}`,
      config
    );

    return response.data.data;
  } catch (error: unknown) {
    console.warn('Failed to get engineer profile:', error);
    return null;
  }
}

// ----------------------
// Stage Tracking Helper Functions
// ----------------------

// Helper function to update current stage status
export async function updateProfileStage(
  stage: StageKey,
  status: StageStatus
): Promise<void> {
  try {
    const userData = getUserFromCookie();
    if (!userData?.id) {
      console.warn('No user ID found for stage update');
      return;
    }
    const stageUpdate = {
      profileStages: {
        lastStage: stage,
        lastStatus: status,
      },
    };
    await updateEngineerProfileApi(userData.id as string, stageUpdate);
  } catch (error) {
    console.warn(
      `Failed to update stage ${stage} with status ${status}:`,
      error
    );
    // Don't throw error to avoid breaking the main flow
  }
}

// Get current profile stages from API
export async function getProfileStages(): Promise<ProfileStages | null> {
  try {
    const profile = await getEngineerProfileApi();
    return profile?.profileStages || null;
  } catch (error) {
    console.warn('Failed to get profile stages:', error);
    return null;
  }
}

// Get stage order for progress calculation
export function getStageOrder(): StageKey[] {
  return ['knowBetter', 'resumeUpload', 'mcq', 'codingTest', 'interview'];
}

// Get stage progress based on last completed stage
export function getProfileProgress(
  profileStages: ProfileStages | null
): number {
  if (!profileStages) return 0;

  const stageOrder = getStageOrder();
  const currentStageIndex = stageOrder.indexOf(profileStages.lastStage);

  if (currentStageIndex === -1) return 0;

  // If current stage is passed, add 1 to index for progress calculation
  const completedStages =
    profileStages.lastStatus === 'passed'
      ? currentStageIndex + 1
      : currentStageIndex;

  return Math.round((completedStages / stageOrder.length) * 100);
}

// Check if user is on the latest available stage
export function isCurrentStage(
  profileStages: ProfileStages | null,
  stage: StageKey
): boolean {
  if (!profileStages) return stage === 'knowBetter'; // First stage if no data

  const stageOrder = getStageOrder();
  const currentStageIndex = stageOrder.indexOf(profileStages.lastStage);
  const checkStageIndex = stageOrder.indexOf(stage);

  // If last stage was passed, user can access next stage
  if (profileStages.lastStatus === 'passed') {
    return checkStageIndex === currentStageIndex + 1;
  } else {
    // If last stage failed, user should retry that stage
    return checkStageIndex === currentStageIndex;
  }
}

// Get human readable status
export function getStageDisplayStatus(status: StageStatus): string {
  switch (status) {
    case 'passed':
      return 'Passed';
    case 'failed':
      return 'Failed';
    default:
      return 'Unknown';
  }
}

// ----------------------
// Stage Completion Functions
// ----------------------

// Function to handle Know Better stage completion
export async function completeKnowBetterStage(
  profileData: UpdateEngineerProfileParams
): Promise<UpdateEngineerProfileResponse> {
  try {
    const userData = getUserFromCookie();
    if (!userData?.id) {
      throw new Error('No user ID found');
    }

    // Update profile data and mark stage as passed
    const updateData = {
      ...profileData,
      profileStages: {
        lastStage: 'knowBetter' as StageKey,
        lastStatus: 'passed' as StageStatus,
      },
    };

    const result = await updateEngineerProfileApi(
      userData.id as string,
      updateData
    );
    return result;
  } catch (error) {
    await updateProfileStage('knowBetter', 'failed');
    console.error('Failed to complete Know Better stage:', error);
    throw error;
  }
}

// Function to handle Resume Upload stage completion
export async function completeResumeUploadStage(): Promise<void> {
  try {
    await updateProfileStage('resumeUpload', 'passed');
  } catch (error) {
    await updateProfileStage('resumeUpload', 'failed');
    throw error;
  }
}

// Function to handle MCQ completion
export async function completeMCQStage(
  mcqResults: MCQData | null, // Replace with your MCQ result type
  passed: boolean
): Promise<void> {
  try {
    // Submit MCQ results to your API first
    // const result = await submitMCQResults(mcqResults);

    const status: StageStatus = passed ? 'passed' : 'failed';
    await updateProfileStage('mcq', status);
  } catch (error) {
    await updateProfileStage('mcq', 'failed');
    console.error('Failed to complete MCQ stage:', error);
    throw error;
  }
}

// Function to handle Coding Test completion
export async function completeCodingTestStage(
  testResults: CodingTestAISubmissionResponse | null, // Replace with your test result type
  passed: boolean
): Promise<void> {
  try {
    // Submit coding test results to your API first
    // const result = await submitCodingTestResults(testResults);

    const status: StageStatus = passed ? 'passed' : 'failed';
    await updateProfileStage('codingTest', status);
  } catch (error) {
    await updateProfileStage('codingTest', 'failed');
    console.error('Failed to complete Coding Test stage:', error);
    throw error;
  }
}

// Function to handle Interview completion
export async function completeInterviewStage(
  interviewResults: Interview, // Replace with your interview result type
  passed: boolean
): Promise<void> {
  try {
    // Process interview results first
    // const result = await submitInterviewResults(interviewResults);

    const status: StageStatus = passed ? 'passed' : 'failed';
    await updateProfileStage('interview', status);
  } catch (error) {
    await updateProfileStage('interview', 'failed');
    console.error('Failed to complete Interview stage:', error);
    throw error;
  }
}
