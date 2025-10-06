import React, { useState } from 'react';
import { X, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  InterviewPreferences,
  proposeInterviewSlots,
  SlotSelection,
} from '@/services/customer/shortlistedProfileService';

interface InterviewSlotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  interviewPreferences?: InterviewPreferences;
  candidateName: string;
  candidateId: string; // Add candidateId prop
}

const InterviewSlotsModal: React.FC<InterviewSlotsModalProps> = ({
  isOpen,
  onClose,
  interviewPreferences,
  candidateName,
  candidateId,
}) => {
  const [selectedSlots, setSelectedSlots] = useState<SlotSelection[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tempSelectedDate, setTempSelectedDate] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  if (!isOpen) return null;

  const hasSlots =
    interviewPreferences?.preferredinterviewSlot &&
    interviewPreferences.preferredinterviewSlot.length > 0;

  // Calendar logic
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate calendar days - Fix: Explicit typing for the array
  const calendarDays: (number | null)[] = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const navigateMonth = (direction: 'prev' | 'next'): void => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(month - 1);
    } else {
      newDate.setMonth(month + 1);
    }
    setCurrentDate(newDate);
  };

  const isDateDisabled = (day: number): boolean => {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    return date < today || dayOfWeek === 0 || dayOfWeek === 6; // Disable past dates, Sundays, and Saturdays
  };

  const formatSelectedDate = (day: number): string => {
    const date = new Date(year, month, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDateSelect = (day: number): void => {
    if (!isDateDisabled(day)) {
      const formattedDate = formatSelectedDate(day);
      setTempSelectedDate(formattedDate);
    }
  };

  const handleBooking = async (): Promise<void> => {
    // Validate candidateId first
    if (
      !candidateId ||
      typeof candidateId !== 'string' ||
      candidateId.trim() === ''
    ) {
      setBookingError(
        'Candidate ID is missing or invalid. Please refresh the page and try again.'
      );
      return;
    }

    if (selectedSlots.length === 0) {
      setBookingError('Please select at least one interview slot');
      return;
    }

    console.log('Starting booking process with:', {
      candidateId: candidateId,
      selectedSlotsCount: selectedSlots.length,
      selectedSlots: selectedSlots,
    });

    setIsBooking(true);
    setBookingError(null);

    try {
      const response = await proposeInterviewSlots(candidateId, selectedSlots);

      console.log('API Response:', response);

      if (response.success) {
        console.log('Interview slots booked successfully:', response);
        // Show success message or handle success
        onClose(); // Close modal on success
      } else {
        setBookingError(response.message || 'Failed to book interview slots');
      }
    } catch (error) {
      console.error('Error booking interview:', error);
      setBookingError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      setIsBooking(false);
    }
  };

  const handleTimeSelect = (time: string): void => {
    if (tempSelectedDate && selectedSlots.length < 3) {
      // Parse the time string to create a proper Date object
      const [timeStr, period] = time.split(' ');
      const [hours] = timeStr.split(':').map(Number);

      // Convert to 24-hour format
      let hour24 = hours;
      if (period === 'PM' && hours !== 12) {
        hour24 += 12;
      } else if (period === 'AM' && hours === 12) {
        hour24 = 0;
      }

      // Find the actual day number from the calendar
      const dayNumber: number | null =
        calendarDays.find(day => {
          if (day === null) return false;
          const testDate = formatSelectedDate(day);
          return testDate === tempSelectedDate;
        }) || null;

      if (dayNumber) {
        // Create full DateTime using current calendar context
        const fullDateTime = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          dayNumber,
          hour24,
          0,
          0
        );

        // If the date would be in the past, move to next year
        const now = new Date();
        if (fullDateTime <= now) {
          fullDateTime.setFullYear(fullDateTime.getFullYear() + 1);
        }

        const newSlot: SlotSelection = {
          date: tempSelectedDate,
          time: time,
          fullDateTime: fullDateTime,
        };

        // Check if this exact slot already exists
        const slotExists = selectedSlots.some(
          slot => slot.date === tempSelectedDate && slot.time === time
        );

        if (!slotExists) {
          setSelectedSlots(prev => [...prev, newSlot]);
          setBookingError(null); // Clear any previous errors
        }
      }
    }
  };

  const removeSlot = (dateToRemove: string, timeToRemove: string): void => {
    setSelectedSlots(prev =>
      prev.filter(
        slot => !(slot.date === dateToRemove && slot.time === timeToRemove)
      )
    );
    setBookingError(null); // Clear error when user makes changes
  };

  // Time slots - 1 hour intervals, all available
  const timeSlots: string[] = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-300" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-4xl mx-4 bg-white rounded-lg shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gray-50 border-b">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Select a date & time
            </h3>
            <p className="text-sm text-gray-600 mt-1">{candidateName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Preferred Interview Slots - always show */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Preferred Interview Slots
            </h4>
            <div className="grid gap-3">
              {hasSlots
                ? interviewPreferences.preferredinterviewSlot.map(
                    (slot: string, index: number) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg bg-blue-50 flex items-center gap-3"
                      >
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <span className="text-gray-900 font-medium">
                          {slot}
                        </span>
                      </div>
                    )
                  )
                : ['Morning', 'Afternoon', 'Evening'].map(
                    (slot: string, index: number) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg bg-green-50 flex items-center gap-3"
                      >
                        <Calendar className="w-5 h-5 text-green-500" />
                        <span className="text-gray-900 font-medium">
                          {slot}
                        </span>
                      </div>
                    )
                  )}
            </div>
          </div>

          {/* Selected Slots Display */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Selected Interview Slots ({selectedSlots.length}/3)
            </h4>
            {selectedSlots.length > 0 ? (
              <div className="grid gap-2">
                {selectedSlots.map((slot, index) => (
                  <div
                    key={index}
                    className="p-3 border border-orange-200 rounded-lg bg-orange-50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      <span className="text-gray-900 font-medium">
                        {slot.date} at {slot.time}
                      </span>
                    </div>
                    <button
                      onClick={() => removeSlot(slot.date, slot.time)}
                      className="text-orange-500 hover:text-orange-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-4 border border-gray-200 rounded-lg bg-gray-50">
                Select up to 3 date & time combinations from the calendar below
              </div>
            )}
          </div>

          {/* Calendar and Time Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {monthNames[month]} {year}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigateMonth('prev')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft size={16} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => navigateMonth('next')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight size={16} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekdays.map(weekday => (
                    <div
                      key={weekday}
                      className="p-2 text-center text-sm font-medium text-gray-500"
                    >
                      {weekday}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    if (day === null) {
                      return <div key={index} className="p-2 h-10"></div>;
                    }

                    const isDisabled = isDateDisabled(day);
                    const formattedDate = formatSelectedDate(day);
                    const hasSelectedSlotForDate = selectedSlots.some(
                      slot => slot.date === formattedDate
                    );
                    const isCurrentlySelected =
                      tempSelectedDate === formattedDate;
                    const isToday =
                      today.getDate() === day &&
                      today.getMonth() === month &&
                      today.getFullYear() === year;

                    // Check if it's a weekend for visual styling
                    const date = new Date(year, month, day);
                    const isWeekend =
                      date.getDay() === 0 || date.getDay() === 6;

                    return (
                      <button
                        key={day}
                        onClick={() => handleDateSelect(day)}
                        disabled={isDisabled}
                        className={`
                          p-2 h-10 text-sm font-medium rounded-lg transition-colors
                          ${
                            hasSelectedSlotForDate
                              ? 'bg-green-500 text-white'
                              : isCurrentlySelected
                                ? 'bg-orange-500 text-white'
                                : isToday && !isDisabled
                                  ? 'bg-blue-100 text-blue-700'
                                  : isDisabled
                                    ? isWeekend
                                      ? 'text-gray-300 cursor-not-allowed bg-gray-100'
                                      : 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                        title={
                          isWeekend && !isDisabled
                            ? 'Weekends are not available for interviews'
                            : isDisabled && date < today
                              ? 'Past dates are not available'
                              : undefined
                        }
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                {tempSelectedDate
                  ? `Available times for ${tempSelectedDate}`
                  : 'Select a date to choose time'}
              </h4>
              {selectedSlots.length >= 3 && (
                <div className="text-sm text-orange-600 mb-4 p-2 bg-orange-50 rounded">
                  Maximum 3 slots selected. Remove a slot to add another.
                </div>
              )}
              {tempSelectedDate ? (
                <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto">
                  {timeSlots.map((time, index) => {
                    const isSlotTaken = selectedSlots.some(
                      s => s.date === tempSelectedDate && s.time === time
                    );
                    const canSelect = selectedSlots.length < 3 && !isSlotTaken;

                    return (
                      <button
                        key={index}
                        onClick={() => handleTimeSelect(time)}
                        disabled={!canSelect}
                        className={`
                          p-3 border rounded-lg text-left transition-colors flex items-center gap-2 text-sm
                          ${
                            isSlotTaken
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : !canSelect
                                ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                                : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-gray-700'
                          }
                        `}
                      >
                        <Clock
                          className={`w-4 h-4 ${
                            isSlotTaken
                              ? 'text-green-500'
                              : canSelect
                                ? 'text-gray-500'
                                : 'text-gray-300'
                          }`}
                        />
                        <span className="font-medium">{time}</span>
                        {isSlotTaken && (
                          <span className="text-xs ml-auto text-green-600">
                            (Selected)
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8 border border-gray-200 rounded-lg bg-gray-50">
                  Please select a date from the calendar
                </div>
              )}
            </div>
          </div>

          {/* Error Display */}
          {bookingError && (
            <div className="mb-6 p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-center gap-2">
                <X className="w-5 h-5 text-red-500" />
                <span className="text-red-700 font-medium">Booking Error</span>
              </div>
              <p className="text-red-600 mt-1">{bookingError}</p>
            </div>
          )}

          {/* Action Buttons */}
          {selectedSlots.length > 0 && (
            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={onClose}
                disabled={isBooking}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                disabled={isBooking}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isBooking ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Booking...
                  </>
                ) : (
                  `Book Interview (${selectedSlots.length} slot${selectedSlots.length !== 1 ? 's' : ''})`
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewSlotsModal;
