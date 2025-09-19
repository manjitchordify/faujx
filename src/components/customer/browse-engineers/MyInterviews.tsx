import CustomTabs from '@/components/ui/CustomTabs';
import { setIsFavouriteInfoSeen } from '@/store/slices/customerSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { CustomerTabs } from '@/types/customer';
import React, { FC, useState, useEffect } from 'react';
import Image from 'next/image';
import InterviewFeedbackCard from './cards/InterviewFeedbackCard';
import ShortListModal from './modals/ShortListModal';
import Cookies from 'js-cookie';
import { showToast } from '@/utils/toast/Toast';

import {
  getMyInterviews,
  InterviewDetails,
  MyInterviewsResponse,
} from '@/services/customer/myinterviewservice';
import { jitsiLiveUrl } from '@/services/jitsiService';

interface MyInterviewsProps {
  setSelectedTab: React.Dispatch<React.SetStateAction<CustomerTabs>>;
  selectedTab: CustomerTabs;
}

type interviewTabs = 'Scheduled' | 'Completed';

const MyInterviews: FC<MyInterviewsProps> = ({}) => {
  const interViewTabs: interviewTabs[] = ['Scheduled', 'Completed'];
  const { loggedInUser } = useAppSelector(state => state.user);
  const [showShortListModal, setShowShortListModal] = useState(true);
  const [selectedInterviewTab, setSelectedInterviewTab] =
    useState<interviewTabs>('Scheduled');

  // API state management
  const [scheduledInterviews, setScheduledInterviews] = useState<
    InterviewDetails[]
  >([]);
  const [completedInterviews, setCompletedInterviews] = useState<
    InterviewDetails[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state for interview details
  const [selectedInterview, setSelectedInterview] =
    useState<InterviewDetails | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const { isFavouriteInfoSeen } = useAppSelector(store => store.customer);
  const dispatch = useAppDispatch();

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const response: MyInterviewsResponse = await getMyInterviews();

      setScheduledInterviews(response.scheduled || []);
      setCompletedInterviews(response.completed || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        console.error('Error fetching interviews:', err.message);
      } else {
        setError('Failed to fetch interviews');
        console.error('Error fetching interviews:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleTabChange = (tabText: string) => {
    console.log('TAB TEXT : ', tabText);
    setSelectedInterviewTab(tabText as interviewTabs);
  };

  const handleJoinInterview = async (interview: InterviewDetails) => {
    try {
      const response = await jitsiLiveUrl({
        userId: loggedInUser?.id as string,
        sessionId: interview.meetingId as string,
        role: 'INTERVIEW_PANEL',
      });
      if (response?.url) {
        Cookies.set('jwt_token', response?.jwt);
        // Cookies.set('roleTitle', roleTitle);
        window.open(
          `/customer/interviews/${interview.id}/meeting?room=${interview.meetingId}`
        );
      }
    } catch (error: unknown) {
      const message = (error as Error)?.message || 'An error occurred';
      showToast(message, 'error');
    }
  };

  // Handle view interview details
  const handleViewDetails = (interview: InterviewDetails) => {
    setSelectedInterview(interview);
    setShowDetailsModal(true);
  };

  // Close details modal
  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedInterview(null);
  };

  // Check if interview is happening now or soon (within 30 minutes)
  const isInterviewSoon = (startTime: string) => {
    const now = new Date();
    const interviewTime = new Date(startTime);
    const timeDiff = interviewTime.getTime() - now.getTime();
    return timeDiff <= 30 * 60 * 1000 && timeDiff >= -60 * 60 * 1000;
  };

  // Get current interviews based on selected tab
  const getCurrentInterviews = () => {
    return selectedInterviewTab === 'Scheduled'
      ? scheduledInterviews
      : completedInterviews;
  };

  const currentInterviews = getCurrentInterviews();

  // Loading state
  if (loading) {
    return (
      <div className="w-full flex flex-col gap-6">
        <CustomTabs textArr={interViewTabs} onChange={handleTabChange} />
        <div className="w-full flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading interviews...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full flex flex-col gap-6">
        <CustomTabs textArr={interViewTabs} onChange={handleTabChange} />
        <div className="w-full flex items-center justify-center py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
            <button
              onClick={() => fetchInterviews()}
              className="ml-4 text-red-800 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 relative">
      <CustomTabs textArr={interViewTabs} onChange={handleTabChange} />

      {/* Grid Layout - 3 Cards Per Row */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentInterviews.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500 text-lg mb-2">
              No {selectedInterviewTab.toLowerCase()} interviews found
            </div>
            <p className="text-gray-400">
              {selectedInterviewTab === 'Scheduled'
                ? "You haven't scheduled any interviews yet."
                : "You haven't completed any interviews yet."}
            </p>
          </div>
        ) : (
          currentInterviews.map(interview => {
            const startDateTime = new Date(interview.startTime);
            const endDateTime = new Date(interview.endTime);
            const isSoon = isInterviewSoon(interview.startTime);

            // For scheduled interviews, show clean cards with View Details button
            if (selectedInterviewTab === 'Scheduled') {
              return (
                <div
                  key={interview.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col h-full"
                >
                  {/* Large Header Image with Status Overlay */}
                  <div className="relative w-full h-40 rounded-lg overflow-hidden mb-3 flex-shrink-0">
                    {interview.candidate.profilePic ? (
                      <Image
                        src={interview.candidate.profilePic}
                        alt={interview.candidate.firstName}
                        width={400}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Status Badge Overlay */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-1.5 text-xs font-semibold rounded-full shadow-md ${
                          isSoon
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'text-white'
                        }`}
                        style={!isSoon ? { backgroundColor: 'green' } : {}}
                      >
                        {isSoon ? 'Starting Soon' : 'Scheduled'}
                      </span>
                    </div>
                  </div>

                  {/* Interview Status Banner */}
                  <div className="mb-4">
                    <div
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isSoon ? 'bg-red-50 border border-red-200' : 'border'
                      }`}
                      style={
                        !isSoon
                          ? {
                              backgroundColor: '#f0f9f4',
                              borderColor: '#1F514C',
                            }
                          : {}
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isSoon ? 'bg-red-500' : ''
                          }`}
                          style={!isSoon ? { backgroundColor: '#1F514C' } : {}}
                        ></div>
                        <span
                          className={`font-semibold text-sm ${
                            isSoon ? 'text-red-700' : ''
                          }`}
                          style={!isSoon ? { color: '#1F514C' } : {}}
                        >
                          {isSoon
                            ? 'Interview Starting Soon!'
                            : 'Interview Scheduled'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {new Date(interview.startTime).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Content Container - Flex grow to push buttons to bottom */}
                  <div className="flex flex-col flex-grow">
                    {/* Title Section */}
                    <div className="mb-4">
                      <div className="text-gray-900">
                        <div className="font-semibold text-lg leading-tight">
                          {interview.candidate.firstName}{' '}
                          {interview.candidate.lastName}
                        </div>
                        <div className="text-gray-600 text-sm mt-1">
                          {interview.candidate.email}
                        </div>
                      </div>
                    </div>

                    {/* Skills Section */}
                    <div className="mb-4">
                      <h3 className="text-gray-900 font-medium mb-2 text-sm">
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded-md font-medium">
                          React.js
                        </span>
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium">
                          Node.js
                        </span>
                        <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-xs rounded-md font-medium">
                          AWS
                        </span>
                      </div>
                    </div>

                    {/* Spacer to push buttons to bottom */}
                    <div className="flex-grow"></div>

                    {/* Action Buttons - Single Row */}
                    <div className="flex gap-2 mt-auto">
                      {/* Join Interview Button */}
                      {interview.meetingLink ? (
                        <button
                          className={`flex-1 font-medium py-2.5 px-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center space-x-1 text-sm text-white ${
                            isSoon
                              ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500 animate-pulse'
                              : 'hover:opacity-90 focus:ring-green-500'
                          }`}
                          style={!isSoon ? { backgroundColor: 'green' } : {}}
                          onClick={() => handleJoinInterview(interview)}
                        >
                          <svg
                            className="w-4 h-4 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                          </svg>
                          <span className="truncate">
                            {isSoon ? 'JOIN NOW' : 'Join'}
                          </span>
                        </button>
                      ) : (
                        <div className="flex-1 bg-gray-100 text-gray-500 font-medium py-2.5 px-3 rounded-lg text-center border border-dashed border-gray-300 text-xs">
                          Link Not Available
                        </div>
                      )}

                      {/* View Details Button with Hover Tooltip */}
                      <div className="flex-1 relative group">
                        <button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center space-x-1 text-sm"
                          onClick={() => handleViewDetails(interview)}
                        >
                          <svg
                            className="w-4 h-4 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="truncate">Details</span>
                        </button>

                        {/* Hover Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                          <div className="bg-white border border-gray-200 text-gray-900 text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
                            <div className="space-y-1">
                              <div className="font-medium text-gray-900">
                                {interview.candidate.firstName}{' '}
                                {interview.candidate.lastName}
                              </div>
                              <div className="text-gray-600">
                                {interview.candidate.email}
                              </div>
                              <div className="text-gray-600">
                                {interview.candidate.phone}
                              </div>
                              <div className="border-t border-gray-200 pt-1 mt-1">
                                <div className="text-gray-700">
                                  📅{' '}
                                  {new Date(
                                    interview.startTime
                                  ).toLocaleDateString()}
                                </div>
                                <div className="text-gray-700">
                                  🕐{' '}
                                  {new Date(
                                    interview.startTime
                                  ).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}{' '}
                                  -{' '}
                                  {new Date(
                                    interview.endTime
                                  ).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </div>
                                <div className="text-gray-700">
                                  ⏱️{' '}
                                  {Math.round(
                                    (new Date(interview.endTime).getTime() -
                                      new Date(interview.startTime).getTime()) /
                                      (1000 * 60)
                                  )}{' '}
                                  mins
                                </div>
                              </div>
                            </div>
                            {/* Tooltip Arrow */}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            } else {
              // For completed interviews, use your existing InterviewFeedbackCard
              const completedCandidate = {
                id: interview.id,
                role: 'Interview Completed',
                profileImage:
                  interview.candidate.profilePic || '/images/blurPic.png',
                date: startDateTime.toDateString(),
                duration: `${startDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
              };

              return (
                <InterviewFeedbackCard
                  key={interview.id}
                  candidate={completedCandidate}
                />
              );
            }
          })
        )}
      </div>

      {/* Floating Interview Details Card */}
      {showDetailsModal && selectedInterview && (
        <>
          {/* Transparent overlay to close modal */}
          <div className="fixed inset-0 z-40" onClick={closeDetailsModal} />

          {/* Floating Details Card - Schedule Info Only */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl border border-gray-200 max-w-sm w-full mx-4 z-50 animate-in fade-in zoom-in duration-200">
            {/* Card Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Schedule Details
              </h2>
              <button
                onClick={closeDetailsModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Card Content */}
            <div className="p-4">
              {/* Candidate Info Header */}
              <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                  {selectedInterview.candidate.profilePic ? (
                    <Image
                      src={selectedInterview.candidate.profilePic}
                      alt={selectedInterview.candidate.firstName}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      className="w-6 h-6 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {selectedInterview.candidate.firstName}{' '}
                    {selectedInterview.candidate.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    Interview Schedule
                  </p>
                </div>
              </div>

              {/* Schedule Information */}
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
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
                    </div>
                    <span className="text-gray-600 font-medium">Date</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {new Date(selectedInterview.startTime).toLocaleDateString(
                      'en-US',
                      {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      }
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: '#1F514C' }}
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-600 font-medium">
                      Start Time
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {new Date(selectedInterview.startTime).toLocaleTimeString(
                      [],
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      }
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-orange-600"
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
                    </div>
                    <span className="text-gray-600 font-medium">End Time</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {new Date(selectedInterview.endTime).toLocaleTimeString(
                      [],
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      }
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-600 font-medium">Duration</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {Math.round(
                      (new Date(selectedInterview.endTime).getTime() -
                        new Date(selectedInterview.startTime).getTime()) /
                        (1000 * 60)
                    )}{' '}
                    minutes
                  </span>
                </div>
              </div>

              {/* Join Button */}
              {selectedInterview.meetingLink && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      handleJoinInterview(selectedInterview);
                      closeDetailsModal();
                    }}
                    className={`w-full font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 text-white ${
                      isInterviewSoon(selectedInterview.startTime)
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'hover:opacity-90'
                    }`}
                    style={
                      !isInterviewSoon(selectedInterview.startTime)
                        ? { backgroundColor: '#1F514C' }
                        : {}
                    }
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                    <span>Join Interview</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {!isFavouriteInfoSeen && showShortListModal && (
        <ShortListModal
          onClose={() => {
            setShowShortListModal(false);
            dispatch(setIsFavouriteInfoSeen(true));
          }}
        />
      )}
    </div>
  );
};

export default MyInterviews;
