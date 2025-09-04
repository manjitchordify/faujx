'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isMain = pathname === '/';
  const isEngineerRoute = pathname?.startsWith('/engineer');
  const isCustomerRoute = pathname?.startsWith('/customer');

  const engineerNavItems = [
    { href: '/engineer', label: 'Home' },
    // { href: "/for-customer", label: "For Customer" },
    // { href: "/for-expert", label: "For Expert" },
    // { href: '/about', label: 'About us' },
    { href: '/engineer/book-mentor', label: 'Book a mentor' },
    { href: '/engineer/blog', label: 'Blog' },
    { href: '/engineer/testimonials', label: 'Testimonials' },
    { href: '/engineer/faq', label: 'FAQ' },
  ];

  const customerNavItems = [
    { href: '/customer', label: 'Home' },
    { href: '/customer/about', label: 'About Us' },
    { href: '/customer/success-stories', label: 'Success Stories' },
    { href: '/customer/pricing', label: 'Pricing' },
    { href: '/customer/blog', label: 'Blog' },
  ];

  const getNavItems = () => {
    if (isEngineerRoute) return engineerNavItems;
    if (isCustomerRoute) return customerNavItems;
    return [];
  };

  const navItems = getNavItems();

  return (
    <header className="w-full md:pt-6 bg-[#1F514C] text-white sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex-shrink-0 flex items-center opacity-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/applogo.png"
                alt="Faujx Logo"
                height={40}
                width={40}
                className="h-8 lg:h-10 w-auto mr-2"
                priority
              />
              {/* <span className="text-xl font-bold text-gray-900">Faujx</span> */}
            </Link>
          </div>

          <div className="hidden md:flex-1 md:flex items-center space-x-8">
            <nav className="!ml-auto hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`px-1 py-2 text-sm border-b-2 font-medium transition-colors duration-200  ${
                    pathname === item.href
                      ? 'text-white border-white'
                      : 'text-[whitesmoke]/90 border-b-transparent hover:border-b-[whitesmoke]/90'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div
              className={clsx(
                [isMain ? 'hidden' : 'md:flex'],
                'items-center gap-4'
              )}
            >
              <button className="bg-white hover:bg-[whitesmoke]/90 text-[#1F514C] font-semibold py-2.5 px-6 rounded-2xl text-sm transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5">
                Log In
              </button>
              <button className="bg-transparent border-[1.5px] border-white hover:bg-white text-white hover:text-[#1F514C] font-semibold py-2.5 px-6 rounded-2xl text-sm transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5">
                Sign Up
              </button>
            </div>
          </div>

          <div
            className={clsx(
              [isMain ? 'hidden' : 'md:hidden flex'],
              'items-center'
            )}
          >
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
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
        </div>
      </div>

      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          menuOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 bg-white border-t border-gray-200">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === item.href
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
