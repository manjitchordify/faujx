'use client';

import Button from '@/components/ui/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const Page = () => {
  const router = useRouter();

  const details = [
    'The coding test will take approximately 2 hours to complete.',
    'Please ensure you have a stable internet connection.',
    'Use a laptop or desktop for the best experience.',
    'Once you start, the timer will not pause — complete it in one sitting.',
    'Make sure you are in a quiet environment free from interruptions.',
    'The coding test will be conducted on CodeSandbox.',
    'If you are not familiar with CodeSandbox, Please review the instructions beforehand. Otherwise you may proceed to take the test now.',
  ];

  const handleTakeTestNow = () => {
    router.push('/engineer/coding');
  };

  return (
    <div className="w-full min-h-[calc(100vh-130px)] flex flex-col justify-start items-center">
      {/* CENTER */}
      <div className="w-full flex-1 flex justify-center items-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl h-fit flex flex-col justify-center items-center gap-3 sm:gap-4 lg:gap-6 rounded-2xl sm:rounded-3xl lg:rounded-[36px] px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-6 sm:py-8 md:py-10 lg:py-12 bg-white shadow-lg sm:shadow-xl lg:shadow-[0px_7.33px_120.76px_14.66px_rgba(0,0,0,0.25)]">
          {/* Clap Image */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 lg:w-15 lg:h-15 relative">
            <Image
              src="/images/coding/clap.png"
              alt="Celebration"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Title */}
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-3xl text-center font-medium leading-tight">
            Let&apos;s move on to the coding round
          </h1>

          {/* Instructions List */}
          <ul className="w-full flex flex-col justify-start items-start gap-2 sm:gap-3 md:gap-1">
            {details.map((item, index) => (
              <li
                key={index}
                className="text-sm sm:text-base md:text-lg lg:text-[18px] text-[#585858] font-light list-disc ml-4 sm:ml-6 leading-relaxed"
              >
                {item}
              </li>
            ))}
          </ul>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-12 mt-4 sm:mt-6 md:mt-8 w-full sm:w-auto">
            <Button
              text="Coding Instructions"
              onClick={() => router.push('/engineer/coding/codesandbox-intro')}
              className="text-sm sm:text-base md:text-[16px] bg-[#1F514C] text-white rounded-xl sm:rounded-2xl px-6 sm:px-8 md:px-10 lg:px-12 py-2 sm:py-3 md:py-4 hover:bg-[#164239] transition-colors duration-200 whitespace-nowrap"
            />
            <Button
              text="Take Test Now"
              onClick={handleTakeTestNow}
              className="text-sm sm:text-base md:text-[16px] bg-[#1F514C] text-white rounded-xl sm:rounded-2xl px-6 sm:px-8 md:px-10 lg:px-12 py-2 sm:py-3 md:py-4 hover:bg-[#164239] transition-colors duration-200 whitespace-nowrap"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
