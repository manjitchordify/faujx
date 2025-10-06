'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  FiEye,
  FiUser,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiUsers,
  FiX,
  FiCheckCircle,
  FiXCircle,
  FiCode,
  FiBookOpen,
  FiVideo,
  FiGlobe,
  FiFileText,
  FiLoader,
  FiChevronsLeft,
  FiChevronsRight,
  FiAlertCircle,
} from 'react-icons/fi';
import {
  getAllCandidates,
  updateCandidatePublishStatus,
  getCandidateStatsWorkaround,
  type Candidate,
  type PaginatedCandidatesResponse,
} from '@/services/admin-panelist-services/candidateService';

// Confirmation Modal Component
function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  candidateName,
  isLoading,
  action,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  candidateName: string;
  isLoading: boolean;
  action: 'publish' | 'unpublish';
}) {
  if (!isOpen) return null;

  const isPublish = action === 'publish';

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-10 h-10 rounded-full ${isPublish ? 'bg-orange-100' : 'bg-red-100'} flex items-center justify-center`}
            >
              <FiAlertCircle
                className={`w-5 h-5 ${isPublish ? 'text-orange-600' : 'text-red-600'}`}
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isPublish ? 'Confirm Publishing' : 'Confirm Unpublishing'}
            </h3>
          </div>

          <p className="text-gray-600 mb-6">
            {isPublish ? (
              <>
                Are you sure you want to publish{' '}
                <span className="font-medium">{candidateName}&apos;s</span>{' '}
                profile to the Faujx platform? This action will make their
                profile visible to potential clients.
              </>
            ) : (
              <>
                Are you sure you want to unpublish{' '}
                <span className="font-medium">{candidateName}&apos;s</span>{' '}
                profile? This will remove their profile from the Faujx platform
                and make it invisible to potential clients.
              </>
            )}
          </p>

          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-4 py-2 ${isPublish ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2`}
            >
              {isLoading ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  {isPublish ? 'Publishing...' : 'Unpublishing...'}
                </>
              ) : (
                <>
                  {isPublish ? (
                    <FiGlobe className="w-4 h-4" />
                  ) : (
                    <FiX className="w-4 h-4" />
                  )}
                  {isPublish ? 'Confirm Publish' : 'Confirm Unpublish'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// View Candidate Details Modal
function ViewCandidateModal({
  candidate,
  onClose,
  onPublishProfile,
}: {
  candidate: Candidate;
  onClose: () => void;
  onPublishProfile: (candidate: Candidate) => void;
}) {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {candidate.firstName} - Candidate Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Basic Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ID
                  </label>
                  <p className="text-gray-900 font-mono text-xs">
                    {candidate.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <p className="text-gray-900">{candidate.firstName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="text-gray-900">{candidate.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Interview Status
                  </label>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      candidate.interviewStatus === 'completed'
                        ? candidate.interviewPassed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                        : candidate.interviewStatus === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : candidate.interviewStatus === 'pending_confirmation'
                            ? 'bg-yellow-100 text-yellow-800'
                            : candidate.interviewStatus === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {candidate.interviewStatus === 'completed'
                      ? candidate.interviewPassed
                        ? 'PASSED'
                        : 'FAILED'
                      : candidate.interviewStatus
                          .replace('_', ' ')
                          .toUpperCase()}
                  </span>
                </div>
                {candidate.interviewStatus === 'completed' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Interview Result
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      {candidate.interviewPassed ? (
                        <>
                          <FiCheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-green-700 font-medium">
                            Passed
                          </span>
                        </>
                      ) : (
                        <>
                          <FiXCircle className="w-4 h-4 text-red-500" />
                          <span className="text-red-700 font-medium">
                            Failed
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Published Status
                  </label>
                  <div className="flex items-center gap-2">
                    {candidate.isPublished ? (
                      <>
                        <FiGlobe className="w-4 h-4 text-blue-500" />
                        <span className="text-blue-700 font-medium">
                          Published
                        </span>
                      </>
                    ) : (
                      <>
                        <FiX className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500 font-medium">
                          Not Published
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Created Date
                  </label>
                  <p className="text-gray-900">
                    {new Date(candidate.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Updated Date
                  </label>
                  <p className="text-gray-900">
                    {new Date(candidate.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Test Scores
              </h3>
              <div className="space-y-4">
                {/* Resume Parsing Score */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      <FiFileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Resume Parsing
                      </h4>
                      <p className="text-lg font-bold text-blue-600">
                        {candidate.resumeParsingScore}%
                      </p>
                    </div>
                  </div>
                  {candidate.resumeUrl ? (
                    <a
                      href={candidate.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Resume
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500">No resume available</p>
                  )}
                </div>

                {/* MCQ Score */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                      <FiBookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">MCQ Test</h4>
                      <p className="text-lg font-bold text-green-600">
                        {candidate.mcqScore}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Coding Score */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                      <FiCode className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Coding Test</h4>
                      <p className="text-lg font-bold text-purple-600">
                        {candidate.codingScore}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interview Status */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                      <FiVideo className="w-4 h-4" />
                    </div>
                    <div className="w-full">
                      <h4 className="font-medium text-gray-900">Interview</h4>
                      <p className="text-sm text-gray-600">
                        Status:{' '}
                        {candidate.interviewStatus
                          .replace('_', ' ')
                          .toUpperCase()}
                      </p>
                      {candidate.interviewStatus === 'completed' && (
                        <div className="flex items-center gap-1 mt-1">
                          {candidate.interviewPassed ? (
                            <FiCheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <FiXCircle className="w-4 h-4 text-red-500" />
                          )}
                          <p
                            className={`text-sm font-medium ${candidate.interviewPassed ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {candidate.interviewPassed ? 'Passed' : 'Failed'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-center">
              {candidate.isPublished ? (
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 font-medium rounded-lg">
                  <FiGlobe className="w-5 h-5" />
                  Already Published
                </div>
              ) : candidate.interviewPassed ? (
                <button
                  onClick={() => onPublishProfile(candidate)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
                >
                  <FiGlobe className="w-5 h-5" />
                  Publish Profile to Faujx Platform
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 font-medium rounded-lg">
                  <FiXCircle className="w-5 h-5" />
                  Cannot Publish - Interview Not Passed
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Vetting() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Confirmation modal state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [candidateToPublish, setCandidateToPublish] =
    useState<Candidate | null>(null);
  const [confirmationAction, setConfirmationAction] = useState<
    'publish' | 'unpublish'
  >('publish');
  const [isPublishing, setIsPublishing] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Total stats (not filtered)
  const [totalStats, setTotalStats] = useState({
    totalCandidates: 0,
    passedCandidates: 0,
    failedCandidates: 0,
  });

  // Fetch total stats separately
  const fetchTotalStats = useCallback(async () => {
    try {
      const stats = await getCandidateStatsWorkaround();
      setTotalStats({
        totalCandidates: stats.total,
        passedCandidates: stats.passed,
        failedCandidates: stats.failed,
      });
    } catch (err) {
      console.error('Error fetching total stats:', err);
    }
  }, []);

  // Fetch candidates with search and filter - MEMOIZED WITH useCallback
  // NOTE: Backend API must support 'search' and 'filter' query parameters
  // API Endpoint: GET /candidates/allCandidates?page={page}&perPage={perPage}&search={search}&filter={filter}
  const fetchCandidates = useCallback(
    async (
      page: number = 1,
      perPage: number = 10,
      search: string = '',
      filter: string = 'all'
    ) => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching candidates with filters:', {
          page,
          perPage,
          search,
          filter,
        });

        const response: PaginatedCandidatesResponse = await getAllCandidates(
          page,
          perPage,
          search,
          filter
        );

        console.log('API Response:', response);

        setCandidates(response.data || []);
        // Convert string values to numbers if needed
        setCurrentPage(
          typeof response.page === 'string'
            ? parseInt(response.page)
            : response.page
        );
        setTotalItems(
          typeof response.total === 'string'
            ? parseInt(response.total)
            : response.total
        );
        setTotalPages(
          typeof response.totalPages === 'string'
            ? parseInt(response.totalPages)
            : response.totalPages
        );
        setItemsPerPage(
          typeof response.perPage === 'string'
            ? parseInt(response.perPage)
            : response.perPage
        );
      } catch (err: unknown) {
        console.error(
          err instanceof Error
            ? err.message
            : 'Unknown error fetching candidates'
        );
        setError(
          err instanceof Error ? err.message : 'Failed to fetch candidates'
        );
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Fetch data on mount
  useEffect(() => {
    console.log('Component mounted, fetching initial data');
    fetchTotalStats();
    fetchCandidates(1, itemsPerPage, searchTerm, statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch when filters change - with debounce for search
  useEffect(() => {
    console.log('Filters changed:', {
      searchTerm,
      statusFilter,
      itemsPerPage,
    });

    const delayDebounceFn = setTimeout(() => {
      console.log('Debounce timeout - fetching with new filters');
      setCurrentPage(1); // Reset to page 1 when filters change
      fetchCandidates(1, itemsPerPage, searchTerm, statusFilter);
    }, 300);

    return () => {
      console.log('Clearing debounce timeout');
      clearTimeout(delayDebounceFn);
    };
  }, [searchTerm, statusFilter, itemsPerPage, fetchCandidates]);

  // Handle pagination changes
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      console.log('Page changed to:', newPage);
      setCurrentPage(newPage);
      fetchCandidates(newPage, itemsPerPage, searchTerm, statusFilter);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    console.log('Items per page changed to:', newItemsPerPage);
    setItemsPerPage(newItemsPerPage);
  };

  // Handle view candidate
  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsViewModalOpen(true);
  };

  // Handle publish/unpublish toggle
  const handleTogglePublish = (candidate: Candidate) => {
    if (candidate.isPublished) {
      // Unpublish action - show confirmation
      setCandidateToPublish(candidate);
      setConfirmationAction('unpublish');
      setShowConfirmation(true);
    } else {
      // Publish action - show confirmation
      setCandidateToPublish(candidate);
      setConfirmationAction('publish');
      setShowConfirmation(true);
    }
  };

  // Handle publish confirmation from modal
  const handlePublishClick = (candidate: Candidate) => {
    setCandidateToPublish(candidate);
    setConfirmationAction('publish');
    setShowConfirmation(true);
  };

  // Handle view report - opens vetting report in new tab
  const handleViewReport = (candidate: Candidate) => {
    window.open(`/vetting-report/candidate/${candidate.userId}`, '_blank');
  };

  // Handle confirmed action (publish or unpublish)
  const handleConfirmedAction = async () => {
    if (!candidateToPublish) return;

    const isPublish = confirmationAction === 'publish';

    try {
      setIsPublishing(true);

      // Show immediate feedback
      showToast(
        `${isPublish ? 'Publishing' : 'Unpublishing'} ${candidateToPublish.firstName}'s profile...`,
        'info'
      );

      // API call with the appropriate boolean value
      await updateCandidatePublishStatus(candidateToPublish.id, isPublish);

      // Refresh all data from server
      await Promise.all([
        fetchCandidates(currentPage, itemsPerPage, searchTerm, statusFilter),
        fetchTotalStats(),
      ]);

      // Close modals
      setShowConfirmation(false);
      setIsViewModalOpen(false);
      setCandidateToPublish(null);
      setSelectedCandidate(null);

      // Success toast notification
      showToast(
        `Profile ${isPublish ? 'published' : 'unpublished'} successfully! The candidate is now ${isPublish ? 'visible on' : 'removed from'} the projects platform.`,
        'success'
      );
    } catch (err: unknown) {
      console.error(
        err instanceof Error
          ? err.message
          : `Unknown error ${isPublish ? 'publishing' : 'unpublishing'} profile`
      );
      showToast(
        `Failed to ${isPublish ? 'publish' : 'unpublish'} profile. Please try again or contact support if the issue persists.`,
        'error'
      );
    } finally {
      setIsPublishing(false);
    }
  };

  // Enhanced Toast Notification System
  const showToast = (
    message: string,
    type: 'success' | 'error' | 'info' = 'info'
  ) => {
    const toast = document.createElement('div');
    const toastId = `toast-${Date.now()}`;
    toast.id = toastId;

    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
      document.body.appendChild(toastContainer);
    }

    const bgColor = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
    }[type];

    const icon = {
      success:
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>',
      error:
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>',
      info: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
    }[type];

    toast.className = `${bgColor} text-white px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out translate-x-full opacity-0 max-w-sm`;
    toast.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 mt-0.5">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            ${icon}
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium leading-5">${message}</p>
        </div>
        <button 
          onclick="document.getElementById('${toastId}').remove()" 
          class="flex-shrink-0 ml-2 text-white/70 hover:text-white transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;

    toastContainer.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full', 'opacity-0');
      toast.classList.add('translate-x-0', 'opacity-100');
    }, 100);

    // Auto remove
    const autoRemoveTimeout = setTimeout(
      () => {
        removeToast(toastId);
      },
      type === 'error' ? 5000 : 4000
    );

    // Store timeout for manual removal
    toast.setAttribute('data-timeout', autoRemoveTimeout.toString());

    return toastId;
  };

  // Helper to remove toast
  const removeToast = (toastId: string) => {
    const toast = document.getElementById(toastId);
    if (!toast) return;

    // Clear timeout
    const timeoutId = toast.getAttribute('data-timeout');
    if (timeoutId) {
      clearTimeout(parseInt(timeoutId));
    }

    // Animate out
    toast.classList.add('translate-x-full', 'opacity-0');
    toast.classList.remove('translate-x-0', 'opacity-100');

    // Remove from DOM
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }

      // Clean up container if empty
      const container = document.getElementById('toast-container');
      if (container && container.children.length === 0) {
        container.remove();
      }
    }, 300);
  };

  // Loading state
  if (loading && candidates.length === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Loading Candidates
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch the data...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiXCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Candidates
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() =>
              fetchCandidates(
                currentPage,
                itemsPerPage,
                searchTerm,
                statusFilter
              )
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Candidate Vetting Results
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage candidate profiles and publishing status
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Candidates</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalStats.totalCandidates}
              </p>
            </div>
            <FiUsers className="w-8 h-8 text-gray-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Interview Passed</p>
              <p className="text-2xl font-bold text-green-600">
                {totalStats.passedCandidates}
              </p>
            </div>
            <FiCheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Interview Failed</p>
              <p className="text-2xl font-bold text-red-600">
                {totalStats.failedCandidates}
              </p>
            </div>
            <FiXCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg p-4 shadow mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => {
              console.log('Filter dropdown changed to:', e.target.value);
              setStatusFilter(e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Candidates</option>
            <optgroup label="Interview Result">
              <option value="passed">Interview Passed</option>
              <option value="failed">Interview Failed</option>
            </optgroup>
            <optgroup label="Interview Status">
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending_confirmation">Pending Confirmation</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </optgroup>
            <optgroup label="Publishing Status">
              <option value="published">Published</option>
              <option value="unpublished">Not Published</option>
            </optgroup>
          </select>
        </div>

        {/* API Implementation Note - Only show when search or filter is active */}
        {(searchTerm.trim() !== '' || statusFilter !== 'all') && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <FiAlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Backend API Implementation Required
                </p>
                <p className="text-xs text-blue-700">
                  The backend API must support the following query parameters:
                </p>
                <ul className="text-xs text-blue-700 mt-1 ml-4 list-disc space-y-1">
                  <li>
                    <code className="bg-blue-100 px-1 py-0.5 rounded">
                      search
                    </code>{' '}
                    - Filter by candidate name or email
                  </li>
                  <li>
                    <code className="bg-blue-100 px-1 py-0.5 rounded">
                      filter
                    </code>{' '}
                    - Filter by status (passed, failed, published, etc.)
                  </li>
                </ul>
                <p className="text-xs text-blue-700 mt-2">
                  <strong>Endpoint:</strong>{' '}
                  <code className="bg-blue-100 px-1 py-0.5 rounded">
                    GET
                    /candidates/allCandidates?page=&#123;page&#125;&perPage=&#123;perPage&#125;&search=&#123;search&#125;&filter=&#123;filter&#125;
                  </code>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NAME
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  EMAIL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  INTERVIEW STATUS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PUBLISHED
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {candidates.length > 0
                ? candidates.map(candidate => (
                    <tr
                      key={candidate.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {candidate.profilePic ? (
                              <Image
                                src={candidate.profilePic}
                                alt={candidate.firstName || 'Candidate'}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <FiUser className="w-5 h-5 text-gray-600" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {candidate.firstName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {candidate.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            candidate.interviewStatus === 'completed'
                              ? candidate.interviewPassed
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                              : candidate.interviewStatus === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : candidate.interviewStatus === 'confirmed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : candidate.interviewStatus ===
                                      'pending_confirmation'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : candidate.interviewStatus === 'cancelled'
                                      ? 'bg-gray-100 text-gray-800'
                                      : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {candidate.interviewStatus === 'completed'
                            ? candidate.interviewPassed
                              ? 'PASSED'
                              : 'FAILED'
                            : candidate.interviewStatus
                                .replace('_', ' ')
                                .toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {candidate.isPublished ? (
                            <>
                              <FiGlobe className="w-4 h-4 text-blue-500 mr-2" />
                              <span className="text-blue-700 font-medium">
                                Published
                              </span>
                            </>
                          ) : (
                            <>
                              <FiX className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-gray-500 font-medium">
                                Not Published
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewCandidate(candidate)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleTogglePublish(candidate)}
                            disabled={
                              !candidate.interviewPassed &&
                              !candidate.isPublished
                            }
                            className={`${
                              candidate.isPublished
                                ? 'text-red-600 hover:text-red-900'
                                : candidate.interviewPassed
                                  ? 'text-green-600 hover:text-green-900'
                                  : 'text-gray-400 cursor-not-allowed'
                            }`}
                            title={
                              candidate.isPublished
                                ? 'Unpublish Profile'
                                : candidate.interviewPassed
                                  ? 'Publish Profile'
                                  : 'Cannot Publish - Interview Not Passed'
                            }
                          >
                            <FiGlobe className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleViewReport(candidate)}
                            className="text-purple-600 hover:text-purple-900"
                            title="View Vetting Report"
                          >
                            <FiFileText className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {candidates.length === 0 && !loading && (
          <div className="text-center py-12">
            <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No candidates found
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No candidates available at this time'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {candidates.length > 0 && totalPages > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing{' '}
              {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}-
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{' '}
              {totalItems === 1 ? 'candidate' : 'candidates'}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={e => handleItemsPerPageChange(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              {/* First Page */}
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || loading}
                className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="First page"
              >
                <FiChevronsLeft className="w-4 h-4" />
              </button>

              {/* Previous Page */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Previous page"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1 mx-2">
                {/* Show page numbers with ellipsis for large page counts */}
                {totalPages <= 7 ? (
                  // Show all pages if 7 or fewer
                  Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={loading}
                        className={`min-w-[32px] h-8 px-2 flex items-center justify-center rounded border text-sm transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {pageNum}
                      </button>
                    )
                  )
                ) : (
                  // Show ellipsis for many pages
                  <>
                    {/* First page */}
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={loading}
                      className={`min-w-[32px] h-8 px-2 flex items-center justify-center rounded border text-sm transition-colors ${
                        currentPage === 1
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      1
                    </button>

                    {/* Left ellipsis */}
                    {currentPage > 3 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}

                    {/* Pages around current */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        pageNum =>
                          pageNum !== 1 &&
                          pageNum !== totalPages &&
                          Math.abs(pageNum - currentPage) <= 1
                      )
                      .map(pageNum => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={loading}
                          className={`min-w-[32px] h-8 px-2 flex items-center justify-center rounded border text-sm transition-colors ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {pageNum}
                        </button>
                      ))}

                    {/* Right ellipsis */}
                    {currentPage < totalPages - 2 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}

                    {/* Last page */}
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={loading}
                      className={`min-w-[32px] h-8 px-2 flex items-center justify-center rounded border text-sm transition-colors ${
                        currentPage === totalPages
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              {/* Next Page */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>

              {/* Last Page */}
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || loading}
                className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Last page"
              >
                <FiChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {isViewModalOpen && selectedCandidate && (
        <ViewCandidateModal
          candidate={selectedCandidate}
          onClose={() => setIsViewModalOpen(false)}
          onPublishProfile={handlePublishClick}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => {
          if (!isPublishing) {
            setShowConfirmation(false);
            setCandidateToPublish(null);
          }
        }}
        onConfirm={handleConfirmedAction}
        candidateName={candidateToPublish?.firstName || ''}
        isLoading={isPublishing}
        action={confirmationAction}
      />
    </div>
  );
}

export default Vetting;
