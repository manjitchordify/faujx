import React from 'react';
import { notFound } from 'next/navigation';
import SignInPage from '@/components/signin/signinPage';

const allowedRoles = ['customer', 'expert', 'engineer'];

export default async function Signin({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;

  if (!allowedRoles.includes(role)) {
    notFound();
  }

  return <SignInPage />;
}
