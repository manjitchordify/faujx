'use client';
import React from 'react';
import CandidateDetailsAccess from '@/components/customer/browse-engineers/candidateDetailAcess';
import { useParams } from 'next/navigation';

function Page() {
  const params = useParams();
  const candidateId = params?.id as string;
  return (
    <div>
      <CandidateDetailsAccess candidateId={candidateId} />
    </div>
  );
}

export default Page;
