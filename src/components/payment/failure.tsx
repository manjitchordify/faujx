'use client';
import React, { useEffect, useRef } from 'react';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { showToast } from '@/utils/toast/Toast';
import { processPaymentCancel } from '@/services/paymentService';

interface FailureProps {
  onContinue: () => void;
}

const Failure: React.FC<FailureProps> = ({ onContinue }) => {
  const router = useRouter();
  const hasProcessedPayment = useRef(false);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const handleGoBack = () => {
    router.back(); // Go back to previous page
  };

  useEffect(() => {
    const cancelPayment = async () => {
      try {
        if (!sessionId || hasProcessedPayment.current) return;
        hasProcessedPayment.current = true;
        await processPaymentCancel(sessionId);
        showToast('Payment failed!', 'error');
      } catch (error: unknown) {
        hasProcessedPayment.current = false;
        const message = (error as Error)?.message || 'An error occurred';
        showToast(message, 'error');
      }
    };

    cancelPayment();
  }, [sessionId]);
  return (
    <div className=" flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center bg-white rounded-3xl shadow-2xl  p-8 mb-8">
        {/* Failure Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-400 to-red-600 rounded-full mb-8 shadow-2xl animate-pulse">
          <XCircle className="w-12 h-12 text-white" />
        </div>

        {/* Failure Message */}
        <div className=" p-8 mb-8">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Payment Failed!
          </h1>
          <p className="text-gray-600 text-lg">
            Something went wrong with your payment. Please retry.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 text-lg"
          >
            <RefreshCw className="w-6 h-6" />
            Try Again
          </button>

          <button
            onClick={handleGoBack}
            className="w-full text-black font-bold p-2 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-3 text-lg"
          >
            <ArrowLeft className="w-6 h-6" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Failure;
