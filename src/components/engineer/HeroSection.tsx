'use client';

import React from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/store/store';

export default function HeroSection() {
  const loggedInUser = useAppSelector(state => state.user.loggedInUser);

  const isLoggedIn = !!loggedInUser?.accessToken;

  return (
    <section className="py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20 flex items-center justify-center bg-gradient-to-br from-[#2A6B65] to-[#1F514C] w-full min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh]">
      <div className="w-full container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Main Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-[5rem] flex flex-col text-white font-semibold mb-4 sm:mb-6 md:mb-8 leading-tight sm:leading-tight md:leading-tight lg:leading-tight xl:leading-none">
          <span className="block">Global Tech Careers,</span>
          <span className="block">Built on Your Skills</span>
        </h1>

        {/* Description Text */}
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-4xl font-semibold text-[#3FAE2A] mb-6 sm:mb-8 md:mb-10 leading-relaxed">
          Join the FaujX Network as a Foundation Engineer
        </p>

        {/* Call-to-Action Button */}
        <Link href={isLoggedIn ? '/engineer/dashboard' : '/engineer/signup'}>
          <button className="bg-gradient-to-r from-[#2A6B65] to-[#1F514C] cursor-pointer hover:from-[#1F514C] hover:to-[#1a433f] text-white font-semibold py-3 px-6 sm:py-4 sm:px-8 md:py-5 md:px-10 lg:py-6 lg:px-12 mb-6 sm:mb-8 md:mb-10 rounded-2xl sm:rounded-3xl text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl 2xl:text-2xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg w-full sm:w-auto">
            Apply as Foundation Engineer
          </button>
        </Link>

        <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-3xl font-semibold text-white leading-relaxed">
          Skills First Approach | Integrated LMS | Mentor Support
        </p>
      </div>
    </section>
  );
}
