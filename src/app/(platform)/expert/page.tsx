import { Metadata } from 'next';
import ActionItemsSection from '@/components/expert/ActionItemsSection';
import ExpertDetail from '@/components/expert/ExpertDetail';
import ExpertFaq from '@/components/expert/ExpertFaq';
import ExpertHeader from '@/components/expert/ExpertHeader';
import HowItWorksSection from '@/components/expert/HowItWorksSection';
import MentorsSection from '@/components/expert/MentorsSection';
import StudentTestimonials from '@/components/expert/StudentTestimonials';

import React from 'react';

export const metadata: Metadata = {
  title: 'Become an Expert Mentor | FaujX - Engineering Mentorship Platform',
  description:
    'Join FaujX as an expert mentor and help shape the next generation of Foundation Engineers. Share your knowledge, mentor students, and contribute to tech education.',
  keywords:
    'engineering mentor, tech mentorship, software development mentor, engineering education, tech teaching, mentor platform, engineering expertise',
  openGraph: {
    title: 'Become an Expert Mentor | FaujX',
    description:
      'Join FaujX as an expert mentor and help shape the next generation of Foundation Engineers.',
    type: 'website',
    url: 'https://faujx.com/expert/',
    images: [
      {
        url: '/images/expert/mentor1.jpg',
        width: 1200,
        height: 630,
        alt: 'FaujX - Expert Mentorship Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Become an Expert Mentor | FaujX',
    description:
      'Join FaujX as an expert mentor and help shape the next generation of Foundation Engineers.',
    images: ['/images/expert/mentor1.jpg'],
  },
  alternates: {
    canonical: 'https://faujx.com/expert/',
  },
};

const page = () => {
  return (
    <>
      <ExpertHeader />
      <ExpertDetail />
      <HowItWorksSection />
      <ActionItemsSection />
      <MentorsSection />
      <StudentTestimonials />
      <ExpertFaq />
    </>
  );
};

export default page;
