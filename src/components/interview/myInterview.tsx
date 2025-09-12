import React from 'react';

const MyInterview = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8 pt-12">
        <div className="text-center">
          <h1 className="text-3xl text-black mb-8">My Interviews</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Interview Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* Company Logo and Info */}
            <div className="flex items-start space-x-4 mb-4">
              {/* Logo */}
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>

              {/* Company Name */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-[#2563EB] hover:text-blue-700 cursor-pointer">
                  Swiggy
                </h3>
              </div>
            </div>

            {/* Company Description */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 leading-relaxed">
                Swiggy Limited is an Indian online food ordering and delivery
                platform. Founded in 2014, Swiggy is headquartered in Bengaluru
                and operates in more than 580 Indian cities, as of July 2023.
              </p>
            </div>

            {/* Action Button */}
            <button className="w-full bg-[#54A044] hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              View Interview Details
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyInterview;
