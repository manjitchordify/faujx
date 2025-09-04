'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  FiSearch,
  FiEye,
  FiUser,
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
} from 'react-icons/fi';
import {
  getAllCandidates,
  updateCandidatePublishStatus,
  type Candidate,
  type GetAllCandidatesResponse,
} from '@/services/adminService';

// View Candidate Details Modal
function ViewCandidateModal({
  candidate,
  onClose,
  onPublishProfile,
  isPublishing = false,
}: {
  candidate: Candidate;
  onClose: () => void;
  onPublishProfile: (candidateId: string) => void;
  isPublishing?: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {candidate.firstName} - Candidate Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isPublishing}
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
                        ? 'bg-green-100 text-green-800'
                        : candidate.interviewStatus === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {candidate.interviewStatus.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Interview Passed
                  </label>
                  <div className="flex items-center gap-2">
                    {candidate.interviewPassed ? (
                      <>
                        <FiCheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-700 font-medium">Yes</span>
                      </>
                    ) : (
                      <>
                        <FiXCircle className="w-4 h-4 text-red-500" />
                        <span className="text-red-700 font-medium">No</span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vetting Status
                  </label>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      candidate.vettingStatus === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : candidate.vettingStatus === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {candidate.vettingStatus.toUpperCase()}
                  </span>
                </div>
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
                    <div>
                      <h4 className="font-medium text-gray-900">Interview</h4>
                      <p className="text-sm text-gray-600">
                        Status:{' '}
                        {candidate.interviewStatus
                          .replace('_', ' ')
                          .toUpperCase()}
                      </p>
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons with Enhanced Publishing State */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-center">
              {candidate.isPublished ? (
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 font-medium rounded-lg">
                  <FiGlobe className="w-5 h-5" />
                  Already Published
                </div>
              ) : candidate.interviewPassed ? (
                <button
                  onClick={() => onPublishProfile(candidate.id)}
                  disabled={isPublishing}
                  className={`inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-all duration-200 shadow-sm ${
                    isPublishing
                      ? 'bg-green-500 text-white cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-md'
                  }`}
                >
                  {isPublishing ? (
                    <>
                      <FiLoader className="w-5 h-5 animate-spin" />
                      Publishing Profile...
                    </>
                  ) : (
                    <>
                      <FiGlobe className="w-5 h-5" />
                      Publish Profile to Projects Platform
                    </>
                  )}
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 font-medium rounded-lg">
                  <FiXCircle className="w-5 h-5" />
                  Cannot Publish - Interview Not Passed
                </div>
              )}
            </div>

            {/* Publishing Status Message */}
            {isPublishing && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800">
                  <FiLoader className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">
                    Publishing candidate profile to the projects platform...
                  </span>
                </div>
              </div>
            )}
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
  const [publishingIds, setPublishingIds] = useState<Set<string>>(new Set());

  // Server-side pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // NEW: Add states for total counts (not filtered)
  const [totalStats, setTotalStats] = useState({
    totalCandidates: 0,
    passedCandidates: 0,
    failedCandidates: 0,
  });

  // Fetch total stats separately (for the stats cards)
  const fetchTotalStats = async () => {
    try {
      // Fetch all candidates without filters to get total counts
      const allCandidatesResponse = await getAllCandidates(1, 1000, '', 'all'); // Large limit to get all

      setTotalStats({
        totalCandidates: allCandidatesResponse.total,
        passedCandidates: allCandidatesResponse.data.filter(
          c => c.interviewPassed
        ).length,
        failedCandidates: allCandidatesResponse.data.filter(
          c => !c.interviewPassed
        ).length,
      });
    } catch (err) {
      console.error('Error fetching total stats:', err);
    }
  };

  // Fetch candidates with pagination
  const fetchCandidates = async (
    page: number = 1,
    perPage: number = 10,
    search: string = '',
    filter: string = 'all'
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response: GetAllCandidatesResponse = await getAllCandidates(
        page,
        perPage,
        search,
        filter
      );

      setCandidates(response.data);
      setCurrentPage(response.page);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
      setItemsPerPage(response.perPage);
    } catch (err: unknown) {
      console.error(
        err instanceof Error ? err.message : 'Unknown error fetching users'
      );
      setError(
        err instanceof Error ? err.message : 'Failed to fetch candidates'
      );
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch - fetch both stats and candidates
  useEffect(() => {
    fetchTotalStats(); // Get total counts for stats cards
    fetchCandidates(1, itemsPerPage, searchTerm, statusFilter);
  }, [itemsPerPage, searchTerm, statusFilter]);

  // Handle search and filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when search/filter changes
      fetchCandidates(1, itemsPerPage, searchTerm, statusFilter);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, itemsPerPage]);

  // Handle pagination changes
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchCandidates(newPage, itemsPerPage, searchTerm, statusFilter);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    fetchCandidates(1, newItemsPerPage, searchTerm, statusFilter);
  };

  // Handle actions
  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsViewModalOpen(true);
  };

  const handlePublishProfile = async (candidateId: string) => {
    try {
      // Add candidate to publishing set
      setPublishingIds(prev => new Set(prev).add(candidateId));

      // Call API to publish candidate profile
      const updatedCandidate = await updateCandidatePublishStatus(
        candidateId,
        true
      );

      // Update local state with the response from API
      setCandidates(prev =>
        prev.map(c => (c.id === candidateId ? updatedCandidate : c))
      );

      // Update selectedCandidate if it's the one being published
      if (selectedCandidate && selectedCandidate.id === candidateId) {
        setSelectedCandidate(updatedCandidate);
      }

      // Refresh total stats since publish status changed
      fetchTotalStats();

      // Close modal and show success message
      setIsViewModalOpen(false);
      setSelectedCandidate(null);

      // Success notification with auto-dismiss
      const successMessage = document.createElement('div');
      successMessage.className =
        'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse';
      successMessage.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Profile published successfully!
        </div>
      `;
      document.body.appendChild(successMessage);

      setTimeout(() => {
        if (successMessage.parentNode) {
          successMessage.parentNode.removeChild(successMessage);
        }
      }, 3000);
    } catch (err: unknown) {
      console.error(
        err instanceof Error ? err.message : 'Unknown error publishing profile'
      );

      // Error notification
      const errorMessage = document.createElement('div');
      errorMessage.className =
        'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorMessage.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Failed to publish profile. Please try again.
        </div>
      `;
      document.body.appendChild(errorMessage);

      setTimeout(() => {
        if (errorMessage.parentNode) {
          errorMessage.parentNode.removeChild(errorMessage);
        }
      }, 4000);
    } finally {
      // Remove candidate from publishing set
      setPublishingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(candidateId);
        return newSet;
      });
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show pages around current page
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
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

      {/* Fixed Stats Cards - Now using totalStats */}
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
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Candidates</option>
            <option value="passed">Interview Passed</option>
            <option value="failed">Interview Failed</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {/* Candidates Table */}
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
              {candidates.map(candidate => {
                // Fixed logic: Only enable publish if passed interview AND not already published
                const canPublishProfile =
                  candidate.interviewPassed && !candidate.isPublished;
                const isPublishing = publishingIds.has(candidate.id);

                return (
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
                              alt={candidate.firstName}
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
                      <div className="flex items-center">
                        {candidate.interviewPassed ? (
                          <>
                            <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-green-700 font-medium">
                              Passed
                            </span>
                          </>
                        ) : (
                          <>
                            <FiXCircle className="w-4 h-4 text-red-500 mr-2" />
                            <span className="text-red-700 font-medium">
                              Failed
                            </span>
                          </>
                        )}
                      </div>
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

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewCandidate(candidate)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
                        >
                          <FiEye className="w-3 h-3" />
                          View
                        </button>

                        <button
                          onClick={() => handlePublishProfile(candidate.id)}
                          disabled={isPublishing || !canPublishProfile}
                          className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded transition-all duration-200 min-w-[80px] justify-center ${
                            candidate.isPublished
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : canPublishProfile
                                ? isPublishing
                                  ? 'bg-green-500 text-white cursor-not-allowed'
                                  : 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {isPublishing ? (
                            <>
                              <FiLoader className="w-3 h-3 animate-spin" />
                              Publishing...
                            </>
                          ) : (
                            <>
                              <FiGlobe className="w-3 h-3" />
                              {candidate.isPublished
                                ? 'Published'
                                : canPublishProfile
                                  ? 'Publish'
                                  : 'Publish'}
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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

        {/* Enhanced Pagination */}
        {candidates.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 border-t border-gray-200">
            {/* Pagination Info */}
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{' '}
              candidates
            </div>

            {/* Items per page selector */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={e => handleItemsPerPageChange(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              {/* First Page */}
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="First page"
              >
                <FiChevronsLeft className="w-4 h-4" />
              </button>

              {/* Previous Page */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Previous page"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 flex items-center justify-center rounded border text-sm font-medium transition-colors ${
                    pageNum === currentPage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              {/* Show ellipsis if there are more pages */}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="px-2 text-gray-400">...</span>
              )}

              {/* Next Page */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>

              {/* Last Page */}
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Last page"
              >
                <FiChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Details Modal with Publishing State */}
      {isViewModalOpen && selectedCandidate && (
        <ViewCandidateModal
          candidate={selectedCandidate}
          onClose={() => setIsViewModalOpen(false)}
          onPublishProfile={handlePublishProfile}
          isPublishing={publishingIds.has(selectedCandidate.id)}
        />
      )}

      {/* Global Publishing Overlay (optional - for when publishing from table) */}
      {publishingIds.size > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-[1px] flex items-center justify-center z-40 pointer-events-none">
          <div className="bg-white rounded-lg shadow-lg p-6 mx-4 pointer-events-auto">
            <div className="flex items-center gap-3">
              <FiLoader className="w-6 h-6 text-blue-600 animate-spin" />
              <div>
                <h3 className="font-medium text-gray-900">
                  Publishing Profile
                </h3>
                <p className="text-sm text-gray-600">
                  Please wait while we publish the candidate profile...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vetting;
