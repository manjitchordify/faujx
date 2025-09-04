'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Advisor from './Advisor';
import { useAppSelector } from '@/store/store';

type UserRole = 'customer' | 'candidate' | 'expert';

const Content = () => {
  const mainContent = useAppSelector(state => state.ui.mainContent);

  const handleRoleSelection = (role: UserRole): void => {
    try {
      localStorage.setItem('userRole', role);
    } catch (error) {
      console.error('Error storing role in localStorage:', error);
    }
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Content variations that change over time
  const contentSlides = [
    {
      text: 'Mission-driven tech hiring platform',
      subText: 'Discovers, vets, upskills, and deploys Foundation Engineers',
      feature: 'Focuses on real-world capabilities over textbook knowledge',
      image: '/portraitFrame.png', // Professional woman
      alt: 'Professional woman - Mission-driven approach',
    },
    {
      text: 'Builds disciplined, dependable, job-ready engineers',
      subText:
        'Designed to accelerate hiring, careers, and expertise from day one',
      feature: 'Combines military precision with cutting-edge technology',
      image: '/images/slideimage2.png', // You'll need a second image
      alt: 'Professional person - Building expertise',
    },
  ];

  // Auto-rotate content every 5 seconds with animation
  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide(prev => (prev + 1) % contentSlides.length);
        setIsAnimating(false);
      }, 150); // Half of transition duration
    }, 5000);

    return () => clearInterval(timer);
  }, [contentSlides.length]);

  const handleSlideChange = (index: number) => {
    if (index !== currentSlide) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setIsAnimating(false);
      }, 150);
    }
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

          {/* Right Section - Dynamic Hero Card */}
          <div className="flex-1 flex justify-center lg:justify-end mb-12 lg:mb-0 mt-10 ">
            <div className="relative ">
              {/* Background Card with Dynamic Content */}
              <div className="bg-[#1F514C] rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl w-[450px] md:w-[550px] lg:w-[700px] flex flex-col justify-center h-60 md:h-64 lg:h-80 overflow-hidden relative">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div
                    className={`w-full h-full bg-gradient-to-r from-white/10 to-transparent transform transition-transform duration-1000 ${isAnimating ? 'translate-x-full' : 'translate-x-0'}`}
                  ></div>
                </div>

                <div
                  className={`text-white mb-6 w-full md:w-36 lg:w-[400px] transition-all duration-300 transform ${isAnimating ? 'translate-x-4 opacity-0' : 'translate-x-0 opacity-100'}`}
                >
                  <div className="space-y-3 lg:space-y-4 w-40 sm:w-36 md:w-52 lg:w-60">
                    {/* Main feature point with staggered animation */}
                    <div
                      className={`flex items-start space-x-2 transition-all duration-500 delay-75 transform ${isAnimating ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'}`}
                    >
                      <div
                        className={`w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0 transition-all duration-300 transform ${isAnimating ? 'scale-0' : 'scale-100'}`}
                      ></div>
                      <p className="text-sm sm:text-base md:text-md lg:text-xl leading-relaxed font-medium">
                        {currentContent.text}
                      </p>
                    </div>

                    <div
                      className={`flex items-start space-x-2 transition-all duration-500 delay-150 transform ${isAnimating ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'}`}
                    >
                      <div
                        className={`w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0 transition-all duration-300 delay-75 transform ${isAnimating ? 'scale-0' : 'scale-100'}`}
                      ></div>
                      <p className="text-sm sm:text-base md:text-md lg:text-xl leading-relaxed font-light">
                        {currentContent.subText}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overlapping Dynamic Image Card with Enhanced Animation */}
              <div className="absolute -bottom-6 -right-6 lg:-bottom-8 lg:-right-8 mr-12 lg:mr-24">
                <div
                  className={`relative w-56 h-70 md:w-64 md:h-80 lg:w-80 lg:h-96 transition-all duration-700 transform ${isAnimating ? 'scale-95 rotate-1' : 'scale-100 rotate-0'}`}
                >
                  {/* Image container with fade and slide effect */}
                  <div
                    className={`relative w-full h-full transition-all duration-500 transform ${isAnimating ? 'opacity-0 translate-x-2' : 'opacity-100 translate-x-0'}`}
                  >
                    <Image
                      src={currentContent.image}
                      alt={currentContent.alt}
                      fill
                      className="object-cover rounded-2xl shadow-2xl"
                      priority
                    />

                    {/* Animated overlay effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-[#1F514C]/20 to-transparent rounded-2xl transition-opacity duration-500 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
                    ></div>
                  </div>

                  {/* Floating animation elements */}
                  <div
                    className={`absolute -top-2 -left-2 w-4 h-4 bg-white/20 rounded-full transition-all duration-1000 transform ${isAnimating ? 'scale-0 -translate-y-4' : 'scale-100 translate-y-0'}`}
                  ></div>
                  <div
                    className={`absolute -bottom-2 -right-2 w-3 h-3 bg-white/30 rounded-full transition-all duration-1000 delay-100 transform ${isAnimating ? 'scale-0 translate-y-4' : 'scale-100 translate-y-0'}`}
                  ></div>
                </div>
              </div>
              {/* Slide indicator moved inside the background card */}
              <div className="absolute  left-1/2 transform -translate-x-1/2 flex space-x-2 z-20 mt-14">
                {contentSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleSlideChange(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-500 transform hover:scale-125 ${
                      index === currentSlide
                        ? 'bg-black scale-110 shadow-lg'
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
