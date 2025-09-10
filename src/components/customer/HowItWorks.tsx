'use client';
import React from 'react';
import SectionHeader from './SectionHeader';

interface Step {
  id: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: 'Search and Filter',
    description:
      'Easily search and apply filters to find candidates that match your needs. Save time by narrowing down profiles based on skills, experience, and more.',
  },
  {
    id: 2,
    title: 'Shortlist Profiles',
    description:
      'Quickly review and shortlist high-potential candidates. Organize your top picks in one place for faster decision-making.',
  },
  {
    id: 3,
    title: 'Platform Fee',
    description:
      "Pay a transparent platform fee only when you're ready to hire. No hidden charges just clear pricing for quality talent access.",
  },
  {
    id: 4,
    title: 'Schedule Interview',
    description:
      'Effortlessly book interviews with shortlisted candidates. Coordinate availability and manage schedules all in one platform.',
  },
  {
    id: 5,
    title: 'Hire with Confidence',
    description:
      'Make informed hiring decisions backed by vetted profiles. Rely on real-world-tested candidates ready to contribute from day one.',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <div className="relative w-full px-4 py-8 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <SectionHeader mainText="How It Works" aboutSection="" />
        </div>

        {/* Steps Container */}
        <div className="flex justify-center space-x-5 flex-wrap gap-y-6">
          {steps.map(step => (
            <div key={step.id} className="w-[350px]">
              <div
                className="rounded-xl p-[1.25px] shadow-md"
                style={{
                  background: 'linear-gradient(to bottom, #C0C0C0, #F7F7F7)',
                }}
              >
                <div
                  className="rounded-xl p-6 min-h-[230px] flex flex-col"
                  style={{
                    background: 'linear-gradient(to bottom, #FFFFFF, #F7F7F7)',
                  }}
                >
                  {/* Step Number at Top */}
                  <div className="flex justify-start mb-4">
                    <div
                      className="w-9 h-9 rounded-md flex items-center justify-center shadow"
                      style={{ backgroundColor: '#1F514C' }}
                    >
                      <span className="text-white font-bold">{step.id}</span>
                    </div>
                  </div>

                  {/* Content at Bottom */}
                  <div className="flex-1 flex flex-col justify-end">
                    <h3 className="text-base sm:text-lg md:text-lg lg:text-xl font-semibold text-gray-800 mb-3 text-left leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-sm md:text-base text-gray-600 leading-relaxed sm:leading-relaxed text-left">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
