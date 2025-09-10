'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/store/store';

export default function HeroSection() {
  const loggedInUser = useAppSelector(state => state.user.loggedInUser);
  const [loaded, setLoaded] = useState(false);

  const isLoggedIn = !!loggedInUser?.accessToken;

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20 flex items-center justify-center bg-gradient-to-br from-[#2A6B65] to-[#1F514C] w-full min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh]">
      <div className="w-full container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Main Headline */}
        <div className="overflow-hidden">
          <h1
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl flex flex-col text-white font-semibold mb-4 sm:mb-6 md:mb-8 leading-tight sm:leading-tight md:leading-tight lg:leading-tight xl:leading-tight"
            style={{
              transform: loaded ? 'translateY(0)' : 'translateY(20px)',
              opacity: loaded ? 1 : 0,
              transition: 'transform 0.6s ease-out, opacity 0.6s ease-out',
            }}
          >
            <span className="block" style={{ transitionDelay: '0.1s' }}>
              Global Tech Careers,
            </span>
            <span className="block" style={{ transitionDelay: '0.2s' }}>
              Built on Your Skills
            </span>
          </h1>
        </div>

        {/* Description Text */}
        <p
          className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-normal text-[#3FAE2A] mb-6 sm:mb-8 md:mb-10 leading-relaxed sm:leading-relaxed md:leading-relaxed"
          style={{
            transform: loaded ? 'translateY(0)' : 'translateY(10px)',
            opacity: loaded ? 1 : 0,
            transition:
              'transform 0.5s ease-out 0.3s, opacity 0.5s ease-out 0.3s',
          }}
        >
          Join the FaujX Network as a Foundation Engineer
        </p>

        {/* Call-to-Action Button */}
        <div
          style={{
            transform: loaded ? 'scale(1)' : 'scale(0.95)',
            opacity: loaded ? 1 : 0,
            transition:
              'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.5s, opacity 0.4s ease-out 0.5s',
          }}
        >
          <Link href={isLoggedIn ? '/engineer/dashboard' : '/engineer/signup'}>
            <button className="bg-gradient-to-r from-[#2A6B65] to-[#1F514C] cursor-pointer hover:from-[#1F514C] hover:to-[#1a433f] text-white font-semibold py-3 px-6 sm:py-4 sm:px-8 md:py-5 md:px-10 lg:py-6 lg:px-12 mb-6 sm:mb-8 md:mb-10 rounded-2xl sm:rounded-3xl text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl 2xl:text-2xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg w-full sm:w-auto">
              Apply as Foundation Engineer
            </button>
          </Link>
        </div>

        <p
          className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-normal text-white leading-relaxed sm:leading-relaxed md:leading-relaxed"
          style={{
            transform: loaded ? 'translateY(0)' : 'translateY(10px)',
            opacity: loaded ? 1 : 0,
            transition:
              'transform 0.5s ease-out 0.7s, opacity 0.5s ease-out 0.7s',
          }}
        >
          Skills First Approach | Integrated LMS | Mentor Support
        </p>
      </div>
    </section>
  );
}
