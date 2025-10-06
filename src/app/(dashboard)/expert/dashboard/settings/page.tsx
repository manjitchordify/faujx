'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/expert/shared/Sidebar';
import Settings from '@/components/engineer/dashboardSettings/Settings';

const SettingsPage = () => {
  const [activeMenuItem, setActiveMenuItem] = useState<string>('settings');

  const handleMenuItemClick = (item: string) => {
    setActiveMenuItem(item);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <Sidebar activeItem={activeMenuItem} onItemClick={handleMenuItemClick} />
      <main className="flex-1 bg-gray-100">
        <Settings />
      </main>
    </div>
  );
};

export default SettingsPage;
