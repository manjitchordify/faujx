import React, { useEffect, useState } from 'react';
import { CustomerTabs } from '@/types/customer';
import {
  InterviewDetails,
  Candidate,
  getMyInterviews,
} from '@/services/customer/scheduledCompletedInterviewService';
import { jitsiLiveUrl } from '@/services/jitsiService';
import { useAppSelector } from '@/store/store';
import Cookies from 'js-cookie';
import { showToast } from '@/utils/toast/Toast';
import { useRouter } from 'next/navigation';

interface ScheduledInterviewsProps {
  setSelectedTab: (tab: CustomerTabs) => void;
  selectedTab: CustomerTabs;
  selectedRole?: string;
  selectedMonth?: string;
  selectedYear?: string;
}

const ScheduledInterviews: React.FC<ScheduledInterviewsProps> = ({
  selectedRole = '',
  selectedMonth = '',
  selectedYear = '',
}) => {
  // Local state for interview data
  const [scheduledInterviews, setScheduledInterviews] = useState<
    InterviewDetails[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { loggedInUser } = useAppSelector(state => state.user);
  const isLoggedIn = !!loggedInUser?.accessToken;
  const router = useRouter();

  // Fetch interviews data
  useEffect(() => {
    const fetchInterviews = async () => {
      if (!isLoggedIn) return;

      try {
        setLoading(true);
        setError(null);
        const response = await getMyInterviews();
        setScheduledInterviews(response.scheduled || []);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch interviews';
        setError(errorMessage);
        console.error('Error fetching interviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [isLoggedIn]);

  // Filter interviews based on props
  const getFilteredInterviews = (): InterviewDetails[] => {
    return scheduledInterviews.filter(interview => {
      // Filter by role
      if (selectedRole) {
        const candidateRole = interview.candidate.candidate?.roleTitle;
        if (!candidateRole || candidateRole !== selectedRole) {
          return false;
        }
      }

      // Filter by month and year
      if (selectedMonth || selectedYear) {
        const interviewDate = new Date(interview.startTime);
        const interviewMonth = (interviewDate.getMonth() + 1).toString(); // getMonth() returns 0-11
        const interviewYear = interviewDate.getFullYear().toString();

        if (selectedMonth && interviewMonth !== selectedMonth) {
          return false;
        }

        if (selectedYear && interviewYear !== selectedYear) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredInterviews = getFilteredInterviews();

  // Handle join interview with Jitsi URL logic
  // Extend InterviewDetails to include optional meetingId
  type InterviewWithMeetingId = InterviewDetails & {
    meetingId?: string;
  };

  const handleJoinInterview = async (interview: InterviewWithMeetingId) => {
    try {
      const meetingId = interview.meetingId;

      if (meetingId) {
        // Use Jitsi logic if we have a meetingId
        const response = await jitsiLiveUrl({
          userId: loggedInUser?.id as string,
          sessionId: meetingId,
          role: 'INTERVIEW_PANEL',
        });

        if (response?.url) {
          Cookies.set('jwt_token', response?.jwt);
          window.open(
            `/customer/interviews/${interview.id}/meeting?room=${meetingId}`
          );
        }
      } else if (interview.meetingLink) {
        // Fall back to original behavior - open external meeting link directly
        window.open(interview.meetingLink, '_blank');
      } else {
        showToast('Meeting link not available', 'error');
      }
    } catch (error: unknown) {
      const message = (error as Error)?.message || 'An error occurred';
      showToast(message, 'error');
    }
  };

  // Check if interview is happening now or soon (within 30 minutes)
  const isInterviewSoon = (startTime: string) => {
    const now = new Date();
    const interviewTime = new Date(startTime);
    const timeDiff = interviewTime.getTime() - now.getTime();
    return timeDiff <= 30 * 60 * 1000 && timeDiff >= -60 * 60 * 1000;
  };

  // Helper function to format date and time from ISO string
  const formatDateTime = (startTimeString: string) => {
    const startDate = new Date(startTimeString);

    const dateStr = startDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const timeStr = startDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return { dateStr, timeStr };
  };

  // Helper function to get candidate display name
  const getCandidateName = (candidate: Candidate) => {
    if (candidate.fullName) return candidate.fullName;
    const fullName =
      `${candidate.firstName} ${candidate.lastName || ''}`.trim();
    return fullName || candidate.email.split('@')[0];
  };

  // Helper function to calculate duration
  const getDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return diffMinutes > 0
        ? `${diffHours}h ${diffMinutes}m`
        : `${diffHours}h`;
    }
    return `${diffMinutes}m`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
            <h2 className="text-xl font-semibold text-amber-800">
              Scheduled Interviews
            </h2>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Error Loading Interviews
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
          <h2 className="text-xl font-semibold text-amber-800">
            Scheduled Interviews
          </h2>
        </div>
        <p className="text-amber-700 mb-4">
          Candidates with scheduled interviews awaiting your confirmation or
          completion.
        </p>
      </div>

      {/* Interview Cards Grid - Fixed layout with visible buttons */}
      {filteredInterviews.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">
          {filteredInterviews.map(interview => {
            const { dateStr, timeStr } = formatDateTime(interview.startTime);
            const candidateName = getCandidateName(interview.candidate);
            const duration = getDuration(
              interview.startTime,
              interview.endTime
            );
            const isSoon = isInterviewSoon(interview.startTime);

            return (
              <div
                key={interview.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row h-full">
                  {/* Left - Profile Image Section */}
                  <div className="relative w-full sm:w-48 h-48 sm:h-full bg-gray-300 flex-shrink-0">
                    {interview.candidate.profilePic ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={interview.candidate.profilePic}
                        alt={candidateName}
                        className="w-full h-full object-cover"
                        onError={e => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const fallbackDiv =
                              parent.querySelector('.image-fallback');
                            if (fallbackDiv) {
                              fallbackDiv.classList.remove('hidden');
                            }
                          }
                        }}
                      />
                    ) : null}

                    {/* Image fallback - Gray placeholder with user icon or dummy image */}
                    <div
                      className={`image-fallback w-full h-full flex items-center justify-center ${interview.candidate.profilePic ? 'hidden' : ''}`}
                    >
                      {/* Option 1: Dummy image from placeholder service */}
                      {/* <img
                        src={`https://picsum.photos/200/280?random=${interview.id}`}
                        alt="Placeholder"
                        className="w-full h-full object-cover"
                      /> */}

                      {/* Option 2: Gray background with user icon */}
                      <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                        <svg
                          className="w-16 h-16 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                    </div>

                    {/* Star icon */}
                    <div className="absolute top-3 right-3">
                      <div className="w-8 h-8 bg-black bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>

                    {/* Status Badge on image */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                        Scheduled
                      </span>
                    </div>
                  </div>

                  {/* Right - Content Section */}
                  <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                    <div className="flex-grow">
                      {/* Role Title */}
                      <div className="mb-2">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900">
                          {interview.candidate.candidate?.roleTitle ||
                            'No Role Specified'}
                        </h3>
                      </div>
                      {/* Candidate Name */}
                      <div className="mb-3">
                        <h4 className="text-sm font-bold text-gray-900">
                          {candidateName}
                        </h4>
                      </div>

                      {/* Interview Details */}
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center text-sm">
                          <span className="font-semibold text-gray-700 w-16 sm:w-20">
                            Date:
                          </span>
                          <span className="text-gray-600">{dateStr}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="font-semibold text-gray-700 w-16 sm:w-20">
                            Time:
                          </span>
                          <span className="text-gray-600">{timeStr}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="font-semibold text-gray-700 w-16 sm:w-20">
                            Duration:
                          </span>
                          <span className="text-gray-600">{duration}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Always visible at bottom */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-100">
                      <div className="relative flex-1 group">
                        <button
                          className={`w-full font-medium py-2.5 px-3 rounded-md text-sm transition-colors duration-200 flex items-center justify-center gap-2 text-white ${
                            isSoon
                              ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                          onClick={() => handleJoinInterview(interview)}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          {isSoon ? 'JOIN NOW' : 'Join Interview'}
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          const candidateProfileId =
                            interview.candidate.candidate?.id;
                          router.push(
                            `/customer/browse-engineers/${candidateProfileId}/profile`
                          );
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-3 rounded-md text-sm transition-colors duration-200"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State - Show when no interviews or no filtered results */}
      {filteredInterviews.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-amber-400 rounded-full animate-pulse"></div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {scheduledInterviews.length === 0
              ? 'No Scheduled Interviews'
              : 'No Interviews Match Your Filters'}
          </h3>
          <p className="text-gray-500">
            {scheduledInterviews.length === 0
              ? "You don't have any interviews scheduled at the moment."
              : 'Try adjusting your filter criteria to see more results.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ScheduledInterviews;
