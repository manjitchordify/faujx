import React from 'react';
import HeroSection from '@/components/customer/HeroSection';
import InternePhotoFrame from '@/components/customer/InternePhotoFrame';
import WhyChooseUs from '@/components/customer/WhyChooseUs';
import HowItWorks from '@/components/customer/HowItWorks';
import ExpertServices from '@/components/customer/ExpertServices';
import PricingPlans from '@/components/customer/PricingPlans';
import FrequentlyAskedQuestions from '@/components/customer/FrequentlyAskedQuestions';
import UserStories from '@/components/customer/UserStories';
import VettingProcessSlides from '@/components/customer/VettingProcessSlides';

function Employer() {
  return (
    <>
      <HeroSection />
      <InternePhotoFrame />
      <WhyChooseUs />
      <HowItWorks />
      <VettingProcessSlides />
      <ExpertServices />
      <UserStories />
      <PricingPlans />
      <FrequentlyAskedQuestions />
    </>
  );
}

export default Employer;
