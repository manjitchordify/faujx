'use client';
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiSearch,
  FiEye,
  FiRefreshCw,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiRotateCcw,
  FiEdit,
  FiX,
} from 'react-icons/fi';

// Interview interface
interface Interview {
  id: string;
  candidateName: string;
  candidateEmail: string;
  scheduledDateTime: string;
  status: 'scheduled' | 'rescheduled' | 'pending' | 'completed';
  position: string;
  interviewType: string;
  panelist: string;
  duration: string;
}

// Dummy interview data
const DUMMY_INTERVIEWS: Interview[] = [
  {
    id: '1',
    candidateName: 'John Smith',
    candidateEmail: 'john.smith@email.com',
    scheduledDateTime: '2024-01-20T10:00:00Z',
    status: 'scheduled',
    position: 'Frontend Developer',
    interviewType: 'Technical Interview',
    panelist: 'Sarah Johnson',
    duration: '60 minutes',
  },
  {
    id: '2',
    candidateName: 'Emily Davis',
    candidateEmail: 'emily.davis@email.com',
    scheduledDateTime: '2024-01-21T14:30:00Z',
    status: 'rescheduled',
    position: 'Backend Developer',
    interviewType: 'System Design',
    panelist: 'Michael Chen',
    duration: '90 minutes',
  },
  {
    id: '3',
    candidateName: 'Alex Rodriguez',
    candidateEmail: 'alex.rodriguez@email.com',
    scheduledDateTime: '2024-01-22T09:15:00Z',
    status: 'pending',
    position: 'Full Stack Developer',
    interviewType: 'Coding Assessment',
    panelist: 'Lisa Wong',
    duration: '45 minutes',
  },
  {
    id: '4',
    candidateName: 'Maria Garcia',
    candidateEmail: 'maria.garcia@email.com',
    scheduledDateTime: '2024-01-18T16:00:00Z',
    status: 'completed',
    position: 'React Developer',
    interviewType: 'Technical Interview',
    panelist: 'David Kim',
    duration: '60 minutes',
  },
  {
    id: '5',
    candidateName: 'James Wilson',
    candidateEmail: 'james.wilson@email.com',
    scheduledDateTime: '2024-01-23T11:30:00Z',
    status: 'scheduled',
    position: 'UI/UX Developer',
    interviewType: 'Portfolio Review',
    panelist: 'Anna Thompson',
    duration: '75 minutes',
  },
  {
    id: '6',
    candidateName: 'Sophie Brown',
    candidateEmail: 'sophie.brown@email.com',
    scheduledDateTime: '2024-01-19T13:45:00Z',
    status: 'completed',
    position: 'Senior Developer',
    interviewType: 'Behavioral Interview',
    panelist: 'Robert Lee',
    duration: '50 minutes',
  },
  {
    id: '7',
    candidateName: 'Thomas Anderson',
    candidateEmail: 'thomas.anderson@email.com',
    scheduledDateTime: '2024-01-24T15:20:00Z',
    status: 'rescheduled',
    position: 'DevOps Engineer',
    interviewType: 'Infrastructure Review',
    panelist: 'Jennifer Park',
    duration: '80 minutes',
  },
  {
    id: '8',
    candidateName: 'Rachel Green',
    candidateEmail: 'rachel.green@email.com',
    scheduledDateTime: '2024-01-25T10:45:00Z',
    status: 'pending',
    position: 'Mobile Developer',
    interviewType: 'App Demo',
    panelist: 'Mark Johnson',
    duration: '55 minutes',
  },
];

