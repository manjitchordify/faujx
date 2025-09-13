'use client';
import { getAllInterviewsCandidate } from '@/services/interviewService';
import { InterviewDetails } from '@/types/interview';
import { formatInterviewDate } from '@/utils/helper/Helper';
import { showToast } from '@/utils/toast/Toast';
import { Calendar, Clock, Video } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import Loader from '../ui/Loader';
import { jitsiLiveUrl } from '@/services/jitsiService';
import { useAppSelector } from '@/store/store';

const Interview = () => {
  const [userInterviews, setUserInterviews] = useState<
    InterviewDetails[] | null
  >(null);
  const { loggedInUser } = useAppSelector(state => state.user);
  const userType = loggedInUser?.userType as string;
  const [loader, setLoader] = useState<boolean>(false);

  function formatTimeWithDuration(
    date: Date,
    timeZone: string,
    durationMinutes: number
  ): string {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone,
    };

    const time = new Intl.DateTimeFormat('en-US', options).format(date);

    return `${time} (${timeZone}) • ${durationMinutes} min`;
  }

  // Check if interview is confirmed and join button should be enabled
  const isJoinButtonEnabled = (interview: InterviewDetails): boolean => {
    return interview.status === 'confirmed';
  };

  // Get button text based on status
  const getButtonText = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return 'Join Interview';
      case 'completed':
        return 'Completed';
      case 'rejected':
        return 'Rejected';
      case 'pending_confirmation':
        return 'Awaiting Confirmation';
      default:
        return 'Awaiting Confirmation';
    }
  };

  // Get button styles based on status
  const getButtonStyles = (status: string): string => {
    const baseStyles =
      'w-full text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    switch (status) {
      case 'confirmed':
        return `${baseStyles} bg-blue-500 hover:bg-blue-600 focus:ring-blue-500 cursor-pointer`;
      case 'completed':
        return `${baseStyles} bg-gray-500 cursor-not-allowed`;
      case 'rejected':
        return `${baseStyles} bg-red-500 cursor-not-allowed`;
      case 'pending_confirmation':
        return `${baseStyles} bg-gray-400 cursor-not-allowed`;
      default:
        return `${baseStyles} bg-gray-400 cursor-not-allowed`;
    }
  };

  const joinInterview = async (item: InterviewDetails) => {
    // Add status check before joining
    if (!isJoinButtonEnabled(item)) {
      showToast(
        'Interview must be confirmed by panelists before you can join',
        'warning'
      );
      return;
    }

    try {
      const response = await jitsiLiveUrl({
        userId: loggedInUser?.id as string,
        sessionId: item?.meetingId as string,
        role: userType,
      });
      if (response?.url) {
        const basePath =
          userType === 'expert' ? '/expert/interview' : '/engineer/interview';

        window.open(`${basePath}/${item.id}/meeting?room=${item.meetingId}`);
      }
    } catch (error: unknown) {
      const message = (error as Error)?.message || 'An error occurred';
      showToast(message, 'error');
    }
  };

  const getUserInterview = useCallback(async () => {
    try {
      setLoader(true);
      const res = await getAllInterviewsCandidate(userType);
      setUserInterviews(res);
      console.log('INTERVIEW OF USER : ', res);
    } catch (error) {
      console.log(error);
      showToast('Try Again', 'error');
    } finally {
      setLoader(false);
    }
  }, [userType]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
            Confirmed
          </span>
        );
      case 'pending_confirmation':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 w-fit">
            Awaiting Confirmation
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 w-fit">
            Rejected
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 w-fit">
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 w-fit">
            {status}
          </span>
        );
    }
  };

  useEffect(() => {
    getUserInterview();
  }, [getUserInterview]);

  return (
    <div className="w-full min-h-[calc(100vh-100px)] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {loader ? (
        <Loader text="Getting Interviews...." />
      ) : (
        <>
          {/* Success Message */}
          {userInterviews && userInterviews.length > 0 && (
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Interview Scheduled
                </h1>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {userInterviews[0].status === 'confirmed'
                  ? 'Great news! Your interview is confirmed and ready to join. Details are below.'
                  : userInterviews[0].status === 'completed'
                    ? 'Your interview has been completed. Thank you for participating!'
                    : "Your interview is scheduled. We're waiting for panelist confirmation. You'll be notified once confirmed."}
                You&apos;ll also receive an email with the interview details
                shortly.
              </p>
            </div>
          )}

          {userInterviews && userInterviews.length > 0 ? (
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {userInterviews.map((item, index) => (
                <div key={index} className="w-full">
                  {/* Interview Details Card */}
                  <div
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 h-full flex flex-col transform transition-transform duration-300 
                   hover:scale-105"
                  >
                    <div className="flex justify-between items-start mb-4 sm:mb-6">
                      <h2 className="text-base sm:text-lg font-medium text-gray-900">
                        Frontend Engineer &apos; FaujX
                      </h2>
                      {/* Show status badge for each interview */}
                      {getStatusBadge(item.status)}
                    </div>

                    <div className="space-y-3 sm:space-y-4 flex-1">
                      {/* Date */}
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-500">
                            Date
                          </p>
                          <p className="text-sm sm:text-base text-gray-900 break-words">
                            {formatInterviewDate(
                              new Date(item.scheduledSlot.startTime)
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-500">
                            Time
                          </p>
                          <p className="text-sm sm:text-base text-gray-900 break-words">
                            {formatTimeWithDuration(
                              new Date(item.scheduledSlot.startTime),
                              'Asia/Kolkata',
                              item.durationMinutes
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Meeting Link */}
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <Video className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-500">
                            Meeting Link
                          </p>
                          {isJoinButtonEnabled(item) ? (
                            <p
                              onClick={() => joinInterview(item)}
                              className="text-sm sm:text-base text-blue-600 hover:text-blue-700 underline cursor-pointer break-words"
                            >
                              Join link
                            </p>
                          ) : item.status === 'completed' ? (
                            <p className="text-sm sm:text-base text-gray-500 break-words">
                              Interview completed
                            </p>
                          ) : (
                            <p className="text-sm sm:text-base text-gray-500 break-words">
                              Available after confirmation
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                      <button
                        onClick={() =>
                          item.status === 'confirmed'
                            ? joinInterview(item)
                            : undefined
                        }
                        disabled={item.status !== 'confirmed'}
                        className={getButtonStyles(item.status)}
                      >
                        {getButtonText(item.status)}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex justify-center items-center p-4">
              <p className="text-gray-600 text-center text-sm sm:text-base">
                No Interviews Available
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Interview;
