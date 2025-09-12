'use client';
import Button from '@/components/ui/Button';
import { setIsCandidateInfoSeen } from '@/store/slices/customerSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { CustomerTabs } from '@/types/customer';
import { ArrowRight, ChevronDown, Menu, MoreVertical, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Candidates from './Candidates';
import Favourites from './Favourites';
import FloatingAction from './FloatingAction';
import SelectionModal from './modals/SelectionModal';
import MyInterviews from './MyInterviews';
import ShortListed from './ShortListed';

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
  const CustomerTabsArray: CustomerTabs[] = [
    'Candidates',
    'Favourites',
    'Shortlisted',
    'My Interviews',
  ];
  const [showSelectionModal, setShowSelectionModal] = useState(true);
  const [showFloating, setShowFloating] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedSkills, setSelectedSkills] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [compensationRange, setCompensationRange] = useState<number>(150);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [tabMenuOpen, setTabMenuOpen] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<CustomerTabs>('Candidates');
  const {
    CustomerFavourites,
    CustomerShortlisted,
    CustomerMyInterviews,
    isCandidateInfoSeen,
  } = useAppSelector(store => store.customer);
  const dispatch = useAppDispatch();
  const loggedInUser = useAppSelector(state => state.user.loggedInUser);

  const isLoggedIn = !!loggedInUser?.accessToken;

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
      profileImage: '/images/blurPic.png',
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
      profileImage: '/images/blurPic.png',
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
      profileImage: '/images/blurPic.png',
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
      profileImage: '/images/blurPic.png',
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
      profileImage: '/images/blurPic.png',
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
      profileImage: '/images/blurPic.png',
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
      profileImage: '/images/blurPic.png',
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
      profileImage: '/images/blurPic.png',
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
      profileImage: '/images/blurPic.png',
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
      profileImage: '/images/blurPic.png',
    },
  ];

  // Fixed helper function to extract numeric salary range
  const getSalaryRange = (salary: string): { min: number; max: number } => {
    const matches = salary.match(
      /\$(\d{1,3}(?:,\d{3})*),?(\d{3})?\s*-\s*\$(\d{1,3}(?:,\d{3})*),?(\d{3})?/
    );
    if (matches) {
      const minStr = matches[1].replace(/,/g, '') + (matches[2] || '');
      const maxStr = matches[3].replace(/,/g, '') + (matches[4] || '');
      const min = parseInt(minStr);
      const max = parseInt(maxStr);
      return { min, max };
    }

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
      if (selectedRole && candidate.role !== selectedRole) {
        return false;
      }

      if (selectedSkills && !candidate.skills.includes(selectedSkills)) {
        return false;
      }

      if (selectedLocation && candidate.location !== selectedLocation) {
        return false;
      }

      const salaryRange = getSalaryRange(candidate.salary);
      const maxCompensation = compensationRange * 1000;

      if (salaryRange.min > 0 && salaryRange.min > maxCompensation) {
        return false;
      }

      return true;
    });
  };

  const handleTabSelect = (tab: CustomerTabs) => {
    setSelectedTab(tab);
    setTabMenuOpen(false);
  };

  const handleView = () => {
    setSelectedTab('Favourites');
    setShowFloating(false);
  };

  const uniqueSkills = Array.from(
    new Set(candidates.flatMap(c => c.skills))
  ).sort();

  const clearAllFilters = () => {
    setSelectedRole('');
    setSelectedSkills('');
    setSelectedLocation('');
    setCompensationRange(150);
    setSidebarOpen(false);
  };

  const getBadgeCount = (tab: CustomerTabs): number => {
    switch (tab) {
      case 'Favourites':
        return CustomerFavourites.length;
      case 'Shortlisted':
        return CustomerShortlisted.length;
      case 'My Interviews':
        return CustomerMyInterviews.length;
      case 'Candidates':
        return 0;
      default:
        return 0;
    }
  };

  useEffect(() => {
    if (CustomerFavourites.length > 0) {
      setShowFloating(true);
    } else {
      setShowFloating(false);
    }
  }, [CustomerFavourites]);

  // Filter Section Component
  const FilterSection = () => (
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
            onChange={e => setCompensationRange(parseInt(e.target.value))}
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
        onClick={clearAllFilters}
        className="w-full mt-4 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="w-full h-screen bg-gray-50 flex overflow-hidden">
      {/* Desktop Sidebar - Static */}
      <div className="hidden xl:flex w-72 bg-gray-100 flex-col flex-shrink-0">
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Filters
            </h2>
            <FilterSection />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-gray-100 shadow-xl flex flex-col transform transition-transform">
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white flex-shrink-0">
              <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <FilterSection />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header with Tab Menu */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>

          <h1 className="text-lg font-bold text-gray-900 truncate max-w-[200px]">
            {selectedTab}
          </h1>

          {/* Mobile Tab Menu */}
          {isLoggedIn && (
            <div className="relative">
              <button
                onClick={() => setTabMenuOpen(!tabMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors relative"
              >
                <MoreVertical className="h-6 w-6" />
                {(CustomerFavourites.length > 0 ||
                  CustomerShortlisted.length > 0 ||
                  CustomerMyInterviews.length > 0) && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>

              {/* Tab Dropdown Menu */}
              {tabMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setTabMenuOpen(false)}
                  />

                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                    {CustomerTabsArray.map(item => {
                      const badgeCount = getBadgeCount(item);

                      return (
                        <button
                          key={item}
                          onClick={() => handleTabSelect(item)}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between ${
                            selectedTab === item
                              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                              : 'text-gray-700'
                          }`}
                        >
                          <span className="font-medium text-sm">{item}</span>
                          {badgeCount > 0 && (
                            <span
                              className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-semibold ${
                                selectedTab === item
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {badgeCount}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Header Section */}
            <div className="mb-6 lg:mb-8">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 lg:gap-6">
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 capitalize truncate">
                    {selectedTab}
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Discover talented professionals for your team
                  </p>
                </div>

                {/* Desktop Tabs */}
                {isLoggedIn && (
                  <div className="hidden lg:flex flex-row gap-2 xl:gap-3 flex-shrink-0 flex-wrap">
                    {CustomerTabsArray.map(item => (
                      <Button
                        text={item}
                        onClick={() => setSelectedTab(item)}
                        showBadge={true}
                        badgeCount={getBadgeCount(item)}
                        key={item}
                        className={`capitalize px-3 xl:px-4 py-2 border rounded-2xl cursor-pointer font-semibold text-xs transition-all duration-200 whitespace-nowrap ${
                          selectedTab === item
                            ? 'bg-[#1F514C] text-white border-[#1F514C] shadow-md'
                            : 'bg-white text-black border-[#D3F5C6] hover:bg-gray-50 hover:shadow-sm'
                        }`}
                        textColor={
                          selectedTab === item ? 'text-white' : 'text-black'
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Content Grid */}
            <div className="w-full h-[calc(100vh-290px)] flex flex-row flex-wrap gap-6">
              {selectedTab === 'Candidates' ? (
                <Candidates
                  setSelectedTab={setSelectedTab}
                  selectedTab={selectedTab}
                  candidates={getFilteredCandidates()}
                />
              ) : selectedTab === 'Favourites' ? (
                <Favourites
                  setSelectedTab={setSelectedTab}
                  selectedTab={selectedTab}
                />
              ) : selectedTab === 'Shortlisted' ? (
                <ShortListed
                  setSelectedTab={setSelectedTab}
                  selectedTab={selectedTab}
                />
              ) : (
                <MyInterviews
                  setSelectedTab={setSelectedTab}
                  selectedTab={selectedTab}
                />
              )}
            </div>

            {/* Sign Up Section for Shortlisted */}
            {!isLoggedIn && selectedTab === 'Shortlisted' && (
              <div className="w-full flex flex-col gap-4 justify-center items-center p-6 sm:p-8 mt-8 bg-gray-50 rounded-lg">
                <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-center max-w-4xl text-gray-800">
                  To view full profiles, please sign up and pay access fee
                </p>
                <button className="w-full max-w-xs sm:max-w-sm flex flex-row justify-center items-center gap-3 px-6 py-3 rounded-2xl bg-[#1F514C] text-white cursor-pointer hover:bg-[#164139] transition-all duration-200 hover:shadow-lg">
                  <span className="font-medium">Sign Up</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals and Floating Elements */}
      {!isCandidateInfoSeen && showSelectionModal && (
        <SelectionModal
          onClose={() => {
            setShowSelectionModal(false);
            dispatch(setIsCandidateInfoSeen(true));
          }}
        />
      )}

      {showFloating && selectedTab === 'Candidates' && (
        <FloatingAction
          text1={`Favourites : ${CustomerFavourites.length}/8`}
          text2="View"
          onView={() => handleView()}
        />
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .slider::-webkit-slider-thumb:hover {
          background: #059669;
          transform: scale(1.1);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }
        .slider::-moz-range-thumb:hover {
          background: #059669;
          transform: scale(1.1);
        }

        /* Custom scrollbar styling */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Animation for dropdown */
        @keyframes slide-in-from-top {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-in {
          animation-fill-mode: both;
        }

        .slide-in-from-top-2 {
          animation-name: slide-in-from-top;
        }

        .duration-200 {
          animation-duration: 200ms;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
