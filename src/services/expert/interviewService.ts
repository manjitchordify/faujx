import { getAuthAxiosConfig } from '@/utils/apiHeader';
import axios, { AxiosResponse, AxiosError } from 'axios';

// ----------------------
// API Response Types
// ----------------------
export interface ApiInterviewer {
  id: string;
  name: string;
  designation: string;
  department: string;
}

export interface ApiScheduledSlot {
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface ApiInterview {
  id: string;
  scheduledSlot: ApiScheduledSlot;
  interviewType: string;
  status: string;
  notes: string;
  meetingLink: string;
  createdAt: string;
  interviewers: ApiInterviewer[];
}

// ----------------------
// Error interface
// ----------------------
export interface ApiError {
  status: number;
  message: string;
  data?: unknown;
  code?: string;
}

// ----------------------
// Error handling
// ----------------------
function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    if (axiosError.response) {
      throw {
        status: axiosError.response.status,
        message: axiosError.response.data?.message || axiosError.message,
        data: axiosError.response.data,
      } as ApiError;
    } else if (axiosError.request) {
      throw {
        status: 0,
        message: 'Network error',
        code: 'NETWORK_ERROR',
      } as ApiError;
    } else {
      throw {
        status: 0,
        message: axiosError.message || 'Request setup error',
        code: 'REQUEST_ERROR',
      } as ApiError;
    }
  }

  throw {
    status: 0,
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  } as ApiError;
}

// ----------------------
// Main API Function
// ----------------------

/**
 * Fetch all interviews for the current expert
 */
export async function getExpertInterviews(): Promise<ApiInterview[]> {
  try {
    const config = getAuthAxiosConfig();
    const response: AxiosResponse<ApiInterview[]> = await axios.get(
      'experts/interviews',
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

// ----------------------
// Utility functions for display
// ----------------------

/**
 * Format interview date and time for display
 */
export function formatInterviewDateTime(scheduledSlot: ApiScheduledSlot): {
  date: string;
  time: string;
  duration: string;
} {
  const startTime = new Date(scheduledSlot.startTime);
  const endTime = new Date(scheduledSlot.endTime);

  // Calculate duration in minutes
  const durationMs = endTime.getTime() - startTime.getTime();
  const durationMinutes = Math.round(durationMs / (1000 * 60));

  // Format date
  const date = startTime.toLocaleDateString('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Format time
  const time = startTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  // Format duration
  const duration =
    durationMinutes >= 60
      ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`
      : `${durationMinutes}m`;

  return {
    date,
    time: `${time} (${scheduledSlot.timezone})`,
    duration,
  };
}

/**
 * Get interview type display name
 */
export function getInterviewTypeDisplayName(type: string): string {
  const typeMap: Record<string, string> = {
    technical: 'Technical Interview',
    behavioral: 'Behavioral Interview',
    'system-design': 'System Design Interview',
    cultural: 'Cultural Fit Interview',
  };

  return typeMap[type] || type;
}

/**
 * Get status color for UI
 */
export function getStatusColor(status: string): {
  bg: string;
  text: string;
  border: string;
} {
  const statusColors: Record<
    string,
    {
      bg: string;
      text: string;
      border: string;
    }
  > = {
    confirmed: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    },
    pending: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
    },
    cancelled: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },
    completed: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
  };

  return statusColors[status] || statusColors['pending'];
}
