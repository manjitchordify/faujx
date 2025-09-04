'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/engineer/shared/sidebar';
import DashboardPage from '@/components/engineer/dashboard/dashboardPage';
import ProfileSetup from '@/components/engineer/profilesetup/ProfileSetup';
import { useAppSelector } from '@/store/store';

const EngineerDashboardPage = () => {
  const [activeMenuItem, setActiveMenuItem] = useState<string>('dashboard');
  const { loggedInUser } = useAppSelector(state => state.user);

  const handleMenuItemClick = (item: string) => {
    setActiveMenuItem(item);
  };

  const showDashboard =
    loggedInUser?.profileSetup ||
    (loggedInUser?.phase1Completed &&
      loggedInUser?.isPreliminaryVideoCompleted &&
      loggedInUser?.profilePic &&
      loggedInUser?.profileVideo);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Only show sidebar when dashboard is shown */}
      <Sidebar activeItem={activeMenuItem} onItemClick={handleMenuItemClick} />

      <main className="flex-1">
        {!loggedInUser?.phase1Completed ? null : showDashboard ? (
          <DashboardPage />
        ) : (
          <ProfileSetup />
        )}
      </main>
    </div>
  );
};

export default EngineerDashboardPage;
