'use client';

import React, { useState, useRef } from 'react';
import { Calendar, X } from 'lucide-react';
import ModalWrapper from '@/components/ui/ModalWrapper';

interface TimePickerModalProps {
  onTimeSelect: (selectedDateObject: Date) => void;
  onClose: () => void;
  initialTime?: {
    hour?: number;
    minute?: number;
    period?: 'AM' | 'PM';
  };
  selectedDate?: Date;
}

const TimePickerModal: React.FC<TimePickerModalProps> = ({
  onTimeSelect,
  onClose,
  initialTime = { hour: 7, minute: 0, period: 'AM' },
  selectedDate,
}) => {
  const [hour, setHour] = useState(initialTime.hour || 7);
  const [minute, setMinute] = useState(initialTime.minute || 0);
  const [period, setPeriod] = useState<'AM' | 'PM'>(initialTime.period || 'AM');

  const clockRef = useRef<HTMLDivElement>(null);

  const getHourAngle = () => {
    // Fix: 12 should be at 0 degrees (top), 1 at 30 degrees, etc.
    const hourValue = hour === 12 ? 0 : hour;
    return hourValue * 30;
  };

  const handleHourClick = (clickedHour: number) => {
    setHour(clickedHour);
  };

  const handleTimeInput = (type: 'hour' | 'minute', value: string) => {
    const num = parseInt(value) || 0;
    if (type === 'hour') {
      if (num >= 1 && num <= 12) {
        setHour(num);
      }
    } else {
      if (num >= 0 && num <= 59) {
        setMinute(num);
      }
    }
  };

  // Create Date object with selected time
  const createSelectedDateObject = () => {
    // Convert 12-hour to 24-hour format
    let hours24 = hour;
    if (period === 'AM' && hour === 12) {
      hours24 = 0;
    } else if (period === 'PM' && hour !== 12) {
      hours24 = hour + 12;
    }

    // Use selectedDate if provided, otherwise use today's date
    const baseDate = selectedDate ? new Date(selectedDate) : new Date();

    // Create date object with selected time
    const selectedDateObject = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      hours24,
      minute,
      0, // seconds
      0 // milliseconds
    );

    return selectedDateObject;
  };

  const handleOK = () => {
    const selectedDateObject = createSelectedDateObject();
    onTimeSelect(selectedDateObject);
    if (onClose) onClose();
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <ModalWrapper onClose={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl sm:rounded-2xl p-4 sm:p-5 w-full max-w-xs sm:max-w-sm mx-auto shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Select Time
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </button>
        </div>

        {/* Time Display */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-4 sm:mb-5">
          <div className="bg-gray-200 rounded-lg sm:rounded-lg px-3 sm:px-3 py-2 sm:py-2.5 min-w-[50px] sm:min-w-[55px] text-center">
            <input
              type="text"
              value={hour.toString().padStart(2, '0')}
              onChange={e => handleTimeInput('hour', e.target.value)}
              className="bg-transparent text-xl sm:text-xl font-bold text-gray-900 w-full text-center outline-none"
              maxLength={3}
            />
          </div>

          <span className="text-xl sm:text-xl font-bold text-gray-900">:</span>

          <div className="bg-gray-200 rounded-lg sm:rounded-lg px-3 sm:px-3 py-2 sm:py-2.5 min-w-[50px] sm:min-w-[55px] text-center">
            <input
              type="text"
              value={minute.toString().padStart(2, '0')}
              onChange={e => handleTimeInput('minute', e.target.value)}
              className="bg-transparent text-xl sm:text-xl font-bold text-gray-900 w-full text-center outline-none"
              maxLength={3}
            />
          </div>

          <div className="flex flex-col gap-1 ml-1 sm:ml-2">
            <button
              onClick={() => setPeriod('AM')}
              className={`px-2 sm:px-2.5 py-1 sm:py-1 rounded-md sm:rounded-md text-xs sm:text-xs font-medium transition-colors ${
                period === 'AM'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              AM
            </button>
            <button
              onClick={() => setPeriod('PM')}
              className={`px-2 sm:px-2.5 py-1 sm:py-1 rounded-md sm:rounded-md text-xs sm:text-xs font-medium transition-colors ${
                period === 'PM'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              PM
            </button>
          </div>
        </div>

        {/* Clock */}
        <div className="flex justify-center mb-4 sm:mb-5">
          <div
            ref={clockRef}
            className="relative w-48 h-48 sm:w-52 sm:h-52 bg-gray-200 rounded-full flex items-center justify-center"
          >
            {/* Hour numbers for mobile */}
            <div className="block sm:hidden">
              {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, index) => {
                const angle = index * 30 - 90;
                const radian = angle * (Math.PI / 180);
                const clockSize = 192; // 48 * 4 (w-48)
                const x = clockSize / 2 + clockSize * 0.35 * Math.cos(radian);
                const y = clockSize / 2 + clockSize * 0.35 * Math.sin(radian);
                const isSelected = num === hour;

                return (
                  <button
                    key={num}
                    onClick={() => handleHourClick(num)}
                    className={`absolute text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-700 hover:bg-gray-300'
                    }`}
                    style={{
                      left: `${x - 12}px`,
                      top: `${y - 12}px`,
                      zIndex: 5,
                    }}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            {/* Hour numbers for desktop */}
            <div className="hidden sm:block">
              {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, index) => {
                const angle = index * 30 - 90;
                const radian = angle * (Math.PI / 180);
                const clockSize = 208; // 52 * 4 (w-52) - smaller than previous 240
                const x = clockSize / 2 + clockSize * 0.35 * Math.cos(radian);
                const y = clockSize / 2 + clockSize * 0.35 * Math.sin(radian);
                const isSelected = num === hour;

                return (
                  <button
                    key={num}
                    onClick={() => handleHourClick(num)}
                    className={`absolute text-base font-medium w-7 h-7 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-700 hover:bg-gray-300'
                    }`}
                    style={{
                      left: `${x - 14}px`,
                      top: `${y - 14}px`,
                      zIndex: 5,
                    }}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            {/* Hour hand for mobile */}
            <div className="block sm:hidden">
              <div
                className="absolute w-0.5 bg-emerald-600 origin-bottom"
                style={{
                  height: '67px',
                  left: '95.75px',
                  top: '29px',
                  transform: `rotate(${getHourAngle()}deg)`,
                  transformOrigin: 'bottom center',
                  zIndex: 1,
                }}
              />
            </div>

            {/* Hour hand for desktop */}
            <div className="hidden sm:block">
              <div
                className="absolute w-0.5 bg-emerald-600 origin-bottom"
                style={{
                  height: '73px', // Adjusted for smaller clock
                  left: '103.75px', // Adjusted for w-52 (52*4/2 = 104px center)
                  top: '31px',
                  transform: `rotate(${getHourAngle()}deg)`,
                  transformOrigin: 'bottom center',
                  zIndex: 1,
                }}
              />
            </div>

            {/* Center dot - appears on top of hour hand */}
            <div
              className="absolute w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gray-800 rounded-full"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
              }}
            />
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="flex items-center justify-between">
          <button className="p-1.5 sm:p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <Calendar className="w-4 h-4 sm:w-4 sm:h-4 text-gray-600" />
          </button>

          <div className="flex gap-2 sm:gap-2.5">
            <button
              onClick={handleClose}
              className="px-4 sm:px-5 py-1.5 sm:py-1.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium text-sm sm:text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleOK}
              className="px-4 sm:px-5 py-1.5 sm:py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-sm"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default TimePickerModal;
