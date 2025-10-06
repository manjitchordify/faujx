'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import TimePickerModal from '../modals/TimePickerModal';
import Calendar from '../modals/CalendarModal';
import { CalendarType } from '@/types/common';
import AskQueryModal from '../modals/AskQueryModal';
import {
  bookMentorApi,
  BookMentorParams,
  fetchAllMentorBookingApi,
  fetchMentorsApi,
} from '@/services/MentorService';
import Loader from '@/components/ui/Loader';
import { showToast } from '@/utils/toast/Toast';

import UnifiedCard, { MentorData, BookingData, CardData } from './mentorCard';
import { jitsiLiveUrl } from '@/services/jitsiService';
import { useAppSelector } from '@/store/store';

export interface ExpertResponse {
  message: string;
  data: Expert[];
  total: number;
  page: number;
  limit: number;
}

export interface Expert {
  id: string;
  userId: string;
  role: string;
  rating: number;
  skills: string[];
  experience: string;
  price: string;
  profilePic: string;
  availableSlots: string[];
  isAvailable: boolean;
  user: User;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string | null;
  phone: string;
  profilePic: string | null;
  dateOfBirth: string;
  location: string;
  userType: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isSubscribed: boolean;
  isPremium: boolean;
}

export interface ApiBookingResponse {
  id: string;
  candidate_id: string;
  expert_id: string;
  booking_date: string;
  duration_minutes: number;
  hourly_rate: string;
  total_amount: string;
  currency: string;
  status: string;
  notes: string;
  meeting_link?: string;
  meeting_id?: string;
  created_at: string;
  updated_at: string;
  payments?: Record<string, unknown>[];
  expert?: {
    id: string;
    userId: string;
    role: string;
    rating: number;
    skills: string[];
    experience: string;
    price: string;
    profilePic: string;
    availableSlots: string[];
    isAvailable: boolean;
    resumeUrl?: string;
    resumeKey?: string;
    introVideo?: string | null;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      fullName: string | null;
      phone: string;
      profilePic: string | null;
      profilePicKey?: string | null;
      profileVideoKey?: string | null;
      profileVideo?: string | null;
      dateOfBirth?: string | null;
      location?: string | null;
      country?: string | null;
      userType: string;
      currentStatus?: string;
      isVerified: boolean;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
      isSubscribed: boolean;
      subscribedAt?: string | null;
      isPremium: boolean;
      premiumSince?: string | null;
      premiumUntil?: string | null;
      currentSubscriptionId?: string | null;
      companyWebsite?: string | null;
      companyName?: string | null;
    };
  };
}

type ViewType = 'mentors' | 'bookings';

const Spinner = () => (
  <div className="flex justify-center items-center p-10">
    <div className="animate-spin rounded-full h-8 w-8 border-2 border-b-transparent border-gray-900"></div>
  </div>
);

