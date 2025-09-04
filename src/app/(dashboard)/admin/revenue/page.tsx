'use client';

import React from 'react';

function Page() {
  return (
    <div
      className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center"
      style={{ minHeight: 'calc(100vh - 120px)' }}
    >
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-8 mx-auto shadow-lg">
          <span className="text-3xl text-white font-bold">$</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">Coming Soon</h1>

        <p className="text-lg text-gray-600 mb-2">
          Subscription & Revenue Management
        </p>

        <p className="text-sm text-gray-500">
          This feature is currently under development.
        </p>
      </div>
    </div>
  );
}

export default Page;
