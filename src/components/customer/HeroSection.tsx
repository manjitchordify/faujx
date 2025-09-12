'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link'; // Import Next.js Link
import { HiArrowRight } from 'react-icons/hi2';
import Button from '@/components/customer/shared/Button';

function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="w-full px-0 py-0 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="text-center space-y-4 md:space-y-6 py-8 md:py-12 mt-2">
          {/* Updated content with 3 lines and smaller font */}
          <div className="overflow-hidden">
            <div
              className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-gray-900 leading-tight sm:leading-tight md:leading-tight lg:leading-tight xl:leading-tight flex flex-col"
              style={{
                transform: loaded ? 'translateY(0)' : 'translateY(20px)',
                opacity: loaded ? 1 : 0,
                transition: 'transform 0.6s ease-out, opacity 0.6s ease-out',
              }}
            >
              <div
                className="block font-semibold"
                style={{ transitionDelay: '0.1s' }}
              >
                Elite Tech Talent.
              </div>
              <div
                className="block font-semibold"
                style={{ transitionDelay: '0.2s' }}
              >
                Ready for Action.
              </div>
            </div>
          </div>

          <div
            className="space-y-1 my-8 md:my-12"
            style={{
              transform: loaded ? 'translateY(0)' : 'translateY(10px)',
              opacity: loaded ? 1 : 0,
              transition:
                'transform 0.5s ease-out 0.3s, opacity 0.5s ease-out 0.3s',
            }}
          >
            <div className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-[#1F514C] font-normal leading-relaxed sm:leading-relaxed md:leading-relaxed">
              Deploy vetted engineers, consult experts, or vet your own
              candidates.
            </div>
          </div>

          {/* Updated buttons with navigation */}
          <div
            className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 py-3"
            style={{
              transform: loaded ? 'scale(1)' : 'scale(0.95)',
              opacity: loaded ? 1 : 0,
              transition:
                'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.5s, opacity 0.4s ease-out 0.5s',
            }}
          >
            <Link href="customer/browse-engineers">
              <Button
                text="Browse Engineers"
                icon={<HiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
                className="hover:scale-105 cursor-pointer transition-transform duration-300 shadow-2xl !rounded-[20px]"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
