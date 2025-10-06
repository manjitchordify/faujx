'use client';

import { setIsCandidateInfoSeen } from '@/store/slices/customerSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { Candidate, CustomerTabs } from '@/types/customer';
import { ArrowRight, Menu, MoreVertical, X } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Candidates from './Candidates';
import Favourites from './Favourites';
import FloatingAction from './FloatingAction';
import SelectionModal from './modals/SelectionModal';
import ShortListed from './ShortListed';
import CandidateFilter from './CandidateFilter';
import InterviewFilter from './InterviewFilter';
import ScheduledInterviews from './ScheduledInterviews';
import InterviewedCandidates from './Interviewedcandidates';
import HiredCandidates from './Hiredcandidates';
import {
  getDashboardCountsApi,
  DashboardCounts,
} from '@/services/dashboardService';

const Dashboard: React.FC = () => {
  const CustomerTabsArray: CustomerTabs[] = [
    'Candidates',
    'Favourites',
    'Shortlisted',
    'Scheduled Interviews',
    'Interviewed',
    'Hired',
  ];

  const [dashboardCounts, setDashboardCounts] = useState<DashboardCounts>({
    candidates: 0,
    favorites: 0,
    shortlisted: 0,
    scheduled: 0,
    interviewed: 0,
    hired: 0,
  });

  const [initialCountsLoaded, setInitialCountsLoaded] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(true);
  const [showFloating, setShowFloating] = useState(false);

  // Candidate filter states
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedSkills, setSelectedSkills] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [compensationRange, setCompensationRange] = useState<number>(150);

  // Interview filter states
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [tabMenuOpen, setTabMenuOpen] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<CustomerTabs>('Candidates');
  const [publishedCandidates, setPublishedCandidates] = useState<
    Candidate[] | null
  >(null);

  const { CustomerFavourites, CustomerShortlisted, isCandidateInfoSeen } =
    useAppSelector(store => store.customer);
  const dispatch = useAppDispatch();
  const loggedInUser = useAppSelector(state => state.user.loggedInUser);
  const searchParams = useSearchParams();
  const router = useRouter();

  const isLoggedIn = !!loggedInUser?.accessToken;

  // Initial API fetch for dashboard counts
  useEffect(() => {
    const fetchDashboardCounts = async () => {
      try {
        const data = await getDashboardCountsApi();
        setDashboardCounts(data.counts);
        setInitialCountsLoaded(true);
      } catch (error) {
        console.error('Error fetching dashboard counts:', error);
        setInitialCountsLoaded(true); // Set to true even on error to allow Redux sync
      }
    };

    fetchDashboardCounts();
  }, []);

  // Sync dashboard counts with Redux state ONLY after initial API load
  // This ensures we start with API counts and then sync with Redux updates
  useEffect(() => {
    if (initialCountsLoaded) {
      setDashboardCounts(prev => ({
        ...prev,
        favorites: CustomerFavourites.length,
        shortlisted: CustomerShortlisted.length,
      }));
    }
  }, [
    CustomerFavourites.length,
    CustomerShortlisted.length,
    initialCountsLoaded,
  ]);

  // Function to update URL with current tab and preserve other parameters
  const updateURLWithTab = React.useCallback(
    (tab: CustomerTabs) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('tab', tab);
      const search = current.toString();
      const query = search ? `?${search}` : '';
      router.push(`${window.location.pathname}${query}`);
    },
    [searchParams, router]
  );

  useEffect(() => {
    const role = searchParams.get('role');
    const tab = searchParams.get('tab');
    if (role) {
      setSelectedRole(role);
    }
    if (tab && CustomerTabsArray.includes(tab as CustomerTabs)) {
      setSelectedTab(tab as CustomerTabs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Update URL when tab changes
  useEffect(() => {
    updateURLWithTab(selectedTab);
  }, [selectedTab, updateURLWithTab]);

  // Generic filter function that can be used for any candidate array
  const filterCandidates = (candidates: Candidate[]): Candidate[] => {
    return candidates.filter(candidate => {
      if (selectedRole && candidate.roleTitle !== selectedRole) {
        return false;
      }

      if (selectedSkills && !candidate.skills.includes(selectedSkills)) {
        return false;
      }

      if (
        selectedLocation &&
        candidate.preferredLocations?.join(', ') !== selectedLocation
      ) {
        return false;
      }

      const maxCompensation = compensationRange * 1000;

      if (Number(candidate.preferredMonthlySalary) > maxCompensation) {
        return false;
      }

      return true;
    });
  };

  // Individual filter functions for each section
  const getFilteredCandidates = (): Candidate[] => {
    return publishedCandidates ? filterCandidates(publishedCandidates) : [];
  };

  const getFilteredFavourites = (): Candidate[] => {
    return filterCandidates(CustomerFavourites);
  };

  const getFilteredShortlisted = (): Candidate[] => {
    return filterCandidates(CustomerShortlisted);
  };

  const handleTabSelect = (tab: CustomerTabs) => {
    setSelectedTab(tab);
    setTabMenuOpen(false);
  };

  const handleView = () => {
    setSelectedTab('Favourites');
    setShowFloating(false);
  };

  const clearCandidateFilters = () => {
    setSelectedRole('');
    setSelectedSkills('');
    setSelectedLocation('');
    setCompensationRange(150);
    setSidebarOpen(false);
  };

  const clearInterviewFilters = () => {
    setSelectedRole('');
    setSelectedMonth('');
    setSelectedYear('');
    setSidebarOpen(false);
  };

  // Updated badge count function
  const getBadgeCount = (tab: CustomerTabs): number => {
    switch (tab) {
      case 'Favourites':
        return dashboardCounts.favorites;
      case 'Shortlisted':
        return dashboardCounts.shortlisted;
      case 'Hired':
        return dashboardCounts.hired;
      case 'Candidates':
        return dashboardCounts.candidates;
      case 'Scheduled Interviews':
        return dashboardCounts.scheduled;
      case 'Interviewed':
        return dashboardCounts.interviewed;
      default:
        return 0;
    }
  };

  // Updated StatusIndicator component to handle all tab types
  const StatusIndicator = ({
    status,
  }: {
    status:
      | 'candidates'
      | 'favourites'
      | 'shortlisted'
      | 'pending'
      | 'interviewed'
      | 'hired';
  }) => {
    const statusConfig = {
      candidates: { color: 'bg-blue-500', pulse: false },
      favourites: { color: 'bg-gray-500', pulse: false },
      shortlisted: { color: 'bg-purple-500', pulse: false },
      pending: { color: 'bg-amber-400', pulse: true },
      interviewed: { color: 'bg-blue-500', pulse: false },
      hired: { color: 'bg-green-500', pulse: false },
    };

    const config = statusConfig[status];

    return (
      <span
        className={`inline-block w-2 h-2 rounded-full mr-2 ${config.color} ${config.pulse ? 'animate-pulse' : ''}`}
      />
    );
  };

  // Helper function to get status for each tab
  const getTabStatus = (
    tab: CustomerTabs
  ):
    | 'candidates'
    | 'favourites'
    | 'shortlisted'
    | 'pending'
    | 'interviewed'
    | 'hired' => {
    switch (tab) {
      case 'Candidates':
        return 'candidates';
      case 'Favourites':
        return 'favourites';
      case 'Shortlisted':
        return 'shortlisted';
      case 'Scheduled Interviews':
        return 'pending';
      case 'Interviewed':
        return 'interviewed';
      case 'Hired':
        return 'hired';
      default:
        return 'candidates';
    }
  };

  useEffect(() => {
    if (CustomerFavourites.length > 0) {
      setShowFloating(true);
    } else {
      setShowFloating(false);
    }
  }, [CustomerFavourites]);

  // Determine which filter to show based on selected tab
  const isInterviewTab = [
    'Scheduled Interviews',
    'Interviewed',
    'Hired',
  ].includes(selectedTab);

  const FilterSection = () => (
    <>
      {isInterviewTab ? (
        <InterviewFilter
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          onClearFilters={clearInterviewFilters}
        />
      ) : (
        <CandidateFilter
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          selectedSkills={selectedSkills}
          setSelectedSkills={setSelectedSkills}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          compensationRange={compensationRange}
          setCompensationRange={setCompensationRange}
          publishedCandidates={publishedCandidates}
          onClearFilters={clearCandidateFilters}
        />
      )}
    </>
  );

  return (
    <div className="w-full h-[calc(100vh-104px)] bg-gray-50 flex overflow-hidden">
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
                  getBadgeCount('Scheduled Interviews') > 0 ||
                  getBadgeCount('Interviewed') > 0 ||
                  getBadgeCount('Hired') > 0) && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>

              {/* Updated Tab Dropdown Menu */}
              {tabMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setTabMenuOpen(false)}
                  />

                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                    {CustomerTabsArray.map(item => {
                      const isActive = selectedTab === item;

                      return (
                        <button
                          key={item}
                          onClick={() => handleTabSelect(item)}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between ${
                            selectedTab === item
                              ? 'bg-green-50 text-green-700 border-r-2 border-green-500'
                              : 'text-gray-700'
                          }`}
                        >
                          <span className="font-medium text-sm flex items-center">
                            <StatusIndicator status={getTabStatus(item)} />
                            {item}
                          </span>
                          {getBadgeCount(item) > 0 && (
                            <span
                              className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold min-w-[20px] ${
                                isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-500 text-white'
                              }`}
                            >
                              {getBadgeCount(item)}
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
            {/* Updated Header Section with improved styling */}
            <div className="mb-6 lg:mb-8">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 lg:gap-6">
                {/* Enhanced Desktop Tabs with improved styling */}
                {isLoggedIn && (
                  <div className="hidden lg:flex w-full justify-evenly bg-gray-50 rounded-xl p-1 border border-gray-200 shadow-sm">
                    <div className="flex flex-row  flex-shrink-0 w-full justify-evenly flex-wrap">
                      {CustomerTabsArray.map(item => {
                        const isActive = selectedTab === item;

                        return (
                          <button
                            key={item}
                            onClick={() => setSelectedTab(item)}
                            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                              isActive
                                ? 'bg-white text-green-700 shadow-md border border-green-200'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                            }`}
                          >
                            <StatusIndicator status={getTabStatus(item)} />
                            <span>{item}</span>
                            {getBadgeCount(item) > 0 && (
                              <span
                                className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-semibold ${
                                  selectedTab === item
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {getBadgeCount(item)}
                              </span>
                            )}

                            {isActive && (
                              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-green-600 rounded-full" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Updated Content Grid */}
            <div className="w-full h-full flex flex-row flex-wrap gap-6">
              {selectedTab === 'Candidates' ? (
                <Candidates
                  setSelectedTab={setSelectedTab}
                  selectedTab={selectedTab}
                  candidates={getFilteredCandidates()}
                  selectedRole={selectedRole}
                  setPublishedCandidates={setPublishedCandidates}
                  publishedCandidates={publishedCandidates}
                />
              ) : selectedTab === 'Favourites' ? (
                <Favourites
                  setSelectedTab={setSelectedTab}
                  selectedTab={selectedTab}
                  candidates={getFilteredFavourites()}
                />
              ) : selectedTab === 'Shortlisted' ? (
                <ShortListed
                  setSelectedTab={setSelectedTab}
                  selectedTab={selectedTab}
                  candidates={getFilteredShortlisted()}
                />
              ) : selectedTab === 'Scheduled Interviews' ? (
                <ScheduledInterviews
                  setSelectedTab={setSelectedTab}
                  selectedTab={selectedTab}
                  selectedRole={selectedRole}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                />
              ) : selectedTab === 'Interviewed' ? (
                <InterviewedCandidates
                  setSelectedTab={setSelectedTab}
                  selectedTab={selectedTab}
                  selectedRole={selectedRole}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                />
              ) : (
                <HiredCandidates
                  setSelectedTab={setSelectedTab}
                  selectedTab={selectedTab}
                  selectedRole={selectedRole}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
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

      {/* Enhanced Custom Styles */}
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

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
