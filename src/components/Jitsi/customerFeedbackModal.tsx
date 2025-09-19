'use client';

import { useState } from 'react';
import {
  X,
  Star,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { submitCustomerInterviewFeedback } from '@/services/customer/feedBackService';

interface CustomerFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  interviewId: string;
}

// Define the API error type to avoid 'any'
interface ApiError {
  status?: number;
  message?: string;
  data?: unknown;
}

// Type guard to check if error is an ApiError
function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('status' in error || 'message' in error)
  );
}

export function CustomerFeedbackModal({
  isOpen,
  onClose,
  onSuccess,
  interviewId,
}: CustomerFeedbackModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveringRating, setHoveringRating] = useState<number>(0);
  const [hireStatus, setHireStatus] = useState<string>('');
  const [comments, setComments] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0 || !hireStatus || !comments.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (comments.trim().length < 10) {
      setError('Please provide more detailed comments (minimum 10 characters)');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Use the provided API service
      await submitCustomerInterviewFeedback(interviewId, {
        rating,
        hireStatus,
        comments: comments.trim(),
      });

      // Show success state
      setShowSuccess(true);

      // Auto close after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        resetForm();
        onSuccess();
      }, 2000);
    } catch (error: unknown) {
      console.error('Error submitting feedback:', error);

      // Handle specific error cases based on the API response
      if (isApiError(error) && error.status) {
        switch (error.status) {
          case 401:
            setError('Session expired. Please log in again.');
            break;
          case 404:
            setError('Interview not found. Please try again.');
            break;
          case 400:
            setError('Invalid feedback data. Please check your inputs.');
            break;
          case 500:
            setError('Server error. Please try again later.');
            break;
          default:
            setError(
              error.message || 'Failed to submit feedback. Please try again.'
            );
        }
      } else if (error instanceof Error) {
        setError(
          error.message || 'Failed to submit feedback. Please try again.'
        );
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !showSuccess) {
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setRating(0);
    setHoveringRating(0);
    setHireStatus('');
    setComments('');
    setError('');
    setShowSuccess(false);
  };

  if (!isOpen) return null;

  // Success view
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center">
          <div className="mb-4">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Feedback Submitted!
          </h2>
          <p className="text-gray-600">
            Thank you for your feedback. Your evaluation has been submitted
            successfully.
          </p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Redirecting...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Interview Feedback
            </h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <X size={24} />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Overall Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                  <button
                    key={value}
                    type="button"
                    onMouseEnter={() => setHoveringRating(value)}
                    onMouseLeave={() => setHoveringRating(0)}
                    onClick={() => setRating(value)}
                    className={`p-1 transition-colors ${
                      hoveringRating >= value || rating >= value
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  >
                    <Star
                      size={24}
                      fill={
                        hoveringRating >= value || rating >= value
                          ? 'currentColor'
                          : 'none'
                      }
                    />
                  </button>
                ))}
                <span className="ml-3 text-sm text-gray-600">
                  {rating > 0 ? `${rating}/10` : 'Select rating'}
                </span>
              </div>
            </div>

            {/* Hire Status Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Would you like to hire this candidate?{' '}
                <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setHireStatus('yes')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    hireStatus === 'yes'
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ThumbsUp size={16} />
                  <span>Yes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHireStatus('no')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    hireStatus === 'no'
                      ? 'bg-red-50 border-red-500 text-red-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ThumbsDown size={16} />
                  <span>No</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHireStatus('maybe')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    hireStatus === 'maybe'
                      ? 'bg-yellow-50 border-yellow-500 text-yellow-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>Maybe</span>
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Comments <span className="text-red-500">*</span>
              </label>
              <textarea
                value={comments}
                onChange={e => setComments(e.target.value)}
                placeholder="Please provide detailed feedback about the candidate's performance, skills, communication, and overall interview experience..."
                rows={5}
                maxLength={1000}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
                disabled={isSubmitting}
              />
              <div className="mt-1 flex justify-between text-xs">
                <span className="text-gray-500">
                  Minimum 10 characters required
                </span>
                <span
                  className={`${comments.length > 900 ? 'text-red-500' : 'text-gray-500'}`}
                >
                  {comments.length}/1000
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  rating === 0 ||
                  !hireStatus ||
                  comments.trim().length < 10
                }
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
