'use client';

import React, { useState, ChangeEvent, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { loginApi } from '@/services/authService';
import { showToast } from '@/utils/toast/Toast';
import { clearAuthCookies } from '@/services/authService';

interface LoginData {
  email: string;
  password: string;
}

interface ValidationErrors {
  login: {
    email?: string;
    password?: string;
  };
}

export default function SignInPage() {
  const router = useRouter();
  const pathname = usePathname();

  const role = pathname?.startsWith('/engineer')
    ? 'engineer'
    : pathname?.startsWith('/customer')
      ? 'customer'
      : 'expert';

  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({
    login: {},
  });

  // Store the role in localStorage when component mounts
  useEffect(() => {
    try {
      const storageRole = role === 'engineer' ? 'candidate' : role;
      localStorage.setItem('userRole', storageRole);
    } catch (error) {
      console.error('Error storing role in localStorage:', error);
    }
  }, [role]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateLogin = (): boolean => {
    const newErrors: ValidationErrors['login'] = {};

    if (!loginData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(loginData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!loginData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(prev => ({ ...prev, login: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });

    if (errors.login[e.target.name as keyof ValidationErrors['login']]) {
      setErrors(prev => ({
        ...prev,
        login: { ...prev.login, [e.target.name]: undefined },
      }));
    }
  };

  const handleLogin = async () => {
    if (!validateLogin()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginApi({
        email: loginData.email,
        password: loginData.password,
      });

      if (response?.data?.user && response?.data?.accessToken) {
        const userType = response.data.user.userType;
        const phase1Completed = response.data.phase1Completed;

        // Validate userType matches current route
        const routeUserTypeMapping: Record<string, string[]> = {
          engineer: ['candidate'],
          customer: ['customer'],
          expert: ['expert', 'Panelist', 'interview_panel', 'Admin'],
        };

        const allowedUserTypes = routeUserTypeMapping[role] || [];

        if (!allowedUserTypes.includes(userType)) {
          // Clear auth cookies and show error
          clearAuthCookies();
          showToast(
            `Invalid user type. This login page is for ${role}s only.`,
            'error'
          );
          setIsLoading(false);
          return;
        }

        const roleDashboards: Record<string, string> = {
          candidate: '/engineer/dashboard',
          customer: '/customer/browse-engineers',
          Panelist: '/panelist/dashboard',
          interview_panel: '/panelist/dashboard',
          Admin: '/admin/dashboard',
          expert: '/expert/dashboard',
        };

        const dashboard = roleDashboards[userType] || '/engineer/dashboard';

        // Store updated role in localStorage
        try {
          localStorage.setItem(
            'userRole',
            userType === 'candidate' ? 'candidate' : userType
          );
        } catch (error) {
          console.error('Error updating role in localStorage:', error);
        }

        showToast('Logged in successfully!', 'success');

        // Navigate to appropriate route based on user completion status
        setTimeout(() => {
          if (userType === 'candidate' && !phase1Completed) {
            router.push('/engineer/knowbetter');
          } else {
            router.push(dashboard);
          }
        }, 500);
      } else {
        throw new Error(
          'Invalid response from server - missing user data or token'
        );
      }
    } catch (error: unknown) {
      const message =
        (error as Error)?.message || 'Login failed. Please try again.';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupRedirect = () => {
    router.push(`/${role}/signup`);
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row">
      <div className="flex-1 bg-[#1F514C] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative order-1 lg:order-1">
        <div className="w-full max-w-sm lg:max-w-md">
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-3 lg:mb-4">
              Welcome
            </h1>
            <p className="text-white text-base sm:text-lg font-normal px-2 sm:px-0">
              Log in to manage your account and access your dashboard.
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSignupRedirect}
              disabled={isLoading}
              className="cursor-pointer bg-transparent hover:bg-white/5 disabled:bg-white/5 text-white py-3 lg:py-2 px-6 sm:px-8 rounded-xl font-normal transition-all border border-white hover:border-white/50 flex items-center justify-center gap-3 text-base sm:text-lg w-full sm:w-auto"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 order-2 lg:order-2 bg-[#f6f6f6]">
        <div className="w-full max-w-sm lg:max-w-md">
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-2xl sm:text-3xl font-normal text-gray-900 mb-6 lg:mb-8">
              Login to your account
            </h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={loginData.email}
                onChange={handleLoginChange}
                className={`w-full px-3 sm:px-4 py-3 sm:py-4 rounded-xl border ${
                  errors.login.email ? 'border-red-500' : 'border-[#E6E6E6]'
                } text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all text-sm sm:text-base`}
                disabled={isLoading}
              />
              {errors.login.email && (
                <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1">
                  {errors.login.email}
                </p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginChange}
                onKeyPress={e =>
                  e.key === 'Enter' && !isLoading && handleLogin()
                }
                className={`w-full px-3 sm:px-4 py-3 sm:py-4 rounded-xl border ${
                  errors.login.password ? 'border-red-500' : 'border-[#E6E6E6]'
                } text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all text-sm sm:text-base`}
                disabled={isLoading}
              />
              {errors.login.password && (
                <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1">
                  {errors.login.password}
                </p>
              )}
            </div>

            <div className="pt-3 sm:pt-4 flex justify-center">
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="disabled:cursor-not-allowed cursor-pointer bg-[#1F514C] hover:bg-[#1a453f] disabled:bg-[#658481] text-white py-3 lg:py-2 px-6 sm:px-8 rounded-xl font-normal transition-all flex items-center justify-center gap-3 text-base sm:text-lg w-full sm:w-auto"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
