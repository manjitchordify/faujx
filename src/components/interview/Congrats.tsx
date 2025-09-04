'use client';
import React from 'react';
import { CheckCircle } from 'lucide-react';

const Congrats = () => {
  const handleLogin = () => {
    // Handle login logic here
    console.log('Login clicked');
  };

  return (
    <div className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Green Header Section */}
          <div className="bg-green-50 p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                  Congratulations!
                </h1>
                <p className="text-gray-700 leading-relaxed">
                  Hi! You&apos;ve
                  <span className="text-green-600 font-medium">
                    successfully
                  </span>
                  cleared our interview process. Log in and create your profile
                  with Faujx to get started.
                </p>
              </div>
            </div>
          </div>

          {/* White Content Section */}
          <div className="p-8">
            {/* Login Button */}
            <div className="text-center mb-6">
              <button
                onClick={handleLogin}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 outline-none"
              >
                Login
              </button>
            </div>

            {/* Terms and Privacy Notice */}
            <p className="text-sm text-gray-500 text-center leading-relaxed">
              By continuing, you agree to Faujx&apos;s Terms of Service and
              Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Congrats;
