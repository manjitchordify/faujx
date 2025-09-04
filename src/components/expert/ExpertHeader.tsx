import React from 'react';
import Link from 'next/link';

const ExpertHeader: React.FC = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1
          className="text-black mb-8 leading-none"
          style={{
            fontSize: '80px',
            fontWeight: 500,
            lineHeight: '90px',
          }}
        >
          Empower Future
          <br />
          Engineers. Get Paid for
          <br />
          Your Expertise.
        </h1>
        <p
          className="text-gray-500 mb-12"
          style={{
            fontSize: '20px',
            fontWeight: 400,
            lineHeight: '140%',
          }}
        >
          Become a FaujX Expert. Shape the Next Wave of Global Engineers.
        </p>
        <Link
          href={'/expert/signup'}
          className="inline-block bg-[#298917] hover:bg-[#298917] text-white px-8 py-3 rounded-2xl transition-colors duration-200 font-medium"
          style={{
            fontSize: '16px',
          }}
        >
          Apply as Expert
        </Link>
      </div>
    </section>
  );
};

export default ExpertHeader;
