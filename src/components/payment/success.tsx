'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import {
  processPaymentSuccess,
  updateHiringProcessStatus,
} from '@/services/paymentService';
import { showToast } from '@/utils/toast/Toast';
interface SuccessProps {
  onContinue: () => void;
  interviewId: string;
}

const Success: React.FC<SuccessProps> = ({ onContinue, interviewId = '' }) => {
  const hasProcessedPayment = useRef(false);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        if (!sessionId || hasProcessedPayment.current) return;

        hasProcessedPayment.current = true; // Mark as processed

        await processPaymentSuccess(sessionId);
        if (interviewId) {
          updateCandidateHiringStatus();
        }
        showToast('Payment processed successfully!', 'success');
      } catch (error: unknown) {
        hasProcessedPayment.current = false; // Reset on error
        const message = (error as Error)?.message || 'An error occurred';
        showToast(message, 'error');
      } finally {
        setLoading(false);
      }
    };

    const updateCandidateHiringStatus = async () => {
      try {
        if (!sessionId) return;

        await updateHiringProcessStatus(interviewId);
      } catch (error: unknown) {
        const message = (error as Error)?.message || 'An error occurred';
        console.log('Error', message);
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [sessionId, interviewId]);

  return (
    <div className="flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center bg-white rounded-3xl shadow-2xl p-8 mb-8">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-8 shadow-2xl animate-pulse">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>

        {/* Success Message */}
        <div className="p-8 mb-8">
          <h1 className="text-2xl font-bold text-[#15A958] mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-600 text-lg">
            {loading
              ? 'Verifying your payment...'
              : 'Your payment has been processed successfully.'}
          </p>
        </div>

        {/* Continue Button */}
        {!loading && (
          <button
            onClick={onContinue}
            className="w-full bg-[#15A958] hover:bg-green-800 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 text-lg"
          >
            Proceed
            <ArrowRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Success;
