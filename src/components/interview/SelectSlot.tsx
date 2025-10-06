'use client';
import Calendar from '@/components/engineer/modals/CalendarModal';
import TimePickerModal from '@/components/engineer/modals/TimePickerModal';
import Button from '@/components/ui/Button';
import { submitInterviewSlots } from '@/services/interviewService';
import { setInterviewSlots } from '@/store/slices/interviewSlice';
import { RootState, useAppDispatch } from '@/store/store';
import { CalendarType } from '@/types/common';
import {
  FailedInterviewResponse,
  InterviewSlot,
  SuccessInterviewScheduleResponse,
} from '@/types/interview';
import { formatReadableDate } from '@/utils/helper/Helper';
import { showToast } from '@/utils/toast/Toast';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { MdCancel } from 'react-icons/md';
import { useSelector } from 'react-redux';
import AlternativeSlots from './selected-slot/AlternativeSlots';
import usePreventBackNavigation from '@/app/hooks/usePreventBackNavigation';
import { completeInterviewStage } from '@/services/engineerService';

const SelectSlot = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showClock, setShowClock] = useState(false);
  const [showAlternateSlots, setShowAlternateSlots] = useState(false);
  const [alternateSlots, setAlternateSlots] = useState<InterviewSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [slots, setSlots] = useState<InterviewSlot[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const router = useRouter();
  usePreventBackNavigation();
  function convertDateToUTCObject(
    date: Date,
    normalize: boolean
  ): {
    startTime: string;
    endTime: string;
    timezone: string;
  } {
    if (normalize) {
      // Case: normalize to start and end of day UTC
      const utcYear = date.getUTCFullYear();
      const utcMonth = date.getUTCMonth();
      const utcDay = date.getUTCDate();

      const startTime = new Date(Date.UTC(utcYear, utcMonth, utcDay, 0, 0, 0));
      const endTime = new Date(Date.UTC(utcYear, utcMonth, utcDay, 23, 59, 59));

      return {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        timezone: 'UTC',
      };
    } else {
      // Case: keep the exact timing from passed date
      return {
        startTime: date.toISOString(),
        endTime: date.toISOString(),
        timezone: 'UTC',
      };
    }
  }

  const handleCalendar = () => {
    setShowCalendar(true);
  };
  const dispatch = useAppDispatch();
  const { loggedInUser } = useSelector((store: RootState) => store.user);
  const userType = loggedInUser?.userType as string;

  const CalendarDateSelect = (data: CalendarType) => {
    setSelectedDate(data.dateObject);
    setSlots(() => [convertDateToUTCObject(data.dateObject, true)]);
    // setShowClock(true);
    setShowCalendar(false);
  };

  const handleConfirm = async () => {
    if (slots.length < 1) {
      return showToast('Please Select Slot', 'warning');
    }

    try {
      setLoader(true);
      const res: FailedInterviewResponse | SuccessInterviewScheduleResponse =
        await submitInterviewSlots(slots, userType);
      if (res.success) {
        dispatch(setInterviewSlots(res));
        setShowAlternateSlots(false);
        await completeInterviewStage(null, 'scheduled');
        const redirectPath =
          userType === 'expert' ? '/expert/interview' : '/engineer/interview';
        router.push(redirectPath);
      } else {
        showToast('Select Slot', 'success');
        setSlots([]);
        setShowAlternateSlots(true);
        setAlternateSlots(res.data.alternativeSlots);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const handleSetSlots = (data: Date) => {
    // ALREADY SELECTED
    const isSelected = slots.find(item => item.startTime == data.toISOString());
    if (isSelected) {
      return null;
    }

    if (slots.length == 1) {
      return showToast('Slot Already Selected', 'success');
    }

    setSlots(() => [convertDateToUTCObject(data, false)]);
  };

  const handleFilterSlot = (item: InterviewSlot) => {
    const filter = slots.filter(items => items.startTime !== item.startTime);
    setSlots(filter);
  };

  return (
    <div className="w-full min-h-[calc(100vh-230px)] flex justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-center items-center gap-6 sm:gap-8 w-full max-w-6xl">
        {showAlternateSlots ? (
          <AlternativeSlots
            slots={alternateSlots}
            selectedSlots={slots}
            handleSetSlots={handleSetSlots}
            handleConfirm={handleConfirm}
            handleFilterSlot={handleFilterSlot}
            loading={loader}
          />
        ) : (
          <>
            <p className="w-full max-w-4xl text-base sm:text-lg lg:text-[22px] text-center font-[300] px-4 sm:px-6 lg:px-0 leading-relaxed">
              You have now moved to the final round, for which you have to give
              your availability slot to be interviewed by the Panel
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center items-center w-full max-w-4xl">
              {slots.map(item => (
                <div
                  key={item.startTime}
                  className="flex flex-row justify-center items-center gap-2 sm:gap-3 bg-[#299b00] px-3 sm:px-4 py-2 text-white rounded-xl sm:rounded-2xl w-full sm:w-auto min-w-fit hover:bg-[#33c000] transition-colors duration-200"
                >
                  <span className="text-sm sm:text-base whitespace-nowrap">
                    {formatReadableDate(new Date(item.startTime), true)}
                  </span>
                  <MdCancel
                    onClick={(e: React.SyntheticEvent) => {
                      e.stopPropagation();
                      handleFilterSlot(item);
                    }}
                    className="size-4 sm:size-5 text-white cursor-pointer hover:scale-110 transition-transform flex-shrink-0"
                  />
                </div>
              ))}
            </div>

            <Button
              isLoading={loader}
              onClick={slots.length == 1 ? handleConfirm : handleCalendar}
              text={slots.length == 1 ? 'Confirm' : 'Select Slot'}
              className="px-8 sm:px-12 lg:px-14 py-2.5 sm:py-3 bg-[#1F514C] rounded-md font-medium shadow-[0px_9px_13.2px_0px_#B2BBB8] text-sm sm:text-base w-full sm:w-auto max-w-xs hover:bg-[#2a6660] transition-colors duration-200"
            />
          </>
        )}
      </div>

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
    </div>
  );
};

export default SelectSlot;
