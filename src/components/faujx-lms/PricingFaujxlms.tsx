import React from 'react';
import { Check } from 'lucide-react';
import Link from 'next/link';

const PricingFaujxlms = () => {
  return (
    <div className="min-h-screen bg-[#1F514C] flex items-center justify-center p-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-medium text-white mb-4">
            Pricing & Plans
          </h1>

          <p className="text-gray-300 text-xl font-medium leading-relaxed">
            Simple, transparent, and value-driven plans.
            <br />
            Pick the one that grows with your learning journey.
          </p>
        </div>

        {/* Divider Line */}
        <div className="w-16 h-px bg-gray-400 mx-auto mb-12"></div>

        {/* Pricing Card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-auto">
          {/* Price */}
          {/* <div className="mb-8">
            <div className="flex items-baseline justify-center mb-2">
              <span className="text-purple-600 text-2xl font-medium">$</span>
              <span className="text-6xl font-bold text-gray-800">900</span>
              <span className="text-gray-500 text-lg ml-2">/per course</span>
            </div>
          </div> */}

          {/* Features */}
          <div className="space-y-4 mb-8 text-left">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
              <span className="text-gray-700 font-medium">
                Lifetime access to course videos
              </span>
            </div>

            <div className="flex items-center">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
              <span className="text-gray-700 font-medium">
                Downloadable resources &
                <br />
                assignments
              </span>
            </div>

            <div className="flex items-center">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
              <span className="text-gray-700 font-medium">
                Certificate on completion
              </span>
            </div>

            <div className="flex items-center">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
              <span className="text-gray-700 font-medium">Offline viewing</span>
            </div>
          </div>

          {/* CTA Button */}
          <Link href="#explore-courses" passHref>
            <button className="w-full bg-gradient-to-r from-[#1F514C] to-[#2a837a] hover:bg-[#207068] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg cursor-pointer">
              Start Learning
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PricingFaujxlms;
