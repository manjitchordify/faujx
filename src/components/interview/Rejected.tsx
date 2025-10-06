'use client';
import React from 'react';
import { XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Rejected = () => {
  const router = useRouter();
  const handleUpskill = () => {
    router.push('/faujx-lms');
  };

  return (
    <div className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-red-50 p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  Interview Feedback
                </h1>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Thank you for participating in the interview process. At this
                  time, your performance did not meet the required threshold.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  After reviewing your overall performance, we’ve identified
                  areas where you can strengthen your skills and improve your
                  readiness for future opportunities.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  To support your growth, we recommend exploring
                  <span className="font-semibold"> Faujx LMS</span>, a platform
                  with structured resources and exercises tailored to building
                  professional skills, confidence, and career development.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Section with Button */}
          <div className="p-8">
            <div className="text-center">
              <button
                onClick={handleUpskill}
                className="bg-green-800 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 outline-none"
              >
                Upskill with Faujx LMS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rejected;
