'use client';
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const InterviewCompleted = () => {
  const router = useRouter();
  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="w-full md:w-2/3 lg:w-1/2 mx-auto">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Success Icon and Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Interview Completed
              </h1>
              <div className="space-y-1">
                <p className="text-gray-600">Thank you for attending.</p>
                <p className="text-gray-600">
                  We&apos;ll review your responses and get back to you shortly.
                </p>
              </div>
            </div>
          </div>

          {/* Update Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p
              className="text-gray-700 text-sm cursor-pointer"
              onClick={() => router.push('/engineer/login')}
            >
              Your interview is complete — you will receive an email with
              details after confirmation from the panel.
            </p>
          </div>

          {/* Interview Details */}
          <div className="space-y-2">
            <p className="text-gray-500 text-sm">Interview</p>
            <h2 className="text-lg font-medium text-gray-900">
              Product Designer — Round 1
            </h2>
            <p className="text-gray-500 text-sm">Interviewer: Jane Doe</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewCompleted;
