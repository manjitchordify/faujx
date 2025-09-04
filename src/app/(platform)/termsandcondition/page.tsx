import { Metadata } from 'next';
import TandC from '@/components/termsandcondition/TandC';
import React from 'react';

export const metadata: Metadata = {
  title: 'Terms & Conditions | FaujX - Platform Usage Terms',
  description:
    'Read the Terms & Conditions of FaujX to understand your rights, responsibilities, and our policies for using our tech hiring platform.',
  keywords:
    'terms and conditions, FaujX terms, platform usage terms, legal terms, user agreement',
  robots: 'noindex, nofollow', // Legal pages typically shouldn't be indexed
  openGraph: {
    title: 'Terms & Conditions | FaujX',
    description:
      'Read the Terms & Conditions of FaujX to understand your rights, responsibilities, and our policies.',
    type: 'website',
    url: 'https://faujx.com/termsandcondition/',
  },
  alternates: {
    canonical: 'https://faujx.com/termsandcondition/',
  },
};

const page = () => {
  return <TandC />;
};

export default page;
