// services/notificationService.ts
import { getAuthAxiosConfig } from '@/utils/apiHeader';
import axios, { AxiosError } from 'axios';

// TypeScript interfaces matching your actual data structure
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string | null;
  phone: string;
  profilePic: string;
  profilePicKey: string;
  profileVideoKey: string;
  profileVideo: string;
  dateOfBirth: string;
  location: string;
  country: string | null;
  userType: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isSubscribed: boolean;
  subscribedAt: string | null;
  isPremium: boolean;
  premiumSince: string | null;
  premiumUntil: string | null;
  currentSubscriptionId: string | null;
}

export interface Notification {
  id: string;
  userId: string;
  moduleName: string;
  notificationText: string;
  isRead: boolean;
  notificationType: 'info' | 'warning' | 'error' | 'success';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl: string | null;
  referenceId: string | null;
  referenceType: string | null;
  metadata: Record<string, unknown> | null;
  expiresAt: string | null;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  hasMore: boolean;
}

export interface NotificationQueryParams {
  limit?: number;
  offset?: number;
  isRead?: boolean;
  moduleName?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  notificationType?: 'info' | 'warning' | 'error' | 'success';
}

export interface CreateNotificationPayload {
  userId?: string;
  moduleName: string;
  notificationText: string;
  notificationType: 'info' | 'warning' | 'error' | 'success';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  referenceId?: string;
  referenceType?: string;
  metadata?: Record<string, unknown>;
  expiresAt?: string;
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

// 1. GET /api/notifications - Get notifications with optional filters
export const getNotifications = async (
  params: NotificationQueryParams = {}
): Promise<NotificationResponse> => {
  try {
    const config = getAuthAxiosConfig();
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
    if (params.isRead !== undefined)
      queryParams.append('isRead', params.isRead.toString());
    if (params.moduleName) queryParams.append('moduleName', params.moduleName);
    if (params.priority) queryParams.append('priority', params.priority);
    if (params.notificationType)
      queryParams.append('notificationType', params.notificationType);

    const response = await axios.get(
      `/notifications?${queryParams.toString()}`,
      config
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// 2. POST /api/notifications - Create a new notification
export const createNotification = async (
  payload: CreateNotificationPayload
): Promise<Notification> => {
  try {
    const config = getAuthAxiosConfig();
    const response = await axios.post('/notifications', payload, config);
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// Helper function to get unread notifications count
export const getUnreadNotificationsCount = async (): Promise<number> => {
  try {
    const response = await getNotifications({
      isRead: false,
      limit: 0, // We just need the total count
    });
    return response.total;
  } catch (error: unknown) {
    console.error('Failed to fetch unread notifications count:', error);
    return 0;
  }
};

// Helper function to mark notification as read (using PUT to update)
export const markNotificationAsRead = async (
  notificationId: string
): Promise<void> => {
  try {
    const config = getAuthAxiosConfig();
    await axios.put(`/notifications/${notificationId}/read`, {}, config);
  } catch (error: unknown) {
    console.error('Failed to mark notification as read:', error);
  }
};

// Helper function to mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    const config = getAuthAxiosConfig();
    await axios.put('/notifications/mark-all-read', {}, config);
  } catch (error: unknown) {
    console.error('Failed to mark all notifications as read:', error);
  }
};

// Named export object for compatibility
const notificationService = {
  getNotifications,
  createNotification,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};

export default notificationService;
