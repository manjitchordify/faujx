'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import {
  FiArrowLeft,
  FiUser,
  FiCalendar,
  FiMail,
  FiCheck,
  FiX,
  FiVideo,
  FiDownload,
  FiUserCheck,
  FiUserX,
  FiClock,
  FiHash,
  FiRefreshCw,
  FiStar,
  FiEye,
  FiChevronDown,
  FiChevronUp,
  FiFileText,
} from 'react-icons/fi';
import {
  getInterviewDetails,
  confirmInterview,
  rejectInterview,
  type InterviewDetails as InterviewDetailsType,
} from '@/services/interviewPanelService';
import { showToast } from '@/utils/toast/Toast';
import { jitsiLiveUrl } from '@/services/jitsiService';
import { useAppSelector } from '@/store/store';
import Cookies from 'js-cookie';

function InterviewDetails() {
  const router = useRouter();
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interviewData, setInterviewData] =
    useState<InterviewDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [expandedFeedback, setExpandedFeedback] = useState<{
    [key: number]: boolean;
  }>({});

  const { loggedInUser } = useAppSelector(state => state.user);

  // Define a type for attendees
  type Attendee = {
    status?: {
      action?: string;
    };
  };

  // Helper function to calculate overall interview status based on all panelists
  const calculateOverallInterviewStatus = (attendees: Attendee[]): string => {
    const actions = attendees
      .map(attendee => attendee.status?.action?.toLowerCase())
      .filter((action): action is string => Boolean(action));

    console.log('All panelist actions:', actions);

    // If any panelist rejected, overall is rejected
    if (actions.includes('rejected')) {
      return 'rejected';
    }

    // If any panelist is still pending, overall is pending
    if (actions.includes('pending')) {
      return 'pending';
    }

    // If all confirmed, overall is confirmed
    if (actions.every(action => action === 'confirmed')) {
      return 'confirmed';
    }

    // If all completed, overall is completed
    if (actions.every(action => action === 'completed')) {
      return 'completed';
    }

    // Default fallback
    return 'pending';
  };

  // Enhanced validation helper
  const validateInterviewState = (data: InterviewDetailsType) => {
    const validMyActions = ['pending', 'confirmed', 'rejected', 'completed'];
    const validInterviewStatuses = [
      'pending',
      'confirmed',
      'rejected',
      'completed',
      'in_progress',
    ];

    return {
      isValidMyAction: validMyActions.includes(data.myAction?.toLowerCase()),
      isValidInterviewStatus: validInterviewStatuses.includes(
        data.interviewstatus?.toLowerCase()
      ),
      hasRequiredData: !!(data.myAction && data.interviewstatus),
    };
  };

  // Function to parse and display feedback scores
  const parseFeedbackNote = (noteString: string) => {
    try {
      const parsed = JSON.parse(noteString);
      return Object.entries(parsed).map(([criterion, score]) => ({
        criterion,
        score: Number(score),
      }));
    } catch {
      return null;
    }
  };

  // Function to calculate average score
  const calculateAverageScore = (noteString: string) => {
    try {
      const parsed = JSON.parse(noteString);
      const scores = Object.values(parsed).map(score => Number(score));
      const average =
        scores.reduce((sum, score) => sum + score, 0) / scores.length;
      return average.toFixed(1);
    } catch {
      return null;
    }
  };

  // Function to get score color based on value
  const getScoreColor = (score: number, maxScore: number = 10) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600 bg-green-50';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-50';
    if (percentage >= 40) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  // Toggle feedback expansion
  const toggleFeedbackExpansion = (index: number) => {
    setExpandedFeedback(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Memoized function using useCallback for fetching interview details
  const fetchInterviewDetails = useCallback(async () => {
    if (!interviewId) return;

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching interview details for ID:', interviewId);
      const response = await getInterviewDetails(interviewId);
      console.log('response', response);
      setInterviewData(response);
    } catch (err: unknown) {
      let errorMessage = 'Failed to fetch interview details';

      if (err && typeof err === 'object' && 'message' in err) {
        errorMessage = (err as { message: string }).message;
      }

      setError(errorMessage);
      console.error('Error fetching interview details:', err);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [interviewId]);

  // Fixed useEffect with proper dependencies
  useEffect(() => {
    console.log('useEffect triggered with interviewId:', interviewId);
    if (interviewId) {
      fetchInterviewDetails();
    }
  }, [interviewId, fetchInterviewDetails]);

  const handleBack = () => {
    router.push('/panelist/interviews');
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return { date: 'N/A', time: 'N/A', day: 'N/A' };

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return { date: 'Invalid Date', time: 'Invalid Time', day: 'Invalid Day' };
    }

    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      day: date.toLocaleDateString('en-US', { weekday: 'long' }),
    };
  };

  const handleResumeDownload = () => {
    if (interviewData?.resumeUrl) {
      const filename = `${interviewData.candidateName}_resume.pdf`;
      const link = document.createElement('a');
      link.href = interviewData.resumeUrl;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Resume download started', 'success');
    } else {
      showToast('Resume not available', 'error');
    }
  };

  const handleReportDownload = () => {
    if (interviewData?.candidateReport) {
      // Open the report URL in a new tab
      window.open(interviewData.candidateReport, '_blank');
      showToast('Report opened in new tab', 'success');
    } else {
      showToast('Report not available', 'error');
    }
  };

  const joinMeeting = async (meeting_id: string, roleTitle: string) => {
    try {
      const response = await jitsiLiveUrl({
        userId: loggedInUser?.id as string,
        sessionId: meeting_id as string,
        role: 'INTERVIEW_PANEL',
      });
      if (response?.url) {
        Cookies.set('jwt_token', response?.jwt);
        Cookies.set('roleTitle', roleTitle);
        window.open(
          `/panelist/interviews/${interviewId}/meeting?room=${meeting_id}`
        );
      }
    } catch (error: unknown) {
      const message = (error as Error)?.message || 'An error occurred';
      showToast(message, 'error');
    }
  };

  // Handle interview confirmation with server data refresh
  const handleConfirmInterview = async () => {
    if (!interviewId) return;

    // Show confirmation dialog
    const isConfirmed = window.confirm(
      `Are you sure you want to confirm this interview?\n\n` +
        `Candidate: ${interviewData?.candidateName}\n` +
        `Scheduled: ${formatDateTime(interviewData?.scheduledDateandTime || '').date} at ${formatDateTime(interviewData?.scheduledDateandTime || '').time}\n\n` +
        `Once confirmed, you will be expected to attend the interview.`
    );

    if (!isConfirmed) return;

    try {
      setActionLoading(true);
      await confirmInterview(interviewId);

      // Refresh the interview data from server to get updated state
      await fetchInterviewDetails();

      // Show custom success box
      window.alert(
        '✅ SUCCESS\n\nInterview confirmed successfully!\n\nYou will be expected to attend this interview. The meeting link will be available when all panelists confirm.'
      );
    } catch (error: unknown) {
      const message =
        (error as { message?: string })?.message ||
        'Failed to confirm interview';

      // Show custom error box
      window.alert(
        '❌ ERROR\n\nFailed to confirm interview.\n\n' +
          message +
          '\n\nPlease try again or contact support if the problem persists.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Handle interview rejection with server data refresh
  const handleRejectInterview = async () => {
    if (!interviewId) return;

    // Show confirmation dialog
    const isConfirmed = window.confirm(
      `Are you sure you want to reject this interview?\n\n` +
        `Candidate: ${interviewData?.candidateName}\n` +
        `Scheduled: ${formatDateTime(interviewData?.scheduledDateandTime || '').date} at ${formatDateTime(interviewData?.scheduledDateandTime || '').time}\n\n` +
        `This action cannot be undone. The candidate and other panelists will be notified.`
    );

    if (!isConfirmed) return;

    try {
      setActionLoading(true);
      await rejectInterview(interviewId);

      // Refresh the interview data from server to get updated state
      await fetchInterviewDetails();

      // Show custom success box
      window.alert(
        '✅ SUCCESS\n\nInterview rejected successfully!\n\nThe candidate and other panelists have been notified of your decision.'
      );
    } catch (error: unknown) {
      const message =
        (error as { message?: string })?.message ||
        'Failed to reject interview';

      // Show custom error box
      window.alert(
        '❌ ERROR\n\nFailed to reject interview.\n\n' +
          message +
          '\n\nPlease try again or contact support if the problem persists.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'in_progress':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getMyActionIcon = (myAction: string) => {
    switch (myAction.toLowerCase()) {
      case 'completed':
        return <FiCheck className="w-4 h-4" />;
      case 'confirmed':
        return <FiUserCheck className="w-4 h-4" />;
      case 'rejected':
        return <FiUserX className="w-4 h-4" />;
      case 'pending':
        return <FiClock className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
    }
  };

  const getMyActionDisplayText = (myAction: string) => {
    switch (myAction.toLowerCase()) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'rejected':
        return 'Rejected';
      case 'completed':
        return 'Completed';
      default:
        return myAction.replace('_', ' ');
    }
  };

  // Enhanced conditional logic with proper overall status calculation
  const overallInterviewStatus = interviewData
    ? calculateOverallInterviewStatus(interviewData.attendees)
    : 'pending';
  const isPendingConfirmation =
    interviewData?.myAction?.toLowerCase() === 'pending';

  // Meeting should only be enabled when ALL panelists have confirmed (overall status is confirmed/in_progress/completed)
  const isMeetingEnabled = ['confirmed', 'in_progress', 'completed'].includes(
    overallInterviewStatus.toLowerCase()
  );
  const hasMeetingLink =
    interviewData?.meetingLink && interviewData.meetingLink.trim() !== '';

  // Debug logging
  console.log('Enhanced Button Logic Debug:', {
    myAction: interviewData?.myAction,
    originalInterviewStatus: interviewData?.interviewstatus,
    calculatedOverallStatus: overallInterviewStatus,
    isPendingConfirmation,
    isMeetingEnabled,
    hasMeetingLink,
    allPanelistActions: interviewData?.attendees.map(a => a.status?.action),
  });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiRefreshCw className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading interview details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !interviewData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiX className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Interview Not Found
          </h3>
          <p className="text-gray-600 mb-6">
            {error || 'The interview details could not be loaded.'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={fetchInterviewDetails}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" />
              Retry
            </button>
            <button
              onClick={handleBack}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { date, time, day } = formatDateTime(
    interviewData.scheduledDateandTime
  );

  // Validate interview state
  const stateValidation = validateInterviewState(interviewData);
  if (!stateValidation.hasRequiredData) {
    console.warn('Interview data missing required fields:', stateValidation);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Back to Interviews
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                Interview Details
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Candidate Information */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Candidate Information
                </h3>
              </div>
              <div className="px-6 py-5">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 bg-blue-600 rounded-lg flex items-center justify-center">
                      <FiUser className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">
                          {interviewData.candidateName}
                        </h4>
                        {interviewData.candidateRole && (
                          <p className="text-sm text-gray-600 mt-1">
                            {interviewData.candidateRole} Developer
                          </p>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(overallInterviewStatus)}`}
                      >
                        {getMyActionIcon(overallInterviewStatus)}
                        <span className="ml-1">
                          {getMyActionDisplayText(overallInterviewStatus)}
                        </span>
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <FiMail className="mr-2 h-4 w-4" />
                        <a
                          href={`mailto:${interviewData.candidateEmail}`}
                          className="text-blue-600 hover:text-blue-500"
                        >
                          {interviewData.candidateEmail}
                        </a>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FiHash className="mr-2 h-4 w-4" />
                        <span className="font-mono">ID: {interviewId}</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center text-sm text-gray-700">
                        <span className="font-medium">Interview Status:</span>
                        <span className="ml-2 capitalize font-semibold text-gray-900">
                          {overallInterviewStatus.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    {/* Resume Download Button and Report Button */}
                    {(interviewData.resumeUrl || interviewData.userId) && (
                      <div className="mt-4 flex gap-4">
                        {/* Resume Download Button */}
                        {interviewData.resumeUrl && (
                          <button
                            onClick={handleResumeDownload}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          >
                            <FiDownload className="mr-2 h-4 w-4" />
                            Download Resume
                          </button>
                        )}

                        {/* Report Button */}
                        {interviewData.userId && (
                          <button
                            onClick={handleReportDownload}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          >
                            <FiFileText className="mr-2 w-4 h-4" />
                            Download Report
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Interview Schedule */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <FiCalendar className="mr-2 h-5 w-5" />
                  Interview Schedule
                </h3>
              </div>
              <div className="px-6 py-5">
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {time}
                  </div>
                  <div className="text-lg font-medium text-gray-700 mb-1">
                    {day}
                  </div>
                  <div className="text-sm text-gray-500">{date}</div>
                </div>
              </div>
            </div>

            {/* Attendees Information */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <FiUserCheck className="mr-2 h-5 w-5" />
                  Interview Panelists
                </h3>
              </div>
              <div className="px-6 py-5">
                <div className="space-y-4">
                  {interviewData.attendees.map((attendee, index) => {
                    // Get the attendee key (attendee1, attendee2, etc.)
                    const attendeeKey = Object.keys(attendee).find(key =>
                      key.startsWith('attendee')
                    );
                    const attendeeInfo = attendeeKey
                      ? attendee[attendeeKey]
                      : null;
                    const status = attendee.status;

                    if (
                      !attendeeInfo ||
                      (typeof attendeeInfo === 'object' &&
                        'action' in attendeeInfo)
                    ) {
                      return null;
                    }

                    const typedAttendeeInfo = attendeeInfo as {
                      email: string;
                      interviewerName: string;
                    };

                    // Check if this is the current user (compare emails)
                    const isCurrentUser =
                      loggedInUser?.email === typedAttendeeInfo.email;

                    // Parse feedback scores if available
                    const feedbackScores = status.note
                      ? parseFeedbackNote(status.note)
                      : null;
                    const averageScore = status.note
                      ? calculateAverageScore(status.note)
                      : null;

                    return (
                      <div
                        key={index}
                        className={`border rounded-lg overflow-hidden transition-all duration-200 ${
                          isCurrentUser
                            ? 'border-blue-300 bg-blue-50/30 ring-2 ring-blue-200 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div
                          className={`flex items-center justify-between p-4 ${
                            isCurrentUser ? 'bg-blue-50' : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isCurrentUser
                                  ? 'bg-blue-600 ring-2 ring-blue-300'
                                  : 'bg-blue-600'
                              }`}
                            >
                              <FiUser className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">
                                  {typedAttendeeInfo.interviewerName}
                                </span>
                                {isCurrentUser && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                {typedAttendeeInfo.email}
                              </div>
                              {status.rating && (
                                <div className="flex items-center text-sm text-gray-600 mt-1">
                                  <FiStar className="w-4 h-4 mr-1 fill-current text-yellow-400" />
                                  <span className="font-medium">
                                    {status.rating}/10
                                  </span>
                                  {averageScore && (
                                    <span className="ml-2 text-xs text-gray-500">
                                      (Avg: {averageScore})
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                isCurrentUser
                                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                  : getStatusBadgeColor(status.action)
                              }`}
                            >
                              {getMyActionIcon(status.action)}
                              <span className="ml-1">
                                {getMyActionDisplayText(status.action)}
                              </span>
                            </span>
                            {feedbackScores && (
                              <button
                                onClick={() => toggleFeedbackExpansion(index)}
                                className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                                  isCurrentUser
                                    ? 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                                    : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                                }`}
                              >
                                <FiEye className="w-3 h-3 mr-1" />
                                Details
                                {expandedFeedback[index] ? (
                                  <FiChevronUp className="w-3 h-3 ml-1" />
                                ) : (
                                  <FiChevronDown className="w-3 h-3 ml-1" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Expanded Feedback Details */}
                        {expandedFeedback[index] && feedbackScores && (
                          <div
                            className={`border-t bg-white p-4 ${
                              isCurrentUser
                                ? 'border-blue-200'
                                : 'border-gray-200'
                            }`}
                          >
                            <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                              <FiStar className="w-4 h-4 mr-1" />
                              Detailed Evaluation Scores
                              {isCurrentUser && (
                                <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full border border-blue-200">
                                  Your Feedback
                                </span>
                              )}
                            </h5>
                            <div className="grid grid-cols-1 gap-3">
                              {feedbackScores.map(
                                ({ criterion, score }, scoreIndex) => (
                                  <div
                                    key={scoreIndex}
                                    className={`flex items-center justify-between p-3 rounded-md ${
                                      isCurrentUser
                                        ? 'bg-blue-50 border border-blue-100'
                                        : 'bg-gray-50'
                                    }`}
                                  >
                                    <div className="flex-1">
                                      <span className="text-sm text-gray-700">
                                        {criterion}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="w-16 bg-gray-200 rounded-full h-2">
                                        <div
                                          className={`h-2 rounded-full transition-all duration-300 ${
                                            isCurrentUser
                                              ? 'bg-blue-600'
                                              : 'bg-blue-600'
                                          }`}
                                          style={{
                                            width: `${(score / 10) * 100}%`,
                                          }}
                                        ></div>
                                      </div>
                                      <span
                                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getScoreColor(score)}`}
                                      >
                                        {score}/10
                                      </span>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                            {averageScore && (
                              <div
                                className={`mt-4 p-3 border rounded-lg ${
                                  isCurrentUser
                                    ? 'bg-blue-50 border-blue-200'
                                    : 'bg-blue-50 border-blue-200'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-blue-900">
                                    Overall Average Score
                                    {isCurrentUser && (
                                      <span className="ml-2 text-xs text-blue-600">
                                        (Your Rating)
                                      </span>
                                    )}
                                  </span>
                                  <span className="text-lg font-bold text-blue-900">
                                    {averageScore}/10
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Quick Actions
                </h3>
              </div>
              <div className="px-6 py-5 space-y-4">
                {/* Enhanced Meeting Button Logic */}
                {hasMeetingLink && isMeetingEnabled ? (
                  <button
                    onClick={() =>
                      joinMeeting(
                        interviewData.meetingLink?.split('/').pop() ?? '',
                        'Front-end'
                      )
                    }
                    className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-colors"
                  >
                    <FiVideo className="mr-2 h-4 w-4" />
                    Join Meeting
                  </button>
                ) : hasMeetingLink && !isMeetingEnabled ? (
                  <div className="w-full text-center space-y-2">
                    <div className="w-full inline-flex justify-center items-center px-4 py-3 border-2 border-dashed border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-gray-50">
                      <FiVideo className="mr-2 h-4 w-4" />
                      Meeting Unavailable
                    </div>
                    <p className="text-xs text-gray-500">
                      Meeting available when all panelists confirm
                      <br />
                      <span className="font-mono text-xs">
                        Overall Status: {overallInterviewStatus}
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="w-full text-center space-y-2">
                    <div className="w-full inline-flex justify-center items-center px-4 py-3 border-2 border-dashed border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-gray-50">
                      <FiVideo className="mr-2 h-4 w-4" />
                      No Meeting Link
                    </div>
                    <p className="text-xs text-gray-500">
                      Meeting link not available
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Interview Response Actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Interview Response
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {isPendingConfirmation
                    ? 'Please respond to this interview invitation'
                    : 'Interview response status'}
                </p>
              </div>
              <div className="px-6 py-5 space-y-4">
                {/* Enhanced Confirm/Reject Button Logic */}
                {isPendingConfirmation ? (
                  <>
                    <button
                      onClick={handleConfirmInterview}
                      disabled={actionLoading}
                      className="w-full inline-flex justify-center items-center px-6 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <FiUserCheck className="mr-2 h-5 w-5" />
                      {actionLoading ? 'Confirming...' : 'Confirm Interview'}
                    </button>
                    <button
                      onClick={handleRejectInterview}
                      disabled={actionLoading}
                      className="w-full inline-flex justify-center items-center px-6 py-4 border border-red-300 text-base font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <FiUserX className="mr-2 h-5 w-5" />
                      {actionLoading ? 'Rejecting...' : 'Reject Interview'}
                    </button>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      {getMyActionIcon(interviewData.myAction)}
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {getMyActionDisplayText(interviewData.myAction)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Your Response: {interviewData.myAction}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Information Card */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Status Information
                </h3>
              </div>
              <div className="px-6 py-5 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Overall Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadgeColor(overallInterviewStatus)}`}
                  >
                    {overallInterviewStatus.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">My Action:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(interviewData.myAction)}`}
                  >
                    {getMyActionDisplayText(interviewData.myAction)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewDetails;
