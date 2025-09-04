import { Metadata } from 'next';
import PrivacyPolicy from '@/components/privacypolicy/PrivacyPolicy';
import React from 'react';

export const metadata: Metadata = {
  title: 'Privacy Policy | FaujX - Data Protection & Privacy',
  description:
    'Read the Privacy Policy of FaujX to learn how we collect, use, and protect your personal information on our tech hiring platform.',
  keywords:
    'privacy policy, FaujX privacy, data protection, personal information, privacy terms, data privacy',
  robots: 'noindex, nofollow', // Legal pages typically shouldn't be indexed
  openGraph: {
    title: 'Privacy Policy | FaujX',
    description:
      'Read the Privacy Policy of FaujX to learn how we collect, use, and protect your personal information.',
    type: 'website',
    url: 'https://faujx.com/privacypolicy/',
  },
  alternates: {
    canonical: 'https://faujx.com/privacypolicy/',
  },
};

const page = () => {
  return <PrivacyPolicy />;
};

export default page;
