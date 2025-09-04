import React from 'react';
import { Metadata } from 'next';
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

export const metadata: Metadata = {
  title:
    'Accelerate Your Engineering Career | FaujX - Foundation Engineer Development',
  description:
    'Jumpstart your engineering career with FaujX. Get upskilled, mentored, and deployed as a Foundation Engineer with real-world capabilities and military precision.',
  keywords:
    'engineering career, foundation engineer, tech upskilling, engineering mentorship, software development career, engineering training, tech skills development',
  openGraph: {
    title: 'Accelerate Your Engineering Career | FaujX',
    description:
      'Jumpstart your engineering career with upskilling, mentorship, and real-world deployment opportunities.',
    type: 'website',
    url: 'https://faujx.com/engineer/',
    images: [
      {
        url: '/images/engineer/testimonials/engineer1.jpeg',
        width: 1200,
        height: 630,
        alt: 'FaujX - Engineering Career Development',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Accelerate Your Engineering Career | FaujX',
    description:
      'Jumpstart your engineering career with upskilling, mentorship, and real-world deployment opportunities.',
    images: ['/images/engineer/testimonials/engineer1.jpeg'],
  },
  alternates: {
    canonical: 'https://faujx.com/engineer/',
  },
};

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