const BrowseMentor: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('mentors');
  const [searchTerm, setSearchTerm] = useState('');
  const [showClock, setShowClock] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<MentorData | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [slots, setSlots] = useState<Date>();
  const [askQuery, setAskQuery] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const { loggedInUser } = useAppSelector(state => state.user);
  const userType = loggedInUser?.userType as string;

  // Filter states
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [showExperienceDropdown, setShowExperienceDropdown] = useState(false);

  // Mentor-related state
  const [isLoadingMentors, setIsLoadingMentors] = useState(true);
  const [mentors, setMentors] = useState<MentorData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMentors, setTotalMentors] = useState(0);
  const limit = 6;
  const totalPages = Math.ceil(totalMentors / limit);

  // Booking-related state
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [bookingCount, setBookingCount] = useState(0);

  // Experience ranges
  const experienceRanges = [
    { label: 'Below 1 year', value: 'below-1', min: 0, max: 1 },
    { label: '1-3 years', value: '1-3', min: 1, max: 3 },
    { label: '3-5 years', value: '3-5', min: 3, max: 5 },
    { label: 'Above 5 years', value: 'above-5', min: 5, max: Infinity },
  ];

  // Extract unique skills from all mentors
  const availableSkills = useMemo(() => {
    const skillsSet = new Set<string>();
    mentors.forEach(mentor => {
      mentor.skills.forEach(skill => skillsSet.add(skill));
    });
    return Array.from(skillsSet).sort();
  }, [mentors]);

  // Parse experience string to years
  const parseExperience = (experience: string): number => {
    const match = experience.match(/(\d+)/);
    return match ? parseInt(match[0], 10) : 0;
  };

  // Fetch mentors only when page changes
  useEffect(() => {
    const fetchMentors = async () => {
      setIsLoadingMentors(true);

      try {
        const { mentors: fetchedMentors, total } = await fetchMentorsApi({
          page: currentPage,
          limit,
        });

        const transformedMentors: MentorData[] = fetchedMentors.map(mentor => ({
          type: 'mentor' as const,
          id: mentor.id,
          name: mentor.name,
          role: mentor.role,
          avatar: mentor.avatar,
          rating: mentor.rating,
          skills: mentor.skills,
          experience: mentor.experience,
          price: mentor.price,
          isAvailable: mentor.isAvailable,
        }));

        setMentors(transformedMentors);
        setTotalMentors(total);
      } catch (err) {
        console.error('Error fetching mentors:', err);
        showToast('Failed to load mentors', 'error');
      } finally {
        setIsLoadingMentors(false);
      }
    };

    fetchMentors();
  }, [currentPage]);

  // Fetch bookings only once when component mounts
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoadingBookings(true);
      try {
        const response: ApiBookingResponse[] = await fetchAllMentorBookingApi();

        const transformedBookings: BookingData[] = response.map(
          (booking: ApiBookingResponse) => {
            const expertFirstName = booking.expert?.user?.firstName || '';
            const expertLastName = booking.expert?.user?.lastName || '';
            const expertFullName =
              `${expertFirstName} ${expertLastName}`.trim() || 'Expert';

            return {
              type: 'booking' as const,
              id: booking.id,
              candidate_id: booking.candidate_id,
              expert_id: booking.expert_id,
              booking_date: booking.booking_date,
              duration_minutes: booking.duration_minutes,
              hourly_rate: booking.hourly_rate,
              total_amount: booking.total_amount,
              currency: booking.currency,
              status: booking.status,
              notes: booking.notes,
              meeting_link: booking.meeting_link,
              meeting_id: booking.meeting_id,
              created_at: booking.created_at,
              updated_at: booking.updated_at,
              payments: booking.payments,
              name: expertFullName,
              role: booking.expert?.role || 'Subject Matter Expert',
              avatar: booking.expert?.profilePic || '',
            };
          }
        );

        setBookings(transformedBookings);
        setBookingCount(transformedBookings.length);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        showToast('Failed to load bookings', 'error');
      } finally {
        setIsLoadingBookings(false);
      }
    };

    fetchBookings();
  }, []);

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSkills, selectedExperience]);

  const CalendarDateSelect = (data: CalendarType) => {
    setSelectedDate(data.dateObject);
    setShowClock(true);
    setShowCalendar(false);
  };

  const handleSetSlots = (data: Date) => {
    console.log('data', data);
    setSlots(data);
    setAskQuery(true);
  };

  const handleBookMentor = async (queryText: string) => {
    if (!selectedMentor || !slots || !selectedDate) {
      console.error('Missing required booking information');
      return;
    }

    try {
      setIsBooking(true);
      const bookingDateTime = new Date(selectedDate);
      if (slots instanceof Date) {
        bookingDateTime.setHours(slots.getHours());
        bookingDateTime.setMinutes(slots.getMinutes());
      }

      const bookingParams: BookMentorParams = {
        expertId: selectedMentor.id,
        bookingDate: bookingDateTime.toISOString(),
        durationMinutes: 60,
        notes: queryText,
      };

      const response = await bookMentorApi(bookingParams);

      console.log('Booking successful:', response?.stripe_session_url);

      setAskQuery(false);
      setSelectedMentor(null);
      setSelectedDate(undefined);
      setSlots(undefined);
      setIsBooking(false);
      setBookingCount(prev => prev + 1);

      window.location.href = response?.stripe_session_url;
    } catch (error: unknown) {
      const message = (error as Error)?.message || 'An error occurred';
      showToast(message, 'error');
      setIsBooking(false);
    }
  };

  const handleMentorBook = (mentor: MentorData) => {
    setSelectedMentor(mentor);
    setShowCalendar(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    // Reset filters when changing views
    if (view === 'bookings') {
      setSelectedSkills([]);
      setSelectedExperience('');
    }
  };

  const handleJoinSession = async (booking: BookingData) => {
    try {
      joinInterview(booking);
    } catch (error: unknown) {
      const message = (error as Error)?.message || 'An error occurred';
      showToast(message, 'error');
    }
  };

  const joinInterview = async (item: BookingData) => {
    console.log('join button', item);
    const meetingId = item?.meeting_id ?? '';

    try {
      const response = await jitsiLiveUrl({
        userId: loggedInUser?.id as string,
        sessionId: meetingId as string,
        role: userType,
      });

      if (response?.url) {
        const basePath = '/engineer/session';

        window.open(
          `${basePath}/${item.id}/meeting?room=${meetingId}&candidatesession=true`
        );
      }
    } catch (error: unknown) {
      const message = (error as Error)?.message || 'An error occurred';
      showToast(message, 'error');
    }
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleClearFilters = () => {
    setSelectedSkills([]);
    setSelectedExperience('');
  };

  // Apply filters to mentors
  const filteredMentors = mentors.filter(mentor => {
    // Search term filter
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.skills.some((skill: string) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Skills filter
    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.some(selectedSkill =>
        mentor.skills.includes(selectedSkill)
      );

    // Experience filter
    let matchesExperience = true;
    if (selectedExperience) {
      const mentorYears = parseExperience(mentor.experience);
      const experienceRange = experienceRanges.find(
        range => range.value === selectedExperience
      );
      if (experienceRange) {
        matchesExperience =
          mentorYears >= experienceRange.min &&
          mentorYears < experienceRange.max;
      }
    }

    return matchesSearch && matchesSkills && matchesExperience;
  });

  const filteredBookings = bookings.filter(
    booking =>
      booking.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCardGrid = (
    items: CardData[],
    isLoading: boolean,
    emptyMessage: string,
    emptySubMessage: string
  ) => {
    if (isLoading) {
      return <Spinner />;
    }

    if (items.length === 0) {
      return (
        <div className="text-center py-12 px-4">
          <div className="text-gray-400 text-xl mb-4">{emptyMessage}</div>
          <p className="text-gray-600">{emptySubMessage}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full">
        {items.map(item => (
          <UnifiedCard
            key={item.id}
            data={item}
            onAction={() => {
              if (item.type === 'mentor') {
                handleMentorBook(item as MentorData);
              } else {
                handleJoinSession(item as BookingData);
              }
            }}
            actionLabel={item.type === 'mentor' ? 'Book Mentor' : undefined}
          />
        ))}
      </div>
    );
  };

  const renderMentorList = () => (
    <div className="w-full">
      {renderCardGrid(
        filteredMentors,
        isLoadingMentors,
        'No mentors found',
        'Try adjusting your search terms or filters'
      )}

      {!isLoadingMentors && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-4 border-t border-gray-200 mt-8 gap-4">
          <div className="flex items-center gap-2 order-2 sm:order-1">
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="cursor-pointer px-3 py-1 text-sm border text-gray-700 border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="hidden sm:flex items-center gap-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage > totalPages - 3) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`cursor-pointer px-3 py-1 text-sm border rounded-md ${
                      currentPage === pageNum
                        ? 'bg-green-600 text-white border-green-600'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <div className="sm:hidden flex items-center gap-2 text-sm text-gray-600">
              <span>
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <button
              onClick={() =>
                handlePageChange(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="cursor-pointer px-3 py-1 text-sm border text-gray-700 border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          <div className="text-sm text-gray-500 order-1 sm:order-2">
            Showing {filteredMentors.length} mentors
          </div>
        </div>
      )}
    </div>
  );

  const renderBookingList = () => (
    <div className="w-full">
      {renderCardGrid(
        filteredBookings,
        isLoadingBookings,
        'No bookings found',
        bookings.length === 0
          ? "You haven't booked any mentors yet"
          : 'No bookings match your search'
      )}

      {!isLoadingBookings && filteredBookings.length > 0 && (
        <div className="flex justify-end items-center px-4 sm:px-6 py-4 border-t border-gray-200 mt-8">
          <div className="text-sm text-gray-500">
            Showing {filteredBookings.length} bookings
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Fixed Header with Search and Tabs */}
      <div className="mb-6 sm:mb-8 pt-8 sm:pt-12">
        <div className="flex flex-col gap-4">
          {/* Search and Tabs Row */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative w-full lg:w-auto lg:flex-1 lg:max-w-lg">
              <input
                type="text"
                placeholder={
                  currentView === 'mentors'
                    ? 'Search for Mentors'
                    : 'Search bookings'
                }
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-2 sm:py-3 text-sm sm:text-base border-2 text-gray-700 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
              />
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto">
              <button
                className={`cursor-pointer px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-xs sm:text-sm transition-colors flex-1 sm:flex-none ${
                  currentView === 'mentors'
                    ? 'bg-[#54A044] text-white border border-green-600'
                    : 'text-gray-700 hover:text-gray-900 border border-green-200 bg-white'
                }`}
                onClick={() => handleViewChange('mentors')}
              >
                Browse Mentors
              </button>
              <button
                className={`cursor-pointer px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-xs sm:text-sm transition-colors relative flex-1 sm:flex-none ${
                  currentView === 'bookings'
                    ? 'bg-[#54A044] text-white border border-green-600'
                    : 'text-gray-700 hover:text-gray-900 border border-green-200 bg-white'
                }`}
                onClick={() => handleViewChange('bookings')}
              >
                My Bookings
                {bookingCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center font-bold">
                    {bookingCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filters Row - Only show for mentors view */}
          {currentView === 'mentors' && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Skills Filter */}
              <div className="relative w-full sm:w-64">
                <button
                  onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}
                  className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-green-500 transition-all bg-white text-left flex items-center justify-between"
                >
                  <span className="text-gray-700">
                    {selectedSkills.length > 0
                      ? `${selectedSkills.length} skill${selectedSkills.length > 1 ? 's' : ''} selected`
                      : 'Filter by Skills'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {showSkillsDropdown && (
                  <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {availableSkills.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No skills available
                      </div>
                    ) : (
                      availableSkills.map(skill => (
                        <label
                          key={skill}
                          className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSkills.includes(skill)}
                            onChange={() => handleSkillToggle(skill)}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">
                            {skill}
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Experience Filter */}
              <div className="relative w-full sm:w-64">
                <button
                  onClick={() =>
                    setShowExperienceDropdown(!showExperienceDropdown)
                  }
                  className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-green-500 transition-all bg-white text-left flex items-center justify-between"
                >
                  <span className="text-gray-700">
                    {selectedExperience
                      ? experienceRanges.find(
                          r => r.value === selectedExperience
                        )?.label
                      : 'Filter by Experience'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {showExperienceDropdown && (
                  <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg">
                    {experienceRanges.map(range => (
                      <button
                        key={range.value}
                        onClick={() => {
                          setSelectedExperience(
                            range.value === selectedExperience
                              ? ''
                              : range.value
                          );
                          setShowExperienceDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                          selectedExperience === range.value
                            ? 'bg-green-50 text-green-700 font-medium'
                            : 'text-gray-700'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear Filters Button */}
              {(selectedSkills.length > 0 || selectedExperience) && (
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2.5 text-sm text-gray-700 hover:text-gray-900 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all whitespace-nowrap"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Content Area - Unified Grid Layout */}
      {currentView === 'mentors' ? renderMentorList() : renderBookingList()}

      {/* Modals */}
      {showCalendar && (
        <Calendar
          onSelect={CalendarDateSelect}
          onClose={() => setShowCalendar(false)}
        />
      )}

      {showClock && (
        <TimePickerModal
          onTimeSelect={handleSetSlots}
          onClose={() => setShowClock(false)}
          selectedDate={selectedDate}
        />
      )}

      {askQuery && (
        <AskQueryModal
          onSubmit={handleBookMentor}
          onClose={() => setAskQuery(false)}
        />
      )}

      {isBooking && (
        <div className="fixed inset-0 bg-gray-500/80 flex items-center justify-center z-50">
          <Loader text="Redirecting to payment..." />
        </div>
      )}
    </div>
  );
};

export default BrowseMentor;
