'use client';

import { useState } from 'react';
import { CAPABILITIES, type Role } from '@/constants/capability';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: {
    comment: Record<string, number>;
    rating: number;
    evaluationStatus: string;
    comments: string;
  }) => void;
  roleTitle: Role;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  roleTitle,
}) => {
  const capabilities = CAPABILITIES[roleTitle] || [];

  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const [comments, setComments] = useState('');

  // const handleCloseFeedbackModal = () => {
  //   setRatings({});
  //   setComments('');
  //   onClose();
  // };

  const handleSubmitFeedback = async () => {
    setFeedbackLoading(true);
    try {
      // Separate overall rating from capability ratings
      const { overall, ...capabilityRatings } = ratings;

      onSubmit({
        comment: capabilityRatings,
        rating: overall,
        evaluationStatus: status == true ? 'passed' : 'failed',
        comments: comments.trim(),
      });
      setRatings({});
      setComments('');
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setFeedbackLoading(false);
    }
  };

  // Check if all capabilities have been rated
  const allCapabilitiesRated = capabilities.every(cap => ratings[cap] > 0);
  const hasOverallRating = ratings['overall'] > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {roleTitle} – Interview Feedback
          </h3>
          {/* <button
            onClick={handleCloseFeedbackModal}
            className="text-gray-400 hover:text-gray-600 p-1"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button> */}
        </div>

        {/* Modal Body */}
        <div className="px-6 py-4 space-y-6 max-h-[65vh] overflow-y-auto">
          {!CAPABILITIES[roleTitle][0] ? (
            <div className="text-center py-8 text-gray-500">
              No capabilities found for this role.
            </div>
          ) : (
            <>
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Rate each capability on a scale of 1-10 stars based on the
                  engineer&apos;s performance during the interview.
                </p>
              </div>

              {/* Capabilities Ratings */}
              {capabilities.map(cap => (
                <div key={cap} className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700">
                    {cap}
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {[...Array(10)].map((_, i) => {
                      const star = i + 1;
                      const isSelected = (ratings[cap] || 0) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setRatings(prev => ({ ...prev, [cap]: star }))
                          }
                          className={`w-8 h-8 flex items-center justify-center rounded-full border text-xs font-medium transition-colors ${
                            isSelected
                              ? 'bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600'
                              : 'bg-white text-gray-400 border-gray-300 hover:bg-gray-50 hover:text-gray-600'
                          }`}
                          title={`Rate ${star} out of 10`}
                        >
                          ★
                        </button>
                      );
                    })}
                    {ratings[cap] && (
                      <span className="ml-2 text-sm text-gray-600 self-center">
                        {ratings[cap]}/10
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Overall Rating */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700">
              Overall Rating
            </label>
            <div className="flex flex-wrap gap-1">
              {[...Array(10)].map((_, i) => {
                const star = i + 1;
                const isSelected = (ratings.overall || 0) >= star;

                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setRatings(prev => ({ ...prev, overall: star }))
                    }
                    className={`w-8 h-8 flex items-center justify-center rounded-full border text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600'
                        : 'bg-white text-gray-400 border-gray-300 hover:bg-gray-50 hover:text-gray-600'
                    }`}
                    title={`Rate ${star} out of 10`}
                  >
                    ★
                  </button>
                );
              })}
              {ratings.overall && (
                <span className="ml-2 text-sm text-gray-600 self-center">
                  {ratings.overall}/10
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 pt-4">
              <span className="text-lg  font-bold  text-gray-700">
                Overall Result
              </span>

              <button
                type="button"
                onClick={() => setStatus(prev => !prev)}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                  status ? 'bg-green-500' : 'bg-red-400'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    status ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>

              <span className="text-sm text-gray-700">
                {status ? 'Pass' : 'Fail'}
              </span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-3">
            <label
              htmlFor="comments"
              className="block text-sm font-bold text-gray-700"
            >
              Comments
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Optional: Provide any additional feedback or observations about
              the candidate&apos;s performance
            </p>
            <textarea
              id="comments"
              rows={4}
              value={comments}
              onChange={e => setComments(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical"
              placeholder="Enter any additional comments, observations, or specific feedback about the candidate's performance, communication skills, problem-solving approach, etc..."
              maxLength={1000}
            />
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Optional field</span>
              <span>{comments.length}/1000 characters</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          {/* <button
            onClick={handleCloseFeedbackModal}
            disabled={feedbackLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button> */}
          <button
            onClick={handleSubmitFeedback}
            disabled={
              feedbackLoading || !hasOverallRating || !allCapabilitiesRated
            }
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {feedbackLoading && (
              <svg
                className="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
            )}
            {feedbackLoading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </div>
    </div>
  );
};
