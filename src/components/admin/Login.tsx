'use client';
import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { loginApi } from '@/services/authService';

interface Credentials {
  email: string;
  password: string;
}

// Define error interface for better type safety
interface ApiError {
  message?: string;
  error?: string;
  statusText?: string;
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

const Login: React.FC = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState<Credentials>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    // Real-time validation feedback
    let fieldError = '';

    if (name === 'email' && value.trim()) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value.trim().toLowerCase())) {
        fieldError = 'Invalid email format';
      }
    }

    if (name === 'password' && value.trim()) {
      if (value.length < 6) {
        fieldError = 'Password must be at least 6 characters';
      }
    }

    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear or set error based on validation
    if (fieldError) {
      setError(fieldError);
    } else if (error) {
      setError('');
    }
  };

  const validateLogin = (): boolean => {
    // Clear any existing errors
    setError('');

    // Check if fields are empty
    if (!credentials.email?.trim()) {
      setError('Email address is required');
      return false;
    }

    if (!credentials.password?.trim()) {
      setError('Password is required');
      return false;
    }

    // Comprehensive email validation
    const email = credentials.email.trim().toLowerCase();

    // Check basic format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Check for common email issues
    if (email.length > 254) {
      setError('Email address is too long');
      return false;
    }

    if (email.startsWith('.') || email.endsWith('.')) {
      setError('Email address cannot start or end with a period');
      return false;
    }

    if (email.includes('..')) {
      setError('Email address cannot contain consecutive periods');
      return false;
    }

    // Password validation
    if (credentials.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (credentials.password.length > 128) {
      setError('Password is too long (maximum 128 characters)');
      return false;
    }

    // Check for common weak passwords
    const commonWeakPasswords = [
      '123456',
      'password',
      '123456789',
      'qwerty',
      'abc123',
    ];
    if (commonWeakPasswords.includes(credentials.password.toLowerCase())) {
      setError('Please choose a stronger password');
      return false;
    }

    return true;
  };

  const handleLogin = async (): Promise<void> => {
    if (!validateLogin()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await loginApi({
        email: credentials.email.trim(),
        password: credentials.password,
      });

      if (response?.data?.user && response?.data?.accessToken) {
        console.log('Login successful:', response.data.user);

        // Wait a moment for cookies to be set by the API response
        setTimeout(() => {
          const userType = getCookie('userType');
          console.log('UserType from cookie:', userType);

          if (userType === 'admin') {
            router.push('/admin/dashboard');
          } else if (userType === 'interview_panel') {
            router.push('/panelist/dashboard');
          } else {
            setError(
              'Access denied. You do not have permission to access this system.'
            );
            setIsLoading(false);
            return;
          }
        }, 100);
      } else {
        setError('Invalid response from server');
        setIsLoading(false);
      }
    } catch (error: unknown) {
      // Properly type the error handling
      let errorMessage = 'Login failed. Please try again.';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        const apiError = error as ApiError;
        errorMessage =
          apiError.message ||
          apiError.error ||
          apiError.statusText ||
          errorMessage;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    await handleLogin();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <>
      <style jsx>{`
        .custom-primary {
          background-color: #1f514c;
        }
        .custom-primary:hover:not(:disabled) {
          background-color: #1a4540;
        }
        .custom-primary:active:not(:disabled) {
          background-color: #163a36;
        }
        .custom-focus:focus {
          --tw-ring-color: #1f514c;
          border-color: #1f514c;
        }
        .error-field {
          border-color: #ef4444;
          --tw-ring-color: #ef4444;
        }
        .success-field {
          border-color: #10b981;
          --tw-ring-color: #10b981;
        }
      `}</style>
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 custom-primary rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to FaujX
            </div>
            <div className="text-gray-600">Admin/Panelist Login</div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className={`text-gray-700 custom-focus block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 ${
                    error && error.toLowerCase().includes('email')
                      ? 'error-field'
                      : credentials.email.trim() && !error
                        ? 'success-field border-gray-300'
                        : 'border-gray-300'
                  }`}
                  placeholder="example@company.com"
                  autoComplete="email"
                  spellCheck="false"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className={`text-gray-700 custom-focus block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 ${
                    error && error.toLowerCase().includes('password')
                      ? 'error-field'
                      : credentials.password.trim() && !error
                        ? 'success-field border-gray-300'
                        : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  minLength={6}
                  maxLength={128}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-red-200 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                </div>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !!error}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition duration-200 custom-primary ${
                isLoading || error ? 'cursor-not-allowed opacity-70' : ''
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <div className="text-xs text-gray-500">
              © 2025 FaujX. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
