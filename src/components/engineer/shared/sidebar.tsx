'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  LayoutDashboard,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X,
  UserRound,
} from 'lucide-react';
import { useAppSelector } from '@/store/store';
import { clearAuthCookies } from '@/services/authService';

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const MOBILE_BREAKPOINT = 768;

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () =>
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return isMobile;
};

const useOutsideClick = (isOpen: boolean, onClose: () => void) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const menuButton = document.getElementById('mobile-menu-button');

      if (
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);
};

const useDropdownState = () => {
  const [dropdownStates, setDropdownStates] = useState({
    skill: false,
    rating: false,
    experience: false,
  });

  const [selections, setSelections] = useState({
    skill: 'All Skills',
    rating: 'All Ratings',
    experience: 'All Experience',
  });

  const closeAllDropdowns = useCallback(() => {
    setDropdownStates({ skill: false, rating: false, experience: false });
  }, []);

  const toggleDropdown = useCallback((type: keyof typeof dropdownStates) => {
    setDropdownStates(prev => ({
      skill: false,
      rating: false,
      experience: false,
      [type]: !prev[type],
    }));
  }, []);

  const handleSelection = useCallback(
    (type: keyof typeof selections, value: string) => {
      setSelections(prev => ({ ...prev, [type]: value }));
      closeAllDropdowns();
      console.log(`Selected ${type}:`, value);
    },
    [closeAllDropdowns]
  );

  return {
    dropdownStates,
    selections,
    closeAllDropdowns,
    toggleDropdown,
    handleSelection,
  };
};

const Sidebar: React.FC<SidebarProps> = ({ activeItem = 'dashboard' }) => {
  const router = useRouter();
  const { loggedInUser } = useAppSelector(state => state.user);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { closeAllDropdowns } = useDropdownState();

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const toggleMobileMenu = useCallback(
    () => setIsMobileMenuOpen(prev => !prev),
    []
  );

  useOutsideClick(isMobileMenuOpen && isMobile, closeMobileMenu);

  //   const isUserVetted = useMemo(
  //   () => !!loggedInUser?.profileSetup,
  //   [loggedInUser?.profileSetup]
  // );
  const isUserVetted = useMemo(
    () =>
      loggedInUser?.profileSetup ||
      (loggedInUser?.isPreliminaryVideoCompleted &&
        loggedInUser?.profilePic &&
        loggedInUser?.profileVideo),
    [
      loggedInUser?.profileSetup,
      loggedInUser?.isPreliminaryVideoCompleted,
      loggedInUser?.profilePic,
      loggedInUser?.profileVideo,
    ]
  );

  const menuItems = useMemo(
    () => [
      {
        id: 'dashboard',
        label: isUserVetted ? 'Dashboard' : 'Vetting status',
        icon: LayoutDashboard,
        route: '/engineer/dashboard',
        active: true,
      },
      {
        id: 'interviews',
        label: 'My Interviews',
        icon: ClipboardList,
        route: '/engineer/my-interviews',
        active: false,
        hideOnBrowseMentors: !isUserVetted,
      },
      {
        id: 'Profile',
        label: 'Profile',
        icon: UserRound,
        route: '/engineer/dashboard/profile',
        active: false,
        hideOnBrowseMentors: !isUserVetted,
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        route: '/engineer/dashboard/settings',
        active: false,
        hideOnBrowseMentors: !isUserVetted,
      },
    ],
    [isUserVetted]
  );

  const visibleMenuItems = useMemo(
    () => menuItems.filter(item => !item.hideOnBrowseMentors),
    [menuItems]
  );

  const handleItemClick = useCallback(
    (itemId: string, route: string) => {
      closeAllDropdowns();
      if (isMobile) closeMobileMenu();
      router.push(route);
    },
    [closeAllDropdowns, isMobile, closeMobileMenu, router]
  );

  const handleLogout = useCallback(() => {
    clearAuthCookies();
    document.cookie.split(';').forEach(cookie => {
      document.cookie = cookie
        .replace(/^ +/, '') // trim spaces
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
    closeAllDropdowns();
    if (isMobile) closeMobileMenu();
    router.push('/');
  }, [closeAllDropdowns, isMobile, closeMobileMenu, router]);

  const sidebarBaseClasses = `fixed left-0 top-0 bottom-0 w-64 sm:w-72 lg:w-80 bg-white flex flex-col shadow-lg border-r border-gray-100 z-50 overflow-y-auto transition-transform duration-300 ease-in-out`;
  const sidebarVisibilityClasses = isMobile
    ? isMobileMenuOpen
      ? 'translate-x-0'
      : '-translate-x-full'
    : 'translate-x-0 md:z-40';

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        id="mobile-menu-button"
        onClick={toggleMobileMenu}
        className="text-gray-600 md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`${sidebarBaseClasses} ${sidebarVisibilityClasses}`}
      >
        {/* Mobile Close Button */}
        {isMobile && (
          <div className="flex justify-end p-4 md:hidden">
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close menu"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        )}

        {/* User Profile Section */}
        <div
          className={`p-6 border-b border-gray-100 ${isMobile ? 'pt-2' : ''}`}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <User size={24} className="text-gray-600" />
            </div>
            <h3 className="font-medium text-gray-900 text-sm sm:text-base">
              {loggedInUser?.firstName}
            </h3>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2 sm:space-y-4">
            {visibleMenuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <React.Fragment key={item.id}>
                  <li>
                    <button
                      onClick={() => handleItemClick(item.id, item.route)}
                      className={`cursor-pointer border-1 w-full flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-left transition-all duration-200 text-sm sm:text-base ${
                        isActive
                          ? 'bg-[#1F514C] text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
                      <span className="font-medium truncate">{item.label}</span>
                    </button>
                  </li>
                </React.Fragment>
              );
            })}
          </ul>
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-all duration-200 text-sm sm:text-base"
          >
            <span className="font-medium">Logout</span>
            <LogOut size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
          </button>
        </div>
      </div>

      {/* Desktop Spacer */}
      <div className="hidden md:block w-64 sm:w-72 lg:w-80 flex-shrink-0" />
    </>
  );
};

export default Sidebar;
