import React from 'react';
import Link from 'next/link';

const ExpertHeader: React.FC = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-black mb-6 sm:mb-8 leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl 2xl:text-7xl font-medium">
          Empower Tomorrow&apos;s Engineers. Monetize Your Expertise Today.
        </h1>
        <p className="text-gray-500 mb-8 sm:mb-10 md:mb-12 text-base sm:text-lg md:text-xl lg:text-2xl font-normal leading-relaxed max-w-3xl mx-auto">
          Become a FaujX Expert. Shape the Next Wave of Global Engineers.
        </p>
        <Link
          href={'/expert/signup'}
          className="inline-block bg-gradient-to-r from-[#2A6B65] to-[#1F514C] hover:from-[#1F514C] hover:to-[#1a433f] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl transition-all duration-300 font-medium text-sm sm:text-base md:text-lg shadow-lg"
        >
          Apply as Expert
        </Link>
      </div>
    </section>
  );
};

export default ExpertHeader;
