'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Define paths that don't need admin layout (sidebar + topbar)
  const authPaths = ['/panelist/login'];
  const isAuthPage = authPaths.includes(pathname);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <ThemeProvider>
      {isAuthPage ? (
        // Simple layout for login/auth pages
        <div>{children}</div>
      ) : (
        // Full admin layout with sidebar and topbar
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
          {/* Main content area with proper margin on large screens */}
          <div className="min-h-screen lg:ml-64">
            <Topbar onMenuClick={toggleSidebar} />
            <main className="p-4 flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      )}
    </ThemeProvider>
  );
}
