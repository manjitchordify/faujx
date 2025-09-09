'use client';

import React from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/store/store';

export default function HeroSection() {
  const loggedInUser = useAppSelector(state => state.user.loggedInUser);

  const isLoggedIn = !!loggedInUser?.accessToken;

  return (
    <section className="py-10 flex items-center justify-center bg-[#1F514C] w-full">
      <div className="w-full container mx-auto px-6 lg:px-8">
        {/* Main Headline */}
        <h1 className="text-3xl flex flex-col text-white xl:!leading-none max-w-[22ch] md:text-4xl lg:text-7xl 2xl:text-[5rem] font-semibold mb-6 leading-tight">
          <span>Global Tech Careers,</span> <span>Built on Your Skills</span>
        </h1>

        {/* Description Text */}
        <p className="text-xl font-semibold md:text-2xl lg:text-4xl 2xl:text-4xl text-[#3FAE2A] mb-8">
          Join the FaujX Network as a Foundation Engineer
        </p>

        {/* Call-to-Action Button */}
        <Link href={isLoggedIn ? '/engineer/dashboard' : '/engineer/signup'}>
          <button className="bg-[#54A044] cursor-pointer hover:bg-[#54A044]/75 text-white font-semibold py-4 px-8 mb-10 rounded-3xl max-md:text-sm 2xl:text-lg transition-all duration-200 transform hover:-translate-y-0.5">
            Apply as Foundation Engineer
          </button>
        </Link>

        <p className="text-xl font-semibold md:text-2xl 2xl:text-3xl text-white">
          Skills First Approach | Integrated LMS | Mentor Support
        </p>
      </div>
    </section>
  );
}
