import axios, { AxiosError } from 'axios';
import { getAuthAxiosConfig } from '@/utils/apiHeader';
import { showToast } from '@/utils/toast/Toast';

// TypeScript interfaces for API response
export interface DashboardApiData {
  keyMetrics: {
    totalActiveCustomers: number;
    activeCandidates: number;
    activeExperts: number;
    interviewsScheduled: {
      weekly: number;
      monthly: number;
    };
    candidateToFTEConversionRate: string;
    churnRate: string;
    revenue: {
      subscription: number;
      placementFees: number;
    };
  };
  graphData: {
    weeklySignupTrend: {
      customers: number[];
      candidates: number[];
    };
    monthlySignupTrend?: {
      customers: number[];
      candidates: number[];
    };
    activeVsInactiveCandidates: {
      active: number;
      inactive: number;
    };
    revenueBreakdown: {
      byTier: {
        basic: number;
        premium: number;
        enterprise: number;
      };
      byGeography: {
        India: number;
        USA: number;
        Europe: number;
      };
    };
    topPerformingSkills: Array<{
      skill: string;
      count: number;
    }>;
  };
}

// Interface for candidate data based on API response
export interface Candidate {
  id: string;
  firstName: string;
  email: string;
  profilePic: string | null;
  resumeParsingScore: number;
  mcqScore: number;
  codingScore: number | string;
  interviewStatus:
    | 'pending'
    | 'confirmed'
    | 'pending_confirmation'
    | 'completed';
  interviewPassed: boolean;
  notes: string | null;
  isPublished: boolean;
  resumeUrl: string | null;
  vettingStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// Interface for getAllCandidates API response
export interface GetAllCandidatesResponse {
  data: Candidate[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  // Add these for better stats tracking
  totalStats?: {
    totalCandidates: number;
    passedCandidates: number;
    failedCandidates: number;
    publishedCandidates: number;
  };
}

// Interface for updating candidate published status
export interface UpdateCandidatePublishRequest {
  isPublished: boolean;
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

export const getAdminDashboard = async (): Promise<DashboardApiData> => {
  try {
    const config = getAuthAxiosConfig();

    const response = await axios.get<DashboardApiData>(
      '/admin-dashboard',
      config
    );

    if (!response.data) {
      showToast('No dashboard data received from server.', 'error');
      throw {
        status: 500,
        message: 'Invalid server response: missing dashboard data',
      };
    }

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// GET all candidates with pagination and filtering support
export const getAllCandidates = async (
  page: number = 1,
  perPage: number = 10,
  search: string = '',
  filter: string = 'all'
): Promise<GetAllCandidatesResponse> => {
  try {
    const config = getAuthAxiosConfig();

    // Build query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      perPage: perPage.toString(),
    });

    // Add search parameter if provided
    if (search.trim()) {
      params.append('search', search.trim());
    }

    if (filter !== 'all') {
      // Option 1: Use a single filter parameter
      params.append('filter', filter);
    }

    const response = await axios.get<GetAllCandidatesResponse>(
      `/candidates/allCandidates?${params.toString()}`,
      config
    );

    if (!response.data) {
      showToast('No candidate data received from server.', 'error');
      throw {
        status: 500,
        message: 'Invalid server response: missing candidate data',
      };
    }

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// NEW: Get total stats for all candidates (for dashboard cards)
export const getCandidateStats = async (): Promise<{
  totalCandidates: number;
  passedCandidates: number;
  failedCandidates: number;
  publishedCandidates: number;
}> => {
  try {
    const config = getAuthAxiosConfig();

    const response = await axios.get<GetAllCandidatesResponse>(
      `/candidates/allCandidates?page=1&perPage=10000`,
      config
    );

    if (!response.data?.data) {
      showToast('No candidate statistics data received from server.', 'error');
      throw {
        status: 500,
        message: 'Invalid server response: missing candidate statistics data',
      };
    }

    const candidates: Candidate[] = response.data.data;

    return {
      totalCandidates: response.data.total,
      passedCandidates: candidates.filter(c => c.interviewPassed).length,
      failedCandidates: candidates.filter(c => !c.interviewPassed).length,
      publishedCandidates: candidates.filter(c => c.isPublished).length,
    };
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// PUT update candidate published status
export const updateCandidatePublishStatus = async (
  candidateId: string,
  isPublished: boolean = true
): Promise<Candidate> => {
  try {
    const config = getAuthAxiosConfig();

    const requestBody: UpdateCandidatePublishRequest = {
      isPublished,
    };

    const response = await axios.put<Candidate>(
      `/candidates/${candidateId}`,
      requestBody,
      config
    );

    if (!response.data) {
      showToast('Failed to update candidate status.', 'error');
      throw {
        status: 500,
        message: 'Invalid server response: missing updated candidate data',
      };
    }

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

export default getAdminDashboard;
