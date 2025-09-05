'use client';

import React, { FC, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { clearAuthCookies } from '@/services/authService';
import NotificationDropdown from '@/components/shared/NotificationDropdown';
import { setMainContent, resetMainContent } from '@/store/slices/uiSlice';

interface HeaderProps {
  hideNavMenu?: boolean;
}

const Header: FC<HeaderProps> = ({ hideNavMenu = false }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const pathname = usePathname();
  const loggedInUser = useAppSelector(state => state.user.loggedInUser);

  const isLoggedIn = !!loggedInUser?.accessToken;
  const isMain = pathname === '/';
  const isEngineerRoute = pathname?.startsWith('/engineer');
  const isCustomerRoute = pathname?.startsWith('/customer');
  const isExpertRoute = pathname?.startsWith('/expert');
  const isPrivacyRoute =
    pathname?.startsWith('/privacypolicy') ||
    pathname?.startsWith('/termsandcondition');

  const isEngineerLandingPage = pathname === '/engineer';

  const mainNavItems = [{ href: 'advisor', label: 'Advisors' }];

  const engineerNavItems = [
    { href: '/engineer', label: 'Home' },
    { href: '#book-mentor', label: 'Book a mentor' },
    { href: '#blog', label: 'Blog' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#faq', label: 'FAQ' },
  ];

  const customerNavItems = [
    { href: '/customer', label: 'Home' },
    { href: '#success-stories', label: 'Success Stories' },
    { href: '#frequently-asked-questions', label: 'FAQ' },
  ];

  const expertNavItems = [
    { href: '/expert', label: 'Home' },
    { href: '#aboutus', label: 'About Us' },
    { href: '/expert/pricing', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' },
  ];

  const getNavItems = () => {
    if (isMain) return mainNavItems;
    if (isEngineerRoute) return engineerNavItems;
    if (isCustomerRoute) return customerNavItems;
    if (isExpertRoute) return expertNavItems;
    return [];
  };

  const navItems = getNavItems();

  const role = isEngineerRoute
    ? 'engineer'
    : isCustomerRoute
      ? 'customer'
      : isExpertRoute
        ? 'expert'
        : 'engineer';

  const getUserName = () => {
    if (!loggedInUser) return '';
    const firstName = loggedInUser.firstName || '';
    const lastName = loggedInUser.lastName || '';
    return `${firstName} ${lastName}`.trim() || loggedInUser.email;
  };

  const getProfileImage = () => {
    return loggedInUser?.profilePic || '/default-avatar.svg';
  };

  const handleLogout = () => {
    clearAuthCookies();
    setProfileDropdownOpen(false);
    setMenuOpen(false);
    router.push('/');
  };

  const closeDropdowns = () => {
    setProfileDropdownOpen(false);
  };

  // Handle notification count update - same as Topbar
  const handleNotificationCountUpdate = (count: number) => {
    setNotificationCount(count);
  };

  return (
    <header
      className={`w-full md:pt-6 shadow-lgg sticky top-0 z-50 ${isEngineerLandingPage ? 'bg-[#1F514C]' : 'bg-white'}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className="flex items-center"
              onClick={() => {
                // Reset main content to show home page when logo is clicked
                dispatch(resetMainContent());
              }}
            >
              <Image
                src="/applogo.png"
                alt="Faujx Logo"
                height={80}
                width={80}
                className="h-8 lg:h-10 w-auto mr-2"
                priority
                quality={100}
                style={{ objectFit: 'contain' }}
              />
            </Link>
          </div>

          <div className="hidden md:flex-1 md:flex items-center space-x-6 lg:space-x-8">
            {/* Navigation Menu - Hide when logged in */}
            {!isLoggedIn && (
              <nav className="!ml-auto hidden md:flex items-center space-x-6 lg:space-x-8">
                {!hideNavMenu &&
                  navItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={e => {
                        if (item.href === 'advisor') {
                          e.preventDefault();
                          // Dispatch action to show advisor section
                          dispatch(setMainContent('advisor'));
                          // setMenuOpen(false);
                        }
                      }}
                      className={`px-1 py-2 text-sm font-medium transition-colors duration-200  ${
                        pathname === item.href
                          ? `${isMain ? 'text-[#1F514C] border-b-2 border-[#1F514C]' : isEngineerLandingPage ? 'text-white border-b-2 border-white' : 'text-[#1F514C] border-b-2 border-[#1F514C]'}`
                          : `${isMain ? 'text-gray-700 hover:text-blue-600' : isEngineerLandingPage ? 'text-white hover:text-gray-200' : 'text-gray-700 hover:text-blue-600'}`
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
              </nav>
            )}

            {/* User Profile Section - Show when logged in */}
            {isLoggedIn ? (
              <div className="ml-auto relative flex items-center space-x-3 lg:space-x-4">
                {/* Notifications Component - Same as in Topbar */}
                <div className="relative">
                  <NotificationDropdown
                    onUnreadCountChange={handleNotificationCountUpdate}
                    showBadge={true}
                  />
                </div>

                {/* Profile Section */}
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 lg:space-x-3 focus:outline-none relative"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 relative">
                    <Image
                      src={getProfileImage()}
                      alt={getUserName()}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />

                    {/* Red notification indicator dot on profile image (shows if there are any notifications) */}
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${isEngineerLandingPage ? 'text-white' : 'text-gray-700'}`}
                  >
                    {getUserName()}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      profileDropdownOpen ? 'rotate-180' : ''
                    } ${isEngineerLandingPage ? 'text-white' : 'text-gray-500'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <>
                    {/* Backdrop to close dropdown when clicking outside */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileDropdownOpen(false)}
                    />

                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-3 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Logout
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Login/Signup Buttons - Show when not logged in */
              <div
                className={clsx(
                  [isMain || isPrivacyRoute ? 'hidden' : 'md:flex'],
                  'items-center gap-3 lg:gap-4'
                )}
              >
                <button
                  onClick={() => router.push(`/${role}/login`)}
                  className={`font-semibold py-2 px-4 lg:px-6 rounded-full text-sm transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5 ${
                    isEngineerLandingPage
                      ? 'bg-white text-[#1F514C] hover:bg-gray-100'
                      : 'bg-[#1F514C] hover:bg-[#1F514C]/75 text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push(`/${role}/signup`)}
                  className={`font-semibold py-2 px-4 lg:px-6 rounded-full text-sm transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5 ${
                    isEngineerLandingPage
                      ? 'bg-transparent border-[1.5px] border-white text-white hover:bg-white hover:text-[#1F514C]'
                      : 'bg-transparent border-[1.5px] border-[#1F514C] hover:bg-[#1F514C] text-[#1F514C] hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button - Only show when not logged in */}
          {!isLoggedIn && (
            <div className={clsx(['md:hidden flex'], 'items-center')}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none ${
                  isMain
                    ? 'text-[#1F514C] hover:text-blue-600'
                    : isEngineerRoute
                      ? 'text-white hover:text-gray-200'
                      : 'text-gray-700 hover:text-blue-600'
                }`}
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!menuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          )}

          {/* Mobile Profile Display - Show when logged in on mobile */}
          {isLoggedIn && (
            <div className="md:hidden relative flex items-center space-x-3">
              {/* Mobile Notifications */}
              <div className="relative">
                <NotificationDropdown
                  onUnreadCountChange={handleNotificationCountUpdate}
                  showBadge={true}
                />
              </div>

              {/* Mobile Profile */}
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 relative">
                  <Image
                    src={getProfileImage()}
                    alt={getUserName()}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />

                  {/* Mobile notification indicator */}
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${
                    profileDropdownOpen ? 'rotate-180' : ''
                  } ${isEngineerLandingPage ? 'text-white' : 'text-gray-500'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Mobile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu - Only show when not logged in */}
      {!isLoggedIn && (
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            menuOpen ? 'max-h-screen' : 'max-h-0'
          }`}
        >
          <div
            className={`px-4 pt-3 pb-4 space-y-2 sm:px-6 border-t border-gray-200 ${isEngineerLandingPage ? 'bg-[#1F514C]' : 'bg-white'}`}
          >
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={e => {
                  if (item.href === 'advisor') {
                    e.preventDefault();
                    // Dispatch action to show advisor section
                    dispatch(setMainContent('advisor'));
                  }
                  setMenuOpen(false);
                }}
                className={`block px-4 py-3 rounded-md text-base font-medium ${
                  pathname === item.href
                    ? `${isMain ? 'bg-blue-50 text-blue-600' : isEngineerLandingPage ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'}`
                    : `${isMain ? 'text-gray-700 hover:bg-gray-50 hover:text-blue-600' : isEngineerLandingPage ? 'text-white hover:bg-white/10 hover:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown when clicking outside */}
      {profileDropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={closeDropdowns} />
      )}
    </header>
  );
};

export default Header;
