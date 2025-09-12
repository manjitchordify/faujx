import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getExpertInterviews,
  formatInterviewDateTime,
  getInterviewTypeDisplayName,
} from '@/services/expert/interviewService';
import { Session } from '@/components/expert/shared/SessionCard';

export interface Interview {
  id: string;
  scheduledSlot: {
    startTime: string;
    endTime: string;
    timezone: string;
  };
  interviewType: string;
  status: string;
  notes: string;
  meetingLink: string;
  createdAt: string;
  interviewers: {
    id: string;
    name: string;
    designation: string;
    department: string;
  }[];
}

interface UseInterviewsReturn {
  interviews: Interview[];
  pendingSessions: Session[];
  confirmedSessions: Session[];
  confirmedCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Custom hook for managing interviews
export const useInterviews = (): UseInterviewsReturn => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformInterviewToSession = useCallback(
    (interview: Interview): Session => {
      const { date, time, duration } = formatInterviewDateTime(
        interview.scheduledSlot
      );
      const interviewer = interview.interviewers[0];

      return {
        id: interview.id,
        name: interviewer?.name || 'Unknown Interviewer',
        title: interviewer?.designation || 'Interviewer',
        rating: 0,
        query:
          interview.notes ||
          getInterviewTypeDisplayName(interview.interviewType),
        date,
        time,
        duration,
        avatar: null,
        status: interview.status === 'confirmed' ? 'accepted' : 'pending',
        meetingLink: interview.meetingLink,
        interviewType: interview.interviewType,
        department: interviewer?.department,
      };
    },
    []
  );

  const { pendingSessions, confirmedSessions, confirmedCount } = useMemo(() => {
    const transformedSessions = interviews.map(transformInterviewToSession);
    const pending = transformedSessions.filter(
      session => session.status === 'pending'
    );
    const confirmed = transformedSessions.filter(
      session => session.status === 'accepted'
    );

    return {
      pendingSessions: pending,
      confirmedSessions: confirmed,
      confirmedCount: confirmed.length,
    };
  }, [interviews, transformInterviewToSession]);

  const fetchInterviews = useCallback(async (): Promise<void> => {
    const isMounted = true; // Changed from let to const
    try {
      setLoading(true);
      setError(null);
      const data = await getExpertInterviews();
      if (isMounted) {
        setInterviews(data);
      }
    } catch (error) {
      if (isMounted) {
        console.error('Error fetching interviews:', error);
        setError('Failed to load interviews');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchInterviews(); // Call the existing fetchInterviews function
  }, [fetchInterviews]);

  return {
    interviews,
    pendingSessions,
    confirmedSessions,
    confirmedCount,
    loading,
    error,
    refetch: fetchInterviews,
  };
};
