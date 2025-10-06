'use client';

import React from 'react';
import Success from '@/components/payment/success';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

const PaymentSuccess = () => {
  const router = useRouter();
  const params = useParams();
  const interviewId = params?.interviewId as string;
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId') as string | null;

  const handleContinue = () => {
    router.push(`/customer/browse-engineers/hired/${userId}`);
  };
  return <Success onContinue={handleContinue} interviewId={interviewId} />;
};

export default PaymentSuccess;
