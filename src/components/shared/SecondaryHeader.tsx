import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

const SecondaryHeader = () => {
  const currentPath = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to check if a link is active
  const isActive = (href: string): boolean => {
    if (href === '/faujx-lms') {
      return currentPath === '/faujx-lms' || currentPath === '/faujx-lms/';
    }
    return false;
  };

  // Function to get link classes
  const getLinkClasses = (href: string): string => {
    const baseClasses =
      'transition-colors duration-200 font-medium text-sm xl:text-base';
    const activeClasses = 'text-[#36f3e0] font-semibold';
    const inactiveClasses = 'text-white hover:text-[#36f3e0]';

    return `${baseClasses} ${isActive(href) ? activeClasses : inactiveClasses}`;
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when a link is clicked
  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 lg:mt-10">
      <div className="bg-[#1F514C] rounded-2xl px-4 sm:px-6 lg:px-16 py-4 lg:py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <div className="relative">
              <Link href="/" className="block">
                <Image
                  src="/applogo2.png"
                  alt="Faujx Logo"
                  height={80}
                  width={80}
                  className="h-10 sm:h-12 lg:h-14 w-auto"
                  priority
                  quality={100}
                  style={{ objectFit: 'contain' }}
                />
              </Link>
            </div>
          </div>

          {/* Navigation Links - Hidden on mobile, visible on desktop */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link href="/faujx-lms" className={getLinkClasses('/faujx-lms')}>
              Home
            </Link>
            <Link
              href="/faujx-lms#HowitWorksfaujx"
              className="text-white hover:text-[#36f3e0] transition-colors duration-200 font-medium text-sm xl:text-base"
            >
              How it Works
            </Link>
            <Link
              href="/faujx-lms#explore-courses"
              className="text-white hover:text-[#36f3e0] transition-colors duration-200 font-medium text-sm xl:text-base"
            >
              Explore Courses
            </Link>
            <Link
              href="/faujx-lms#our-students"
              className="text-white hover:text-[#36f3e0] transition-colors duration-200 font-medium text-sm xl:text-base"
            >
              Our Students
            </Link>
            <Link
              href="/faujx-lms#faq-faujxlms"
              className="text-white hover:text-[#36f3e0] transition-colors duration-200 font-medium text-sm xl:text-base"
            >
              FAQ
            </Link>
          </nav>

          {/* Mobile Controls Container */}
          <div className="flex items-center gap-3 lg:hidden">
            {/* Launch Button - Mobile Version */}
            <Link
              href="/faujx-lms/courses"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-800 px-3 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg text-sm"
            >
              Launch
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                // Close icon
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger icon
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop Launch Button */}
          <Link
            href="/faujx-lms/courses"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:block bg-white text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg text-base"
          >
            Launch FaujX LMS
          </Link>
        </div>

        {/* Mobile Navigation Menu */}
        <nav
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? 'max-h-96 opacity-100 mt-4 pt-4 border-t border-white/20'
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col space-y-3 pb-2">
            <Link
              href="/faujx-lms"
              onClick={handleMobileLinkClick}
              className={`py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive('/faujx-lms')
                  ? 'text-[#36f3e0] font-semibold bg-white/10'
                  : 'text-white hover:text-[#36f3e0] hover:bg-white/5'
              }`}
            >
              Home
            </Link>
            <Link
              href="/faujx-lms#HowitWorksfaujx"
              onClick={handleMobileLinkClick}
              className="text-white hover:text-[#36f3e0] hover:bg-white/5 py-2 px-3 rounded-lg transition-all duration-200"
            >
              How it Works
            </Link>
            <Link
              href="/faujx-lms#explore-courses"
              onClick={handleMobileLinkClick}
              className="text-white hover:text-[#36f3e0] hover:bg-white/5 py-2 px-3 rounded-lg transition-all duration-200"
            >
              Explore Courses
            </Link>
            <Link
              href="/faujx-lms#our-students"
              onClick={handleMobileLinkClick}
              className="text-white hover:text-[#36f3e0] hover:bg-white/5 py-2 px-3 rounded-lg transition-all duration-200"
            >
              Our Students
            </Link>
            <Link
              href="/faujx-lms#faq-faujxlms"
              onClick={handleMobileLinkClick}
              className="text-white hover:text-[#36f3e0] hover:bg-white/5 py-2 px-3 rounded-lg transition-all duration-200"
            >
              FAQ
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default SecondaryHeader;
