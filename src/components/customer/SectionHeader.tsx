import React from 'react';

type SectionHeaderProps = {
  mainText: string;
  aboutSection: string;
};

function SectionHeader({ mainText, aboutSection }: SectionHeaderProps) {
  return (
    <>
      <div className="max-w-4xl mx-auto text-center ">
        <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight sm:leading-tight md:leading-tight lg:leading-tight font-semibold text-[#1F514C] tracking-tight">
          {mainText}
        </h2>
      </div>
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center text-[#1F514C] mb-4 sm:mb-5 md:mt-6 lg:mt-8 md:mb-3 leading-relaxed sm:leading-relaxed md:leading-relaxed">
        {aboutSection}
      </p>
    </>
  );
}

export default SectionHeader;
