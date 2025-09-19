'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FiX,
  FiHome,
  FiUsers,
  FiUser,
  FiBookOpen,
  FiCheckCircle,
  FiDollarSign,
  FiMonitor,
  FiCalendar,
  FiMessageSquare,
  FiBarChart2,
  FiShoppingBag,
} from 'react-icons/fi';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
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

// Helper function to check if a path is active
const isLinkActive = (linkPath: string, currentPath: string): boolean => {
  // Exact match
  if (currentPath === linkPath) {
    return true;
  }

  // For interview management, check if we're on any interview-related page
  if (linkPath === '/panelist/interviews') {
    return currentPath.startsWith('/panelist/interviews');
  }

  // For expert interview management
  if (linkPath === '/panelist/expert-interviews') {
    return currentPath.startsWith('/panelist/expert-interviews');
  }

  // For admin interview management
  if (linkPath === '/admin/interviews') {
    return currentPath.startsWith('/admin/interviews');
  }

  // For other admin pages, you might want similar logic
  if (linkPath.startsWith('/admin/')) {
    const basePath = linkPath.replace('/admin/', '');
    return currentPath.startsWith(`/admin/${basePath}`);
  }

  return false;
};

// Admin navigation links
const adminLinks = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: FiHome },
  { name: 'Manage Users', href: '/admin/users', icon: FiUsers },
  { name: 'Panelist Management', href: '/admin/panelists', icon: FiUser },
  { name: 'Engineer Management', href: '/admin/engineer', icon: FiCheckCircle },
  {
    name: 'Customer Management',
    href: '/admin/customer',
    icon: FiShoppingBag,
  },
  {
    name: 'Expert Management',
    href: '/admin/expert',
    icon: FiBookOpen,
  },
  {
    name: 'Subscription & Revenue',
    href: '/admin/revenue',
    icon: FiDollarSign,
  },
  { name: 'LMS Monitoring', href: '/admin/lms', icon: FiMonitor },
  {
    name: 'Interview & Scheduling',
    href: '/admin/interviews',
    icon: FiCalendar,
  },
  {
    name: 'Communication Logs',
    href: '/admin/communications',
    icon: FiMessageSquare,
  },
  { name: 'Reports & Insights', href: '/admin/reports', icon: FiBarChart2 },
];

// Interview Panel navigation links
const interviewPanelLinks = [
  { name: 'Dashboard', href: '/panelist/dashboard', icon: FiHome },
  {
    name: 'Manage Engineer Interviews',
    href: '/panelist/interviews',
    icon: FiCalendar,
  },
  {
    name: 'Manage Expert Interviews',
    href: '/panelist/expert-interviews',
    icon: FiCheckCircle,
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [userType, setUserType] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const userTypeFromCookie = getCookie('userType');
    setUserType(userTypeFromCookie);
  }, []);

  // Determine which links to show based on user type
  const getNavigationLinks = () => {
    if (userType === 'admin') {
      return adminLinks;
    } else if (userType === 'interview_panel') {
      return interviewPanelLinks;
    }
    return [];
  };

  const navigationLinks = getNavigationLinks();

  // Loading state
  if (!isClient) {
    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
        <aside
          className={`
            w-64 h-screen flex flex-col
            fixed left-0 top-0 z-50 transform transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 lg:z-40
          `}
          style={{ backgroundColor: '#1F514C' }}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <h1 className="text-xl font-bold text-white">FaujX</h1>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-white/70">Loading...</div>
          </div>
        </aside>
      </>
    );
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-64 h-screen text-white flex flex-col
          fixed left-0 top-0 z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:z-40
        `}
        style={{ backgroundColor: '#1F514C' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <h1 className="text-xl font-bold text-white">FaujX</h1>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <nav className="space-y-2">
            {navigationLinks.map(link => {
              // Updated active link detection logic
              const isActive = isLinkActive(link.href, pathname);
              const IconComponent = link.icon;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={onClose}
                  title={link.name}
                  className={`
                    flex items-center gap-4 px-4 py-3.5 mx-1 rounded-xl transition-all duration-200 group relative
                    ${
                      isActive
                        ? 'bg-white/15 text-white font-medium shadow-sm backdrop-blur-sm border border-white/20'
                        : 'text-white/90 hover:bg-white/8 hover:text-white'
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                  )}
                  <IconComponent
                    className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
                      isActive
                        ? 'text-white'
                        : 'text-white/75 group-hover:text-white'
                    }`}
                  />
                  <span className="truncate text-sm font-medium">
                    {link.name}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
