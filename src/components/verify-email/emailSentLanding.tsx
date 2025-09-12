'use client';
import { showToast } from '@/utils/toast/Toast';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { resendVerificationEmail } from '@/services/authService';
import { useAppSelector } from '@/store/store';

const EmailSentLanding = () => {
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const { loggedInUser } = useAppSelector(state => state.user);

  const handleBackToLogin = () => {
    router.push('login');
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendSuccess(false);

    try {
      await resendVerificationEmail(loggedInUser!.email);
      await new Promise(resolve => setTimeout(resolve, 2000));

      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
      showToast('Verification email has been sent successfully.');
    } catch (error) {
      console.error('Failed to resend verification email:', error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md mx-auto">
        {/* Email Sent Card */}
        <div className="bg-white rounded-4xl shadow-[0px_7px_120px_14px_#00000040] py-8 px-8 lg:px-12">
          {/* Mail Icon and Title */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-[#008E5B]" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-3">
              Check Your Email
            </h1>
            <p className="text-gray-600 text-base leading-relaxed mb-4">
              We&apos;ve sent a verification email to your inbox. Please check
              your email and click the verification link to continue.
            </p>
          </div>

          {resendSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-green-700 text-center">
                ✓ Verification email sent successfully!
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-green-800 mb-2">
              What&apos;s next?
            </h3>
            <ol className="text-sm text-[#008E5B] space-y-1">
              <li>1. Check your email inbox (and spam folder)</li>
              <li>2. Click the verification link in the email</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleResendVerification}
              disabled={isResending}
              className="w-full bg-[#008E5B] hover:bg-[#007A52] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-[#008E5B] focus:ring-offset-2 outline-none flex items-center justify-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`}
              />
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </button>

            {/* Back to Login Button */}
            <button
              onClick={handleBackToLogin}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 outline-none flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSentLanding;
