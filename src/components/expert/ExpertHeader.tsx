import React from 'react';
import Link from 'next/link';

const ExpertHeader: React.FC = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-black mb-6 sm:mb-8 leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-medium">
          Empower Future
          <br />
          Engineers. Get Paid for
          <br />
          Your Expertise.
        </h1>
        <p className="text-gray-500 mb-8 sm:mb-10 md:mb-12 text-base sm:text-lg md:text-xl lg:text-2xl font-normal leading-relaxed max-w-3xl mx-auto">
          Become a FaujX Expert. Shape the Next Wave of Global Engineers.
        </p>
        <Link
          href={'/expert/signup'}
          className="inline-block bg-[#298917] hover:bg-[#298917] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl transition-colors duration-200 font-medium text-sm sm:text-base md:text-lg"
        >
          Apply as Expert
        </Link>
      </div>
    </section>
  );
};

export default ExpertHeader;
