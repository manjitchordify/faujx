import axios, { AxiosError } from 'axios';
import { getAuthAxiosConfig } from '@/utils/apiHeader';
import { showToast } from '@/utils/toast/Toast';

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
  userId: string;
  email: string;
  profilePic: string | null;
  resumeParsingScore: number;
  mcqScore: number;
  codingScore: number | string;
  interviewStatus:
    | 'pending'
    | 'confirmed'
    | 'pending_confirmation'
    | 'completed'
    | 'failed'
    | 'cancelled';
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
    | 'completed'
    | 'failed'
    | 'cancelled';
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
    | 'completed'
    | 'failed'
    | 'cancelled';
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
    | 'completed'
    | 'failed'
    | 'cancelled';
  interviewPassed?: boolean;
}

// Hired Candidate Interfaces
export interface HiredCandidateEducation {
  degree: string;
  institute: string;
  year: number;
}

export interface HiredCandidateExperience {
  company: string;
  role: string;
  duration: string;
}

export interface HiredCandidateProject {
  name: string;
  description: string;
}

export interface HiredCandidateParsedSkills {
  technical: string[];
  soft: string[];
  languages: string[];
}

export interface HiredCandidateInterviewFeedback {
  rating: number;
  comments: string;
}

export interface HiredCandidate {
  hireStatus: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  location: string;
  preferredMonthlySalary: string;
  experienceYears: number;
  currentDesignation: string;
  currentCompany: string;
  workMode: string[];
  currencyType: string;
  skills: string[];
  portfolioUrl: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  resumeUrl: string | null;
  resumeParseScore: number;
  roleTitle: string;
  joiningPeriod: string;
  isWillingToRelocate: boolean;
  isOpenToOtherLocations: boolean;
  relocationConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
  parsedEducation: HiredCandidateEducation[];
  parsedExperience: HiredCandidateExperience[];
  parsedProjects: HiredCandidateProject[];
  parsedSkills: HiredCandidateParsedSkills;
  interviewFeedback: HiredCandidateInterviewFeedback;
}

