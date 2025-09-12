import ExploreCourses from '@/components/faujx-lms/ExploreCourses';
import FaqFaujxLms from '@/components/faujx-lms/FaqFaujxLms';
import FaujxHeroSection from '@/components/faujx-lms/FaujxHeroSection';
import HowItWorks from '@/components/faujx-lms/HowItWorks';
import PlatformHighlights from '@/components/faujx-lms/PlatformHighlights';
import PricingFaujxlms from '@/components/faujx-lms/PricingFaujxlms';
import ReadyToStartLearning from '@/components/faujx-lms/ReadyToStartLearning';
import TestimonialsFaujxlms from '@/components/faujx-lms/TestimonialsFaujxlms';
import WhatisFaujx from '@/components/faujx-lms/WhatisFaujx';
import React from 'react';

const page = () => {
  return (
    <div className="w-full">
      <FaujxHeroSection />
      <WhatisFaujx />
      <HowItWorks />
      <ExploreCourses />
      <PlatformHighlights />
      <PricingFaujxlms />
      <TestimonialsFaujxlms />
      <ReadyToStartLearning />
      <FaqFaujxLms />
    </div>
  );
};

export default page;
