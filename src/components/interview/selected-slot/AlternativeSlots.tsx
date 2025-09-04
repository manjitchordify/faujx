import Button from '@/components/ui/Button';
import { InterviewSlot } from '@/types/interview';
import { formatDateTime } from '@/utils/helper/Helper';
import React, { FC } from 'react';
import { MdCancel } from 'react-icons/md';

interface AlternativeSlotsProps {
  slots: InterviewSlot[];
  selectedSlots: InterviewSlot[];
  handleSetSlots: (data: Date) => void;
  handleFilterSlot: (data: InterviewSlot) => void;
  handleConfirm: () => void;
  loading: boolean;
}

const AlternativeSlots: FC<AlternativeSlotsProps> = ({
  slots,
  selectedSlots,
  handleSetSlots,
  handleConfirm,
  handleFilterSlot,
  loading,
}) => {
  const isSelected = (item: InterviewSlot) => {
    const data = selectedSlots.map(item => item.startTime);
    return data.includes(item.startTime) ? true : false;
  };

  return (
    <div
      onClick={(e: React.SyntheticEvent) => e.stopPropagation()}
      className="w-full max-w-4xl mx-auto bg-white flex flex-col justify-center items-center gap-6 sm:gap-8 p-4 sm:p-6 lg:p-8 rounded-2xl"
    >
      <div className="flex flex-col gap-1 justify-center items-center text-center">
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold">
          Select 2 Alternative Slots
        </p>
        <p className="text-sm sm:text-base lg:text-[16px] text-gray-600 px-2">
          Choose your preferred time slots for the interview
        </p>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 lg:gap-5 w-full">
        {slots.map(item => (
          <div
            key={item.startTime}
            onClick={() => handleSetSlots(new Date(item.startTime))}
            className={`${
              isSelected(item) ? 'bg-[#fca800]' : 'bg-[#299b00]'
            } flex flex-row gap-2 justify-center items-center px-3 sm:px-4 py-2 sm:py-2.5 text-white rounded-xl sm:rounded-2xl cursor-pointer hover:opacity-90 transition-all duration-200 text-sm sm:text-base min-w-fit`}
          >
            <span className="whitespace-nowrap">
              {formatDateTime(item.startTime)}
            </span>
            {isSelected(item) && (
              <MdCancel
                onClick={(e: React.SyntheticEvent) => {
                  e.stopPropagation();
                  handleFilterSlot(item);
                }}
                className="size-4 sm:size-5 text-white cursor-pointer hover:scale-110 transition-transform flex-shrink-0"
              />
            )}
          </div>
        ))}
      </div>

      <Button
        isLoading={loading}
        text="Confirm"
        onClick={handleConfirm}
        className="w-full max-w-[200px] sm:w-[150px] lg:w-[100px] px-5 py-2 sm:py-3 bg-[#33c000] rounded-md text-sm sm:text-base"
      />
    </div>
  );
};

export default AlternativeSlots;
