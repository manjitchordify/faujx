'use client';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import {
  getFavouriteCustomerCandidates,
  getPublishedCandidates,
  getShortlistedCustomerCandidates,
} from '@/services/customerService';
import {
  setCustomerFavourites,
  setCustomerShortlisted,
  setIsCandidateInfoSeen,
} from '@/store/slices/customerSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { Candidate, CustomerTabs } from '@/types/customer';
import { showToast } from '@/utils/toast/Toast';
import { ArrowRight, ChevronDown, Menu, MoreVertical, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import Candidates from './Candidates';
import Favourites from './Favourites';
import FloatingAction from './FloatingAction';
import SelectionModal from './modals/SelectionModal';
import MyInterviews from './MyInterviews';
import ShortListed from './ShortListed';

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
  const [candidateLoader, setCandidateLoader] = useState(false);
  const [publishedCandidates, setPublishedCandidates] = useState<
    Candidate[] | null
  >();
  const searchParams = useSearchParams();

  const isLoggedIn = !!loggedInUser?.accessToken;

  useEffect(() => {
    const role = searchParams.get('role');
    const tab = searchParams.get('tab'); // Read the tab query parameter
    if (role) {
      setSelectedRole(role);
    }
    if (tab && CustomerTabsArray.includes(tab as CustomerTabs)) {
      setSelectedTab(tab as CustomerTabs); // Set the selected tab if valid
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const getFilteredCandidates = (): Candidate[] => {
    return publishedCandidates!.filter(candidate => {
      if (selectedRole && candidate.roleTitle !== selectedRole) {
        return false;
      }

      if (selectedSkills && !candidate.skills.includes(selectedSkills)) {
        return false;
      }

      if (selectedLocation && candidate.location !== selectedLocation) {
        return false;
      }

      const maxCompensation = compensationRange * 1000;

      if (candidate.expectedSalary > maxCompensation) {
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
          <option value="Front-end">Frontend</option>
          <option value="'Back-end">Backend</option>
          <option value="Full-Stack">Full Stack</option>
          <option value="AI/MLr">AIML</option>
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
          {Array.from(new Set(publishedCandidates!.flatMap(c => c.skills)))
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
          {Array.from(
            new Set(
              publishedCandidates!
                .map(c => c.location)
                .filter((loc): loc is string => Boolean(loc)) // 👈 ensures only non-null strings
            )
          )
            .sort()
            .map(location => (
              <option key={location} value={location}>
                {location}
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
        onClick={clearAllFilters}
        className="w-full mt-4 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );

  const getAllPublishedCandidates = useCallback(async () => {
    try {
      setCandidateLoader(true);
      const res = await getPublishedCandidates();
      const filterData = res.filter(
        item =>
          item?.skills.length > 0 &&
          item.location &&
          item.capabilities.length > 0
      );
      setPublishedCandidates(filterData);
    } catch (error) {
      console.log(error);
      showToast('Try Again', 'error');
    } finally {
      setCandidateLoader(false);
    }
  }, []);

  const getAllFavourites = useCallback(async () => {
    try {
      const favouriteCandidates: Candidate[] =
        await getFavouriteCustomerCandidates();
      dispatch(setCustomerFavourites(favouriteCandidates)); // Overwrite instead of merge
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  const getAllShortListed = useCallback(async () => {
    try {
      const shortlistedCandidates: Candidate[] =
        await getShortlistedCustomerCandidates();
      dispatch(setCustomerShortlisted(shortlistedCandidates)); // Overwrite instead of merge
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    getAllPublishedCandidates();
    getAllFavourites();
    getAllShortListed();
  }, [getAllPublishedCandidates, getAllFavourites, getAllShortListed]);

  if (candidateLoader) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader text="Getting Candidates ..." />
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-104px)] bg-gray-50 flex overflow-hidden">
      {publishedCandidates ? (
        <>
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
                  <h2 className="text-lg font-semibold text-gray-800">
                    Filters
                  </h2>
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
                              <span className="font-medium text-sm">
                                {item}
                              </span>
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
                <div className="w-full h-full flex flex-row flex-wrap gap-6">
                  {selectedTab === 'Candidates' ? (
                    <Candidates
                      setSelectedTab={setSelectedTab}
                      selectedTab={selectedTab}
                      candidates={getFilteredCandidates()}
                      selectedRole={selectedRole}
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
        </>
      ) : (
        <div className="w-full h-full flex justify-center items-center font-medium">
          NO DATA AVAILABLE
        </div>
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
