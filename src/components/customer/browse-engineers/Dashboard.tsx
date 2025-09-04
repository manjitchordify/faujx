'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Menu, X, Users } from 'lucide-react';
import Link from 'next/link';

interface Candidate {
  id: number;
  role: string;
  skills: string[];
  capabilities: string[];
  salary: string;
  location: string;
  profileImage?: string;
}

const Dashboard: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedSkills, setSelectedSkills] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [compensationRange, setCompensationRange] = useState<number>(150);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Sample candidate data
  const candidates: Candidate[] = [
    {
      id: 1,
      role: 'Frontend Developer',
      skills: ['React', 'JavaScript', 'CSS'],
      capabilities: [
        'Frontend specialization: Modern UI development',
        'Expert in creating responsive and accessible user interfaces',
      ],
      salary: '$95,000 - $120,000',
      location: 'New York',
      profileImage: '/images/internee.png',
    },
    {
      id: 2,
      role: 'Backend Developer',
      skills: ['Node.js', 'Python', 'React'],
      capabilities: [
        'Backend development: API design and database optimization',
        'Experienced in microservices architecture and cloud deployment',
      ],
      salary: '$85,000 - $100,000',
      location: 'London',
      profileImage: '/images/internee.png',
    },
    {
      id: 3,
      role: 'UI/UX Designer',
      skills: ['Figma', 'JavaScript', 'CSS'],
      capabilities: [
        'UI/UX design: User-centered design approach',
        'Expert in creating intuitive and visually appealing interfaces',
      ],
      salary: '$90,000 - $115,000',
      location: 'Remote',
      profileImage: '/images/internee.png',
    },
    {
      id: 4,
      role: 'Frontend Developer',
      skills: ['React', 'Node.js', 'Figma'],
      capabilities: [
        'Frontend development: Component-based architecture',
        'Strong background in modern JavaScript frameworks',
      ],
      salary: '$100,000 - $130,000',
      location: 'New York',
      profileImage: '/images/internee.png',
    },
    {
      id: 5,
      role: 'Backend Developer',
      skills: ['Python', 'JavaScript', 'CSS'],
      capabilities: [
        'Backend development: Scalable system architecture',
        'Specialist in server-side technologies and database design',
      ],
      salary: '$75,000 - $95,000',
      location: 'London',
      profileImage: '/images/internee.png',
    },
    {
      id: 6,
      role: 'UI/UX Designer',
      skills: ['Figma', 'React', 'Node.js'],
      capabilities: [
        'UI/UX design: Design systems and prototyping',
        'Experienced in user research and interaction design',
      ],
      salary: '$80,000 - $95,000',
      location: 'Remote',
      profileImage: '/images/internee.png',
    },
    {
      id: 7,
      role: 'Frontend Developer',
      skills: ['CSS', 'Python', 'Figma'],
      capabilities: [
        'Frontend development: Cross-platform applications',
        'Expert in responsive design and modern CSS techniques',
      ],
      salary: '$105,000 - $140,000',
      location: 'New York',
      profileImage: '/images/internee.png',
    },
    {
      id: 8,
      role: 'Backend Developer',
      skills: ['Node.js', 'React', 'Figma'],
      capabilities: [
        'Backend development: Microservices and APIs',
        'Proficient in both backend technologies and system design',
      ],
      salary: '$90,000 - $110,000',
      location: 'London',
      profileImage: '/images/internee.png',
    },
    {
      id: 9,
      role: 'UI/UX Designer',
      skills: ['Figma', 'CSS', 'Python'],
      capabilities: [
        'UI/UX design: Brand identity and visual design',
        'Expert in design tools and front-end implementation',
      ],
      salary: '$110,000 - $135,000',
      location: 'Remote',
      profileImage: '/images/internee.png',
    },
    {
      id: 10,
      role: 'Frontend Developer',
      skills: ['React', 'Node.js', 'Python'],
      capabilities: [
        'Frontend development: Modern web applications',
        'Specialized in React ecosystem and full-stack capabilities',
      ],
      salary: '$105,000 - $125,000',
      location: 'New York',
      profileImage: '/images/internee.png',
    },
  ];

  // Fixed helper function to extract numeric salary range
  const getSalaryRange = (salary: string): { min: number; max: number } => {
    // Updated regex to handle both comma and non-comma separated numbers
    const matches = salary.match(
      /\$(\d{1,3}(?:,\d{3})*),?(\d{3})?\s*-\s*\$(\d{1,3}(?:,\d{3})*),?(\d{3})?/
    );
    if (matches) {
      // Remove commas and parse
      const minStr = matches[1].replace(/,/g, '') + (matches[2] || '');
      const maxStr = matches[3].replace(/,/g, '') + (matches[4] || '');
      const min = parseInt(minStr);
      const max = parseInt(maxStr);
      return { min, max };
    }

    // Fallback: try simpler pattern
    const simpleMatches = salary.match(
      /\$(\d+),?(\d{3})?\s*-\s*\$(\d+),?(\d{3})?/
    );
    if (simpleMatches) {
      const min = parseInt(
        (simpleMatches[1] + (simpleMatches[2] || '')).replace(/,/g, '')
      );
      const max = parseInt(
        (simpleMatches[3] + (simpleMatches[4] || '')).replace(/,/g, '')
      );
      return { min, max };
    }

    return { min: 0, max: 0 };
  };

  const getFilteredCandidates = (): Candidate[] => {
    return candidates.filter(candidate => {
      // Role filter
      if (selectedRole && candidate.role !== selectedRole) {
        return false;
      }

      // Skills filter
      if (selectedSkills && !candidate.skills.includes(selectedSkills)) {
        return false;
      }

      // Location filter
      if (selectedLocation && candidate.location !== selectedLocation) {
        return false;
      }

      // Compensation filter - Fixed logic
      const salaryRange = getSalaryRange(candidate.salary);
      const maxCompensation = compensationRange * 1000; // Convert to actual dollar amount

      // Show candidates whose minimum salary is within the compensation range
      // This means we can afford candidates whose starting salary is at or below our max budget
      if (salaryRange.min > 0 && salaryRange.min > maxCompensation) {
        return false;
      }

      return true;
    });
  };

  const CandidateCard: React.FC<{ candidate: Candidate }> = ({ candidate }) => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex gap-4 hover:shadow-md transition-shadow duration-200">
        {/* Left Side - Profile Image */}
        <div className="w-24 flex-shrink-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-lg relative overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
            {candidate.profileImage ? (
              <Image
                src={candidate.profileImage}
                alt={`${candidate.role} profile`}
                width={96}
                height={96}
                className="w-full h-full object-cover rounded-lg blur-sm"
                onError={e => {
                  // Fallback to gradient background if image fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full rounded-lg bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                <Users className="w-8 h-8 text-gray-500" />
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="flex-1 flex flex-col">
          {/* Role Badge */}
          <div className="mb-2">
            <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
              {candidate.role}
            </span>
          </div>

          {/* Skills Section */}
          <div className="mb-2">
            <h4 className="text-xs font-semibold text-gray-900 mb-1">Skills</h4>
            <div className="flex flex-wrap gap-1">
              {candidate.skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Capabilities Section */}
          <div className="mb-3 flex-1">
            <h4 className="text-xs font-semibold text-gray-900 mb-1">
              Capabilities
            </h4>
            <ul className="text-xs text-gray-600 space-y-0.5">
              {candidate.capabilities.map(
                (capability: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-1 font-bold text-xs">
                      •
                    </span>
                    <span className="leading-tight text-xs">{capability}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Bottom Section - Salary, Location and Button */}
          <div className="mt-auto">
            {/* Salary */}
            <div className="mb-2">
              <span className="text-sm font-bold text-green-600">
                {candidate.salary}
              </span>
            </div>

            {/* Location */}
            <div className="mb-3">
              <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                {candidate.location}
              </span>
              <span className="ml-1 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">
                Remote
              </span>
            </div>

            {/* Action Button */}
            <Link
              // href="/customer/browse-engineers/sign-in"
              href="/profile/slug"
              className="block w-full"
            >
              <button className="w-full py-2 px-3 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
                View Profile
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  // Get unique skills for the skills dropdown
  const uniqueSkills = Array.from(
    new Set(candidates.flatMap(c => c.skills))
  ).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Layout */}
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex w-72 bg-gray-100 flex-col flex-shrink-0">
          <div className="p-6 h-full overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Filters
            </h2>

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
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
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
                  {uniqueSkills.map(skill => (
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
                  <option value="New York">New York</option>
                  <option value="London">London</option>
                  <option value="Remote">Remote</option>
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
                    min="50"
                    max="150"
                    value={compensationRange}
                    onChange={e =>
                      setCompensationRange(parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-3">
                    <span>$50k</span>
                    <span>$150k</span>
                  </div>
                </div>
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={() => {
                  setSelectedRole('');
                  setSelectedSkills('');
                  setSelectedLocation('');
                  setCompensationRange(150);
                }}
                className="w-full mt-4 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-gray-100 shadow-xl overflow-y-auto">
              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white sticky top-0 z-10">
                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-md hover:bg-gray-100"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              <div className="p-6 space-y-4 pb-20">
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
                    <option value="Frontend Developer">
                      Frontend Developer
                    </option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
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
                    {uniqueSkills.map(skill => (
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
                    <option value="New York">New York</option>
                    <option value="London">London</option>
                    <option value="Remote">Remote</option>
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
                      min="50"
                      max="150"
                      value={compensationRange}
                      onChange={e =>
                        setCompensationRange(parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-3">
                      <span>$50k</span>
                      <span>$150k</span>
                    </div>
                  </div>
                </div>

                {/* Clear Filters Button */}
                <button
                  onClick={() => {
                    setSelectedRole('');
                    setSelectedSkills('');
                    setSelectedLocation('');
                    setCompensationRange(150);
                    setSidebarOpen(false); // Close sidebar after clearing filters
                  }}
                  className="w-full mt-4 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 bg-white min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Candidates</h1>
              <div className="w-10"></div> {/* Spacer for centering */}
            </div>
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
                    Candidates
                  </h1>
                  <p className="text-gray-600">
                    Discover talented professionals for your team
                  </p>
                </div>
              </div>
            </div>

            {/* Candidate Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {getFilteredCandidates().map((candidate: Candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
