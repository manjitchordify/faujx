import React, { FC, useState } from 'react';
import Button from './Button';

interface TabsProps {
  textArr: string[];
  onChange: (text: string) => void;
  btnStyle?: string;
}

const CustomTabs: FC<TabsProps> = ({
  textArr = ['Scheduled', 'Completed'],
  onChange,
  btnStyle,
}) => {
  const [selectedTab, setSelectedTab] = useState<string>(textArr[0]);

  return (
    <div className="w-fit flex flex-row justify-between items-center gap-1 sm:gap-2 bg-[#FFFFFF] rounded-2xl border border-gray-300">
      {textArr.map(item => (
        <Button
          key={item}
          text={item}
          textColor={`${selectedTab === item ? 'text-white' : 'text-black'}`}
          onClick={() => {
            setSelectedTab(item);
            onChange(item);
          }}
          className={`
            min-w-fit 
            w-[100px] xs:w-[120px] sm:w-[140px] md:w-[160px] lg:w-[200px] 
            rounded-2xl 
            py-2 md:py-3
            px-2 xs:px-3 sm:px-4 
            cursor-pointer 
            text-xs xs:text-sm sm:text-base
            font-medium
            transition-all duration-200
            whitespace-nowrap
            ${
              selectedTab === item
                ? 'bg-[#9BCDA4] shadow-sm'
                : 'bg-[#FFFFFF] hover:bg-gray-50'
            } 
            ${btnStyle}
          `}
        />
      ))}
    </div>
  );
};

export default CustomTabs;
