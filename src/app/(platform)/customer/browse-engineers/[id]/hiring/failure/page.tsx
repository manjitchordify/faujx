'use client';
import React from 'react';
import Failure from '@/components/payment/failure';
import { useRouter } from 'next/navigation';

const PaymentFailure = () => {
  const router = useRouter();
  const handleContinue = () => {
    router.push('/customer/candidate-pricing');
  };
  return <Failure onContinue={handleContinue} />;
};

export default PaymentFailure;
