'use client';

import React from 'react';
import Success from '@/components/payment/success';
import { useParams, useRouter } from 'next/navigation';
import { updateIsPremium } from '@/store/slices/userSlice';
import { useDispatch } from 'react-redux';

const PaymentSuccess = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useParams();
  const candidateId = params?.id as string;
  const handleContinue = () => {
    dispatch(updateIsPremium(true));
    router.push(`/customer/browse-engineers/hired/${candidateId}`);
  };
  return <Success onContinue={handleContinue} />;
};

export default PaymentSuccess;
