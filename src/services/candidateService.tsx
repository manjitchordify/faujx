import { getAuthAxiosConfig, getAuthToken } from '@/utils/apiHeader';
import axios, { AxiosError } from 'axios';

// TypeScript interfaces
export interface CandidateStats {
  total: number;
  passed: number;
  failed: number;
  published: number;
  unpublished: number;
  byInterviewStatus: {
    pending: number;
    confirmed: number;
    pending_confirmation: number;
    completed: number;
  };
  byVettingStatus: {
    pending: number;
    approved: number;
    rejected: number;
  };
}

export interface Candidate {
  id: string;
  firstName: string;
  email: string;
  profilePic: string | null;
  resumeParsingScore: number;
  mcqScore: number;
  codingScore: number | string; // Can be number or string like "56.50"
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

export interface PaginatedCandidatesResponse {
  data: Candidate[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface CreateCandidateRequest {
  firstName: string;
  email: string;
  profilePic?: string | null;
  resumeParsingScore?: number;
  mcqScore?: number;
  codingScore?: number;
  interviewStatus?:
    | 'pending'
    | 'confirmed'
    | 'pending_confirmation'
    | 'completed';
  interviewPassed?: boolean;
  notes?: string | null;
  isPublished?: boolean;
  resumeUrl?: string | null;
  vettingStatus?: 'pending' | 'approved' | 'rejected';
}

export interface UpdateCandidateRequest {
  firstName?: string;
  email?: string;
  profilePic?: string | null;
  resumeParsingScore?: number;
  mcqScore?: number;
  codingScore?: number;
  interviewStatus?:
    | 'pending'
    | 'confirmed'
    | 'pending_confirmation'
    | 'completed';
  interviewPassed?: boolean;
  notes?: string | null;
  isPublished?: boolean;
  resumeUrl?: string | null;
  vettingStatus?: 'pending' | 'approved' | 'rejected';
}

export interface UpdateCandidatePublishRequest {
  isPublished: boolean;
}

export interface UpdateCandidateVettingRequest {
  vettingStatus: 'pending' | 'approved' | 'rejected';
}

export interface UpdateCandidateInterviewRequest {
  interviewStatus:
    | 'pending'
    | 'confirmed'
    | 'pending_confirmation'
    | 'completed';
  interviewPassed?: boolean;
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

// GET candidate statistics
export const getCandidateStats = async (): Promise<CandidateStats> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(
      `https://devapi.faujx.com/api/candidates/stats`,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// Alternative: GET candidate statistics by making API calls (WORKAROUND)
export const getCandidateStatsWorkaround =
  async (): Promise<CandidateStats> => {
    try {
      const config = getAuthAxiosConfig();
      const token = getAuthToken();

      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };

      // Get all candidates with a large perPage to get actual counts
      const response = await axios.get(
        `https://devapi.faujx.com/api/candidates/allCandidates?page=1&perPage=1000`,
        config
      );

      const allCandidates: Candidate[] = response.data.data;
      const total = response.data.total;

      // Calculate statistics from all candidates
      const passed = allCandidates.filter(c => c.interviewPassed).length;
      const failed = allCandidates.filter(c => !c.interviewPassed).length;
      const published = allCandidates.filter(c => c.isPublished).length;
      const unpublished = allCandidates.filter(c => !c.isPublished).length;

      const byInterviewStatus = {
        pending: allCandidates.filter(c => c.interviewStatus === 'pending')
          .length,
        confirmed: allCandidates.filter(c => c.interviewStatus === 'confirmed')
          .length,
        pending_confirmation: allCandidates.filter(
          c => c.interviewStatus === 'pending_confirmation'
        ).length,
        completed: allCandidates.filter(c => c.interviewStatus === 'completed')
          .length,
      };

      const byVettingStatus = {
        pending: allCandidates.filter(c => c.vettingStatus === 'pending')
          .length,
        approved: allCandidates.filter(c => c.vettingStatus === 'approved')
          .length,
        rejected: allCandidates.filter(c => c.vettingStatus === 'rejected')
          .length,
      };

      return {
        total,
        passed,
        failed,
        published,
        unpublished,
        byInterviewStatus,
        byVettingStatus,
      };
    } catch (error: unknown) {
      handleApiError(error);
    }
  };

// GET all candidates with pagination and filtering
export const getAllCandidates = async (
  page: number = 1,
  perPage: number = 10,
  search: string = '',
  filter: string = 'all'
): Promise<PaginatedCandidatesResponse> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };

    // Build query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      perPage: perPage.toString(),
    });

    // Add search parameter if provided
    if (search.trim()) {
      params.append('search', search.trim());
    }

    // Add filter parameter
    if (filter !== 'all') {
      params.append('filter', filter);
    }

