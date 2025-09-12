'use client';
import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';
import SecondaryHeader from '@/components/shared/SecondaryHeader';
import { usePathname } from 'next/navigation';

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideHeaderPathsArr = [
    '/engineer/mcq',
    '/engineer/feedback',
    '/engineer/coding/coding-intro',
  ];
  const isHide = hideHeaderPathsArr.includes(pathname);
  const isLms = pathname.startsWith('/faujx-lms');
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-foreground w-full">
      {isLms ? <SecondaryHeader /> : <Header hideNavMenu={isHide} />}
      <main className="w-full  bg-white text-black flex flex-col items-center justify-center flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
