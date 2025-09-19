import axios, { AxiosResponse, AxiosError } from 'axios';
import { getAuthAxiosConfig } from '@/utils/apiHeader';

// ----------------------
// Types for fetching mentors/experts
// ----------------------
export interface Expert {
  id: string;
  userId: string;
  role: string;
  rating: number;
  skills: string[];
  experience: string;
  price: string;
  profilePic: string;
  availableSlots: string[];
  isAvailable: boolean;
  user: ExpertUser;
}

export interface ExpertUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string | null;
  phone: string;
  profilePic: string | null;
  dateOfBirth: string;
  location: string;
  userType: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isSubscribed: boolean;
  isPremium: boolean;
}

export interface ExpertResponse {
  message: string;
  data: Expert[];
  total: number;
  page: number;
  limit: number;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  skills: string[];
  experience: string;
  price: number;
}

export interface FetchMentorsParams {
  page?: number;
  limit?: number;
  search?: string;
}

// ----------------------
// Types for booking mentor
// ----------------------
export interface BookMentorParams {
  expertId: string;
  bookingDate: string; // ISO string format like "2024-12-15T14:00:00.000Z"
  durationMinutes: number;
  notes: string;
}

export interface BookingData {
  id: string;
  expertId: string;
  candidateId: string;
  bookingDate: string;
  durationMinutes: number;
  status: string;
  hourly_rate: number;
  total_amount: number;
  currency: string;
  stripe_session_url: string;
  payment_intent_id: string;
}

export interface BookMentorResponse {
  success: boolean;
  message: string;
  id: string;
  expertId: string;
  candidateId: string;
  bookingDate: string;
  durationMinutes: number;
  status: string;
  hourly_rate: number;
  total_amount: number;
  currency: string;
  stripe_session_url: string;
  payment_intent_id: string;
}

export interface BookingResponse {
  id: string;

  candidate_id: string;
  expert_id: string;
  booking_date: string;
  duration_minutes: number;
  hourly_rate: string;
  total_amount: string;
  currency: string;
  status: string;
  notes: string;
  meeting_link?: string;
  created_at: string;
  updated_at: string;
  payments?: Record<string, unknown>[];
}

// ----------------------
// Common error interface
// ----------------------
export interface ApiError {
  status: number;
  message: string;
  data?: unknown;
  code?: string;
}

// ----------------------
// Common error handling
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
// Fetch Mentors/Experts API
// ----------------------
export async function fetchMentorsApi(
  params: FetchMentorsParams = {}
): Promise<{ mentors: Mentor[]; total: number }> {
  try {
    const { page = 1, limit = 6, search } = params;

    let url = `https://devapi.faujx.com/api/experts/getexperts?page=${page}&limit=${limit}`;

    if (search && search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch experts: ${response.statusText}`);
    }

    const data: ExpertResponse = await response.json();

    const transformedMentors: Mentor[] = data.data.map((expert: Expert) => ({
      id: expert.id,
      name: `${expert.user.firstName} ${expert.user.lastName}`,
      role: expert.role.trim(),
      avatar: expert.profilePic || '/default-avatar.png',
      rating: expert.rating,
      skills: expert.skills,
      experience: expert.experience,
      price: parseFloat(expert.price),
    }));

    return {
      mentors: transformedMentors,
      total: data.total,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw {
        status: 0,
        message: error.message,
        code: 'FETCH_ERROR',
      } as ApiError;
    }

    throw {
      status: 0,
      message: 'Failed to fetch mentors',
      code: 'UNKNOWN_ERROR',
    } as ApiError;
  }
}

// ----------------------
// Book Mentor API
// ----------------------
export async function bookMentorApi(
  params: BookMentorParams
): Promise<BookMentorResponse> {
  try {
    const config = getAuthAxiosConfig();

    const response: AxiosResponse<BookMentorResponse> = await axios.post(
      `/booking/book-a-mentor?expertId=${params.expertId}`,
      {
        expertId: params.expertId,
        bookingDate: params.bookingDate,
        durationMinutes: params.durationMinutes,
        notes: params.notes,
      },
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function fetchAllMentorBookingApi(): Promise<BookingResponse[]> {
  try {
    const config = getAuthAxiosConfig();

    const response: AxiosResponse<BookingResponse[]> = await axios.get(
      `/booking/bookings`,
      config
    );

    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export function formatDateForBooking(date: Date): string {
  return date.toISOString();
}

// ----------------------
// Helper function to create booking params
// ----------------------
export function createBookingParams(
  expertId: string,
  bookingDate: Date,
  notes: string,
  durationMinutes: number = 60
): BookMentorParams {
  return {
    expertId,
    bookingDate: formatDateForBooking(bookingDate),
    durationMinutes,
    notes,
  };
}
