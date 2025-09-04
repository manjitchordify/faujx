// components/Topbar.tsx
'use client';
import {
  FiMenu,
  FiUser,
  FiSettings,
  FiLogOut,
  FiSearch,
  FiChevronDown,
} from 'react-icons/fi';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/store';
import NotificationDropdown from '../shared/NotificationDropdown';

interface TopbarProps {
  onMenuClick: () => void;
}

// Helper function to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof document !== 'undefined') {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
  }
  return null;
};

// Helper function to format user type for display
const formatUserType = (userType: string | null): string => {
  if (!userType) return 'User';

  switch (userType.toLowerCase()) {
    case 'admin':
      return 'Administrator';
    case 'interview_panel':
      return 'Interview Panel';
    default:
      return userType.charAt(0).toUpperCase() + userType.slice(1);
  }
};

// Helper function to format user name for display
const formatUserName = (
  firstName?: string,
  lastName?: string,
  email?: string
): string => {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  if (firstName) {
    return firstName;
  }
  if (email) {
    // Extract name from email (before @)
    return email.split('@')[0];
  }
  return 'User';
};

export default function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const loggedInUser = useAppSelector(state => state.user.loggedInUser);

  const [userType, setUserType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // Console log the user data for debugging
  useEffect(() => {
    console.log('Current pathname:', pathname);
    console.log('Logged in user from Redux:', loggedInUser);
    console.log(
      'User name:',
      formatUserName(
        loggedInUser?.firstName,
        loggedInUser?.lastName,
        loggedInUser?.email
      )
    );
  }, [pathname, loggedInUser]);

  useEffect(() => {
    const userTypeFromCookie = getCookie('userType');
    setUserType(userTypeFromCookie);
    setIsLoading(false);
  }, []);

  // Get appropriate links based on user type
  const getProfileLink = () => {
    if (userType === 'admin') return '/admin/profile';
    if (userType === 'interview_panel') return '/panelist/profile';
    return '/profile';
  };

  const getSettingsLink = () => {
    if (userType === 'admin') return '/admin/settings';
    if (userType === 'interview_panel') return '/panelist/settings';
    return '/settings';
  };

  const getLogoutLink = () => {
    if (userType === 'admin') return '/admin/login';
    if (userType === 'interview_panel') return '/panelist/login';
    return '/login';
  };

  const getSettingsLabel = () => {
    if (userType === 'admin') return 'Settings & Access Control';
    return 'Settings';
  };

  // Handle logout
  const handleLogout = () => {
    if (typeof document !== 'undefined') {
      document.cookie =
        'userType=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    setShowDropdown(false);
  };

  // Handle notification count update
  const handleNotificationCountUpdate = (count: number) => {
    setNotificationCount(count);
  };

  const displayUserType = formatUserType(userType);
  const displayUserName = formatUserName(
    loggedInUser?.firstName,
    loggedInUser?.lastName,
    loggedInUser?.email
  );

  // Get user initials for avatar
  const getUserInitials = (): string => {
    if (loggedInUser?.firstName && loggedInUser?.lastName) {
      return `${loggedInUser.firstName[0]}${loggedInUser.lastName[0]}`.toUpperCase();
    }
    if (loggedInUser?.firstName) {
      return loggedInUser.firstName.substring(0, 2).toUpperCase();
    }
    if (loggedInUser?.email) {
      return loggedInUser.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex justify-between items-center relative">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <FiMenu className="w-5 h-5 text-gray-700" />
        </button>

        {/* Search Input */}
        <div className="relative hidden sm:block">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-64 xl:w-80 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all"
          />
        </div>

        {/* Mobile Search Button */}
        <button className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <FiSearch className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Right Section - Contains both notification and user dropdowns */}
      <div className="flex items-center gap-2 relative">
        {/* Notifications Component - With count callback */}
        <div className="relative">
          <NotificationDropdown
            onUnreadCountChange={handleNotificationCountUpdate}
            showBadge={true}
          />
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            {/* User Info - Hidden on mobile */}
            {!isLoading && (
              <div className="hidden lg:flex flex-col items-end text-right mr-2">
                <span className="text-sm font-medium text-gray-900">
                  {displayUserName}
                </span>
                <span className="text-xs text-gray-500">{displayUserType}</span>
              </div>
            )}

            {/* User Avatar with initials or icon */}
            <div className="relative">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-medium text-sm"
                style={{ backgroundColor: '#1F514C' }}
              >
                {loggedInUser ? (
                  getUserInitials()
                ) : (
                  <FiUser className="w-4 h-4" />
                )}
              </div>

              {/* Red notification indicator dot (shows if there are any notifications) */}
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </div>

            <FiChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                showDropdown ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* User Dropdown Menu - Positioned at same level as notification dropdown */}
          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />

              <div className="absolute right-0 top-[calc(100%+1rem)] w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-fadeIn">
                {/* User Info - Mobile */}
                <div className="px-4 py-3 border-b border-gray-100 lg:hidden">
                  <p className="font-medium text-gray-900">{displayUserName}</p>
                  <p className="text-sm text-gray-500">{displayUserType}</p>
                  {loggedInUser?.email && (
                    <p className="text-xs text-gray-400 mt-1">
                      {loggedInUser.email}
                    </p>
                  )}
                </div>

                {/* User Info - Desktop (always visible in dropdown) */}
                <div className="hidden lg:block px-4 py-3 border-b border-gray-100">
                  <p className="font-medium text-gray-900">{displayUserName}</p>
                  {loggedInUser?.email && (
                    <p className="text-sm text-gray-500">
                      {loggedInUser.email}
                    </p>
                  )}
                </div>

                <div className="py-1">
                  <Link
                    href={getProfileLink()}
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FiUser className="w-4 h-4 text-gray-500" />
                    <span>Profile</span>
                  </Link>

                  <Link
                    href={getSettingsLink()}
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FiSettings className="w-4 h-4 text-gray-500" />
                    <span>{getSettingsLabel()}</span>
                  </Link>

                  <div className="border-t border-gray-100 my-1"></div>

                  <Link
                    href={getLogoutLink()}
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FiLogOut className="w-4 h-4 text-red-500" />
                    <span>Sign Out</span>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </header>
  );
}
