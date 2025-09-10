import React from 'react';
import { Metadata } from 'next';
import HeroSection from '@/components/customer/HeroSection';
import InternePhotoFrame from '@/components/customer/InternePhotoFrame';
import WhyChooseUs from '@/components/customer/WhyChooseUs';
import HowItWorks from '@/components/customer/HowItWorks';
import ExpertServices from '@/components/customer/ExpertServices';
import PricingPlans from '@/components/customer/PricingPlans';
import FrequentlyAskedQuestions from '@/components/customer/FrequentlyAskedQuestions';
import UserStories from '@/components/customer/UserStories';
import VettingProcessSlides from '@/components/customer/VettingProcessSlides';
import WhyDifferent from '@/components/customer/WhyDifferent';

export const metadata: Metadata = {
  title:
    'Hire Foundation Engineers | FaujX - Tech Hiring Platform for Employers',
  description:
    'Find and hire pre-vetted Foundation Engineers through FaujX. Our mission-driven platform discovers, vets, and deploys engineering talent with real-world capabilities.',
  keywords:
    'hire engineers, foundation engineers, tech hiring, software engineers, engineering talent, tech recruitment, pre-vetted engineers, engineering hiring platform',
  openGraph: {
    title: 'Hire Foundation Engineers | FaujX',
    description:
      'Find and hire pre-vetted Foundation Engineers with real-world capabilities. Discover, vet, and deploy engineering talent.',
    type: 'website',
    url: 'https://faujx.com/customer/',
    images: [
      {
        url: '/images/customer/recruitment.png',
        width: 1200,
        height: 630,
        alt: 'FaujX - Hire Foundation Engineers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hire Foundation Engineers | FaujX',
    description:
      'Find and hire pre-vetted Foundation Engineers with real-world capabilities.',
    images: ['/images/customer/recruitment.png'],
  },
  alternates: {
    canonical: 'https://faujx.com/customer/',
  },
};

function Employer() {
  return (
    <>
      <HeroSection />
      <InternePhotoFrame />
      <WhyChooseUs />
      <HowItWorks />
      <VettingProcessSlides />
      <WhyDifferent />
      <ExpertServices />
      <UserStories />
      <PricingPlans />
      <FrequentlyAskedQuestions />
    </>
  );
}

export default Employer;
