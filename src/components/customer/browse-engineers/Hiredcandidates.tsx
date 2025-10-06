// Handle image error for profile pictures
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const target = e.target as HTMLImageElement;
  target.style.display = 'none';
  const fallbackDiv = target.nextElementSibling as HTMLDivElement;
  if (fallbackDiv) {
    fallbackDiv.style.display = 'flex';
  }
};
import React, { useState, useEffect } from 'react';
import { CustomerTabs } from '@/types/customer';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  getHiredCandidatesApi,
  HiredCandidate,
  ApiError,
} from '@/services/hiredService';

interface HiredCandidatesProps {
  setSelectedTab: (tab: CustomerTabs) => void;
  selectedTab: CustomerTabs;
  // Filter props from Dashboard
  selectedRole?: string;
  selectedMonth?: string;
  selectedYear?: string;
}

const HiredCandidates: React.FC<HiredCandidatesProps> = ({
  selectedRole,
  selectedMonth,
  selectedYear,
}) => {
  const router = useRouter();

  // State management
  const [hiredCandidates, setHiredCandidates] = useState<HiredCandidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  // Fetch hired candidates from API
  const fetchHiredCandidates = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getHiredCandidatesApi({ page, limit: 12 });

      setHiredCandidates(response.candidates);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to fetch hired candidates');
      console.error('Error fetching hired candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchHiredCandidates(1);
  }, []);

  // Apply filters to the candidates
  const filterCandidates = (candidates: HiredCandidate[]): HiredCandidate[] => {
    return candidates.filter(candidate => {
      // Filter by role - using candidateRole from API
      if (selectedRole && candidate.candidateRole !== selectedRole) {
        return false;
      }

      // Filter by hire date month/year
      if (selectedMonth || selectedYear) {
        const hireDate = new Date(candidate.hireDate);
        const hireMonth = (hireDate.getMonth() + 1).toString().padStart(2, '0');
        const hireYear = hireDate.getFullYear().toString();

        if (selectedMonth && hireMonth !== selectedMonth) {
          return false;
        }

        if (selectedYear && hireYear !== selectedYear) {
          return false;
        }
      }

      return true;
    });
  };

  // Get filtered candidates
  const filteredCandidates = filterCandidates(hiredCandidates);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Helper function to get candidate initials for avatar
  const getCandidateInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || '';
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  };

  // Helper function to get role color
  const getRoleColor = (role: string) => {
    const colors = {
      'Front-end': 'bg-blue-100 text-blue-800',
      'Back-end': 'bg-green-100 text-green-800',
      'Full-stack': 'bg-purple-100 text-purple-800',
      Mobile: 'bg-orange-100 text-orange-800',
      DevOps: 'bg-red-100 text-red-800',
      Data: 'bg-indigo-100 text-indigo-800',
      QA: 'bg-yellow-100 text-yellow-800',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Handle pagination
  const handlePageChange = async (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      await fetchHiredCandidates(newPage);
    }
  };

  // Handle view details action
  const handleViewDetails = (candidateId: string, candidateName: string) => {
    console.log(
      `Viewing details for candidate: ${candidateName} (ID: ${candidateId})`
    );
    router.push(`/customer/browse-engineers/hired/${candidateId}`);
  };

  // Handle retry on error
  const handleRetry = () => {
    fetchHiredCandidates(currentPage);
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full">
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <h2 className="text-xl font-semibold text-red-800">
              Error Loading Hired Candidates
            </h2>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h2 className="text-xl font-semibold text-green-800">
              Hired Candidates
            </h2>
          </div>
        </div>
        <p className="text-green-700 mb-4">
          Candidates who have successfully completed the hiring process and are
          now part of your team.
        </p>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map(candidate => {
          const candidateName =
            `${candidate.firstName} ${candidate.lastName || ''}`.trim();
          const candidateInitials = getCandidateInitials(
            candidate.firstName,
            candidate.lastName
          );
          const hireDate = formatDate(candidate.hireDate);
          const interviewDate = formatDate(candidate.interviewDate);
          const roleColorClass = getRoleColor(candidate.candidateRole);

          return (
            <div
              key={candidate.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-green-300"
            >
              {/* Candidate Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative w-14 h-14 flex-shrink-0">
                  {candidate.profilePic ? (
                    <>
                      <Image
                        src={candidate.profilePic}
                        alt={candidateName}
                        width={56}
                        height={56}
                        className="rounded-full object-cover border-2 border-green-200"
                        unoptimized
                        onError={handleImageError}
                      />
                      <div
                        className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg absolute inset-0"
                        style={{ display: 'none' }}
                      >
                        {candidateInitials}
                      </div>
                    </>
                  ) : (
                    <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {candidateInitials}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate text-lg">
                    {candidateName}
                  </h3>
                  <div
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${roleColorClass} mb-2`}
                  >
                    {candidate.candidateRole}
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-600 flex items-center gap-1">
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
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="truncate">{candidate.email}</span>
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
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
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span>{candidate.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Information */}
              <div className="space-y-3 mb-4 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Interview:
                  </span>
                  <span className="font-medium text-blue-700">
                    {interviewDate}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Hired:
                  </span>
                  <span className="font-medium text-green-700">{hireDate}</span>
                </div>
              </div>

              {/* Interview Feedback (if available) */}
              {candidate.interviewFeedback && (
                <div className="mb-4">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                    <p className="text-sm text-blue-800 font-medium mb-1">
                      Interview Feedback:
                    </p>
                    <p className="text-sm text-blue-700 italic">
                      &ldquo;{candidate.interviewFeedback}&rdquo;
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() =>
                    handleViewDetails(candidate.userId, candidateName)
                  }
                  className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  View Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing page {currentPage} of {totalPages} ({total} total
              candidates)
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                First
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <span className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium">
                {currentPage}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State - Show when no candidates */}
      {filteredCandidates.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            No Hired Candidates Found
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {selectedRole || selectedMonth || selectedYear
              ? 'No candidates match the current filters. Try adjusting your filter criteria.'
              : "You haven't hired any candidates yet. Once you hire candidates, they'll appear here."}
          </p>
        </div>
      )}
    </div>
  );
};

export default HiredCandidates;
