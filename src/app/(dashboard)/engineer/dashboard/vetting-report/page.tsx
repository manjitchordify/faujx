'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/engineer/shared/sidebar';
import VettingReport from '@/components/vetting-report/vettingReport';

const VettingReportPage = () => {
  const [activeMenuItem, setActiveMenuItem] = useState<string>('dashboard');

  const handleMenuItemClick = (item: string) => {
    setActiveMenuItem(item);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <Sidebar activeItem={activeMenuItem} onItemClick={handleMenuItemClick} />
      <main className="flex-1 bg-gray-100">
        <VettingReport />
      </main>
    </div>
  );
};

export default VettingReportPage;
