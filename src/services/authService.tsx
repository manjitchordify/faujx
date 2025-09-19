import { getAuthAxiosConfig } from '@/utils/apiHeader';
import Cookies from 'js-cookie';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { store } from '@/store/store';
import { setLoggedInUser } from '@/store/slices/userSlice';
import { setAssignmentsData } from '@/store/slices/persistSlice';

// ----------------------
// Profile Stages Types (imported from your routing utility)
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
// Types for authentication
// ----------------------
export interface SignupParams {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  password: string;
  userType: string | null;
  companyName?: string;
  companyWebsite?: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userType: string;
  isVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  companyName?: string;
  companyWebsite?: string;
  phase1Completed?: boolean;
}

export interface SignupResponse {
  user: User;
  message: string;
  data: {
    user: User;
    accessToken?: string;
    tokenType?: string;
  };
}

export interface LoginResponse {
  message: string;
  data: {
    userType: string;
    user: User;
    accessToken: string;
    tokenType: string;
    isPreliminaryVideoCompleted?: boolean;
    phase1Completed?: boolean;
    isPublished?: boolean;
    profileStages?: ProfileStages;
    isPremium?: boolean;
  };
}

export interface VerifyTokenResponse {
  message: string;
  decoded: {
    sub: string;
    email: string;
    userType: string;
    iat: number;
    exp: number;
  };
}

// Additional data interface for auth storage
export interface AdditionalAuthData {
  isPreliminaryVideoCompleted?: boolean;
  tokenType?: string;
  phase1Completed?: boolean;
  isPublished?: boolean;
  profileStages?: ProfileStages;
  isPremium: boolean; // Make this required boolean instead of optional
  [key: string]: unknown;
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
// Store auth data in cookies and Redux
// ----------------------
function storeAuthData(
  user: User,
  accessToken?: string,
  additionalData?: AdditionalAuthData
) {
  const cookieOptions = {
    expires: 1, // 1 days
    secure: false, // Set to false for development (localhost)
    sameSite: 'lax' as const,
    path: '/',
  };

  try {
    // Store in cookies
    Cookies.set('user', JSON.stringify(user), cookieOptions);
    Cookies.set('userType', user.userType, cookieOptions);

    if (accessToken) {
      Cookies.set('accessToken', accessToken, cookieOptions);
    }

    // Store in Redux
    store.dispatch(
      setLoggedInUser({
        ...user,
        accessToken,
        ...additionalData,
      })
    );
  } catch (error) {
    console.error('Error storing auth data:', error);
  }
}

// ----------------------
// Clear auth data
// ----------------------
export function clearAuthCookies() {
  try {
    Cookies.remove('accessToken');
    Cookies.remove('user');
    Cookies.remove('userType');
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }

  store.dispatch(setLoggedInUser(null));
  store.dispatch(setAssignmentsData(null));
}

// ----------------------
// Signup API
// ----------------------
export async function signupApi(params: SignupParams): Promise<SignupResponse> {
  try {
    const config = getAuthAxiosConfig();
    const response: AxiosResponse<SignupResponse> = await axios.post(
      'auth/register',
      params,
      config
    );

    if (response.data.user) {
      storeAuthData(response.data.user, response.data.data?.accessToken);
    }

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function loginApi(params: LoginParams): Promise<LoginResponse> {
  try {
    const config = getAuthAxiosConfig();
    console.log('auth config', config);
    const response: AxiosResponse<LoginResponse> = await axios.post(
      'auth/login',
      params,
      config
    );

    if (
      response.data.data.user &&
      response.data.data.accessToken &&
      (response.data.data.user.userType === 'admin' ||
        response.data.data.user.userType === 'interview_panel' ||
        response.data.data.user.isVerified)
    ) {
      storeAuthData(response.data.data.user, response.data.data.accessToken, {
        isPreliminaryVideoCompleted:
          response.data.data.isPreliminaryVideoCompleted,
        phase1Completed: response.data.data.phase1Completed,
        isPublished: response.data.data.isPublished,
        isPremium: response.data.data.isPremium ?? false, // Provide default false value
        profileStages: response.data.data.profileStages,
      });
    }

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function verifyToken(): Promise<VerifyTokenResponse> {
  try {
    const config = getAuthAxiosConfig();
    const response: AxiosResponse<VerifyTokenResponse> = await axios.get(
      'auth/verify-token',
      config
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function resendVerificationEmail(
  email: string
): Promise<VerifyTokenResponse> {
  try {
    const config = getAuthAxiosConfig();
    const response: AxiosResponse<VerifyTokenResponse> = await axios.post(
      'auth/resend-verification-email',
      { email: email },
      config
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}
