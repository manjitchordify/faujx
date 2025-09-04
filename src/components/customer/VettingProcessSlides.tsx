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
    <div className="relative w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <SectionHeader mainText="Smart Vetting Process" aboutSection="" />
        </div>

        {/* Main Slide Container */}
        <div className="relative flex items-center justify-center">
          {/* Left Arrow */}
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`absolute left-0 z-10 p-4 rounded-full transition-all duration-200 ${
              currentStep === 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:text-green-600 hover:bg-white hover:shadow-lg'
            }`}
          >
            <ChevronLeft size={48} />
          </button>

          {/* Slide Content */}
          <div className="w-full max-w-5xl mx-16">
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
                className="grid lg:grid-cols-2 gap-12 items-center space-x-0 "
              >
                {/* Left Side - Illustration */}
                <div className="flex justify-center lg:justify-end">
                  <div className="relative">
                    {/* Main illustration card */}
                    <div className=" rounded-3xl  p-8 w-96 h-96 flex flex-col items-center justify-center relative overflow-hidden">
                      {/* Step icon */}
                      <div className="relative z-10 ">
                        <div className="relative z-10 mt-10">
                          <Image
                            src={steps[currentStep].image}
                            alt={steps[currentStep].title}
                            width={128}
                            height={128}
                            className="object-contain w-full h-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Content */}
                <div className="text-center lg:text-left">
                  {/* Step Badge */}
                  <div className="inline-block bg-green-600 text-white px-6 py-3 rounded-full text-lg font-semibold mb-8">
                    Step {currentStep + 1}
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl lg:text-4xl font-medium text-gray-900 mb-6 leading-tight">
                    {steps[currentStep].title}
                  </h3>

                  {/* Description */}
                  <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
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
            className={`absolute right-0 z-10 p-4 rounded-full transition-all duration-200 ${
              currentStep === steps.length - 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:text-green-600 hover:bg-white hover:shadow-lg'
            }`}
          >
            <ChevronRight size={48} />
          </button>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center mt-12 space-x-3">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToStep(idx)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
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
        <div className="text-center mt-6">
          <span className="text-sm text-gray-500">
            {currentStep + 1} of {steps.length}
          </span>
        </div>
      </div>
    </div>
  );
}
