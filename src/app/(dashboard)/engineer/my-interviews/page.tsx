'use client';
import React, { useState } from 'react';

import MyInterview from '@/components/interview/myInterview';
import Sidebar from '@/components/engineer/shared/sidebar';

const Page = () => {
  const [activeMenuItem, setActiveMenuItem] = useState<string>('interviews');

  const handleMenuItemClick = (item: string) => {
    setActiveMenuItem(item);
  };
  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <Sidebar activeItem={activeMenuItem} onItemClick={handleMenuItemClick} />
      <main className="flex-1 bg-gray-100">
        <MyInterview />
      </main>
    </div>
  );
};

export default Page;
