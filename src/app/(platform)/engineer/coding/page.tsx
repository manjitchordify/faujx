'use client';
import React from 'react';
import CodingTest from '@/components/engineer/codingtest/CodingTest';
import { useAppSelector } from '@/store/store';
import AimlCodingTest from '@/components/engineer/codingtest/aiml-coding-test';
const Page = () => {
  const { enginnerRole } = useAppSelector(state => state.persist);

  return enginnerRole === 'aiml' ? <AimlCodingTest /> : <CodingTest />;
};

export default Page;
