import React from 'react';

type SectionHeaderProps = {
  mainText: string;
  aboutSection: string;
};

function SectionHeader({ mainText, aboutSection }: SectionHeaderProps) {
  return (
    <>
      <div className="max-w-4xl mx-auto text-center ">
        <p className="text-3xl sm:text-4xl md:text-6xl leading-tight font-light text-[#1F514C] tracking-tight">
          <span className="text-[#1F514C] font-medium mt-3 tracking-tight">
            {mainText}
          </span>
        </p>
      </div>
      <p className="text-3xl text-center text-[#1F514C] mb-5 md:mt-8 md:mb-3">
        {aboutSection}
      </p>
    </>
  );
}

export default SectionHeader;
