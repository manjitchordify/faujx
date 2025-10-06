import { getAuthAxiosConfig } from '@/utils/apiHeader';
import axios, { AxiosError } from 'axios';

// TypeScript interfaces for Plan API
export interface Plan {
  id: string;
  name: string;
  description: string;
  stripePriceId: string;
  stripeProductId: string;
  price: string; // API returns price as string
  currency: string;
  interval: string;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Modified result type for features only
export type GetAllPlanFeaturesResult = string[][];

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

// GET - Get only features from all plans
export const getAllPlanFeatures =
  async (): Promise<GetAllPlanFeaturesResult> => {
    try {
      const config = getAuthAxiosConfig();
      const response = await axios.get('/stripe/plans', config);

      const responseData = response.data;

      // Handle different response structures
      let plans: Plan[] = [];

      if (Array.isArray(responseData)) {
        // If API returns array directly
        plans = responseData;
      } else if (responseData.data && Array.isArray(responseData.data)) {
        // If API returns object with data property
        plans = responseData.data;
      }

      // Extract only features from each plan
      return plans.map(plan => plan.features);
    } catch (error: unknown) {
      handleApiError(error);
    }
  };

const pricingService = {
  getAllPlanFeatures,
};

export default pricingService;
