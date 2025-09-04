import React from 'react';
import HeroSection from '@/components/engineer/HeroSection';
import AboutSection from '@/components/engineer/About';
import IntroSection from '@/components/engineer/IntroSection';
import HowItWorks from '@/components/engineer/HowItWorks';
import SkillBasedLearning from '@/components/engineer/SkillBasedLearning';
import Faq from '@/components/engineer/Faq';
import GuidanceCard from '@/components/engineer/GuidanceCard';
import Testimonials from '@/components/engineer/Testimonials';
import Blog from '@/components/engineer/Blog';
// import HeatSkillMap from '@/components/engineer/HeatSkillMap';
import JumpstartCareer from '@/components/engineer/JumpstartCareer';
const CandidatePage = () => {
  return (
    <div className="bg-white w-full">
      <HeroSection />
      <AboutSection />
      <IntroSection />
      <HowItWorks />
      <GuidanceCard />
      <SkillBasedLearning />
      {/* <Consultation /> */}
      <Blog />
      {/* <HeatSkillMap /> */}
      <Testimonials />
      <JumpstartCareer />
      <Faq />
    </div>
  );
};

export default CandidatePage;
