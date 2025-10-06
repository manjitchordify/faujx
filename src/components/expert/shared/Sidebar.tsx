'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { clearAuthCookies } from '@/services/authService';
import { useAppSelector } from '@/store/store';
import Image from 'next/image';

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeItem = 'dashboard',
  onItemClick,
}) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const loggedInUser = useAppSelector(state => state.user.loggedInUser);

  const toggleMobileMenu = useCallback(
    () => setIsMobileMenuOpen(prev => !prev),
    []
  );
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleItemClick = useCallback(
    (item: string, route: string) => {
      onItemClick?.(item);
      closeMobileMenu();
      router.push(route);
    },
    [closeMobileMenu, router, onItemClick]
  );

  const handleLogout = useCallback(() => {
    console.log('Logout clicked');
    clearAuthCookies();
    router.push('/');
  }, [router]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 bottom-0 w-64 bg-white flex flex-col shadow-lg border-r border-gray-100 z-50 overflow-y-auto transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen
            ? 'translate-x-0'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Image
                src={
                  loggedInUser?.profilePic
                    ? loggedInUser.profilePic
                    : '/default-profile.png'
                }
                alt="Profile"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
            <h3 className="font-medium text-gray-900 text-sm sm:text-base">
              {loggedInUser?.firstName}
            </h3>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() =>
                  handleItemClick('dashboard', '/expert/dashboard')
                }
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-left transition-all duration-200 text-sm ${
                  activeItem === 'dashboard'
                    ? 'bg-[#1F514C] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <LayoutDashboard size={18} />
                <span className="font-medium">Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() =>
                  handleItemClick('earnings', '/expert/earnings-summary')
                }
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-left transition-all duration-200 text-sm ${
                  activeItem === 'earnings'
                    ? 'bg-[#1F514C] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <ClipboardList size={18} />
                <span className="font-medium">Earnings Summary</span>
              </button>
            </li>
            <li>
              <button
                onClick={() =>
                  handleItemClick('settings', '/expert/dashboard/settings')
                }
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-left transition-all duration-200 text-sm ${
                  activeItem === 'settings'
                    ? 'bg-[#1F514C] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Settings size={18} />
                <span className="font-medium">Settings</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-left text-red-600 hover:bg-red-50 transition-all duration-200 text-sm"
          >
            <span className="font-medium">Logout</span>
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Desktop Spacer */}
      <div className="hidden md:block w-64 flex-shrink-0" />
    </>
  );
};

export default Sidebar;
