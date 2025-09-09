'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import SectionHeader from './SectionHeader';

const steps = [
  {
    title: 'Role-to-Resume Mapping',
    description:
      'Ensures candidate resumes are aligned with the required role expectations.Helps shortlist applicants with the right skills and experience match.',
    image: '/icons/step1.svg',
  },
  {
    title: 'AI Pre-Screening',
    description:
      'Automates the initial candidate screening using AI-driven insights. Quickly filters applicants based on qualifications and relevance.',
    image: '/icons/step3.svg',
  },
  {
    title: 'Coding Assessment',
    description:
      'Evaluates technical skills through structured coding challenges. Ensures candidates meet the required problem-solving and programming standards.',
    image: '/icons/step2.svg',
  },
  {
    title: 'Panel Interviews',
    description:
      'Engages multiple experts to assess candidate fit collaboratively. Provides a balanced evaluation across technical, behavioral, and cultural aspects.',
    image: '/icons/step4.svg',
  },
  {
    title: 'Certified Foundation Engineers',
    description:
      'Recognizes candidates who meet the benchmark certification standards. Guarantees foundational technical expertise for engineering roles.',
    image: '/icons/step5.svg',
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

export default function VettingProcessSlides() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setDirection(stepIndex > currentStep ? 1 : -1);
    setCurrentStep(stepIndex);
  };

  return (
    <div className="relative w-full bg-white py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <SectionHeader mainText="Smart Vetting Process" aboutSection="" />
        </div>

        {/* Main Slide Container */}
        <div className="relative flex items-center justify-center">
          {/* Left Arrow */}
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`absolute left-0 sm:left-2 lg:left-0 z-10 p-2 sm:p-3 lg:p-4 rounded-full transition-all duration-200 ${
              currentStep === 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:text-green-600 hover:bg-white hover:shadow-lg'
            }`}
          >
            <ChevronLeft size={24} className="sm:w-8 sm:h-8 lg:w-12 lg:h-12" />
          </button>

          {/* Slide Content */}
          <div className="w-full max-w-5xl mx-8 sm:mx-12 lg:mx-16">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="flex flex-col items-center justify-center"
              >
                {/* Left Side - Illustration - Hidden */}
                {/* <div className="flex justify-center lg:justify-end order-2 lg:order-1">
                  <div className="relative">
                    <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 w-64 md:h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 flex flex-col items-center justify-center relative overflow-hidden">
                      <Image
                        src={steps[currentStep].image}
                        alt={steps[currentStep].title}
                        width={200}
                        height={200}
                        className="object w-full h-full mr-15"
                      />
                    </div>
                  </div>
                </div> */}

                {/* Content */}
                <div className="text-center">
                  {/* Step Badge */}
                  <div className="inline-block bg-green-600 text-white px-4 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 rounded-full text-sm sm:text-base lg:text-lg font-semibold mb-4 sm:mb-6 lg:mb-8">
                    Step {currentStep + 1}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-medium text-gray-900 mb-4 sm:mb-5 lg:mb-6 leading-tight">
                    {steps[currentStep].title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed max-w-lg mx-auto">
                    {steps[currentStep].description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className={`absolute right-0 sm:right-2 lg:right-0 z-10 p-2 sm:p-3 lg:p-4 rounded-full transition-all duration-200 ${
              currentStep === steps.length - 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:text-green-600 hover:bg-white hover:shadow-lg'
            }`}
          >
            <ChevronRight size={24} className="sm:w-8 sm:h-8 lg:w-12 lg:h-12" />
          </button>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center mt-8 sm:mt-10 lg:mt-12 space-x-2 sm:space-x-3">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToStep(idx)}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? 'bg-green-600 scale-125'
                  : idx < currentStep
                    ? 'bg-green-400'
                    : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Step Counter */}
        <div className="text-center mt-4 sm:mt-5 lg:mt-6">
          <span className="text-xs sm:text-sm text-gray-500">
            {currentStep + 1} of {steps.length}
          </span>
        </div>
      </div>
    </div>
  );
}
