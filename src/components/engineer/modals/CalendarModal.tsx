'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ModalWrapper from '@/components/ui/ModalWrapper';

interface CalendarProps {
  onSelect: (data: {
    day: number;
    dateString: string;
    dateObject: Date;
    formattedDate: string;
  }) => void;
  onClose: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ onSelect, onClose }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today.getDate());

  // Check if current displayed month is the same as today's month/year
  const isCurrentMonth =
    currentMonth.getMonth() === today.getMonth() &&
    currentMonth.getFullYear() === today.getFullYear();

  // Disable previous button only if we're viewing the current month
  const isPrevDisabled = isCurrentMonth;

  const monthNames = [
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

  const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to be 6, Monday (1) to be 0
  };

  const getPreviousMonthDays = (date: Date) => {
    const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1);
    return getDaysInMonth(prevMonth);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const prevMonthDays = getPreviousMonthDays(currentMonth);
    const days = [];

    // Previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        isPreviousMonth: true,
      });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        isPreviousMonth: false,
      });
    }

    // Next month's leading days
    const totalCells = 42; // 6 rows × 7 days
    const remainingCells = totalCells - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isPreviousMonth: false,
      });
    }

    return days;
  };

  // Create selected date object with current time
  const getSelectedDateObject = (day: number) => {
    const selectedDateObj = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
      new Date().getHours(),
      new Date().getMinutes(),
      new Date().getSeconds(),
      new Date().getMilliseconds()
    );
    return selectedDateObj;
  };

  // Format selected date in multiple ways
  const createDateData = (day: number) => {
    const dateObject = getSelectedDateObject(day);

    return {
      day: day,
      dateString: dateObject.toISOString(),
      dateObject: dateObject,
      formattedDate: dateObject.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };
  };

  const calendarDays = generateCalendarDays();

  return (
    <ModalWrapper onClose={onClose}>
      <div
        onClick={e => {
          e.stopPropagation();
        }}
        className="bg-white rounded-2xl lg:rounded-3xl shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-5 bg-white">
          <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-5">
            <h1 className="text-xl sm:text-2xl lg:text-2xl font-extrabold text-black">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h1>

            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                disabled={isPrevDisabled}
                className={`
                  p-1.5 sm:p-2 lg:p-2 rounded-full transition-colors duration-200
                  ${
                    isPrevDisabled
                      ? 'cursor-not-allowed opacity-50 bg-gray-100'
                      : 'hover:bg-gray-100 cursor-pointer'
                  }
                `}
                aria-label={
                  isPrevDisabled
                    ? 'Previous month (disabled)'
                    : 'Previous month'
                }
              >
                <ChevronLeft
                  className={`
                  w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 
                  ${isPrevDisabled ? 'text-gray-400' : 'text-gray-600'}
                `}
                />
              </button>

              <button
                onClick={() => navigateMonth('next')}
                className="p-1.5 sm:p-2 lg:p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1 lg:gap-1 mb-1 sm:mb-2 lg:mb-2">
            {dayNames.map(day => (
              <div
                key={day}
                className="text-center py-2 sm:py-2 lg:py-2 text-sm sm:text-base lg:text-base font-[500] text-black"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((dateObj, index) => {
              const isSelected =
                dateObj.isCurrentMonth && dateObj.day === selectedDate;

              return (
                <button
                  key={index}
                  onClick={() => {
                    if (dateObj.isCurrentMonth) {
                      setSelectedDate(dateObj.day);
                      const dateData = createDateData(dateObj.day); // ✅ Fixed: Use dateObj.day instead of selectedDate
                      onSelect(dateData);
                    }
                  }}
                  className={`
                    aspect-square flex items-center justify-center text-sm sm:text-base lg:text-base font-[200]
                    border border-gray-200 transition-all duration-200 p-2
                    ${
                      !dateObj.isCurrentMonth
                        ? 'text-gray-400 bg-gray-50 cursor-default'
                        : isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                          : 'text-black bg-white hover:bg-gray-50 cursor-pointer'
                    }
                  `}
                  disabled={!dateObj.isCurrentMonth}
                >
                  {dateObj.day}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default Calendar;
