'use client';
import React from 'react';
import PricingComponent from '@/components/customer/browse-engineers/candidatePricing';
import { useParams } from 'next/navigation';
function Page() {
  const params = useParams();
  const candidateId = params?.id as string;
  return <PricingComponent candidateId={candidateId} />;
}

export default Page;
