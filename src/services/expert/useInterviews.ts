import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getExpertBookings,
  formatBookingDateTime,
  acceptBooking,
  declineBooking,
  ApiBooking,
  GetBookingsParams,
} from '@/services/expert/interviewService';
import { Session } from '@/components/expert/shared/SessionCard';

export interface Interview {
  id: string;
  candidateId: string;
  expertId: string;
  bookingDate: string;
  durationMinutes: number;
  hourlyRate: number;
  totalAmount: number;
  currency: string;
  status: string;
  notes: string;
  meetingLink: string;
  createdAt: string;
  updatedAt: string;
}

interface UseInterviewsReturn {
  interviews: Interview[];
  bookings: ApiBooking[];
  pendingSessions: Session[];
  confirmedSessions: Session[];
  declinedSessions: Session[];
  confirmedCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  fetchBookings: (params?: GetBookingsParams) => Promise<void>;
  acceptSession: (sessionId: string) => Promise<void>;
  declineSession: (sessionId: string) => Promise<void>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
}

// Transform booking to interview format for backward compatibility
function transformBookingToInterview(booking: ApiBooking): Interview {
  return {
    id: booking.id,
    candidateId: booking.candidate_id,
    expertId: booking.expert_id,
    bookingDate: booking.booking_date,
    durationMinutes: booking.duration_minutes,
    hourlyRate: booking.hourly_rate,
    totalAmount: booking.total_amount,
    currency: booking.currency,
    status: booking.status,
    notes: booking.notes,
    meetingLink: booking.meeting_link,
    createdAt: booking.created_at,
    updatedAt: booking.updated_at,
  };
}

// Custom hook for managing interviews and bookings
export const useInterviews = (
  initialParams?: GetBookingsParams
): UseInterviewsReturn => {
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [pagination, setPagination] = useState<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transform booking to session format
  const transformBookingToSession = useCallback(
    (booking: ApiBooking): Session => {
      const { date, time, duration } = formatBookingDateTime(booking);

      // Map API status to session status
      let sessionStatus: 'pending' | 'accepted' | 'declined' | 'cancelled';
      switch (booking.status) {
        case 'confirmed':
          sessionStatus = 'accepted';
          break;
        case 'cancelled':
          sessionStatus = 'declined';
          break;
        case 'pending':
        default:
          sessionStatus = 'pending';
          break;
      }

      return {
        id: booking.id,
        name: `Candidate ${booking.candidate_id.substring(0, 8)}...`,
        title: 'Interview Session',
        rating: 0,
        query: booking.notes || 'Scheduled interview session',
        date,
        time,
        duration,
        avatar: null,
        status: sessionStatus,
        meetingLink: booking.meeting_link,
        interviewType: 'technical',
        department: 'Engineering',
      };
    },
    []
  );

  // Memoized transformations
  const interviews = useMemo(() => {
    return bookings.map(transformBookingToInterview);
  }, [bookings]);

  const {
    pendingSessions,
    confirmedSessions,
    declinedSessions,
    confirmedCount,
  } = useMemo(() => {
    const transformedSessions = bookings.map(transformBookingToSession);

    const pending = transformedSessions.filter(
      session => session.status === 'pending'
    );
    const confirmed = transformedSessions.filter(
      session => session.status === 'accepted'
    );
    const declined = transformedSessions.filter(
      session => session.status === 'declined'
    );

    return {
      pendingSessions: pending,
      confirmedSessions: confirmed,
      declinedSessions: declined,
      confirmedCount: confirmed.length,
    };
  }, [bookings, transformBookingToSession]);

  // Fetch bookings from API
  const fetchBookings = useCallback(
    async (params: GetBookingsParams = {}): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const response = await getExpertBookings({
          ...initialParams,
          ...params,
        });
        setBookings(response.data);
        setPagination({
          total: response.total,
          page: response.page,
          limit: response.limit,
          totalPages: response.totalPages,
        });
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    },
    [initialParams]
  );

  // Accept session function
  const acceptSession = useCallback(
    async (sessionId: string): Promise<void> => {
      try {
        setLoading(true);
        await acceptBooking(sessionId);
        // Refresh data after accepting
        await fetchBookings(initialParams);
      } catch (error) {
        console.error('Error accepting booking:', error);
        setError('Failed to accept booking');
        throw error; // Re-throw so the UI can handle it
      } finally {
        setLoading(false);
      }
    },
    [fetchBookings, initialParams]
  );

  // Decline session function
  const declineSession = useCallback(
    async (sessionId: string): Promise<void> => {
      try {
        setLoading(true);
        await declineBooking(sessionId);
        // Refresh data after declining
        await fetchBookings(initialParams);
      } catch (error) {
        console.error('Error declining booking:', error);
        setError('Failed to decline booking');
        throw error; // Re-throw so the UI can handle it
      } finally {
        setLoading(false);
      }
    },
    [fetchBookings, initialParams]
  );

  // Main refetch function
  const refetch = useCallback(async (): Promise<void> => {
    await fetchBookings(initialParams);
  }, [fetchBookings, initialParams]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    interviews,
    bookings,
    pendingSessions,
    confirmedSessions,
    declinedSessions,
    confirmedCount,
    loading,
    error,
    refetch,
    fetchBookings,
    acceptSession,
    declineSession,
    pagination,
  };
};
