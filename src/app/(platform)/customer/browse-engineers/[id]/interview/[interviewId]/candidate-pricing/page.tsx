'use client';
import React from 'react';
import PricingComponent from '@/components/customer/browse-engineers/candidatePricing';
import { useParams } from 'next/navigation';
function Page() {
  const params = useParams();
  const candidateId = params?.id as string;
  const interviewId = params?.interviewId as string;
  return (
    <PricingComponent candidateId={candidateId} interviewId={interviewId} />
  );
}

export default Page;
