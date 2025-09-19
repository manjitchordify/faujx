'use client';
import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import TimePickerModal from '../modals/TimePickerModal';
import Calendar from '../modals/CalendarModal';
import { CalendarType } from '@/types/common';
import AskQueryModal from '../modals/AskQueryModal';
import {
  bookMentorApi,
  BookMentorParams,
  fetchAllMentorBookingApi,
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
  created_at: string;
  updated_at: string;
  payments?: Record<string, unknown>[];
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

  // Fetch mentors only when page changes
  useEffect(() => {
    const fetchMentors = async () => {
      setIsLoadingMentors(true);

      try {
        const res = await fetch(
          `https://devapi.faujx.com/api/experts/getexperts?page=${currentPage}&limit=${limit}`
        );
        if (!res.ok) throw new Error('Failed to fetch experts');
        const data: ExpertResponse = await res.json();

        const transformedMentors: MentorData[] = data.data.map(
          (expert: Expert) => ({
            type: 'mentor' as const,
            id: expert.id,
            name: `${expert.user.firstName} ${expert.user.lastName}`,
            role: expert.role.trim(),
            avatar: expert.profilePic,
            rating: expert.rating,
            skills: expert.skills,
            experience: expert.experience,
            price: parseFloat(expert.price),
            isAvailable: expert.isAvailable,
          })
        );

        setMentors(transformedMentors);
        setTotalMentors(data.total);
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
        console.log('response', response);

        // Transform API response to BookingData format
        const transformedBookings: BookingData[] = response.map(
          (booking: ApiBookingResponse) => ({
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
            created_at: booking.created_at,
            updated_at: booking.updated_at,
            payments: booking.payments,
            name: 'Expert Name',
            role: 'Subject Matter Expert',
            avatar: '',
          })
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

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
      // If slots is just time and selectedDate is just date, combine them
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

      // Reset states and increment booking count
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
  };

  const handleJoinSession = async (booking: BookingData) => {
    const session_id = booking?.meeting_link?.split('/').pop() || '';
    try {
      const response = await jitsiLiveUrl({
        userId: loggedInUser?.id as string,
        sessionId: session_id,
        role: userType,
      });
      if (response?.url) {
        window.open(
          `/enginner/session/${booking.id}/meeting?room=${session_id}`
        );
      }
    } catch (error: unknown) {
      const message = (error as Error)?.message || 'An error occurred';
      showToast(message, 'error');
    }
  };

  const filteredMentors = mentors.filter(
    mentor =>
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.skills.some((skill: string) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Filter bookings based on search (you can search by notes or status)
  const filteredBookings = bookings.filter(
    booking =>
      booking.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Common grid and card styling for both mentor and booking lists
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

  // Render mentor list with pagination
  const renderMentorList = () => (
    <div className="w-full">
      {renderCardGrid(
        filteredMentors,
        isLoadingMentors,
        'No mentors found',
        'Try adjusting your search terms'
      )}

      {/* Pagination - only for mentors */}
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

  // Render booking list
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

      {/* Show count info for bookings */}
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
