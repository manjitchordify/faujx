'use client';
import Image from 'next/image';
import React from 'react';

interface SuccessPageProps {
  title: string;
  buttonText: string;
  onButtonClick: () => void;
  icon?: React.ReactNode;
  description?: string;
  onRetry?: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({
  title,
  buttonText,
  onButtonClick,
  icon,
  description,
}) => {
  const defaultIcon = (
    <div className="w-16 h-16 flex items-center justify-center">
      <Image src="/images/clap.png" width={64} height={64} alt="Success" />
    </div>
  );

  return (
    <div className="py-4 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">{icon || defaultIcon}</div>

          {/* Title */}
          <h1 className="text-xl font-medium text-gray-900 mb-8">{title}</h1>

          {/* Button */}
          <button
            onClick={onButtonClick}
            className="bg-[#1F514C] shadow-2xl hover:bg-[#164138] text-white font-medium py-3 px-8 rounded-xl transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {buttonText}
          </button>
        </div>

        {/* Advisory Notice */}
        {description && (
          <div className="mt-6">
            <div className=" bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Important Information
                  </h3>
                  <div className="text-gray-700 space-y-3 text-sm leading-relaxed">
                    <p>Thank you for submitting your resume. Please note:</p>

                    <p>
                      • The FaujX vetting process is{' '}
                      <strong>not a direct hire/no-hire decision</strong>
                    </p>
                    <p>
                      • It evaluates your{' '}
                      <strong>
                        real capabilities, technical skills, and growth
                        potential
                      </strong>
                    </p>
                    <p>
                      • Complete every step{' '}
                      <strong>honestly and independently</strong>
                    </p>
                    <p>
                      • Any plagiarism or external help will{' '}
                      <strong>work against your progress</strong>
                    </p>
                    <p>
                      • The more authentic you are, the more you&apos;ll benefit
                      from accurate feedback and career opportunities
                    </p>

                    <div className="bg-white border border-red-200 rounded-md p-3 mt-4">
                      <p className="text-red-800 font-medium text-sm">
                        💡 Remember: Honesty today builds the foundation for
                        your career tomorrow.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;
