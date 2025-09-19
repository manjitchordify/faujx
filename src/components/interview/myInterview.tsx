'use client';

import React, { useEffect, useState } from 'react';
import { getMyInterviewsApi, Interview } from '@/services/engineerInterview';
import { jitsiLiveUrl } from '@/services/jitsiService';
import { useAppSelector } from '@/store/store';
import { showToast } from '@/utils/toast/Toast';
import RescheduleModal from './RescheduleModal';

const MyInterview = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rescheduleModal, setRescheduleModal] = useState<{
    isOpen: boolean;
    interview: Interview | null;
  }>({
    isOpen: false,
    interview: null,
  });

  const { loggedInUser } = useAppSelector(state => state.user);
  const userType = loggedInUser?.userType as string;

  useEffect(() => {
    async function fetchInterviews() {
      try {
        setLoading(true);
        const data = await getMyInterviewsApi();
        setInterviews([...data.scheduled, ...data.completed]);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch interviews');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchInterviews();
  }, []);

  const joinInterview = async (item: Interview) => {
    console.log('join button', item);

    try {
      const response = await jitsiLiveUrl({
        userId: loggedInUser?.id as string,
        sessionId: item?.meetingId as string,
        role: userType,
      });

      if (response?.url) {
        const basePath =
          userType === 'expert' ? '/expert/interview' : '/engineer/interview';

        window.open(
          `${basePath}/${item.id}/meeting?room=${item.meetingId}&customerInterview=true`
        );
      }
    } catch (error: unknown) {
      const message = (error as Error)?.message || 'An error occurred';
      showToast(message, 'error');
    }
  };

  const handleRescheduleClick = (interview: Interview) => {
    setRescheduleModal({
      isOpen: true,
      interview,
    });
  };

  const handleRescheduleClose = () => {
    setRescheduleModal({
      isOpen: false,
      interview: null,
    });
  };

  const handleRescheduleSubmit = async (reason: string) => {
    if (!rescheduleModal.interview) return;

    try {
      // TODO: Replace with your actual API call
      // const response = await rescheduleInterviewApi({
      //   interviewId: rescheduleModal.interview.id,
      //   reason: reason,
      // });

      // Simulating API call
      console.log('Reschedule request:', {
        interviewId: rescheduleModal.interview.id,
        reason: reason,
      });

      showToast('Reschedule request submitted successfully', 'success');
      handleRescheduleClose();

      // Optionally refresh the interviews list
      // await fetchInterviews();
    } catch (error) {
      console.error('Failed to submit reschedule request:', error);
      throw error; // Let the modal handle the error
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString(undefined, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading interviews...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8 pt-12 text-center">
        <h1 className="text-3xl font-bold text-gray-800">My Interviews</h1>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {interviews.length === 0 ? (
          <p className="text-center text-gray-500">No interviews found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviews.map(interview => (
              <div
                key={interview.id}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:border-gray-200 transition-all duration-300 relative overflow-hidden"
              >
                {/* Decorative accent bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1F514C] to-[#306762]"></div>

                {/* Header Section */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    {/* Company Name */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {interview.customer?.companyName || 'Company Name'}
                      </h3>
                    </div>

                    {/* Date with icon */}
                    <div className="flex items-center gap-2 mb-3">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <div>
                        <p className="text-md font-semibold text-gray-800">
                          {formatDate(interview.startTime)}
                        </p>
                      </div>
                    </div>

                    {/* Time with icon */}
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-sm text-gray-600 font-medium">
                        {formatTime(interview.startTime)} -{' '}
                        {formatTime(interview.endTime)}
                      </p>
                    </div>
                  </div>

                  {/* Interview type badge */}
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                        <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                      </svg>
                      Interview
                    </span>
                  </div>
                </div>

                {/* Status Section with improved layout */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
                  {/* Hire Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Hire Status
                    </span>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-800 shadow-sm ring-1 ring-gray-200">
                      {interview.hireStatus.charAt(0).toUpperCase() +
                        interview.hireStatus.slice(1)}
                    </span>
                  </div>

                  {/* Candidate Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Meeting Status
                    </span>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-800 shadow-sm ring-1 ring-gray-200">
                      {interview.status.charAt(0).toUpperCase() +
                        interview.status.slice(1)}
                    </span>
                  </div>
                </div>
                {/* Reschedule Link - Only show when not completed */}
                <div className="mb-3 flex items-center justify-center">
                  {interview.status !== 'completed' ? (
                    <a
                      onClick={() => handleRescheduleClick(interview)}
                      className="inline-flex items-center text-sm text-gray-500 hover:text-[#1F514C] cursor-pointer transition-colors duration-200 group"
                    >
                      <svg
                        className="w-4 h-4 mr-1.5 group-hover:rotate-12 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <span className="group-hover:underline">
                        Reschedule Interview
                      </span>
                    </a>
                  ) : (
                    <span className="inline-flex items-center text-sm text-gray-400 cursor-not-allowed">
                      <svg
                        className="w-4 h-4 mr-1.5 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <span className="line-through">Reschedule Interview</span>
                    </span>
                  )}
                </div>

                {/* Action Button Section */}
                <div className="mt-auto">
                  <button
                    onClick={() => joinInterview(interview)}
                    className="group/btn cursor-pointer relative w-full flex items-center justify-center bg-gradient-to-r from-[#1F514C] to-[#1F514C] hover:from-[#35625d] hover:to-[#1F514C] text-white font-semibold py-3 px-5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#1F514C] focus:ring-offset-2 shadow-lg hover:shadow-xl"
                  >
                    <svg
                      className="w-5 h-5 mr-2 group-hover/btn:animate-pulse"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Join Interview
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Reschedule Modal */}
      {rescheduleModal.interview && (
        <RescheduleModal
          isOpen={rescheduleModal.isOpen}
          onClose={handleRescheduleClose}
          onSubmit={handleRescheduleSubmit}
          interviewId={rescheduleModal.interview.id}
          companyName={
            rescheduleModal.interview.customer?.companyName || 'Company'
          }
          interviewDate={`${formatDate(rescheduleModal.interview.startTime)} at ${formatTime(rescheduleModal.interview.startTime)}`}
        />
      )}
    </div>
  );
};

export default MyInterview;
