import React, { FC } from 'react';

interface FloatingActionProps {
  text1: string;
  text2?: string;
  onView: () => void;
}
const FloatingAction: FC<FloatingActionProps> = ({
  text1,
  text2 = 'View',
  onView,
}) => {
  return (
    <div className="fixed bottom-10 right-10 flex flex-row gap-4">
      <button className="bg-[#41873F] px-5 py-2 rounded-2xl text-white shadow-[0px_4px_4px_0px_#00000040]">
        {text1}
      </button>
      <button
        onClick={onView}
        className="bg-[#41873F] px-5 py-2 rounded-2xl cursor-pointer text-white shadow-[0px_4px_4px_0px_#00000040]"
      >
        {text2}
      </button>
    </div>
  );
};

export default FloatingAction;
