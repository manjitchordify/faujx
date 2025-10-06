import { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

export interface ApiHeaders {
  [key: string]: string;
}

// Base API configuration
// export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// export const AI_API_BASE_URL = process.env.NEXT_PUBLIC_API_GENERATE_MCQ_BASE_URL;
export const API_BASE_URL = 'https://devapi.faujx.com/api';
export const AI_API_BASE_URL =
  'https://faujx-ai-dev.73eak0edvm4a2.us-east-2.cs.amazonlightsail.com';

export const getApiHeaders = (): ApiHeaders => {
  const headers: ApiHeaders = {
    'Content-Type': 'application/json',
  };

  // Add authorization header if token exists
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Get authentication token from cookies
export function getAuthToken(): string | null {
  const token = Cookies.get('accessToken') || null;
  return token;
}

// Get user data from cookies
export function getUserFromCookie(): Record<string, unknown> | null {
  const userString = Cookies.get('user');
  if (!userString) return null;

  try {
    return JSON.parse(userString);
  } catch (error) {
    console.error('Error parsing user data from cookie:', error);
    return null;
  }
}

// Get user type from cookies
export function getUserTypeFromCookie(): string | null {
  return Cookies.get('userType') || null;
}

export const getAuthAxiosConfig = (): AxiosRequestConfig => {
  return {
    baseURL: API_BASE_URL,
    headers: getApiHeaders(),
  };
};

const apiUtils = getAuthAxiosConfig;

const apiUtilsExport = {
  apiUtils,
  getUserFromCookie,
  getUserTypeFromCookie,
};

export default apiUtilsExport;
