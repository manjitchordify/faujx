'use client';
import { submitInterviewCandidateFeedback } from '@/services/interviewService';
import { showToast } from '@/utils/toast/Toast';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';

const SessionCompleted = () => {
  const [feedback, setFeedback] = useState('');
  const router = useRouter();
  const interviewId = useParams<{ interviewId: string }>().interviewId;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle feedback submission logic here
    console.log('Feedback submitted:', feedback);

    try {
      const res = await submitInterviewCandidateFeedback({
        feedback: feedback,
        interviewId: interviewId,
      });
      console.log('FEEDBACK : ', res);
      router.push('/engineer/interview/interview-completed');
    } catch (error) {
      console.log(error);
      showToast('Try Again');
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <div className="w-full md:w-3/4 lg:w-1/2 mx-auto">
        {/* Session Completed Card */}
        <div className="bg-white rounded-4xl shadow-[0px_7px_120px_14px_#00000040] py-8 px-8 lg:px-12">
          {/* Success Icon and Title */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-3">
              Session Completed
            </h1>
            <p className="text-gray-600 text-base leading-relaxed">
              Please take a moment to rate your experience and provide feedback.
            </p>
          </div>

          {/* Feedback Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Feedback Textarea */}
            <div>
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="Please take a moment to rate your experience and provide feedback."
                rows={6}
                className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 outline-none"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SessionCompleted;
