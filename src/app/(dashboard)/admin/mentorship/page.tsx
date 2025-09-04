'use client';

import React from 'react';

function Page() {
  return (
    <div
      className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center"
      style={{ minHeight: 'calc(100vh - 120px)' }}
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
          <span className="text-2xl text-white font-bold">👨‍🏫</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">Coming Soon</h1>

        <p className="text-lg text-gray-600 mb-2">Mentorship Management</p>

        <p className="text-sm text-gray-500">
          This feature is currently under development.
        </p>
      </div>
    </div>
  );
}

export default Page;
