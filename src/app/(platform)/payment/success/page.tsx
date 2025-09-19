'use client';

import React from 'react';
import Success from '@/components/payment/success';
import { useRouter } from 'next/navigation';

const PaymentSuccess = () => {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/engineer/dashboard/browse-mentors'); // redirect logic here
  };
  return <Success onContinue={handleContinue} />;
};

export default PaymentSuccess;
