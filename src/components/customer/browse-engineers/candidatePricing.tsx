'use client';

import { Check, CreditCard } from 'lucide-react';
import { getAllPlanFeatures } from '@/services/customer/pricingService';
import { hirePayment, HireRequest } from '@/services/paymentService';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface PricingComponentProps {
  candidateId: string;
  interviewId: string;
}

export default function PricingComponent({
  candidateId,
  interviewId,
}: PricingComponentProps) {
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [features, setFeatures] = useState<string[]>([]);
  const [isLoadingFeatures, setIsLoadingFeatures] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId') as string | null;

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setIsLoadingFeatures(true);
        setError(null);

        await getAllPlanFeatures();

        const dummyFeatures = [
          'One month salary per candidate',
          'Live support',
          'Full access to the candidate being hired',
        ];

        setFeatures(dummyFeatures);
      } catch (err: unknown) {
        console.error('Failed to fetch plan features:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load plan features');
        }
      } finally {
        setIsLoadingFeatures(false);
      }
    };

    fetchFeatures();
  }, []);

  const handleSubscription = async () => {
    try {
      setIsPaymentLoading(true);
      setError(null);

      const subscriptionData: HireRequest = {
        contract_type: 'full_time',
        payment_type: 'monthly',
        success_url: `${window.location.origin}/customer/browse-engineers/${candidateId}/interview/${interviewId}/hiring/success?userId=${userId}`,
        cancel_url: `${window.location.origin}/customer/browse-engineers/${candidateId}/interview/${interviewId}/hiring/cancel`,
        additional_notes: 'Candidate pricing',
      };

      const response = await hirePayment(subscriptionData, candidateId);

      if (response.stripe_session_url) {
        window.location.href = response.stripe_session_url;
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (err: unknown) {
      console.error('Subscription creation failed:', err);
      if (err && typeof err === 'object' && 'message' in err) {
        setError(err.message as string);
      } else {
        setError('Failed to create subscription. Please try again.');
      }
    } finally {
      setIsPaymentLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 w-full py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
          Candidate <span className="text-[#1F514C]">Pricing</span>
        </h1>

        {/* Pricing Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Loading State */}
          {isLoadingFeatures && (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-[#16A34A] border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Loading features...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-center">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  if (isLoadingFeatures) {
                    window.location.reload();
                  }
                }}
                className="w-full mt-2 text-red-600 hover:text-red-700 underline"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Features List */}
          {!isLoadingFeatures && !error && (
            <>
              <ul className="space-y-6 mb-8">
                {features.length > 0 ? (
                  features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-6 h-6 bg-[#16A34A] rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white stroke-[3]" />
                      </div>
                      <span className="text-gray-700 text-lg">{feature}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-center text-gray-500 py-4">
                    No features available
                  </li>
                )}
              </ul>

              {/* Pay Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleSubscription}
                  disabled={isPaymentLoading}
                  className="w-48 flex items-center justify-center gap-3 bg-[#16A34A] hover:bg-[#16A34A]/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPaymentLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <CreditCard size={20} />
                  )}
                  Pay Now
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
