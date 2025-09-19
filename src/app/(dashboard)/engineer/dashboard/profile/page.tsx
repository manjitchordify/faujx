'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/engineer/shared/sidebar';
import EngineerProfile from '@/components/engineer/engineer_profile/EngineerProfile';

const BrowseMentorsPage = () => {
  const [activeMenuItem, setActiveMenuItem] = useState<string>('Profile');

  const handleMenuItemClick = (item: string) => {
    setActiveMenuItem(item);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <Sidebar activeItem={activeMenuItem} onItemClick={handleMenuItemClick} />
      <main className="flex-1 bg-gray-100">
        <EngineerProfile />
      </main>
    </div>
  );
};

export default BrowseMentorsPage;
