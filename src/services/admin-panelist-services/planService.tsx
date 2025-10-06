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

export interface CreatePlanRequest {
  name: string;
  description: string;
  price: number; // We send price as number
  currency: string;
  interval: string;
  features: string[];
  isActive: boolean;
}

// Interface for API responses
export interface GetAllPlansResponse {
  data?: Plan[];
  total?: number;
  message?: string;
}

// In case API returns array directly
export type GetAllPlansResult = GetAllPlansResponse | Plan[];

export interface GetPlanResponse {
  data: Plan;
  message: string;
}

export interface CreatePlanResponse {
  data: Plan;
  message: string;
}

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

// POST - Create a new plan
export const createPlan = async (
  planData: CreatePlanRequest
): Promise<CreatePlanResponse> => {
  try {
    const config = getAuthAxiosConfig();
    const response = await axios.post(
      '/stripe/admin/create-plan',
      planData,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// GET - Get all available subscription plans
export const getAllPlans = async (): Promise<GetAllPlansResult> => {
  try {
    const config = getAuthAxiosConfig();

    const response = await axios.get('/stripe/plans', config);

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// GET - Get plan details by ID
export const getPlanById = async (id: string): Promise<GetPlanResponse> => {
  try {
    const config = getAuthAxiosConfig();

    const response = await axios.get(`/stripe/plans/${id}`, config);

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

const planService = {
  createPlan,
  getAllPlans,
  getPlanById,
};

export default planService;
