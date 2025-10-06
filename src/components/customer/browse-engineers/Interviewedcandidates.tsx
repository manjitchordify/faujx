import React, { useEffect, useState } from 'react';
import { CustomerTabs } from '@/types/customer';
import {
  InterviewDetails,
  Candidate,
  getMyInterviews,
} from '@/services/customer/scheduledCompletedInterviewService';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/store';

interface InterviewedCandidatesProps {
  setSelectedTab: (tab: CustomerTabs) => void;
  selectedTab: CustomerTabs;
  selectedRole?: string;
  selectedMonth?: string;
  selectedYear?: string;
}

const InterviewedCandidates: React.FC<InterviewedCandidatesProps> = ({
  selectedRole = '',
  selectedMonth = '',
  selectedYear = '',
}) => {
  // Local state for interview data
  const [completedInterviews, setCompletedInterviews] = useState<
    InterviewDetails[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loggedInUser = useAppSelector(state => state.user.loggedInUser);
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
        setCompletedInterviews(response.completed || []);
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
    return completedInterviews.filter(interview => {
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

  // Helper function to format date
  const formatInterviewDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Helper function to get candidate name
  const getCandidateName = (candidate: Candidate) => {
    if (candidate.fullName) return candidate.fullName;
    const fullName =
      `${candidate.firstName} ${candidate.lastName || ''}`.trim();
    return fullName || candidate.email.split('@')[0];
  };

  // Handle hire action
  const handleHire = (
    candidateId: string,
    interviewId: string,
    userId: string
  ) => {
    router.push(
      `/customer/browse-engineers/${candidateId}/interview/${interviewId}/candidate-pricing?userId=${userId}`
    );
  };

  // Handle reject action
  const handleReject = (candidateId: string, candidateName: string) => {
    console.log(`Rejecting candidate: ${candidateName} (ID: ${candidateId})`);
    // Add your reject logic here
    alert(`Rejecting candidate ${candidateName}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <h2 className="text-xl font-semibold text-blue-800">
              Interviewed Candidates
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
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <h2 className="text-xl font-semibold text-blue-800">
            Interviewed Candidates
          </h2>
        </div>
        <p className="text-blue-700 mb-4">
          Candidates who have completed their interview process and are awaiting
          next steps.
        </p>
      </div>

      {/* Interview Results Grid */}
      {filteredInterviews.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">
          {filteredInterviews.map(interview => {
            const candidateName = getCandidateName(interview.candidate);
            const interviewDate = formatInterviewDate(interview.startTime);

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

                    {/* Image fallback - Gray placeholder with user icon */}
                    <div
                      className={`image-fallback w-full h-full flex items-center justify-center ${interview.candidate.profilePic ? 'hidden' : ''}`}
                    >
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

                    {/* Status Badge on image */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${
                          interview.interviewResult
                            ? interview.interviewResult === 'excellent'
                              ? 'bg-green-500'
                              : interview.interviewResult === 'good'
                                ? 'bg-blue-500'
                                : interview.interviewResult === 'average'
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                            : 'bg-green-500'
                        }`}
                      >
                        {interview.interviewResult
                          ? interview.interviewResult.charAt(0).toUpperCase() +
                            interview.interviewResult.slice(1)
                          : 'Completed'}
                      </span>
                    </div>

                    {/* Score Badge on image */}
                    {interview.interviewScore && (
                      <div className="absolute top-3 right-3">
                        <div className="w-12 h-12 bg-black bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <span className="text-white font-bold text-xs">
                            {interview.interviewScore}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right - Content Section */}
                  <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                    <div className="flex-grow">
                      {/* Role Title - Added using correct nested path */}
                      <div className="mb-2">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900">
                          {interview.candidate.candidate?.roleTitle ||
                            'No Role Specified'}
                        </h3>
                      </div>
                      {/* Candidate Name */}
                      <div className="mb-2">
                        <h4 className="text-sm font-bold text-gray-900">
                          {candidateName}
                        </h4>
                      </div>
                      <div className="mb-3">
                        <button
                          onClick={() => {
                            const candidateProfileId =
                              interview.candidate.candidate?.id;
                            router.push(
                              `/customer/browse-engineers/${candidateProfileId}/profile`
                            );
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline mt-1 cursor-pointer bg-transparent border-none p-0"
                        >
                          View Details →
                        </button>
                      </div>

                      {/* Interview Details */}
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center text-sm">
                          <span className="font-semibold text-gray-700 w-16 sm:w-20">
                            Date:
                          </span>
                          <span className="text-gray-600">{interviewDate}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="font-semibold text-gray-700 w-16 sm:w-20">
                            Duration:
                          </span>
                          <span className="text-gray-600">1 hour</span>
                        </div>
                        {interview.interviewScore && (
                          <div className="flex items-center text-sm">
                            <span className="font-semibold text-gray-700 w-16 sm:w-20">
                              Score:
                            </span>
                            <span className="text-gray-600 font-bold">
                              {interview.interviewScore}/100
                            </span>
                          </div>
                        )}
                        <div className="flex items-center text-sm">
                          <span className="font-semibold text-gray-700 w-16 sm:w-20">
                            Location:
                          </span>
                          <span className="text-gray-600">
                            {interview.candidate.location || 'Remote'}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {interview.interviewScore && (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Overall Score</span>
                            <span>{interview.interviewScore}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                interview.interviewScore >= 90
                                  ? 'bg-green-500'
                                  : interview.interviewScore >= 80
                                    ? 'bg-blue-500'
                                    : interview.interviewScore >= 70
                                      ? 'bg-yellow-500'
                                      : 'bg-red-500'
                              }`}
                              style={{ width: `${interview.interviewScore}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons - Always visible at bottom */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() =>
                          handleHire(
                            interview.candidate?.candidate?.id ?? '',
                            interview.id,
                            interview.candidate?.id ?? ''
                          )
                        }
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-3 rounded-md text-sm transition-colors duration-200"
                      >
                        Hire Now
                      </button>
                      <button
                        onClick={() =>
                          handleReject(interview.candidate.id, candidateName)
                        }
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-3 rounded-md text-sm transition-colors duration-200"
                      >
                        Reject
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
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            {completedInterviews.length === 0
              ? 'No Completed Interviews'
              : 'No Interviews Match Your Filters'}
          </h3>
          <p className="text-gray-500">
            {completedInterviews.length === 0
              ? "You haven't completed any interviews yet."
              : 'Try adjusting your filter criteria to see more results.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default InterviewedCandidates;
