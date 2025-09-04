'use client';

import React from 'react';
import { Check, CreditCard } from 'lucide-react';

const PlatformPricing = () => {
  const features = [
    '30 days access',
    'Unlimited views',
    'Live support',
    '3 candidates can be shortlisted',
  ];
  const buttonText = 'Pay Now';
  const handlePayNow = () => {
    console.log('Pay Now clicked');
    // Default behavior - could redirect to payment page
  };

  return (
    <div className="w-full h-fit min-h-[calc(100vh-230px)] bg-gray-0 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-scroll">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        {/* Title */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
            <span className="text-gray-900">Platform </span>
            <span className="text-emerald-700">Pricing</span>
          </h1>
        </div>

        {/* Pricing Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-10">
          {/* Features List */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5 mb-6 sm:mb-8 md:mb-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 sm:gap-3 md:gap-4"
              >
                {/* Green checkmark circle */}
                <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white stroke-[2.5]" />
                </div>

                {/* Feature text */}
                <span className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 font-medium">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Pay Now Button */}
          <div className="flex justify-center">
            <button
              onClick={handlePayNow}
              className="flex items-center gap-2 sm:gap-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base md:text-lg min-w-[120px] sm:min-w-[140px] md:min-w-[160px]"
            >
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformPricing;