    const response = await axios.get(
      `https://devapi.faujx.com/api/candidates/allCandidates?${params.toString()}`,
      config
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// GET single candidate by ID
export const getCandidateById = async (
  candidateId: string
): Promise<Candidate> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(
      `https://devapi.faujx.com/api/candidates/${candidateId}`,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// POST create new candidate
export const createCandidate = async (
  candidateData: CreateCandidateRequest
): Promise<Candidate> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.post(
      `https://devapi.faujx.com/api/candidates`,
      candidateData,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// PUT update candidate
export const updateCandidate = async (
  candidateId: string,
  candidateData: UpdateCandidateRequest
): Promise<Candidate> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.put(
      `https://devapi.faujx.com/api/candidates/${candidateId}`,
      candidateData,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// DELETE candidate
export const deleteCandidate = async (candidateId: string): Promise<void> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };

    await axios.delete(
      `https://devapi.faujx.com/api/candidates/${candidateId}`,
      config
    );
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// DELETE multiple candidates
export const deleteMultipleCandidates = async (
  candidateIds: string[]
): Promise<void> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    await axios.delete('https://devapi.faujx.com/api/candidates/bulk', {
      ...config,
      data: { candidateIds },
    });
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// PATCH update candidate publish status
export const updateCandidatePublishStatus = async (
  candidateId: string
): Promise<Candidate> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const requestBody: UpdateCandidatePublishRequest = {
      isPublished: true,
    };

    const response = await axios.put(
      `https://devapi.faujx.com/api/candidates/${candidateId}`,
      requestBody,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// PATCH update candidate vetting status
export const updateCandidateVettingStatus = async (
  candidateId: string,
  vettingStatus: 'pending' | 'approved' | 'rejected'
): Promise<Candidate> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const requestBody: UpdateCandidateVettingRequest = {
      vettingStatus,
    };

    const response = await axios.patch(
      `https://devapi.faujx.com/api/candidates/${candidateId}/vetting`,
      requestBody,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// PATCH update candidate interview status
export const updateCandidateInterviewStatus = async (
  candidateId: string,
  interviewData: UpdateCandidateInterviewRequest
): Promise<Candidate> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.patch(
      `https://devapi.faujx.com/api/candidates/${candidateId}/interview`,
      interviewData,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// PATCH approve candidate (set vetting status to approved)
export const approveCandidate = async (
  candidateId: string
): Promise<Candidate> => {
  return updateCandidateVettingStatus(candidateId, 'approved');
};

// PATCH reject candidate (set vetting status to rejected)
export const rejectCandidate = async (
  candidateId: string
): Promise<Candidate> => {
  return updateCandidateVettingStatus(candidateId, 'rejected');
};

// PATCH publish candidate profile
export const publishCandidate = async (
  candidateId: string
): Promise<Candidate> => {
  return updateCandidatePublishStatus(candidateId);
};

// PATCH unpublish candidate profile
export const unpublishCandidate = async (
  candidateId: string
): Promise<Candidate> => {
  return updateCandidatePublishStatus(candidateId);
};

// GET published candidates only
export const getPublishedCandidates = async (
  page: number = 1,
  perPage: number = 10,
  search: string = ''
): Promise<PaginatedCandidatesResponse> => {
  return getAllCandidates(page, perPage, search, 'published');
};

// GET candidates by interview status
export const getCandidatesByInterviewStatus = async (
  interviewStatus:
    | 'pending'
    | 'confirmed'
    | 'pending_confirmation'
    | 'completed',
  page: number = 1,
  perPage: number = 10,
  search: string = ''
): Promise<PaginatedCandidatesResponse> => {
  return getAllCandidates(
    page,
    perPage,
    search,
    `interview_${interviewStatus}`
  );
};

// GET candidates by vetting status
export const getCandidatesByVettingStatus = async (
  vettingStatus: 'pending' | 'approved' | 'rejected',
  page: number = 1,
  perPage: number = 10,
  search: string = ''
): Promise<PaginatedCandidatesResponse> => {
  return getAllCandidates(page, perPage, search, `vetting_${vettingStatus}`);
};

// PATCH bulk update candidates publish status
export const bulkUpdateCandidatePublishStatus = async (
  candidateIds: string[],
  isPublished: boolean
): Promise<Candidate[]> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.patch(
      'https://devapi.faujx.com/api/candidates/bulk/publish',
      {
        candidateIds,
        isPublished,
      },
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// PATCH bulk update candidates vetting status
export const bulkUpdateCandidateVettingStatus = async (
  candidateIds: string[],
  vettingStatus: 'pending' | 'approved' | 'rejected'
): Promise<Candidate[]> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.patch(
      'https://devapi.faujx.com/api/candidates/bulk/vetting',
      {
        candidateIds,
        vettingStatus,
      },
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};