function Interviews() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reschedule modal state
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null
  );
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');

  // Filter interviews based on search term and status filter
  const filteredInterviews = useMemo(() => {
    let filtered = DUMMY_INTERVIEWS;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        interview => interview.status === statusFilter
      );
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        interview =>
          interview.candidateName.toLowerCase().includes(searchLower) ||
          interview.candidateEmail.toLowerCase().includes(searchLower) ||
          interview.position.toLowerCase().includes(searchLower) ||
          interview.panelist.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredInterviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInterviews = filteredInterviews.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleViewDetails = (interviewId: string) => {
    router.push(`/interviews/${interviewId}`);
  };

  const handleRescheduleClick = (interview: Interview) => {
    setSelectedInterview(interview);
    setShowRescheduleModal(true);
    // Pre-populate with current date/time
    const currentDate = new Date(interview.scheduledDateTime);
    setRescheduleDate(currentDate.toISOString().split('T')[0]);
    setRescheduleTime(currentDate.toTimeString().slice(0, 5));
    setRescheduleReason('');
  };

  const handleRescheduleSubmit = () => {
    if (!rescheduleDate || !rescheduleTime || !selectedInterview) {
      alert('Please select both date and time');
      return;
    }

    // Here you would typically call an API to reschedule
    console.log('Rescheduling interview:', {
      interviewId: selectedInterview.id,
      newDateTime: `${rescheduleDate}T${rescheduleTime}:00Z`,
      reason: rescheduleReason,
    });

    // In a real application, you would update the state or refetch data from the server
    // For now, we'll just show the success message without updating the dummy data

    // Close modal and reset form
    setShowRescheduleModal(false);
    setSelectedInterview(null);
    setRescheduleDate('');
    setRescheduleTime('');
    setRescheduleReason('');

    // Show success message (you would integrate with your toast/notification system)
    alert('Interview rescheduled successfully!');
  };

  const closeRescheduleModal = () => {
    setShowRescheduleModal(false);
    setSelectedInterview(null);
    setRescheduleDate('');
    setRescheduleTime('');
    setRescheduleReason('');
  };

  const canReschedule = (status: string) => {
    return status !== 'completed';
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'rescheduled':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return <FiCalendar className="w-4 h-4" />;
      case 'rescheduled':
        return <FiRotateCcw className="w-4 h-4" />;
      case 'pending':
        return <FiClock className="w-4 h-4" />;
      case 'completed':
        return <FiCheckCircle className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
    }
  };

  const getStatusDisplayText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCurrentPage(1);
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
            Manage candidate interviews, schedules, and assessments
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Search Input */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
            <input
              type="text"
              placeholder="Search by name, email, position, or panelist..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 md:pl-11 pr-4 py-2.5 md:py-3 border border-gray-300 text-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-gray-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={e => handleStatusFilterChange(e.target.value)}
              className="w-full px-4 py-2.5 md:py-3 border border-gray-300 text-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="rescheduled">Rescheduled</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {DUMMY_INTERVIEWS.filter(i => i.status === 'scheduled').length}
              </div>
              <div className="text-xs text-gray-500">Scheduled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {
                  DUMMY_INTERVIEWS.filter(i => i.status === 'rescheduled')
                    .length
                }
              </div>
              <div className="text-xs text-gray-500">Rescheduled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {DUMMY_INTERVIEWS.filter(i => i.status === 'pending').length}
              </div>
              <div className="text-xs text-gray-500">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {DUMMY_INTERVIEWS.filter(i => i.status === 'completed').length}
              </div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interviews Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="hidden sm:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="hidden md:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled Time
                </th>
                <th className="hidden lg:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Panelist
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
              {paginatedInterviews.map(interview => {
                const { date, time } = formatDateTime(
                  interview.scheduledDateTime
                );

                return (
                  <tr
                    key={interview.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 md:px-6 py-4">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {interview.candidateName}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {interview.candidateEmail}
                        </div>
                        {/* Mobile: Show position and time */}
                        <div className="sm:hidden mt-1">
                          <div className="text-xs text-gray-600">
                            {interview.position}
                          </div>
                          <div className="text-xs text-gray-500">
                            {date} • {time}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-3 md:px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {interview.position}
                      </div>
                      <div className="text-sm text-gray-500">
                        {interview.interviewType}
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{date}</div>
                      <div className="text-sm text-gray-500">{time}</div>
                    </td>
                    <td className="hidden lg:table-cell px-3 md:px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {interview.panelist}
                      </div>
                      <div className="text-sm text-gray-500">
                        {interview.duration}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(interview.status)}`}
                      >
                        {getStatusIcon(interview.status)}
                        {getStatusDisplayText(interview.status)}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(interview.id)}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        {canReschedule(interview.status) && (
                          <button
                            onClick={() => handleRescheduleClick(interview)}
                            className="text-orange-600 hover:text-orange-900 transition-colors p-1"
                            title="Reschedule Interview"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredInterviews.length === 0 && (
          <div className="text-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-2">
                <FiCalendar className="w-10 h-10 text-gray-400" />
              </div>
              <div className="max-w-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No interviews found
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {searchTerm || statusFilter !== 'all'
                    ? 'No interviews match your current search criteria. Try adjusting your filters.'
                    : 'No interviews are scheduled yet. New interviews will appear here when available.'}
                </p>
                {(searchTerm || statusFilter !== 'all') && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <FiRefreshCw className="w-4 h-4" />
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center px-4 md:px-6 py-4 border-t border-gray-200 gap-4">
            <div className="text-sm text-gray-600 text-center sm:text-left">
              <span>
                Showing {startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, filteredInterviews.length)}{' '}
                of {filteredInterviews.length} interviews
              </span>
            </div>

            <div className="flex items-center gap-1 md:gap-2">
              {/* Previous button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 md:px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-2 md:px-3 py-1 text-sm border rounded-md transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 md:px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedInterview && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-orange-100">
                  <FiEdit className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-semibold text-gray-900">
                    Reschedule Interview
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedInterview.candidateName}
                  </p>
                </div>
              </div>
              <button
                onClick={closeRescheduleModal}
                className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors rounded-lg p-2 hover:bg-gray-100"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-4">
              <div className="space-y-4">
                {/* Current Interview Info */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900 mb-2">
                      Current Schedule:
                    </div>
                    <div className="text-gray-600">
                      {formatDateTime(selectedInterview.scheduledDateTime).date}{' '}
                      at{' '}
                      {formatDateTime(selectedInterview.scheduledDateTime).time}
                    </div>
                    <div className="text-gray-600 mt-1">
                      Position: {selectedInterview.position}
                    </div>
                    <div className="text-gray-600">
                      Panelist: {selectedInterview.panelist}
                    </div>
                  </div>
                </div>

                {/* New Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Date
                  </label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={e => setRescheduleDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {/* New Time Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Time
                  </label>
                  <input
                    type="time"
                    value={rescheduleTime}
                    onChange={e => setRescheduleTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {/* Reason for Reschedule */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Reschedule (Optional)
                  </label>
                  <textarea
                    value={rescheduleReason}
                    onChange={e => setRescheduleReason(e.target.value)}
                    placeholder="Enter reason for rescheduling..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  />
                </div>

                {/* Warning Notice */}
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start">
                    <FiRotateCcw className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="ml-2">
                      <p className="text-sm text-orange-800">
                        The candidate and panelist will be notified about this
                        reschedule. Please ensure the new time works for all
                        parties.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button
                onClick={closeRescheduleModal}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRescheduleSubmit}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Interviews;