export interface PaginatedHiredCandidatesResponse {
  data: HiredCandidate[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
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

    const response = await axios.get<CandidateStats>(
      `/candidates/stats`,
      config
    );

    if (!response.data) {
      showToast('No candidate statistics data received from server.', 'error');
      throw {
        status: 500,
        message: 'Invalid server response: missing candidate statistics data',
      };
    }

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

      // Get all candidates with a large perPage to get actual counts
      const response = await axios.get<PaginatedCandidatesResponse>(
        `/candidates/allCandidates?page=1&perPage=1000`,
        config
      );

      if (!response.data?.data) {
        showToast(
          'No candidates data received for statistics calculation.',
          'error'
        );
        throw {
          status: 500,
          message: 'Invalid server response: missing candidates data',
        };
      }

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

// GET all candidates with pagination, search, and filtering
// NOTE: Backend API must support 'search' and 'filter' query parameters
// API Requirements:
// - 'search' parameter: Filter by candidate name or email (case-insensitive partial match)
// - 'filter' parameter: Filter by status with the following values:
//   * 'all' - No filtering (return all candidates)
//   * 'passed' - Candidates who passed the interview
//   * 'failed' - Candidates who failed the interview
//   * 'published' - Published candidates
//   * 'unpublished' - Not published candidates
//   * 'pending' - Interview status: pending
//   * 'confirmed' - Interview status: confirmed
//   * 'pending_confirmation' - Interview status: pending_confirmation
//   * 'completed' - Interview status: completed
//   * 'cancelled' - Interview status: cancelled
export const getAllCandidates = async (
  page: number = 1,
  perPage: number = 10,
  search: string = '',
  filter: string = 'all'
): Promise<PaginatedCandidatesResponse> => {
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

    // Add filter parameter if not 'all'
    if (filter !== 'all') {
      params.append('filter', filter);
    }

    const response = await axios.get<PaginatedCandidatesResponse>(
      `/candidates/allCandidates?${params.toString()}`,
      config
    );

    if (!response.data) {
      showToast('No candidates data received from server.', 'error');
      throw {
        status: 500,
        message: 'Invalid server response: missing candidates data',
      };
    }

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

    const response = await axios.get<Candidate>(
      `/candidates/${candidateId}`,
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

// POST create new candidate
export const createCandidate = async (
  candidateData: CreateCandidateRequest
): Promise<Candidate> => {
  try {
    const config = getAuthAxiosConfig();

    const response = await axios.post<Candidate>(
      `/candidates`,
      candidateData,
      config
    );

    if (!response.data) {
      showToast('Failed to create candidate.', 'error');
      throw {
        status: 500,
        message: 'Invalid server response: missing created candidate data',
      };
    }

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

    const response = await axios.put<Candidate>(
      `/candidates/${candidateId}`,
      candidateData,
      config
    );

    if (!response.data) {
      showToast('Failed to update candidate.', 'error');
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

// DELETE candidate
export const deleteCandidate = async (candidateId: string): Promise<void> => {
  try {
    const config = getAuthAxiosConfig();

    await axios.delete(`/candidates/${candidateId}`, config);
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

    await axios.delete('/candidates/bulk', {
      ...config,
      data: { candidateIds },
    });
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// PATCH update candidate publish status - UPDATED TO ACCEPT BOOLEAN PARAMETER
export const updateCandidatePublishStatus = async (
  candidateId: string,
  isPublished: boolean
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
      showToast('Failed to update candidate publish status.', 'error');
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

// PATCH update candidate vetting status
export const updateCandidateVettingStatus = async (
  candidateId: string,
  vettingStatus: 'pending' | 'approved' | 'rejected'
): Promise<Candidate> => {
  try {
    const config = getAuthAxiosConfig();

    const requestBody: UpdateCandidateVettingRequest = {
      vettingStatus,
    };

    const response = await axios.patch<Candidate>(
      `/candidates/${candidateId}/vetting`,
      requestBody,
      config
    );

    if (!response.data) {
      showToast('Failed to update candidate vetting status.', 'error');
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

// PATCH update candidate interview status
export const updateCandidateInterviewStatus = async (
  candidateId: string,
  interviewData: UpdateCandidateInterviewRequest
): Promise<Candidate> => {
  try {
    const config = getAuthAxiosConfig();

    const response = await axios.patch<Candidate>(
      `/candidates/${candidateId}/interview`,
      interviewData,
      config
    );

    if (!response.data) {
      showToast('Failed to update candidate interview status.', 'error');
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
  return updateCandidatePublishStatus(candidateId, true);
};

// PATCH unpublish candidate profile
export const unpublishCandidate = async (
  candidateId: string
): Promise<Candidate> => {
  return updateCandidatePublishStatus(candidateId, false);
};

// GET published candidates only
// NOTE: Uses filter parameter - backend must implement filtering
export const getPublishedCandidates = async (
  page: number = 1,
  perPage: number = 10,
  search: string = ''
): Promise<PaginatedCandidatesResponse> => {
  return getAllCandidates(page, perPage, search, 'published');
};

// GET candidates by interview status
// NOTE: Uses filter parameter - backend must implement filtering
export const getCandidatesByInterviewStatus = async (
  interviewStatus:
    | 'pending'
    | 'confirmed'
    | 'pending_confirmation'
    | 'completed'
    | 'failed'
    | 'cancelled',
  page: number = 1,
  perPage: number = 10,
  search: string = ''
): Promise<PaginatedCandidatesResponse> => {
  return getAllCandidates(page, perPage, search, interviewStatus);
};

// GET candidates by vetting status
// NOTE: Uses filter parameter - backend must implement filtering
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

    const response = await axios.patch<Candidate[]>(
      '/candidates/bulk/publish',
      {
        candidateIds,
        isPublished,
      },
      config
    );

    if (!response.data) {
      showToast('Failed to bulk update candidate publish status.', 'error');
      throw {
        status: 500,
        message: 'Invalid server response: missing updated candidates data',
      };
    }

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

    const response = await axios.patch<Candidate[]>(
      '/candidates/bulk/vetting',
      {
        candidateIds,
        vettingStatus,
      },
      config
    );

    if (!response.data) {
      showToast('Failed to bulk update candidate vetting status.', 'error');
      throw {
        status: 500,
        message: 'Invalid server response: missing updated candidates data',
      };
    }

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// GET all hired candidates with pagination and search
// NOTE: Backend API must support 'search' query parameter
// API Requirement: 'search' parameter should filter by candidate name or email
export const getAllHiredCandidates = async (
  page: number = 1,
  perPage: number = 10,
  search: string = ''
): Promise<PaginatedHiredCandidatesResponse> => {
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

    const response = await axios.get<PaginatedHiredCandidatesResponse>(
      `/admin-dashboard/hired-candidates?${params.toString()}`,
      config
    );

    if (!response.data) {
      showToast('No hired candidates data received from server.', 'error');
      throw {
        status: 500,
        message: 'Invalid server response: missing hired candidates data',
      };
    }

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};
