import { getAuthAxiosConfig } from '@/utils/apiHeader';
import axios, { AxiosError } from 'axios';

// TypeScript interfaces for Customer API
export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string | null;
  phone: string;
  profilePic?: string | null;
  profilePicKey?: string | null;
  profileVideoKey?: string | null;
  profileVideo?: string | null;
  dateOfBirth: string;
  location: string;
  country?: string | null;
  isVerified: boolean;
  isActive: boolean;
  isSubscribed: boolean;
  subscribedAt?: string | null;
  isPremium: boolean;
  premiumSince?: string | null;
  premiumUntil?: string | null;
  stripeCustomerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Result type
export type GetAllCustomersResult = Customer[];

// Error handling function
function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      message?: string;
      error?: string;
    }>;
    throw {
      status: axiosError.response?.status || 0,
      message:
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        axiosError.message ||
        'Network error',
    };
  }
  throw {
    status: 0,
    message: 'An unexpected error occurred',
  };
}

// GET - Get all customers
export const getAllCustomers = async (): Promise<GetAllCustomersResult> => {
  try {
    const config = getAuthAxiosConfig();
    const response = await axios.get('/admin-dashboard/customers', config);

    const responseData = response.data;

    // Handle different response structures
    let customers: Customer[] = [];

    if (Array.isArray(responseData)) {
      // If API returns array directly
      customers = responseData;
    } else if (responseData.data && Array.isArray(responseData.data)) {
      // If API returns object with data property
      customers = responseData.data;
    }

    return customers;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// Named export object to fix ESLint warning
const customerService = {
  getAllCustomers,
};

export default customerService;
