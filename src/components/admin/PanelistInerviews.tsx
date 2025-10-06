'use client';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiSearch,
  FiEye,
  FiRefreshCw,
  FiUsers,
  FiBriefcase,
} from 'react-icons/fi';
import {
  getInterviewPanelInterviews,
  type Interview,
  type InterviewListResponse,
  type InterviewListParams,
} from '@/services/admin-panelist-services/interviewPanelService';
import { showToast } from '@/utils/toast/Toast';

type TabType = 'engineer' | 'expert';

function PanelistInterviews() {
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myActionFilter, setMyActionFilter] = useState<string>('pending');
  const [activeTab, setActiveTab] = useState<TabType>('engineer');

  // Pagination state from API
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Separate counts for each tab (fetched from API separately if needed)
  const [tabCounts, setTabCounts] = useState({
    engineer: 0,
    expert: 0,
  });

  // Client-side search filtering (only filters current page results)
  const filteredInterviews = useMemo(() => {
    if (!searchTerm) return interviews || [];

    const searchLower = searchTerm.toLowerCase();
    return (interviews || []).filter(interview => {
      return (
        (interview?.candidateName || '').toLowerCase().includes(searchLower) ||
        (interview?.candidateEmail || '').toLowerCase().includes(searchLower) ||
        (interview?.id || '').toLowerCase().includes(searchLower)
      );
    });
  }, [interviews, searchTerm]);

  // Fetch interviews from API with proper parameters
  const fetchInterviews = useCallback(
    async (
      page: number = 1,
      myAction?: string,
      participantType?: 'candidate' | 'expert'
    ) => {
      try {
        setLoading(true);
        setError(null);

        const params: InterviewListParams = {
          page,
          limit: 10,
          sortBy: 'scheduledAt',
          sortOrder: 'DESC',
        };

        if (myAction) {
          params.myAction = myAction;
        }

        if (participantType) {
          params.participantType = participantType;
        }

        const response: InterviewListResponse =
          await getInterviewPanelInterviews(params);

        setInterviews(response?.data || []);
        setPagination(
          response?.pagination || {
            currentPage: page,
            totalPages: 1,
            totalCount: 0,
            limit: 10,
            hasNextPage: false,
            hasPreviousPage: false,
          }
        );

        // Update tab count for current tab
        if (participantType === 'candidate') {
          setTabCounts(prev => ({
            ...prev,
            engineer: response?.pagination?.totalCount || 0,
          }));
        } else if (participantType === 'expert') {
          setTabCounts(prev => ({
            ...prev,
            expert: response?.pagination?.totalCount || 0,
          }));
        }
      } catch (err: unknown) {
        let errorMessage = 'Failed to fetch interviews';

        if (err && typeof err === 'object' && 'message' in err) {
          errorMessage = (err as { message: string }).message;
        }

        setError(errorMessage);
        console.error('Error fetching interviews:', err);
        showToast(errorMessage, 'error');

        setInterviews([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          limit: 10,
          hasNextPage: false,
          hasPreviousPage: false,
        });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Fetch count for the other tab (optional - for display purposes)
  const fetchTabCount = useCallback(
    async (participantType: 'candidate' | 'expert') => {
      try {
        const params: InterviewListParams = {
          page: 1,
          limit: 1, // We only need the count
          participantType,
          myAction: myActionFilter,
        };

        const response: InterviewListResponse =
          await getInterviewPanelInterviews(params);

        if (participantType === 'candidate') {
          setTabCounts(prev => ({
            ...prev,
            engineer: response?.pagination?.totalCount || 0,
          }));
        } else {
          setTabCounts(prev => ({
            ...prev,
            expert: response?.pagination?.totalCount || 0,
          }));
        }
      } catch (err) {
        console.error('Error fetching tab count:', err);
      }
    },
    [myActionFilter]
  );

  // Main effect: Fetch interviews when page, filter, or tab changes
  useEffect(() => {
    const participantType = activeTab === 'engineer' ? 'candidate' : 'expert';
    fetchInterviews(currentPage, myActionFilter, participantType);

    // Also fetch count for the other tab
    const otherParticipantType =
      activeTab === 'engineer' ? 'expert' : 'candidate';
    fetchTabCount(otherParticipantType);
  }, [currentPage, myActionFilter, activeTab, fetchInterviews, fetchTabCount]);

  // Reset to page 1 when tab or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, myActionFilter]);

  // Handle filter changes
  const handleMyActionFilterChange = (myAction: string) => {
    setMyActionFilter(myAction);
  };

  // Handle tab change
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchTerm(''); // Clear search when switching tabs
  };

  const handleViewDetails = (interviewId: string) => {
    router.push(`/panelist/interviews/${interviewId}`);
  };

  const handleRefresh = () => {
    const participantType = activeTab === 'engineer' ? 'candidate' : 'expert';
    fetchInterviews(currentPage, myActionFilter, participantType);
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) {
      return { date: 'Not scheduled', time: '' };
    }

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return { date: 'Invalid Date', time: 'Invalid Time' };
      }
      return {
        date: date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
        time: date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      };
    } catch {
      return { date: 'Invalid Date', time: 'Invalid Time' };
    }
  };

  const getInterviewStatusBadgeColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';

    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-amber-100 text-amber-800';
      case 'pending':
      case 'pending_confirmation':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMyActionBadgeColor = (myAction: string) => {
    if (!myAction) return 'bg-gray-100 text-gray-800';

    switch (myAction.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'transferred':
        return 'bg-orange-100 text-orange-800';
      case 'no_action':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplayText = (status: string) => {
    if (!status) return 'UNKNOWN';

    switch (status.toLowerCase()) {
      case 'pending':
        return 'PENDING';
      case 'scheduled':
        return 'SCHEDULED';
      case 'confirmed':
        return 'CONFIRMED';
      case 'in_progress':
        return 'IN PROGRESS';
      case 'completed':
        return 'COMPLETED';
      case 'cancelled':
        return 'CANCELLED';
      case 'rejected':
        return 'REJECTED';
      case 'pending_confirmation':
        return 'PENDING CONFIRMATION';
      default:
        return status.replace('_', ' ').toUpperCase();
    }
  };

  const getMyActionDisplayText = (myAction: string) => {
    if (!myAction) return 'NO ACTION';

    switch (myAction.toLowerCase()) {
      case 'pending':
        return 'PENDING';
      case 'confirmed':
        return 'CONFIRMED';
      case 'rejected':
        return 'REJECTED';
      case 'completed':
        return 'COMPLETED';
      case 'transferred':
        return 'TRANSFERRED';
      case 'no_action':
        return 'NO ACTION';
      default:
        return myAction.replace('_', ' ').toUpperCase();
    }
  };

  // Loading state
  if (loading && (!interviews || interviews.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiRefreshCw className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading interviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We couldn&apos;t load your interviews. {error}
          </p>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiRefreshCw
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
            />
            {loading ? 'Retrying...' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  const safeFilteredInterviews = filteredInterviews || [];
  const safePagination = pagination || {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
            Interview Management
          </h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base lg:text-lg">
            Manage interviews, schedules, and assessments for engineers and
            experts
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => handleTabChange('engineer')}
            className={`flex-1 px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-medium transition-all relative ${
              activeTab === 'engineer'
                ? 'text-green-600 bg-green-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FiUsers className="w-4 h-4 md:w-5 md:h-5" />
              <span>Engineer Interviews</span>
              <span
                className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full ${
                  activeTab === 'engineer'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {tabCounts.engineer}
              </span>
            </div>
            {activeTab === 'engineer' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" />
            )}
          </button>
          <button
            onClick={() => handleTabChange('expert')}
            className={`flex-1 px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-medium transition-all relative ${
              activeTab === 'expert'
                ? 'text-green-600 bg-green-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FiBriefcase className="w-4 h-4 md:w-5 md:h-5" />
              <span>Expert Interviews</span>
              <span
                className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full ${
                  activeTab === 'expert'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {tabCounts.expert}
              </span>
            </div>
            {activeTab === 'expert' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" />
            )}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
            <input
              type="text"
              placeholder={`Search ${activeTab === 'engineer' ? 'engineers' : 'experts'} by name, email, or ID...`}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 md:pl-11 pr-4 py-2.5 md:py-3 border border-gray-300 text-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors placeholder:text-gray-500"
            />
            {searchTerm && (
              <p className="text-xs text-gray-500 mt-1 ml-1">
                Note: Search filters current page only
              </p>
            )}
          </div>
          <div>
            <select
              value={myActionFilter}
              onChange={e => handleMyActionFilterChange(e.target.value)}
              className="w-full px-4 py-2.5 md:py-3 border border-gray-300 text-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
              <option value="transferred">Transferred</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interviews Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
        {/* Loading overlay */}
        {loading && safeFilteredInterviews.length > 0 && (
          <div className="absolute inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
              <FiRefreshCw className="w-5 h-5 animate-spin text-green-600" />
              <span className="text-gray-700 font-medium">
                Refreshing interviews...
              </span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {activeTab === 'engineer' ? 'Candidate' : 'Expert'}
                </th>
                <th className="hidden sm:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="hidden md:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled Time
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {safeFilteredInterviews.map(interview => {
                if (!interview || !interview.id) return null;

                const { date, time } = formatDateTime(
                  interview.scheduledSlotTime || ''
                );

                return (
                  <tr key={interview.id} className="hover:bg-gray-50">
                    <td className="px-3 md:px-6 py-4">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {interview.candidateName || 'N/A'}
                        </div>
                        <div className="sm:hidden text-sm text-gray-500 truncate mt-1">
                          {interview.candidateEmail || 'N/A'}
                        </div>
                        <div className="md:hidden text-xs text-gray-600 mt-1">
                          {date} {time && `• ${time}`}
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-3 md:px-6 py-4">
                      <div className="min-w-0">
                        <div className="text-sm text-gray-900 truncate">
                          {interview.candidateEmail || 'N/A'}
                        </div>
                        <div className="md:hidden text-xs text-gray-600 mt-1">
                          {date} {time && `• ${time}`}
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{date}</div>
                      {time && (
                        <div className="text-sm text-gray-500">{time}</div>
                      )}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {interview.interviewType?.toUpperCase() || 'N/A'}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-gray-500 font-medium">
                            Status:
                          </span>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full w-fit ${getInterviewStatusBadgeColor(interview.interviewStatus)}`}
                          >
                            {getStatusDisplayText(interview.interviewStatus)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-gray-500 font-medium">
                            My Action:
                          </span>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full w-fit ${getMyActionBadgeColor(interview.myAction)}`}
                          >
                            {getMyActionDisplayText(interview.myAction)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-1 md:gap-2">
                        <button
                          onClick={() =>
                            interview.myAction?.toLowerCase() !==
                              'transferred' && handleViewDetails(interview.id)
                          }
                          disabled={
                            interview.myAction?.toLowerCase() === 'transferred'
                          }
                          className={`p-1 transition-colors ${
                            interview.myAction?.toLowerCase() === 'transferred'
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-blue-600 hover:text-blue-900'
                          }`}
                          title={
                            interview.myAction?.toLowerCase() === 'transferred'
                              ? 'View disabled - Interview transferred'
                              : 'View Details'
                          }
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {safeFilteredInterviews.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-2">
                {activeTab === 'engineer' ? (
                  <FiUsers className="w-10 h-10 text-gray-400" />
                ) : (
                  <FiBriefcase className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <div className="max-w-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No {activeTab === 'engineer' ? 'engineer' : 'expert'}{' '}
                  interviews found
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {searchTerm
                    ? `No ${activeTab === 'engineer' ? 'engineer' : 'expert'} interviews match your search on this page.`
                    : `No ${activeTab === 'engineer' ? 'engineer' : 'expert'} interviews with "${myActionFilter}" status found.`}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
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
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {safePagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center px-4 md:px-6 py-4 border-t border-gray-200 gap-4">
            <div className="text-sm text-gray-600 text-center sm:text-left">
              <span>
                Showing{' '}
                {Math.min(
                  (safePagination.currentPage - 1) * safePagination.limit + 1,
                  safePagination.totalCount
                )}
                -
                {Math.min(
                  safePagination.currentPage * safePagination.limit,
                  safePagination.totalCount
                )}{' '}
                of {safePagination.totalCount}{' '}
                {activeTab === 'engineer' ? 'engineer' : 'expert'} interviews
              </span>
            </div>

            <div className="flex items-center gap-1 md:gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={!safePagination.hasPreviousPage || loading}
                className="px-2 md:px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>

              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(safePagination.totalPages, 7) },
                  (_, i) => {
                    let pageNum;
                    if (safePagination.totalPages <= 7) {
                      pageNum = i + 1;
                    } else if (currentPage <= 4) {
                      pageNum = i + 1;
                    } else if (currentPage >= safePagination.totalPages - 3) {
                      pageNum = safePagination.totalPages - 6 + i;
                    } else {
                      pageNum = currentPage - 3 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={loading}
                        className={`px-2 md:px-3 py-1 text-sm border rounded-md disabled:opacity-50 transition-colors ${
                          currentPage === pageNum
                            ? 'bg-green-600 text-white border-green-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage(prev =>
                    Math.min(prev + 1, safePagination.totalPages)
                  )
                }
                disabled={!safePagination.hasNextPage || loading}
                className="px-2 md:px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PanelistInterviews;
