import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Check } from 'lucide-react';
import { showToast } from '@/utils/toast/Toast'; // optional toast
// import { submitMentorFeedbackApi } from '@/services/mentorService'; // your API call

interface MentorRatingModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  sessionId?: string; // ID needed for API
}

export const MentorRatingModal: React.FC<MentorRatingModalProps> = ({
  isOpen = true,
  onClose = () => {},
  sessionId,
}) => {
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ratingLabels: { [key: number]: string } = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    if (!feedback.trim()) {
      alert('Please provide your feedback');
      return;
    }

    if (!sessionId) {
      showToast('Session ID is missing', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Replace with your actual API call
      // await submitMentorFeedbackApi(sessionId, { rating, feedback });

      showToast('Feedback submitted successfully!', 'success');

      // Reset modal state
      setRating(0);
      setHoveredRating(0);
      setFeedback('');

      onClose();

      // Navigate to mentor dashboard
      router.push('/engineer/dashboard/browse-mentors');
    } catch (error: unknown) {
      const message = (error as Error)?.message || 'An error occurred';
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setFeedback('');
    onClose();
  };

  if (!isOpen) return null;

  const displayRating = hoveredRating || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl p-8 md:p-10 max-w-lg w-full shadow-2xl animate-in slide-in-from-bottom-4 duration-400">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-all duration-200 group"
        >
          <X className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </button>

        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <Check className="h-10 w-10 text-white stroke-[3]" />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-3">
          Session Completed!
        </h2>

        <p className="text-center text-gray-600 mb-2">
          How was your experience with your mentor?
        </p>
        <p className="text-center text-sm text-gray-500 mb-6">
          All fields are required
        </p>

        <div className="flex justify-center gap-2 md:gap-3 mb-3">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-all duration-200 hover:scale-125 focus:outline-none"
            >
              <svg
                className={`w-10 h-10 md:w-12 md:h-12 transition-colors duration-200 ${
                  star <= displayRating
                    ? 'text-yellow-400 fill-current drop-shadow-md'
                    : 'text-gray-300 fill-current'
                }`}
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          ))}
        </div>

        <div className="h-6 mb-6">
          {displayRating > 0 && (
            <p className="text-center text-sm font-medium text-emerald-600 animate-in fade-in duration-200">
              {ratingLabels[displayRating]}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="feedback"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Share your feedback <span className="text-red-500">*</span>
          </label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="Tell us about your session experience..."
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl resize-none h-24 
                     bg-gray-50 placeholder-gray-400 transition-all duration-200
                     focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 py-3 px-6 rounded-xl font-semibold text-gray-600 bg-gray-100 
                     hover:bg-gray-200 transition-all duration-200 hover:shadow-md active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-3 px-6 rounded-xl font-semibold text-white 
                     bg-gradient-to-r from-emerald-500 to-green-600 
                     hover:from-emerald-600 hover:to-green-700 
                     transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 
                     active:scale-95 shadow-md"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </div>
    </div>
  );
};
