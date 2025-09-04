'use client';

import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { signupApi } from '@/services/authService';
import { showToast } from '@/utils/toast/Toast';
import { Eye, EyeOff, Search, ChevronDown } from 'lucide-react';
import { countries } from '@/data/countries';

interface SignupData {
  fullName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  companyWebsite: string;
}

interface ValidationErrors {
  login: {
    email?: string;
    password?: string;
  };
  signup: {
    fullName?: string;
    email?: string;
    countryCode?: string;
    phoneNumber?: string;
    password?: string;
    confirmPassword?: string;
    companyName?: string;
    companyWebsite?: string;
  };
}

export default function SignUpPage() {
  const router = useRouter();
  const pathname = usePathname();
  const role = pathname?.startsWith('/engineer')
    ? 'engineer'
    : pathname?.startsWith('/customer')
      ? 'customer'
      : 'expert';

  const roleRoutes: Record<string, string> = {
    customer: '/',
    engineer: '/engineer/login',
    expert: '/',
  };

  const [signupData, setSignupData] = useState<SignupData>({
    fullName: '',
    email: '',
    countryCode: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    companyWebsite: '',
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [showCountryDropdown, setShowCountryDropdown] =
    useState<boolean>(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState<string>('');
  const [errors, setErrors] = useState<ValidationErrors>({
    login: {},
    signup: {},
  });

  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Filter countries based on search term
  const filteredCountries = countries.filter(
    country =>
      country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
      country.dialCode.includes(countrySearchTerm) ||
      country.code.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCountryDropdown(false);
        setCountrySearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateFullName = (name: string): boolean => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name) && name.trim().length > 0;
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validateWebsite = (website: string): boolean => {
    const websiteRegex =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return websiteRegex.test(website);
  };

  const validatePhoneNumber = (phone: string, countryCode: string): boolean => {
    if (!countryCode) return false;

    const country = countries.find(c => c.code === countryCode);
    if (!country) return false;

    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    return country.pattern.test(cleanPhone);
  };

  const validateSignup = (): boolean => {
    const newErrors: ValidationErrors['signup'] = {};

    if (!signupData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (!validateFullName(signupData.fullName)) {
      newErrors.fullName = 'Full name should only contain letters and spaces';
    }

    if (!signupData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(signupData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!signupData.countryCode) {
      newErrors.countryCode = 'Please select a country';
    }

    if (!signupData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (
      !validatePhoneNumber(signupData.phoneNumber, signupData.countryCode)
    ) {
      const country = countries.find(c => c.code === signupData.countryCode);
      newErrors.phoneNumber = `Please enter a valid ${country?.name} phone number`;
    }

    if (!signupData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(signupData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!signupData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (role === 'customer') {
      if (!signupData.companyName.trim()) {
        newErrors.companyName = 'Company name is required';
      }

      if (!signupData.companyWebsite.trim()) {
        newErrors.companyWebsite = 'Company website is required';
      } else if (!validateWebsite(signupData.companyWebsite)) {
        newErrors.companyWebsite = 'Please enter a valid website URL';
      }
    }

    setErrors(prev => ({ ...prev, signup: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSignupChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let processedValue = value;

    // Handle different input types with specific filtering
    if (name === 'fullName') {
      // Only allow letters and spaces for full name
      processedValue = value.replace(/[^a-zA-Z\s]/g, '');
    } else if (name === 'phoneNumber') {
      // Only allow digits for phone number
      processedValue = value.replace(/\D/g, '');
    } else {
      // For other fields, use the original value
      processedValue = value;
    }

    setSignupData(prev => ({
      ...prev,
      [name]: processedValue,
    }));

    // Clear specific error when user starts typing
    if (errors.signup[name as keyof ValidationErrors['signup']]) {
      setErrors(prev => ({
        ...prev,
        signup: { ...prev.signup, [name]: undefined },
      }));
    }
  };

  const handleCountrySelect = (countryCode: string) => {
    setSignupData(prev => ({
      ...prev,
      countryCode,
      phoneNumber: '', // Reset phone number when country changes
    }));

    setShowCountryDropdown(false);
    setCountrySearchTerm('');

    // Clear country and phone errors
    setErrors(prev => ({
      ...prev,
      signup: {
        ...prev.signup,
        countryCode: undefined,
        phoneNumber: undefined,
      },
    }));
  };

  const handleLoginRedirect = async () => {
    try {
      router.push(`/${role}/login`);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSignup = async () => {
    if (!validateSignup()) {
      return;
    }
    setIsLoading(true);

    const [firstName, ...lastNameParts] = signupData.fullName
      .trim()
      .split(/\s+/);
    const lastName = lastNameParts.join(' ');

    // Get selected country to combine dial code with phone number
    const selectedCountry = countries.find(
      c => c.code === signupData.countryCode
    );
    const fullPhoneNumber = selectedCountry
      ? `${selectedCountry.dialCode}${signupData.phoneNumber}`
      : signupData.phoneNumber;

    try {
      const response = await signupApi({
        firstName,
        lastName,
        email: signupData.email,
        phone: fullPhoneNumber,
        countryCode: signupData.countryCode,
        password: signupData.password,
        userType: pathname?.startsWith('/engineer') ? 'candidate' : role,
        ...(role === 'customer' && {
          companyName: signupData.companyName,
          companyWebsite: signupData.companyWebsite,
        }),
      });
      if (response?.user) {
        showToast('Your account has been created successfully.', 'success');
        if (roleRoutes[role]) {
          router.push(roleRoutes[role]);
        }
      }
    } catch (error: unknown) {
      const message = (error as Error)?.message || 'An error occurred';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCountry = countries.find(
    c => c.code === signupData.countryCode
  );

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Welcome/Sign In (Top on mobile) */}
      <div className="flex-1 bg-[#1F514C] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative order-1 lg:order-1">
        <div className="w-full max-w-sm lg:max-w-md">
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-3 lg:mb-4">
              Welcome
            </h1>
            <p className="text-white text-base sm:text-lg font-light px-2 sm:px-0">
              Sign in to manage your hires and track interviews.
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleLoginRedirect}
              className="cursor-pointer bg-transparent hover:bg-white/5 disabled:bg-white/5 text-white py-3 lg:py-2 px-6 sm:px-8 rounded-xl font-normal transition-all border border-white hover:border-white/50 flex items-center justify-center gap-3 text-base sm:text-lg w-full sm:w-auto"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up (Bottom on mobile) */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 order-2 lg:order-2 bg-[#f6f6f6]">
        <div className="w-full max-w-sm lg:max-w-md">
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-2xl sm:text-3xl font-normal text-gray-900 mb-6 lg:mb-8">
              Create Account
            </h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={signupData.fullName}
                onChange={handleSignupChange}
                className={`w-full px-3 sm:px-4 py-3 sm:py-4 rounded-xl border ${
                  errors.signup.fullName ? 'border-red-500' : 'border-[#E6E6E6]'
                } text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all text-sm sm:text-base`}
              />
              {errors.signup.fullName && (
                <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1">
                  {errors.signup.fullName}
                </p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={signupData.email}
                onChange={handleSignupChange}
                className={`w-full px-3 sm:px-4 py-3 sm:py-4 rounded-xl border ${
                  errors.signup.email ? 'border-red-500' : 'border-[#E6E6E6]'
                } text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all text-sm sm:text-base`}
              />
              {errors.signup.email && (
                <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1">
                  {errors.signup.email}
                </p>
              )}
            </div>

            {/* Country Code Selection with Search */}
            <div className="relative" ref={countryDropdownRef}>
              <div
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className={`w-full px-3 sm:px-4 py-3 sm:py-4 rounded-xl border ${
                  errors.signup.countryCode
                    ? 'border-red-500'
                    : 'border-[#E6E6E6]'
                } text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all text-sm sm:text-base cursor-pointer flex items-center justify-between`}
              >
                <span
                  className={
                    selectedCountry ? 'text-gray-900' : 'text-gray-400'
                  }
                >
                  {selectedCountry
                    ? `${selectedCountry.flag} ${selectedCountry.name} (${selectedCountry.dialCode})`
                    : 'Select Country'}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`}
                />
              </div>

              {/* Dropdown */}
              {showCountryDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E6E6E6] rounded-xl shadow-lg z-50 max-h-64 flex flex-col">
                  {/* Search Input */}
                  <div className="p-3 border-b border-[#E6E6E6]">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search countries..."
                        value={countrySearchTerm}
                        onChange={e => setCountrySearchTerm(e.target.value)}
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 pl-10 rounded-xl border border-[#E6E6E6] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all text-sm sm:text-base"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Countries List */}
                  <div className="overflow-y-auto">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map(country => (
                        <div
                          key={country.code}
                          onClick={() => handleCountrySelect(country.code)}
                          className="px-3 sm:px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm sm:text-base text-gray-900 border-b border-gray-100 last:border-b-0"
                        >
                          {country.flag} {country.name} ({country.dialCode})
                        </div>
                      ))
                    ) : (
                      <div className="px-3 sm:px-4 py-3 text-gray-400 text-sm sm:text-base">
                        No countries found
                      </div>
                    )}
                  </div>
                </div>
              )}

              {errors.signup.countryCode && (
                <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1">
                  {errors.signup.countryCode}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <div className="flex">
                {selectedCountry && (
                  <div className="flex items-center px-3 sm:px-4 py-3 sm:py-4 rounded-l-xl border border-r-0 border-[#E6E6E6] bg-gray-50 text-gray-700 text-sm sm:text-base">
                    <span className="mr-2">{selectedCountry.flag}</span>
                    {selectedCountry.dialCode}
                  </div>
                )}
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder={
                    selectedCountry ? 'Phone Number' : 'Select country first'
                  }
                  value={signupData.phoneNumber}
                  onChange={handleSignupChange}
                  disabled={!signupData.countryCode}
                  className={`w-full px-3 sm:px-4 py-3 sm:py-4 ${
                    selectedCountry ? 'rounded-r-xl' : 'rounded-xl'
                  } border ${
                    errors.signup.phoneNumber
                      ? 'border-red-500'
                      : 'border-[#E6E6E6]'
                  } text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all text-sm sm:text-base ${
                    !signupData.countryCode
                      ? 'bg-gray-100 cursor-not-allowed'
                      : ''
                  }`}
                />
              </div>
              {errors.signup.phoneNumber && (
                <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1">
                  {errors.signup.phoneNumber}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  className={`w-full px-3 sm:px-4 py-3 sm:py-4 pr-12 rounded-xl border ${
                    errors.signup.password
                      ? 'border-red-500'
                      : 'border-[#E6E6E6]'
                  } text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all text-sm sm:text-base`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.signup.password && (
                <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1">
                  {errors.signup.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  className={`w-full px-3 sm:px-4 py-3 sm:py-4 pr-12 rounded-xl border ${
                    errors.signup.confirmPassword
                      ? 'border-red-500'
                      : 'border-[#E6E6E6]'
                  } text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all text-sm sm:text-base`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.signup.confirmPassword && (
                <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1">
                  {errors.signup.confirmPassword}
                </p>
              )}
            </div>

            {role === 'customer' && (
              <>
                <div>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Company Name"
                    value={signupData.companyName}
                    onChange={handleSignupChange}
                    className={`w-full px-3 sm:px-4 py-3 sm:py-4 rounded-xl border ${
                      errors.signup.companyName
                        ? 'border-red-500'
                        : 'border-[#E6E6E6]'
                    } text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all text-sm sm:text-base`}
                  />
                  {errors.signup.companyName && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1">
                      {errors.signup.companyName}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="url"
                    name="companyWebsite"
                    placeholder="Company Website"
                    value={signupData.companyWebsite}
                    onChange={handleSignupChange}
                    className={`w-full px-3 sm:px-4 py-3 sm:py-4 rounded-xl border ${
                      errors.signup.companyWebsite
                        ? 'border-red-500'
                        : 'border-[#E6E6E6]'
                    } text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all text-sm sm:text-base`}
                  />
                  {errors.signup.companyWebsite && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1">
                      {errors.signup.companyWebsite}
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="pt-3 sm:pt-4 flex justify-center">
              <button
                onClick={handleSignup}
                disabled={isLoading}
                className="disabled:cursor-not-allowed cursor-pointer bg-[#1F514C] disabled:bg-[#658481] text-white py-3 lg:py-2 px-6 sm:px-8 rounded-xl font-normal transition-all flex items-center justify-center gap-3 text-base sm:text-lg w-full sm:w-auto"
              >
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
