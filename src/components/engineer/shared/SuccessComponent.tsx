'use client';
import Image from 'next/image';
import React from 'react';

interface SuccessPageProps {
  title: string;
  buttonText: string;
  onButtonClick: () => void;
  icon?: React.ReactNode;
  description?: string;
}

const SuccessPage: React.FC<SuccessPageProps> = ({
  title,
  buttonText,
  onButtonClick,
  icon,
}) => {
  const defaultIcon = (
    <div className="relative">
      {/* Custom Success Icon */}
      <div className="w-20 h-20 flex items-center justify-center">
        <Image src="/images/clap.png" width={100} height={100} alt="Success" />
      </div>
    </div>
  );

  return (
    <div className=" p-24">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Page Content */}
        <div className="px-8 py-12 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">{icon || defaultIcon}</div>

          {/* Title */}
          <h2 className="text-xl font-medium text-gray-800 mb-8 leading-relaxed px-4">
            {title}
          </h2>

          {/* Action Button */}
          <button
            onClick={onButtonClick}
            className="bg-[#1F514C] shadow-2xl hover:bg-[#164138] text-white font-medium py-3 px-8 rounded-xl transition-all duration-200  hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
