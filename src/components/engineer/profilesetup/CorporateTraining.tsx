'use client';
import {
  getAllVideosApi,
  Video,
  watchVideoApi,
} from '@/services/profileSetupService';
import React, { useState, useEffect } from 'react';

// Define the props interface
interface CorporateTrainingProps {
  onBack: () => void;
  onProceed: () => void;
}

const CorporateTraining: React.FC<CorporateTrainingProps> = ({ onProceed }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [watchingVideo, setWatchingVideo] = useState<string | null>(null);
  const [updatingCompletion, setUpdatingCompletion] = useState<string | null>(
    null
  );

  // NEW FUNCTION: Check if a video should be disabled based on sequential completion
  const isVideoDisabled = (currentVideoIndex: number): boolean => {
    // First video is never disabled
    if (currentVideoIndex === 0) {
      return false;
    }

    // Check if all previous videos are completed
    for (let i = 0; i < currentVideoIndex; i++) {
      const previousVideoId = videos[i]?.id;
      if (!previousVideoId || !completedItems.includes(previousVideoId)) {
        return true; // Disable if any previous video is not completed
      }
    }

    return false; // Enable if all previous videos are completed
  };

  // NEW FUNCTION: Get the reason why a video is disabled
  const getDisabledReason = (currentVideoIndex: number): string => {
    if (currentVideoIndex === 0) return '';

    for (let i = 0; i < currentVideoIndex; i++) {
      const previousVideo = videos[i];
      if (!previousVideo || !completedItems.includes(previousVideo.id)) {
        return `Complete "${previousVideo?.title || `Video ${i + 1}`}" first`;
      }
    }

    return '';
  };

  // Fetch videos from API on component mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllVideosApi();
        setVideos(response.data);

        // Initialize completed items based on API data
        const alreadyCompleted = response.data
          .filter(video => video.completed)
          .map(video => video.id);
        setCompletedItems(alreadyCompleted);
      } catch (err) {
        console.error('Failed to fetch videos:', err);
        setError('Failed to load training videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleWatchVideo = async (videoId: string, videoLink: string) => {
    try {
      setWatchingVideo(videoId);

      // Call the watch video API
      await watchVideoApi({ videoId });

      // Open the video link in a new tab
      window.open(videoLink, '_blank', 'noopener,noreferrer');

      // Optionally mark as completed when watched (you can adjust this logic)
      // setCompletedItems(prev =>
      //   prev.includes(videoId) ? prev : [...prev, videoId]
      // );
    } catch (err) {
      console.error('Failed to track video watch:', err);
      // Still open the video even if tracking fails
      window.open(videoLink, '_blank', 'noopener,noreferrer');
    } finally {
      setWatchingVideo(null);
    }
  };

  const toggleCompletion = async (videoId: string): Promise<void> => {
    const isCurrentlyCompleted = completedItems.includes(videoId);

    // Don't allow unchecking completed items
    if (isCurrentlyCompleted) {
      return;
    }

    try {
      setUpdatingCompletion(videoId);

      // Find the current video index
      const currentVideoIndex = videos.findIndex(video => video.id === videoId);
      const isLastVideo = currentVideoIndex === videos.length - 1;

      // Prepare the payload
      const payload: {
        videoId: string;
        isPreliminaryVideoCompleted?: boolean;
      } = {
        videoId,
      };

      // Add isPreliminaryVideoCompleted only for the last video
      if (isLastVideo) {
        payload.isPreliminaryVideoCompleted = true;
      }

      // Call the watch API to mark as completed
      await watchVideoApi(payload);

      // Only update UI after successful API call
      setCompletedItems(prev => [...prev, videoId]);
    } catch (err) {
      console.error('Failed to track video completion:', err);
      // Don't update UI if API call fails
    } finally {
      setUpdatingCompletion(null);
    }
  };

  // Format duration from link or use default
  const formatDuration = (video: Video): string => {
    if (video.duration) {
      return video.duration;
    }
    // You could extract duration from YouTube links or use a default
    return 'N/A';
  };

  // Check if all training items are completed
  const allCompleted =
    videos.length > 0 &&
    videos.every(video => completedItems.includes(video.id));

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-gray-600">Loading training videos...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (videos.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-600">
            No training videos available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="space-y-4 mb-8">
        {videos.map((video, index) => {
          const isCompleted = completedItems.includes(video.id);
          const isWatching = watchingVideo === video.id;
          const isUpdating = updatingCompletion === video.id;
          const isDisabled = isVideoDisabled(index);
          const disabledReason = getDisabledReason(index);

          return (
            <div
              key={video.id}
              className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 ${
                isUpdating ? 'opacity-75 pointer-events-none' : ''
              }`}
            >
              {/* Loading overlay when updating completion */}
              {isUpdating && (
                <div className="absolute inset-0 bg-white bg-opacity-80 rounded-xl flex items-center justify-center z-20">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
                    <span className="text-indigo-600 font-medium">
                      Updating...
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4 relative">
                {/* Video Number Circle */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isDisabled
                        ? 'bg-gray-400 text-white'
                        : 'bg-indigo-500 text-white'
                  }`}
                >
                  {index + 1}
                </div>

                <div className="flex items-start justify-between flex-1">
                  <div className="flex-1">
                    <h3
                      className={`text-xl font-medium mb-3 ${
                        isDisabled ? 'text-gray-400' : 'text-gray-900'
                      }`}
                    >
                      {video.title}
                    </h3>
                    <p
                      className={`mb-4 leading-relaxed ${
                        isDisabled ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {video.description}
                    </p>
                    {isDisabled && disabledReason && (
                      <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z" />
                          </svg>
                          <p className="text-sm text-gray-600 font-medium">
                            {disabledReason}
                          </p>
                        </div>
                      </div>
                    )}
                    <div
                      className={`flex items-center gap-4 ${
                        isDisabled ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12,6 12,12 16,14"></polyline>
                        </svg>
                        <span className="text-sm">{formatDuration(video)}</span>
                      </div>
                      {video.link && (
                        <button
                          onClick={() =>
                            !isDisabled &&
                            handleWatchVideo(video.id, video.link)
                          }
                          disabled={isWatching || isDisabled}
                          className={`text-sm flex items-center gap-1.5 transition-all duration-200 ${
                            isDisabled
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-indigo-500 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed'
                          }`}
                        >
                          {isWatching ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
                              Loading...
                            </>
                          ) : isDisabled ? (
                            <>
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
                                  d="M12 15v2m0 0v2m0-2h2m-2 0H10M8 9h8V7a4 4 0 00-8 0v2z"
                                />
                              </svg>
                              Video Locked
                            </>
                          ) : (
                            <div className="cursor-pointer flex">
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
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                              Watch Video
                            </div>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="ml-6 flex-shrink-0">
                    <button
                      onClick={() =>
                        !isDisabled && !isUpdating && toggleCompletion(video.id)
                      }
                      disabled={isCompleted || isDisabled || isUpdating}
                      className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 relative ${
                        isCompleted
                          ? 'bg-green-500 text-white cursor-not-allowed scale-105 shadow-md'
                          : isDisabled || isUpdating
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer hover:scale-105 hover:shadow-lg'
                      }`}
                    >
                      {isUpdating ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      ) : isCompleted ? (
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                      ) : isDisabled ? (
                        <svg
                          className="w-7 h-7"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 37 25"
                          fill="none"
                        >
                          <path
                            d="M1.625 19.5312V5.46875C1.625 4.47419 2.02009 3.52036 2.72335 2.8171C3.42661 2.11384 4.38044 1.71875 5.375 1.71875H21.3125C22.3071 1.71875 23.2609 2.11384 23.9641 2.8171C24.6674 3.52036 25.0625 4.47419 25.0625 5.46875V19.5312C25.0625 20.5258 24.6674 21.4796 23.9641 22.1829C23.2609 22.8862 22.3071 23.2812 21.3125 23.2812H5.375C4.38044 23.2812 3.42661 22.8862 2.72335 22.1829C2.02009 21.4796 1.625 20.5258 1.625 19.5312ZM33.815 3.10813L26.315 9.78875C26.2162 9.87653 26.137 9.98422 26.0827 10.1047C26.0284 10.2253 26.0002 10.3559 26 10.4881V13.8219C26.0002 13.9541 26.0284 14.0847 26.0827 14.2053C26.137 14.3258 26.2162 14.4335 26.315 14.5213L33.815 21.2019C33.9501 21.3219 34.1171 21.4002 34.2957 21.4276C34.4743 21.4549 34.657 21.43 34.8219 21.356C34.9867 21.2819 35.1266 21.1617 35.2247 21.01C35.3229 20.8582 35.375 20.6813 35.375 20.5006V3.80937C35.375 3.62866 35.3229 3.45178 35.2247 3.30004C35.1266 3.14829 34.9867 3.02814 34.8219 2.95404C34.657 2.87995 34.4743 2.85508 34.2957 2.88241C34.1171 2.90975 33.9501 2.98813 33.815 3.10813Z"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <button
          onClick={onProceed}
          className={`font-medium px-8 py-3 rounded-full transition-all duration-200 shadow-lg ${
            allCompleted
              ? 'bg-[#54A044] hover:bg-[#54A044]/75 text-white hover:shadow-xl cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-sm'
          }`}
        >
          Proceed{' '}
          {videos.length > 0 && `(${completedItems.length}/${videos.length})`}
        </button>
      </div>
    </div>
  );
};

export default CorporateTraining;
