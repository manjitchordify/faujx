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
  FiFileText,
  FiRepeat,
  FiUsers,
  FiTrendingUp,
  FiMessageCircle,
  FiAward,
  FiChevronDown,
  FiChevronUp,
  FiAlertTriangle,
  FiInfo,
} from 'react-icons/fi';
import {
  getInterviewDetails,
  confirmInterview,
  rejectInterview,
  acceptInvitation,
  declineInvitation,
  type InterviewDetails as InterviewDetailsType,
} from '@/services/admin-panelist-services/interviewPanelService';
import { showToast } from '@/utils/toast/Toast';
import { jitsiLiveUrl } from '@/services/jitsiService';
import { useAppSelector } from '@/store/store';
import Cookies from 'js-cookie';

// Import our separate modal components
import TransferInterviewModal from './Transferinterviewmodal';
import InviteInterviewersModal from './Inviteinterviewersmodal';

function InterviewDetails() {
  const router = useRouter();
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interviewData, setInterviewData] =
    useState<InterviewDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Expanded feedback state
  const [expandedFeedback, setExpandedFeedback] = useState<{
    [key: number]: boolean;
  }>({});

  const { loggedInUser } = useAppSelector(state => state.user);

  // Enhanced validation helper - fixed to use correct field names
  const validateInterviewState = (data: InterviewDetailsType) => {
    const validMyActions = [
      'pending',
      'confirmed',
      'rejected',
      'completed',
      'transferred',
      'no_action',
    ];
    const validInterviewStatuses = [
      'pending',
      'confirmed',
      'rejected',
      'completed',
      'in_progress',
      'cancelled',
    ];

    return {
      isValidMyAction: validMyActions.includes(data.myAction?.toLowerCase()),
      isValidInterviewStatus: validInterviewStatuses.includes(
        data.interviewStatus?.toLowerCase() // Fixed field name
      ),
      hasRequiredData: !!(data.myAction && data.interviewStatus), // Fixed field name
    };
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

  // Function to parse detailed scores
  const parseDetailedScores = (noteString: string) => {
    try {
      const parsed = JSON.parse(noteString);
      return Object.entries(parsed).map(([criteria, score]) => ({
        criteria,
        score: Number(score),
      }));
    } catch {
      return null;
    }
  };

  // Function to get score color based on rating
  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-700 bg-green-100 border-green-300';
    if (score >= 7) return 'text-blue-700 bg-blue-100 border-blue-300';
    if (score >= 5) return 'text-yellow-700 bg-yellow-100 border-yellow-300';
    if (score >= 3) return 'text-orange-700 bg-orange-100 border-orange-300';
    return 'text-red-700 bg-red-100 border-red-300';
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
      setInterviewData(response as InterviewDetailsType);
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

  // Handle interview confirmation (for regular interviews)
  const handleConfirmInterview = async () => {
    if (!interviewId) return;

    try {
      setActionLoading(true);
      await confirmInterview(interviewId);

      setShowConfirmModal(false);
      await fetchInterviewDetails();
      showToast('Interview confirmed successfully!', 'success');
    } catch (error: unknown) {
      const message =
        (error as { message?: string })?.message ||
        'Failed to confirm interview';
      showToast(`Confirmation failed: ${message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle interview rejection (for regular interviews)
  const handleRejectInterview = async () => {
    if (!interviewId) return;

    try {
      setActionLoading(true);
      await rejectInterview(interviewId);

      setShowRejectModal(false);
      await fetchInterviewDetails();
      showToast('Interview rejected successfully!', 'success');
    } catch (error: unknown) {
      const message =
        (error as { message?: string })?.message ||
        'Failed to reject interview';
      showToast(`Rejection failed: ${message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // NEW: Handle invitation acceptance
  const handleAcceptInvitation = async () => {
    if (!interviewId) return;

    try {
      setActionLoading(true);
      // Using interviewId as invitationId (assuming they are the same)
      await acceptInvitation(interviewId);

      setShowConfirmModal(false);
      await fetchInterviewDetails();
      showToast('Invitation accepted successfully!', 'success');
    } catch (error: unknown) {
      const message =
        (error as { message?: string })?.message ||
        'Failed to accept invitation';
      showToast(`Accept failed: ${message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // NEW: Handle invitation decline
  const handleDeclineInvitation = async () => {
    if (!interviewId) return;

    try {
      setActionLoading(true);
      // Using interviewId as invitationId (assuming they are the same)
      await declineInvitation(interviewId);

      setShowRejectModal(false);
      await fetchInterviewDetails();
      showToast('Invitation declined successfully!', 'success');
    } catch (error: unknown) {
      const message =
        (error as { message?: string })?.message ||
        'Failed to decline invitation';
      showToast(`Decline failed: ${message}`, 'error');
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
      case 'transferred':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border border-gray-300';
      case 'no_action':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
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
      case 'transferred':
        return <FiRepeat className="w-4 h-4" />;
      case 'cancelled':
        return <FiX className="w-4 h-4" />;
      case 'no_action':
        return <FiInfo className="w-4 h-4" />;
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
      case 'transferred':
        return 'Transferred';
      case 'cancelled':
        return 'Cancelled';
      case 'no_action':
        return 'Invited';
      default:
        return myAction.replace('_', ' ');
    }
  };

  // Fixed to use the correct field name: interviewStatus
  const interviewStatus =
    interviewData?.interviewStatus?.toLowerCase() || 'pending';
  const myAction = interviewData?.myAction?.toLowerCase();

  // Check if interview is cancelled - all actions should be disabled
  const isCancelled = interviewStatus === 'cancelled';

  // Check if user is invited (isInvited flag determines which APIs to use)
  const isInvited = interviewData?.isInvited || false;

  // UPDATED JOIN MEETING LOGIC - Handle invited users differently
  const isMeetingEnabled =
    interviewStatus === 'confirmed' &&
    !isCancelled &&
    (isInvited ? myAction === 'confirmed' : true);

  const hasMeetingLink =
    interviewData?.meetingLink && interviewData.meetingLink.trim() !== '';

  // Check if transfer is allowed (only when myAction is pending and not cancelled)
  const isTransferAllowed = myAction === 'pending' && !isCancelled;

  // Check if invite is allowed - disabled if already invited or cancelled
  // Also check canInviteOthers flag if available
  const isInviteAllowed =
    isMeetingEnabled && !isInvited && interviewData?.canInviteOthers !== false;

  // UPDATED LOGIC: Check if confirm/reject actions are allowed based on invitation status
  // For invitations: Enable when myAction is 'no_action' or 'pending' and not cancelled
  // For regular interviews: Enable when myAction is 'pending' and not cancelled
  const areResponseActionsAllowed =
    (myAction === 'no_action' || myAction === 'pending') && !isCancelled;

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

  // Fixed to use the correct field name: scheduledDateAndTime
  const { date, time, day } = formatDateTime(
    interviewData.scheduledDateAndTime
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
        {/* Cancelled Interview Alert */}
        {isCancelled && (
          <div className="mb-6 bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertTriangle className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-800">
                  Interview Cancelled
                </h3>
                <div className="mt-2 text-sm text-gray-700">
                  <p>
                    This interview has been cancelled. No further actions are
                    available.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invited Interview Alert */}
        {isInvited && interviewData.invitedBy && (
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiInfo className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Interview Invitation
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    You have been invited to this interview by{' '}
                    <span className="font-semibold">
                      {interviewData.invitedBy}
                    </span>
                    .
                    {areResponseActionsAllowed &&
                      ' Please respond to the invitation below.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

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
                    <div
                      className={`h-16 w-16 rounded-lg flex items-center justify-center ${
                        isCancelled ? 'bg-gray-600' : 'bg-blue-600'
                      }`}
                    >
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
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                          myAction || 'pending'
                        )}`}
                      >
                        {getMyActionIcon(myAction || 'pending')}
                        <span className="ml-1">
                          {getMyActionDisplayText(myAction || 'pending')}
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
                          {interviewStatus.replace('_', ' ')}
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
                <div
                  className={`rounded-lg p-6 text-center ${
                    isCancelled ? 'bg-gray-100' : 'bg-gray-50'
                  }`}
                >
                  <div
                    className={`text-3xl font-bold mb-2 ${
                      isCancelled ? 'text-gray-600' : 'text-gray-900'
                    }`}
                  >
                    {time}
                  </div>
                  <div
                    className={`text-lg font-medium mb-1 ${
                      isCancelled ? 'text-gray-500' : 'text-gray-700'
                    }`}
                  >
                    {day}
                  </div>
                  <div
                    className={`text-sm ${
                      isCancelled ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {date}
                  </div>

                  {/* Duration */}
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                    <FiClock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      {interviewData.durationMinutes} minutes
                    </span>
                  </div>

                  {isCancelled && (
                    <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                      <FiX className="w-3 h-3 mr-1" />
                      Cancelled
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Panelist Evaluations & Feedback */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <FiUserCheck className="mr-2 h-5 w-5" />
                  Panelist Evaluations & Feedback
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Detailed interview assessments from panelists
                </p>
              </div>
              <div className="px-6 py-5">
                <div className="space-y-6">
                  {interviewData.attendees.map((attendee, index) => {
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
                      participationType?: string;
                    };

                    const isCurrentUser =
                      loggedInUser?.email === typedAttendeeInfo.email;
                    const averageScore = status.note
                      ? calculateAverageScore(status.note)
                      : null;
                    const detailedScores = status.note
                      ? parseDetailedScores(status.note)
                      : null;
                    const isExpanded = expandedFeedback[index] || false;

                    return (
                      <div
                        key={index}
                        className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                          isCurrentUser
                            ? 'border-blue-300 bg-blue-50/30 ring-2 ring-blue-200 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        {/* Panelist Header */}
                        <div
                          className={`flex items-center justify-between p-6 ${
                            isCurrentUser ? 'bg-blue-50/50' : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                isCurrentUser
                                  ? 'bg-blue-600 ring-2 ring-blue-300'
                                  : 'bg-blue-600'
                              }`}
                            >
                              <FiUser className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-lg font-semibold text-gray-900">
                                  {typedAttendeeInfo.interviewerName}
                                </h4>
                                {isCurrentUser && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                    You
                                  </span>
                                )}
                                {typedAttendeeInfo.participationType && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300 capitalize">
                                    {typedAttendeeInfo.participationType}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">
                                {typedAttendeeInfo.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(status.action)}`}
                            >
                              {getMyActionIcon(status.action)}
                              <span className="ml-1">
                                {getMyActionDisplayText(status.action)}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Feedback Content */}
                        {(detailedScores ||
                          status.rating ||
                          status.comments) && (
                          <div className="px-6 pb-6">
                            {/* Overall Rating Display */}
                            {averageScore && (
                              <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <FiAward className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium text-gray-900">
                                      Overall Rating
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="text-2xl font-bold text-blue-600">
                                      {averageScore}
                                    </div>
                                    <div className="text-gray-500">/10</div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Detailed Scores */}
                            {detailedScores && detailedScores.length > 0 && (
                              <div className="mb-4">
                                <button
                                  onClick={() => toggleFeedbackExpansion(index)}
                                  className="flex items-center justify-between w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                                >
                                  <div className="flex items-center gap-2">
                                    <FiTrendingUp className="w-4 h-4 text-gray-600" />
                                    <span className="font-medium text-gray-900">
                                      Detailed Evaluation
                                    </span>
                                  </div>
                                  {isExpanded ? (
                                    <FiChevronUp className="w-4 h-4 text-gray-600" />
                                  ) : (
                                    <FiChevronDown className="w-4 h-4 text-gray-600" />
                                  )}
                                </button>

                                {isExpanded && (
                                  <div className="mt-3 space-y-2">
                                    {detailedScores.map((item, scoreIndex) => (
                                      <div
                                        key={scoreIndex}
                                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                                      >
                                        <div className="flex-1">
                                          <p className="text-sm font-medium text-gray-900">
                                            {item.criteria}
                                          </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getScoreColor(item.score)}`}
                                          >
                                            {item.score}/10
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Comments Section */}
                            {status.comments && (
                              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-start gap-3">
                                  <FiMessageCircle className="w-5 h-5 text-gray-600 mt-0.5" />
                                  <div>
                                    <h5 className="font-medium text-gray-900 mb-2">
                                      Interview Comments
                                    </h5>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                      {status.comments}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Legacy Rating Display (if no detailed scores) */}
                            {status.rating && !detailedScores && (
                              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-3">
                                  <FiStar className="w-5 h-5 text-yellow-500 fill-current" />
                                  <span className="font-medium text-gray-900">
                                    Rating:
                                  </span>
                                  <span className="text-lg font-semibold text-blue-600">
                                    {status.rating}/10
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* No feedback available state */}
                        {!detailedScores &&
                          !status.rating &&
                          !status.comments && (
                            <div className="px-6 pb-6">
                              <div className="text-center py-8 text-gray-500">
                                <FiMessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">
                                  No feedback available yet
                                </p>
                              </div>
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
                {/* Meeting Button - Updated logic: Only enabled when interviewStatus is "confirmed" */}
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
                ) : (
                  <div className="w-full text-center space-y-2">
                    <div className="w-full inline-flex justify-center items-center px-4 py-3 border-2 border-dashed border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-gray-50">
                      <FiVideo className="mr-2 h-4 w-4" />
                      {isCancelled
                        ? 'Meeting Cancelled'
                        : hasMeetingLink
                          ? isInvited && myAction !== 'confirmed'
                            ? 'Accept Invitation to Join'
                            : 'Meeting Unavailable'
                          : 'No Meeting Link'}
                    </div>
                    <p className="text-xs text-gray-500">
                      {isCancelled
                        ? 'Interview has been cancelled'
                        : hasMeetingLink
                          ? isInvited && myAction !== 'confirmed'
                            ? 'Meeting available after accepting invitation'
                            : `Meeting available when interview status is confirmed`
                          : 'Meeting link not available'}
                    </p>
                  </div>
                )}

                {/* Transfer Interview Button */}
                {isTransferAllowed ? (
                  <button
                    onClick={() => setShowTransferModal(true)}
                    className="w-full inline-flex justify-center items-center px-4 py-3 border border-orange-300 text-sm font-medium rounded-md text-orange-700 bg-orange-50 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shadow-sm transition-colors"
                  >
                    <FiRepeat className="mr-2 h-4 w-4" />
                    Transfer Interview
                  </button>
                ) : (
                  <div className="w-full text-center space-y-2">
                    <div className="w-full inline-flex justify-center items-center px-4 py-3 border-2 border-dashed border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-gray-50">
                      <FiRepeat className="mr-2 h-4 w-4" />
                      Transfer Not Available
                    </div>
                    <p className="text-xs text-gray-500">
                      {isCancelled
                        ? 'Transfer not available for cancelled interviews'
                        : 'Transfer only available when status is pending'}
                    </p>
                  </div>
                )}

                {/* Invite Interviewers/Panelists Button */}
                {isInviteAllowed ? (
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="w-full inline-flex justify-center items-center px-4 py-3 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-colors"
                  >
                    <FiUsers className="mr-2 h-4 w-4" />
                    Invite Interviewers/Panelists
                  </button>
                ) : (
                  <div className="w-full text-center space-y-2">
                    <div className="w-full inline-flex justify-center items-center px-4 py-3 border-2 border-dashed border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-gray-50">
                      <FiUsers className="mr-2 h-4 w-4" />
                      Invite Not Available
                    </div>
                    <p className="text-xs text-gray-500">
                      {isCancelled
                        ? 'Invite not available for cancelled interviews'
                        : isInvited
                          ? `Already invited by ${interviewData.invitedBy}`
                          : 'Invite feature available when interview status is confirmed'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* UPDATED: Interview Response Actions - Different UI based on invitation status */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {/* UPDATED: Different title based on invitation status */}
                  {isInvited ? 'Invitation Response' : 'Interview Response'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {isCancelled
                    ? 'Interview has been cancelled'
                    : areResponseActionsAllowed
                      ? isInvited
                        ? 'Please respond to this interview invitation'
                        : 'Please respond to this interview request'
                      : isInvited
                        ? 'Invitation response status'
                        : 'Interview response status'}
                </p>
              </div>
              <div className="px-6 py-5 space-y-4">
                {areResponseActionsAllowed ? (
                  <>
                    {/* UPDATED: Different buttons based on invitation status */}
                    <button
                      onClick={() => setShowConfirmModal(true)}
                      disabled={actionLoading}
                      className="w-full inline-flex justify-center items-center px-6 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <FiUserCheck className="mr-2 h-5 w-5" />
                      {actionLoading
                        ? isInvited
                          ? 'Accepting...'
                          : 'Confirming...'
                        : isInvited
                          ? 'Accept Invitation'
                          : 'Confirm Interview'}
                    </button>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      disabled={actionLoading}
                      className="w-full inline-flex justify-center items-center px-6 py-4 border border-red-300 text-base font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <FiUserX className="mr-2 h-5 w-5" />
                      {actionLoading
                        ? isInvited
                          ? 'Declining...'
                          : 'Rejecting...'
                        : isInvited
                          ? 'Decline Invitation'
                          : 'Reject Interview'}
                    </button>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div
                      className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-3 ${
                        isCancelled
                          ? 'bg-gray-100'
                          : interviewData.myAction.toLowerCase() ===
                              'transferred'
                            ? 'bg-purple-100'
                            : isInvited
                              ? 'bg-blue-100'
                              : 'bg-green-100'
                      }`}
                    >
                      <div
                        className={
                          isCancelled
                            ? 'text-gray-600'
                            : interviewData.myAction.toLowerCase() ===
                                'transferred'
                              ? 'text-purple-600'
                              : isInvited
                                ? 'text-blue-600'
                                : 'text-green-600'
                        }
                      >
                        {getMyActionIcon(
                          isCancelled
                            ? 'cancelled'
                            : isInvited
                              ? 'no_action'
                              : interviewData.myAction
                        )}
                      </div>
                    </div>
                    <p
                      className={`text-sm font-medium mb-1 ${
                        isCancelled
                          ? 'text-gray-700'
                          : interviewData.myAction.toLowerCase() ===
                              'transferred'
                            ? 'text-purple-900'
                            : isInvited
                              ? 'text-blue-900'
                              : 'text-green-900'
                      }`}
                    >
                      {getMyActionDisplayText(
                        isCancelled
                          ? 'cancelled'
                          : isInvited
                            ? 'no_action'
                            : interviewData.myAction
                      )}
                    </p>
                    {isCancelled && (
                      <p className="text-xs text-gray-500 mt-2">
                        No actions available for cancelled interviews
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TransferInterviewModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        interviewId={interviewId}
        candidateName={interviewData.candidateName}
        scheduledDate={date}
        scheduledTime={time}
        onTransferSuccess={() => {
          fetchInterviewDetails();
          router.push('/panelist/interviews');
        }}
      />

      <InviteInterviewersModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        interviewId={interviewId}
        candidateName={interviewData.candidateName}
        scheduledDate={date}
        scheduledTime={time}
        onInviteSuccess={() => {
          fetchInterviewDetails();
        }}
      />

      {/* UPDATED: Confirm Modal - Different behavior based on invitation status */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <FiUserCheck className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-semibold text-gray-900">
                    {/* UPDATED: Different title based on invitation status */}
                    {isInvited ? 'Accept Invitation' : 'Confirm Interview'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {/* UPDATED: Different subtitle based on invitation status */}
                    {isInvited
                      ? 'You will be expected to attend this interview'
                      : 'You will be expected to attend this interview'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors rounded-lg p-2 hover:bg-gray-100"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <FiCheck className="h-5 w-5 text-green-600 mt-0.5" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-green-900">
                        Interview Details
                      </h4>
                      <div className="text-sm text-green-700 mt-2 space-y-1">
                        <div>
                          <strong>Candidate:</strong>{' '}
                          {interviewData?.candidateName}
                        </div>
                        <div>
                          <strong>Date:</strong> {date}
                        </div>
                        <div>
                          <strong>Time:</strong> {time}
                        </div>
                        {/* UPDATED: Show invitation info if applicable */}
                        {isInvited && interviewData.invitedBy && (
                          <div>
                            <strong>Invited by:</strong>{' '}
                            {interviewData.invitedBy}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={
                  isInvited ? handleAcceptInvitation : handleConfirmInterview
                }
                disabled={actionLoading}
                className="flex-1 px-4 py-3 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center"
              >
                {actionLoading ? (
                  <>
                    <FiRefreshCw className="w-4 h-4 animate-spin mr-2" />
                    {isInvited ? 'Accepting...' : 'Confirming...'}
                  </>
                ) : (
                  <>
                    <FiUserCheck className="w-4 h-4 mr-2" />
                    {isInvited ? 'Accept Invitation' : 'Confirm Interview'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATED: Reject Modal - Different behavior based on invitation status */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <FiUserX className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-semibold text-gray-900">
                    {/* UPDATED: Different title based on invitation status */}
                    {isInvited ? 'Decline Invitation' : 'Reject Interview'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors rounded-lg p-2 hover:bg-gray-100"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <FiX className="h-5 w-5 text-red-600 mt-0.5" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-red-900">
                        Interview Details
                      </h4>
                      <div className="text-sm text-red-700 mt-2 space-y-1">
                        <div>
                          <strong>Candidate:</strong>{' '}
                          {interviewData?.candidateName}
                        </div>
                        <div>
                          <strong>Date:</strong> {date}
                        </div>
                        <div>
                          <strong>Time:</strong> {time}
                        </div>
                        {/* UPDATED: Show invitation info if applicable */}
                        {isInvited && interviewData.invitedBy && (
                          <div>
                            <strong>Invited by:</strong>{' '}
                            {interviewData.invitedBy}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={
                  isInvited ? handleDeclineInvitation : handleRejectInterview
                }
                disabled={actionLoading}
                className="flex-1 px-4 py-3 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center"
              >
                {actionLoading ? (
                  <>
                    <FiRefreshCw className="w-4 h-4 animate-spin mr-2" />
                    {isInvited ? 'Declining...' : 'Rejecting...'}
                  </>
                ) : (
                  <>
                    <FiUserX className="w-4 h-4 mr-2" />
                    {isInvited ? 'Decline Invitation' : 'Reject Interview'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InterviewDetails;
