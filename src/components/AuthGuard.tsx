'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/store';
import { showToast } from '@/utils/toast/Toast';

const roleDashboards = {
  candidate: '/engineer/dashboard',
  customer: '/customer/browse-engineers',
  Panelist: '/panelist/dashboard',
  interview_panel: '/panelist/dashboard',
  Admin: '/admin/dashboard',
  expert: '/expert/dashboard',
};

const roleRoutePermissions = {
  candidate: ['/engineer'],
  customer: ['/customer'],
  Panelist: ['/panelist'],
  interview_panel: ['/panelist'],
  admin: ['/admin', '/customer', '/engineer', '/panelist', '/expert'],
  expert: ['/expert'],
};

const publicPaths: (string | RegExp)[] = [
  '/',
  '/login',
  '/register',
  '/privacypolicy',
  '/termsandcondition',
  '/roadmap/frontend',
  '/roadmap/backend',
  '/platform/roadmap',
  '/platform/roadmapcopy',
  '/customer/login',
  '/engineer/login',
  '/candidate/login',
  '/expert/login',
  '/customer/signup',
  '/engineer/signup',
  '/expert/signup',
  '/expert',
  '/customer',
  '/engineer',
  '/engineer/book-mentor',
  '/engineer/blog',
  '/engineer/testimonials',
  '/engineer/faq',
  '/expert/about',
  '/expert/pricing',
  '/expert/faq',
  '/customer/browse-engineers/dashboard',
  '/customer/browse-engineers',
  '/admin/login',
  /^\/vetting-report\/candidate\/[a-zA-Z0-9-]+$/,
];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const loggedInUser = useAppSelector(state => state.user.loggedInUser);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAccess = () => {
      function isPublicPath(pathname: string): boolean {
        return publicPaths.some(p =>
          typeof p === 'string' ? p === pathname : p.test(pathname)
        );
      }

      // Usage
      if (
        isPublicPath(pathname) ||
        pathname.startsWith('/api/') ||
        pathname.startsWith('/_next/')
      ) {
        setIsChecking(false);
        return;
      }

      // Check if user is authenticated
      if (!loggedInUser || !loggedInUser.accessToken) {
        // Not logged in - redirect to appropriate login page
        const isOnLoginPage = pathname.includes('/login');

        if (!isOnLoginPage) {
          let role = 'engineer'; // default

          try {
            const storedRole = localStorage.getItem('userRole');
            if (storedRole) {
              role = storedRole === 'candidate' ? 'engineer' : storedRole;
            } else {
              // Determine role from current path
              if (pathname.startsWith('/customer')) role = 'customer';
              else if (pathname.startsWith('/expert')) role = 'expert';
              else if (pathname.startsWith('/panelist')) role = 'expert';
              else if (pathname.startsWith('/admin')) role = 'admin';
            }
          } catch (error) {
            console.error('Error reading localStorage:', error);
          }

          router.push(`/${role}/login`);
          return;
        }
      } else {
        // User is authenticated - check role permissions using Redux data
        const userType = loggedInUser.userType;
        const allowedRoutes =
          roleRoutePermissions[userType as keyof typeof roleRoutePermissions] ||
          [];
        const isRouteAllowed = allowedRoutes.some(route =>
          pathname.startsWith(route)
        );

        if (!isRouteAllowed) {
          showToast(
            "Access denied! You don't have permission to access this page.",
            'error'
          );
          const userDashboard =
            roleDashboards[userType as keyof typeof roleDashboards] ||
            '/engineer/dashboard';
          setTimeout(() => router.push(userDashboard), 1000);
          return;
        }
      }

      setIsChecking(false);
    };

    // Small delay to allow Redux hydration
    const timer = setTimeout(checkAccess, 100);
    return () => clearTimeout(timer);
  }, [loggedInUser, router, pathname]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-b-transparent border-[#1F514C] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
