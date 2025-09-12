'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { Video, Bell, ArrowLeft } from 'lucide-react';
import SessionCard, { Session } from '../shared/SessionCard';
import { useInterviews } from '@/services/expert/useInterviews';
import { useAppSelector } from '@/store/store';
import { jitsiLiveUrl } from '@/services/jitsiService';

const ExpertDashboard: React.FC = () => {
  const [showMySessions, setShowMySessions] = useState(false);
  const {
    pendingSessions,
    confirmedSessions,
    confirmedCount,
    loading,
    error,
    refetch,
  } = useInterviews();
  const { loggedInUser } = useAppSelector(state => state.user);
  // Current view sessions - memoized to prevent recalculation
  const currentSessions = useMemo(() => {
    return showMySessions ? confirmedSessions : pendingSessions;
  }, [showMySessions, confirmedSessions, pendingSessions]);

  // Memoized handlers to prevent child re-renders
  const handleAccept = useCallback((session: Session): void => {
    console.log('Accepted session:', session);
  }, []);

  const handleDecline = useCallback((session: Session): void => {
    console.log('Declined session:', session);
  }, []);

  const handleJoin = useCallback(
    async (session: Session): Promise<void> => {
      try {
        if (session.meetingLink !== undefined) {
          const sessionId = extractSessionId(session.meetingLink);

          const response = await jitsiLiveUrl({
            userId: loggedInUser?.id as string,
            sessionId: sessionId,
            role: 'expert',
          });

          if (response?.url) {
            window.open(
              `/expert/interview/${session.id}/meeting?room=${sessionId}`
            );
          }
        }
      } catch (error: unknown) {
        const message = (error as Error)?.message || 'An error occurred';
        console.error('Error generating Jitsi URL:', message);
        alert(`Error: ${message}`);
      }
    },
    [loggedInUser]
  );

  // Helper function to extract sessionId from meetingLink
  const extractSessionId = (meetingLink: string): string => {
    return meetingLink.substring(meetingLink.lastIndexOf('/') + 1);
  };

  const handleBackToDashboard = useCallback(() => {
    setShowMySessions(false);
  }, []);

  const handleShowMySessions = useCallback(() => {
    setShowMySessions(true);
  }, []);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  // Memoized header to prevent unnecessary re-renders
  const Header = useMemo(
    () => (
      <div className="bg-white shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showMySessions && (
              <button
                type="button"
                onClick={handleBackToDashboard}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={handleShowMySessions}
              className="px-4 py-2 rounded-lg transition-colors border-2 border-green-500 bg-white text-gray-700 hover:bg-gray-200 flex items-center relative"
            >
              {confirmedCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-sm text-white bg-green-600 rounded-full border-2 border-white">
                  {confirmedCount}
                </span>
              )}
              My Sessions
            </button>
          </div>
        </div>
      </div>
    ),
    [
      showMySessions,
      confirmedCount,
      handleBackToDashboard,
      handleShowMySessions,
    ]
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {Header}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Loading interviews...
            </h3>
            <p className="text-gray-500">
              Please wait while we fetch your interview data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {Header}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-12 h-12 text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error loading interviews
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const viewTitle = showMySessions
    ? 'My Interview Sessions'
    : 'Pending Interview Requests';
  const viewDescription = showMySessions
    ? 'Your confirmed interview sessions'
    : 'Review and respond to interview requests';
  const buttonType: 'pending' | 'accepted' = showMySessions
    ? 'accepted'
    : 'pending';

  return (
    <div className="min-h-screen bg-gray-50">
      {Header}

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{viewTitle}</h2>
          <p className="text-gray-600 mt-1">{viewDescription}</p>
        </div>

        {currentSessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {showMySessions
                ? 'No sessions scheduled'
                : 'No pending interviews'}
            </h3>
            <p className="text-gray-500">
              {showMySessions
                ? 'No confirmed interview sessions at the moment.'
                : 'No interview requests at the moment.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {currentSessions.map(session => (
              <SessionCard
                key={session.id}
                session={session}
                buttonType={buttonType}
                onAccept={handleAccept}
                onDecline={handleDecline}
                onJoin={handleJoin}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertDashboard;
