import React, { FC } from 'react';

interface FloatingActionProps {
  text1: string;
  text2?: string;
  onView: () => void;
  current?: number;
  max?: number;
  type?: 'favourites' | 'shortlisted';
}

const FloatingAction: FC<FloatingActionProps> = ({
  text1,
  text2 = 'View',
  onView,
  current,
  max,
  type = 'favourites',
}) => {
  // Determine if we're at maximum capacity
  const isAtMax = current !== undefined && max !== undefined && current >= max;
  const isNearMax =
    current !== undefined && max !== undefined && current >= max - 1;

  // Color schemes based on type and status
  const getButtonColor = () => {
    if (isAtMax) {
      return 'bg-red-500 hover:bg-red-600'; // Red when at maximum
    }
    if (isNearMax) {
      return 'bg-amber-500 hover:bg-amber-600'; // Amber when near maximum
    }
    return 'bg-[#41873F] hover:bg-[#2d5f2b]'; // Default green
  };

  // Progress indicator for visual feedback
  const progressPercentage =
    current !== undefined && max !== undefined ? (current / max) * 100 : 0;

  return (
    <div className="fixed bottom-10 right-10 flex flex-col gap-2 items-end">
      {/* Progress indicator when limits are provided */}
      {current !== undefined && max !== undefined && (
        <div className="bg-white rounded-full p-2 shadow-lg">
          <div className="flex items-center gap-2 px-3 py-1">
            <span className="text-xs font-medium text-gray-600">
              {type === 'favourites' ? 'Favourites' : 'Shortlisted'}
            </span>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isAtMax
                    ? 'bg-red-500'
                    : isNearMax
                      ? 'bg-amber-500'
                      : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-gray-800">
              {current}/{max}
            </span>
          </div>
        </div>
      )}

      {/* Main floating action buttons */}
      <div className="flex flex-row gap-4">
        <button
          className={`px-5 py-2 rounded-2xl text-white shadow-[0px_4px_4px_0px_#00000040] transition-all duration-200 ${getButtonColor()}`}
          title={isAtMax ? `Maximum ${type} reached (${max})` : ''}
        >
          <span className="flex items-center gap-2">
            {text1}
            {isAtMax && (
              <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                MAX
              </span>
            )}
          </span>
        </button>
        <button
          onClick={onView}
          className={`px-5 py-2 rounded-2xl cursor-pointer text-white shadow-[0px_4px_4px_0px_#00000040] transition-all duration-200 hover:shadow-[0px_6px_6px_0px_#00000050] ${getButtonColor()}`}
        >
          {text2}
        </button>
      </div>
    </div>
  );
};

export default FloatingAction;
