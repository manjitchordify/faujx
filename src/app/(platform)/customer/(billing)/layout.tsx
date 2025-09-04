'use client';

import { PaymentProvider } from '@/contexts/PaymentContext';

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PaymentProvider>{children}</PaymentProvider>;
}
