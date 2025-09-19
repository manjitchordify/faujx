'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  FiAlertCircle,
  FiAward,
} from 'react-icons/fi';
import {
  getAllCandidates,
  updateCandidatePublishStatus,
  getCandidateStatsWorkaround,
  getAllHiredCandidates,
  type Candidate,
  type PaginatedCandidatesResponse,
  type HiredCandidate,
  type PaginatedHiredCandidatesResponse,
} from '@/services/admin-panelist-services/candidateService';

// Confirmation Modal Component
function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  candidateName,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  candidateName: string;
  isLoading: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <FiAlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Confirm Publishing
            </h3>
          </div>

          <p className="text-gray-600 mb-6">
            Are you sure you want to publish{' '}
            <span className="font-medium">{candidateName}&apos;s</span> profile
            to the projects platform? This action will make their profile
            visible to potential clients.
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
              className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <FiGlobe className="w-4 h-4" />
                  Confirm Publish
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
                  Publish Profile to Projects Platform
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

// View Hired Engineer Details Modal
function ViewHiredEngineerModal({
  engineer,
  onClose,
}: {
  engineer: HiredCandidate;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {engineer.fullName} - Hired Engineer Details
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
                    Full Name
                  </label>
                  <p className="text-gray-900">{engineer.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="text-gray-900">{engineer.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <p className="text-gray-900">{engineer.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <p className="text-gray-900">{engineer.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Current Role
                  </label>
                  <p className="text-gray-900">
                    {engineer.currentDesignation} at {engineer.currentCompany}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Experience
                  </label>
                  <p className="text-gray-900">
                    {engineer.experienceYears} years
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Preferred Salary
                  </label>
                  <p className="text-gray-900">
                    {engineer.currencyType} {engineer.preferredMonthlySalary}
                    /month
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Hire Status
                  </label>
                  <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {engineer.hireStatus}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Skills & Links
              </h3>
              <div className="space-y-4">
                {/* Skills */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Technical Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {engineer.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="space-y-2">
                  {engineer.linkedinUrl && (
                    <a
                      href={engineer.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline block"
                    >
                      LinkedIn Profile
                    </a>
                  )}
                  {engineer.githubUrl && (
                    <a
                      href={engineer.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline block"
                    >
                      GitHub Profile
                    </a>
                  )}
                  {engineer.portfolioUrl && (
                    <a
                      href={engineer.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline block"
                    >
                      Portfolio
                    </a>
                  )}
                  {engineer.resumeUrl && (
                    <a
                      href={engineer.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline block"
                    >
                      Resume
                    </a>
                  )}
                </div>

                {/* Interview Feedback */}
                {engineer.interviewFeedback && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Interview Feedback
                    </h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-600">Rating:</span>
                      <span className="font-bold text-lg">
                        {engineer.interviewFeedback.rating}/5
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {engineer.interviewFeedback.comments}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Vetting() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [hiredEngineers, setHiredEngineers] = useState<HiredCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [selectedHiredEngineer, setSelectedHiredEngineer] =
    useState<HiredCandidate | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isViewHiredModalOpen, setIsViewHiredModalOpen] = useState(false);

  // Confirmation modal state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [candidateToPublish, setCandidateToPublish] =
    useState<Candidate | null>(null);
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

  // FIXED: Filter candidates/engineers locally for search with proper null checks
  const filteredData = useMemo(() => {
    if (statusFilter === 'hired') {
      // Filter hired engineers - add null/undefined check
      if (!hiredEngineers || !Array.isArray(hiredEngineers)) {
        return [];
      }
      return hiredEngineers.filter(engineer => {
        const matchesSearch =
          engineer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          engineer.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      });
    } else {
      // Filter regular candidates - add null/undefined check
      if (!candidates || !Array.isArray(candidates)) {
        return [];
      }
      return candidates.filter(candidate => {
        const matchesSearch =
          candidate.firstName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          candidate.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'passed' && candidate.interviewPassed) ||
          (statusFilter === 'failed' && !candidate.interviewPassed) ||
          (statusFilter === 'published' && candidate.isPublished);

        return matchesSearch && matchesStatus;
      });
    }
  }, [candidates, hiredEngineers, searchTerm, statusFilter]);

  // Fetch total stats separately
  const fetchTotalStats = async () => {
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
  };

  const fetchCandidates = async (page: number = 1, perPage: number = 10) => {
    try {
      setLoading(true);
      setError(null);

      const response: PaginatedCandidatesResponse = await getAllCandidates(
        page,
        perPage,
        '',
        'all'
      );

      // FIXED: Ensure we always set an array, never undefined
      setCandidates(response.data || []);
      setCurrentPage(response.page);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
      setItemsPerPage(response.perPage);
    } catch (err: unknown) {
      console.error(
        err instanceof Error ? err.message : 'Unknown error fetching candidates'
      );
      setError(
        err instanceof Error ? err.message : 'Failed to fetch candidates'
      );
      // FIXED: Set empty array on error
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHiredEngineers = async (
    page: number = 1,
    perPage: number = 10
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response: PaginatedHiredCandidatesResponse =
        await getAllHiredCandidates(page, perPage, '');

      // FIXED: Ensure we always set an array, never undefined
      setHiredEngineers(response.data || []);
      setCurrentPage(response.page);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
      setItemsPerPage(response.perPage);
    } catch (err: unknown) {
      console.error(
        err instanceof Error
          ? err.message
          : 'Unknown error fetching hired engineers'
      );
      setError(
        err instanceof Error ? err.message : 'Failed to fetch hired engineers'
      );
      // FIXED: Set empty array on error
      setHiredEngineers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data based on filter
  useEffect(() => {
    if (statusFilter === 'hired') {
      fetchHiredEngineers(1, itemsPerPage);
    } else {
      fetchTotalStats();
      fetchCandidates(1, itemsPerPage);
    }
  }, [statusFilter, itemsPerPage]);

  // Handle pagination changes
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      if (statusFilter === 'hired') {
        fetchHiredEngineers(newPage, itemsPerPage);
      } else {
        fetchCandidates(newPage, itemsPerPage);
      }
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (statusFilter === 'hired') {
      fetchHiredEngineers(1, newItemsPerPage);
    } else {
      fetchCandidates(1, newItemsPerPage);
    }
  };

  // Handle view candidate
  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsViewModalOpen(true);
  };

  // Handle view hired engineer
  const handleViewHiredEngineer = (engineer: HiredCandidate) => {
    setSelectedHiredEngineer(engineer);
    setIsViewHiredModalOpen(true);
  };

  // Handle publish confirmation
  const handlePublishClick = (candidate: Candidate) => {
    setCandidateToPublish(candidate);
    setShowConfirmation(true);
  };

  // Handle confirmed publish - ONLY API CALLS
  const handleConfirmedPublish = async () => {
    if (!candidateToPublish) return;

    try {
      setIsPublishing(true);

      // Show immediate feedback
      showToast(
        `Publishing ${candidateToPublish.firstName}'s profile...`,
        'info'
      );

      // API call to publish
      await updateCandidatePublishStatus(candidateToPublish.id);

      // Refresh all data from server - NO LOCAL STATE UPDATES
      await Promise.all([
        fetchCandidates(currentPage, itemsPerPage),
        fetchTotalStats(),
      ]);

      // Close modals
      setShowConfirmation(false);
      setIsViewModalOpen(false);
      setCandidateToPublish(null);
      setSelectedCandidate(null);

      // Success toast notification
      showToast(
        'Profile published successfully! The candidate is now visible on the projects platform.',
        'success'
      );
    } catch (err: unknown) {
      console.error(
        err instanceof Error ? err.message : 'Unknown error publishing profile'
      );
      showToast(
        'Failed to publish profile. Please try again or contact support if the issue persists.',
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
  if (loading && candidates.length === 0 && hiredEngineers.length === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Loading{' '}
            {statusFilter === 'hired' ? 'Hired Engineers' : 'Candidates'}
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
            Error Loading{' '}
            {statusFilter === 'hired' ? 'Hired Engineers' : 'Candidates'}
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() =>
              statusFilter === 'hired'
                ? fetchHiredEngineers(currentPage, itemsPerPage)
                : fetchCandidates(currentPage, itemsPerPage)
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Determine the correct text to display based on current filter
  const getEmptyStateText = () => {
    if (statusFilter === 'hired') {
      return {
        type: 'hired engineers',
        message: searchTerm
          ? 'Try adjusting your search criteria'
          : 'No hired engineers available at this time',
      };
    } else {
      return {
        type: 'candidates',
        message:
          searchTerm || statusFilter !== 'all'
            ? 'Try adjusting your search or filter criteria'
            : 'No candidates available at this time',
      };
    }
  };

  const emptyStateText = getEmptyStateText();

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

      {/* Stats Cards - Only show for non-hired view */}
      {statusFilter !== 'hired' && (
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
      )}

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
              setStatusFilter(e.target.value);
              setCurrentPage(1); // Reset to first page on filter change
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Candidates</option>
            <option value="passed">Interview Passed</option>
            <option value="failed">Interview Failed</option>
            <option value="published">Published</option>
            <option value="hired">Hired Engineers</option>
          </select>
        </div>
      </div>

      {/* Table - Different columns for hired engineers */}
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
                {statusFilter === 'hired' ? (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ROLE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      EXPERIENCE
                    </th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      INTERVIEW STATUS
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PUBLISHED
                    </th>
                  </>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {statusFilter === 'hired' && filteredData.length > 0
                ? // Render hired engineers
                  filteredData.map(item => {
                    const engineer = item as HiredCandidate;
                    return (
                      <tr
                        key={engineer.userId}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                              <FiAward className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {engineer.fullName}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {engineer.email}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {engineer.currentDesignation}
                          </div>
                          <div className="text-xs text-gray-500">
                            {engineer.currentCompany}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {engineer.experienceYears} years
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleViewHiredEngineer(engineer)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
                          >
                            <FiEye className="w-3 h-3" />
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                : statusFilter !== 'hired' && filteredData.length > 0
                  ? // Render regular candidates
                    filteredData.map(item => {
                      const candidate = item as Candidate;
                      const canPublishProfile =
                        candidate.interviewPassed && !candidate.isPublished;

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
                                onClick={() => handlePublishClick(candidate)}
                                disabled={!canPublishProfile}
                                className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded transition-colors min-w-[80px] justify-center ${
                                  candidate.isPublished
                                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                    : canPublishProfile
                                      ? 'bg-green-600 text-white hover:bg-green-700'
                                      : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                }`}
                              >
                                <FiGlobe className="w-3 h-3" />
                                {candidate.isPublished
                                  ? 'Published'
                                  : 'Publish'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  : null}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && !loading && (
          <div className="text-center py-12">
            <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {emptyStateText.type} found
            </h3>
            <p className="text-gray-600">{emptyStateText.message}</p>
          </div>
        )}

        {/* Simplified Pagination */}
        {filteredData.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{' '}
              {statusFilter === 'hired' ? 'engineers' : 'candidates'}
            </div>

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

              {/* Page Info */}
              <span className="px-3 py-1 text-sm text-gray-600 font-medium">
                Page {currentPage} of {totalPages}
              </span>

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

      {/* View Details Modal */}
      {isViewModalOpen && selectedCandidate && (
        <ViewCandidateModal
          candidate={selectedCandidate}
          onClose={() => setIsViewModalOpen(false)}
          onPublishProfile={handlePublishClick}
        />
      )}

      {/* View Hired Engineer Modal */}
      {isViewHiredModalOpen && selectedHiredEngineer && (
        <ViewHiredEngineerModal
          engineer={selectedHiredEngineer}
          onClose={() => setIsViewHiredModalOpen(false)}
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
        onConfirm={handleConfirmedPublish}
        candidateName={candidateToPublish?.firstName || ''}
        isLoading={isPublishing}
      />
    </div>
  );
}

export default Vetting;
