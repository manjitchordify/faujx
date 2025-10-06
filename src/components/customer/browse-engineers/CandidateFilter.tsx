import { ChevronDown } from 'lucide-react';
import React from 'react';
import { Candidate } from '@/types/customer';

interface CandidateFilterProps {
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  selectedSkills: string;
  setSelectedSkills: (skills: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  compensationRange: number;
  setCompensationRange: (range: number) => void;
  publishedCandidates: Candidate[] | null;
  onClearFilters: () => void;
}

const CandidateFilter: React.FC<CandidateFilterProps> = ({
  selectedRole,
  setSelectedRole,
  selectedSkills,
  setSelectedSkills,
  selectedLocation,
  setSelectedLocation,
  compensationRange,
  setCompensationRange,
  publishedCandidates,
  onClearFilters,
}) => {
  return (
    <div className="space-y-4">
      {/* Role Filter */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role
        </label>
        <select
          value={selectedRole}
          onChange={e => setSelectedRole(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-gray-600"
        >
          <option value="">All Roles</option>
          <option value="Front-end">Frontend</option>
          <option value="Back-end">Backend</option>
          <option value="Full-Stack">Full Stack</option>
          <option value="AI/ML">AIML</option>
          <option value="Devops">Devops</option>
        </select>
        <ChevronDown className="absolute right-3 top-9 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>

      {/* Skills Filter */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills
        </label>
        <select
          value={selectedSkills}
          onChange={e => setSelectedSkills(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-gray-600"
        >
          <option value="">All Skills</option>
          {publishedCandidates &&
            Array.from(new Set(publishedCandidates.flatMap(c => c.skills)))
              .sort()
              .map(skill => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
        </select>
        <ChevronDown className="absolute right-3 top-9 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>

      {/* Location Filter */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <select
          value={selectedLocation}
          onChange={e => setSelectedLocation(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-gray-600"
        >
          <option value="">All Locations</option>
          {publishedCandidates &&
            Array.from(
              new Set(
                publishedCandidates
                  .map(c => c.preferredLocations?.filter(Boolean).join(', '))
                  .filter((loc): loc is string => Boolean(loc))
              )
            )
              .sort()
              .map(locationString => (
                <option key={locationString} value={locationString}>
                  {locationString}
                </option>
              ))}
        </select>
        <ChevronDown className="absolute right-3 top-9 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>

      {/* Compensation Slider */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Max Compensation: ${compensationRange}k
        </label>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="150"
            value={compensationRange}
            onChange={e => setCompensationRange(parseInt(e.target.value))}
            className={`
            w-full h-2 rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-green-700
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-green-700
            [&::-moz-range-thumb]:cursor-pointer
          `}
            style={{
              background: `linear-gradient(to right, 
              #22c55e 0%, 
              #22c55e ${((compensationRange - 0) / (150 - 0)) * 100}%, 
              #e5e7eb ${((compensationRange - 0) / (150 - 0)) * 100}%, 
              #e5e7eb 100%)`,
            }}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-3">
            <span>$0k</span>
            <span>$150k</span>
          </div>
        </div>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={onClearFilters}
        className="w-full mt-4 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default CandidateFilter;
