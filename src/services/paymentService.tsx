import { getAuthAxiosConfig, getAuthToken } from '@/utils/apiHeader';
import axios, { AxiosError } from 'axios';

// TypeScript interfaces
export interface PaymentSuccessRequest {
  sessionId: string;
}

export interface PaymentSuccessResponse {
  message: string;
}

export interface SubscriptionRequest {
  subscription_type: 'basic' | 'premium' | 'enterprise';
  period: 'monthly' | 'yearly';
  success_url: string;
  cancel_url: string;
  trial_days?: number;
  notes?: string;
}

export interface HireRequest {
  contract_type: 'full_time';
  payment_type: 'monthly';
  success_url: string;
  cancel_url: string;
  additional_notes?: string;
}

export interface SubscriptionResponse {
  id: string;
  user_id: string;
  subscription_type: string;
  period: string;
  amount: number;
  currency: string;
  status: string;
  start_date: string;
  end_date: string;
  trial_end_date: string;
  auto_renew: boolean;
  candidates_limit: number;
  views_limit: number;
  unlimited_views: boolean;
  live_support: boolean;
  access_days: number;
  stripe_session_url: string;
  created_at: string;
  updated_at: string;
}

function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw {
      status: axiosError.response?.status || 0,
      message:
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Network error',
    };
  }
  throw {
    status: 0,
    message: 'An unexpected error occurred',
  };
}

// POST subscription request
export const createSubscription = async (
  subscriptionData: SubscriptionRequest
): Promise<SubscriptionResponse> => {
  try {
    const config = getAuthAxiosConfig();
    const response = await axios.post(
      '/subscriptions/subscribe',
      subscriptionData,
      config
    );
    return response.data;
  } catch (error: unknown) {
    console.error('Subscription creation failed:', error);
    handleApiError(error);
  }
};

export const hirePayment = async (
  subscriptionData: HireRequest,
  candidiateId: string
): Promise<SubscriptionResponse> => {
  try {
    const config = getAuthAxiosConfig();
    const response = await axios.post(
      `/hiring/hire-candidate/${candidiateId}`,
      subscriptionData,
      config
    );
    return response.data;
  } catch (error: unknown) {
    console.error('Subscription creation failed:', error);
    handleApiError(error);
  }
};
// POST payment success with session ID
export const processPaymentSuccess = async (
  sessionId: string
): Promise<PaymentSuccessResponse> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.post(
      `/booking/booking/payment-success?session_id=${sessionId}`,
      {},
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// POST payment failure (in case needed)
export const processPaymentCancel = async (
  sessionId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.post(
      `/booking/booking/payment-cancel?session_id=${sessionId}`,
      {},
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};
