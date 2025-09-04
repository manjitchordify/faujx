'use client';

import { Check, CreditCard } from 'lucide-react';
import { usePayment } from '@/contexts/PaymentContext';

const features = [
  '30 days access',
  'Unlimited views',
  'Live support',
  '3 candidates can be shortlisted',
];

export default function Pricing() {
  const { isLoading, createPaymentIntent } = usePayment();

  return (
    <div className="min-h-[calc(100vh-14.5625rem)] bg-white w-full py-16 px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
        Platform <span className="text-[#1F514C]">Pricing</span>
      </h1>

      <div className="flex justify-center">
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg shadow-black/30 w-full max-w-2xl p-8 md:p-10 lg:w-4/5">
          <ul className="space-y-4">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start space-x-3">
                <span className="inline-flex items-center justify-center bg-[#3FAE2A] text-white rounded-full w-6 h-6">
                  <Check size={16} />
                </span>
                <span className="text-gray-800">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex justify-center">
            <button
              onClick={createPaymentIntent}
              disabled={isLoading}
              className="flex items-center gap-2 bg-[#3FAE2A] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#17403c] transition disabled:opacity-50 disabled:cursor-wait"
            >
              {isLoading ? (
                <span className="size-[18px] rounded-full border-2 border-white border-b-transparent"></span>
              ) : (
                <CreditCard size={18} />
              )}
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
