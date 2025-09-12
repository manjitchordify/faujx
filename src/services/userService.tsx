import { getAuthAxiosConfig, getAuthToken } from '@/utils/apiHeader';
import axios, { AxiosError } from 'axios';

// TypeScript interfaces
export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  verified: number;
  unverified: number;
  byUserType: {
    candidate: number;
    expert: number;
    admin: number;
    interview_panel: number;
  };
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  dateOfBirth: string | null;
  location: string | null;
  userType: 'candidate' | 'admin' | 'expert' | 'interview_panel';
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedUsersResponse {
  data: AdminUser[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  location?: string;
  userType: 'candidate' | 'admin' | 'expert' | 'interview_panel';
  isVerified?: boolean;
  isActive?: boolean;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  location?: string;
  userType?: 'candidate' | 'admin' | 'expert' | 'interview_panel';
  isVerified?: boolean;
  isActive?: boolean;
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

// GET user statistics (NEW ENDPOINT NEEDED)
export const getUserStats = async (): Promise<UserStats> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(
      `https://devapi.faujx.com/api/users/stats`,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// Alternative: GET user statistics by making multiple API calls (WORKAROUND)
export const getUserStatsWorkaround = async (): Promise<UserStats> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };

    // Get all users with a large perPage to get actual counts
    // Note: This is not ideal for large datasets
    const response = await axios.get(
      `https://devapi.faujx.com/api/users?page=1&perPage=1000`,
      config
    );

    const allUsers: AdminUser[] = response.data.data;
    const total = response.data.total;

    // Calculate statistics from all users
    const active = allUsers.filter(u => u.isActive).length;
    const inactive = allUsers.filter(u => !u.isActive).length;
    const verified = allUsers.filter(u => u.isVerified).length;
    const unverified = allUsers.filter(u => !u.isVerified).length;

    const byUserType = {
      candidate: allUsers.filter(u => u.userType === 'candidate').length,
      expert: allUsers.filter(u => u.userType === 'expert').length,
      admin: allUsers.filter(u => u.userType === 'admin').length,
      interview_panel: allUsers.filter(u => u.userType === 'interview_panel')
        .length,
    };

    return {
      total,
      active,
      inactive,
      verified,
      unverified,
      byUserType,
    };
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// GET all users with pagination and filtering
export const getAllUsers = async (
  page: number = 1,
  perPage: number = 10,
  userType: string = 'all'
): Promise<PaginatedUsersResponse> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };

    const userRole = userType === 'engineer' ? 'candidate' : userType;
    const typeParam = userType !== 'all' ? `userType=${userRole}&` : '';

    const response = await axios.get(
      `https://devapi.faujx.com/api/users?${typeParam}page=${page}&perPage=${perPage}`,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// PUT update user
export const updateUser = async (
  userId: string,
  userData: UpdateUserRequest
): Promise<AdminUser> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.put(
      `https://devapi.faujx.com/api/users/${userId}`,
      userData,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// DELETE user
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };

    await axios.delete(`https://devapi.faujx.com/api/users/${userId}`, config);
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// DELETE multiple users
export const deleteMultipleUsers = async (userIds: string[]): Promise<void> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    await axios.delete('https://devapi.faujx.com/api/users/bulk', {
      ...config,
      data: { userIds },
    });
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// PATCH update user status
export const updateUserStatus = async (
  userId: string,
  isActive: boolean
): Promise<AdminUser> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.patch(
      `https://devapi.faujx.com/api/users/${userId}/status`,
      { isActive },
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// GET single user by ID
export const getUserById = async (userId: string): Promise<AdminUser> => {
  try {
    const config = getAuthAxiosConfig();
    const token = getAuthToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(
      `https://devapi.faujx.com/api/users/${userId}`,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};
