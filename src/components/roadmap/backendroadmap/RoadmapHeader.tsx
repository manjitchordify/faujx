import React from 'react';

const RoadmapHeader = () => {
  return (
    <div className="absolute top-20 left-4 z-50">
      {' '}
      {/* Changed from top-4 to top-20 to account for main header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Backend Developer Roadmap 2025
      </h1>
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-200 border-2 border-blue-600 rounded"></div>
          <span className="text-black">Core Modules</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-200 border-2 border-green-600 rounded"></div>
          <span className="text-black">Assignments</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-200 border-2 border-purple-600 rounded"></div>
          <span className="text-black">Optional</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-200 border-2 border-red-600 rounded"></div>
          <span className="text-black">Capstone</span>
        </div>
      </div>
    </div>
  );
};

export default RoadmapHeader;
