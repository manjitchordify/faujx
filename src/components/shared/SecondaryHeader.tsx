import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const SecondaryHeader = () => {
  const currentPath = usePathname();

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
    const activeClasses = 'text-purple-300 font-semibold';
    const inactiveClasses = 'text-white hover:text-purple-300';

    return `${baseClasses} ${isActive(href) ? activeClasses : inactiveClasses}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 lg:mt-10">
      <div className="bg-gray-800 rounded-2xl px-4 sm:px-8 lg:px-16 py-4 lg:py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <div className="relative">
              <Image
                src="/applogo2.png"
                alt="Faujx Logo"
                height={80}
                width={80}
                className="h-12 lg:h-14 w-auto mr-2"
                priority
                quality={100}
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* Navigation Links - Hidden on mobile, visible on desktop */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link href="/faujx-lms" className={getLinkClasses('/faujx-lms')}>
              Home
            </Link>
            <Link
              href="/faujx-lms#HowitWorksfaujx"
              className="text-white hover:text-purple-300 transition-colors duration-200 font-medium text-sm xl:text-base"
            >
              How it Works
            </Link>
            <Link
              href="/faujx-lms#explore-courses"
              className="text-white hover:text-purple-300 transition-colors duration-200 font-medium text-sm xl:text-base"
            >
              Explore Courses
            </Link>
            <Link
              href="/faujx-lms#our-students"
              className="text-white hover:text-purple-300 transition-colors duration-200 font-medium text-sm xl:text-base"
            >
              Our Students
            </Link>
            <Link
              href="/faujx-lms#faq-faujxlms"
              className="text-white hover:text-purple-300 transition-colors duration-200 font-medium text-sm xl:text-base"
            >
              FAQ
            </Link>
          </nav>

          {/* Mobile Menu Button - Visible on mobile only */}
          <button className="lg:hidden text-white p-2">
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
          </button>

          {/* Launch Button */}
          <Link
            href="https://www.chordifyed.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-gray-800 px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg text-sm sm:text-base flex-shrink-0"
          >
            <span className="hidden sm:inline">Launch FaujX LMS</span>
            <span className="sm:hidden">Launch</span>
          </Link>
        </div>

        {/* Mobile Navigation Menu - Toggle this with state */}
        <nav className="lg:hidden mt-4 pt-4 border-t border-gray-700 hidden">
          <div className="flex flex-col space-y-3">
            <Link
              href="/faujx-lms"
              className={`font-medium transition-colors duration-200 ${
                isActive('/faujx-lms')
                  ? 'text-purple-300 font-semibold'
                  : 'text-white hover:text-purple-300'
              }`}
            >
              Home
            </Link>
            <Link
              href="#how-it-works"
              className="text-white hover:text-purple-300 transition-colors duration-200 font-medium"
            >
              How it Works
            </Link>
            <Link
              href="#explore-courses"
              className="text-white hover:text-purple-300 transition-colors duration-200 font-medium"
            >
              Explore Courses
            </Link>
            <Link
              href="#our-students"
              className="text-white hover:text-purple-300 transition-colors duration-200 font-medium"
            >
              Our students
            </Link>
            <Link
              href="#faq"
              className="text-white hover:text-purple-300 transition-colors duration-200 font-medium"
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
