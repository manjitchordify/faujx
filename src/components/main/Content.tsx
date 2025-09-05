'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Advisor from './Advisor';
import { useAppSelector } from '@/store/store';

type UserRole = 'customer' | 'candidate' | 'expert';

const Content = () => {
  const mainContent = useAppSelector(state => state.ui.mainContent);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleRoleSelection = (role: UserRole): void => {
    try {
      localStorage.setItem('userRole', role);
    } catch (error) {
      console.error('Error storing role in localStorage:', error);
    }
  };

  // Content variations that change over time
  const contentSlides = [
    {
      text: 'Mission-driven tech hiring platform',
      subText: 'Discovers, vets, upskills, and deploys Foundation Engineers',
      image: '/portraitFrame.png',
      alt: 'Professional woman - Mission-driven approach',
    },
    {
      text: 'Builds disciplined, dependable, job-ready engineers',
      subText:
        'Designed to accelerate hiring, careers, and expertise from day one',
      image: '/images/slideimage2.png',
      alt: 'Professional person - Building expertise',
    },
  ];

  // Auto-rotate content every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % contentSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [contentSlides.length]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  const currentContent = contentSlides[currentSlide];

  // If advisor section should be shown, render it
  if (mainContent === 'advisor') {
    return <Advisor />;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Main Content */}
      <section className="bg-[url('/landingpage_background.png')] bg-cover bg-center bg-no-repeat min-h-screen">
        {/* Left Section - Content */}
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between px-2 lg:px-4 py-8 lg:py-16 max-w-7xl mx-auto">
          <div className="flex-1 max-w-xl lg:pr-12 text-center lg:text-left mt-11">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-[#1F514C] leading-tight">
              FaujX
            </h1>
            <div className="mb-8">
              <p className="text-xl lg:text-2xl text-[#1F514C] mb-2 font-medium">
                Accelerating Careers.
              </p>
              <p className="text-xl lg:text-2xl text-[#1F514C] mb-2 font-medium">
                Enabling Teams.
              </p>
              <p className="text-xl lg:text-2xl text-[#1F514C] font-medium">
                Empowering Experts.
              </p>
            </div>

            {/* Tab-style Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-3 lg:gap-4 justify-center lg:justify-start mx-4 sm:mx-0 mt-8 lg:mt-12 xl:mt-16">
              <Link
                href="/customer/"
                className="w-full sm:w-auto lg:max-w-[180px] xl:max-w-[200px]"
              >
                <span
                  onClick={() => handleRoleSelection('customer')}
                  className="block w-full px-4 lg:px-5 xl:px-6 py-4 sm:py-3 bg-[#EAEAE2] text-black rounded-full font-medium text-sm lg:text-base transition-all duration-300 hover:bg-[#1F514C] hover:text-white hover:scale-105 shadow-lg text-center whitespace-nowrap cursor-pointer"
                >
                  I&apos;m a Customer
                </span>
              </Link>
              <Link
                href="/engineer/"
                className="w-full sm:w-auto lg:max-w-[180px] xl:max-w-[200px]"
              >
                <span
                  onClick={() => handleRoleSelection('candidate')}
                  className="block w-full px-4 lg:px-5 xl:px-6 py-4 sm:py-3 bg-[#EAEAE2] text-black rounded-full font-medium text-sm lg:text-base transition-all duration-300 hover:bg-[#1F514C] hover:text-white hover:scale-105 shadow-lg text-center whitespace-nowrap cursor-pointer"
                >
                  I&apos;m an Engineer
                </span>
              </Link>
              <Link
                href="/expert/"
                className="w-full sm:w-auto lg:max-w-[180px] xl:max-w-[200px]"
              >
                <span
                  onClick={() => handleRoleSelection('expert')}
                  className="block w-full px-4 lg:px-5 xl:px-6 py-4 sm:py-3 bg-[#EAEAE2] text-black rounded-full font-medium text-sm lg:text-base transition-all duration-300 hover:bg-[#1F514C] hover:text-white hover:scale-105 shadow-lg text-center whitespace-nowrap cursor-pointer"
                >
                  I&apos;m an Expert
                </span>
              </Link>
            </div>
          </div>

          {/* Right Section - Hybrid Responsive Slider */}
          <div className="flex-1 flex justify-center lg:justify-end mb-8 lg:mb-0 mt-8 lg:mt-0">
            {/* Simple Design for Small Screens (mobile) */}
            <div className="w-full max-w-sm md:hidden">
              {/* Content Card */}
              <div className="bg-[#1F514C] rounded-2xl p-6 shadow-2xl mb-6">
                <div className="text-white space-y-4">
                  <p className="text-lg font-medium leading-relaxed">
                    {currentContent.text}
                  </p>
                  <p className="text-sm font-light leading-relaxed opacity-90">
                    {currentContent.subText}
                  </p>
                </div>
              </div>

              {/* Image Card */}
              <div className="relative w-full aspect-[4/5]">
                <Image
                  src={currentContent.image}
                  alt={currentContent.alt}
                  fill
                  className="object-cover rounded-2xl shadow-2xl"
                  priority
                />
              </div>

              {/* Simple Slide Indicators */}
              <div className="flex justify-center space-x-2 mt-6">
                {contentSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleSlideChange(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'bg-[#1F514C] scale-110'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Optimized Complex Design for Medium and Large Screens */}
            <div className="hidden md:block relative">
              {/* Background Card with Content */}
              <div className="bg-[#1F514C] rounded-3xl p-6 lg:p-8 shadow-2xl w-[500px] lg:w-[600px] flex flex-col justify-center h-64 lg:h-80 overflow-hidden relative">
                <div className="text-white w-[200px] lg:w-[240px]">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-lg lg:text-xl leading-relaxed font-medium">
                        {currentContent.text}
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-base lg:text-lg leading-relaxed font-light">
                        {currentContent.subText}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overlapping Image Card */}
              <div className="absolute -bottom-6 -right-6 lg:-bottom-8 lg:-right-8 mr-12 lg:mr-16">
                <div className="relative w-64 h-80 lg:w-72 lg:h-96">
                  <Image
                    src={currentContent.image}
                    alt={currentContent.alt}
                    fill
                    className="object-cover rounded-2xl shadow-2xl"
                    priority
                  />
                </div>
              </div>

              {/* Slide Indicators */}
              <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-2 z-20 mt-16">
                {contentSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleSlideChange(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'bg-black scale-110'
                        : 'bg-gray-500 hover:bg-white/80'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Content;
