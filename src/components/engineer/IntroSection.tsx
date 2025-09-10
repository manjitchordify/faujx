import Image from 'next/image';
import React from 'react';
import {
  PiGraduationCapFill,
  PiBookOpenFill,
  PiUsersFill,
  PiRocketLaunchFill,
  PiGlobeFill,
  PiHandshakeFill,
} from 'react-icons/pi';

// Dynamic data for the cards
const featureCards = [
  {
    id: 1,
    icon: PiGraduationCapFill,
    title: 'Skills First (Approach)',
    description: 'Get Hired for ability, NOT just your degree.',
  },
  {
    id: 2,
    icon: PiBookOpenFill,
    title: 'Integrated LMS',
    description:
      'Access learning modules before interviews to boost confidence.',
  },
  {
    id: 3,
    icon: PiUsersFill,
    title: 'Mentor Support',
    description: 'Real-Time advice & guidance from Industry Experts.',
  },
  {
    id: 4,
    icon: PiRocketLaunchFill,
    title: 'Faster Client Access',
    description:
      'Skip long hiring funnels, get in front of global clients sooner.',
  },
  {
    id: 5,
    icon: PiGlobeFill,
    title: 'Global Clients',
    description:
      'Work opportunities with global clients based in USA, Canada, Europe, Japan, South Korea, Singapore , India.',
  },
  {
    id: 6,
    icon: PiHandshakeFill,
    title: 'Post Hire Support',
    description: 'To help you ramp faster & thrive in your new job.',
  },
];

export default function IntroSection() {
  return (
    <section className="bg-[#f7f7f7] py-8 sm:py-12 md:pt-16 md:pb-24 w-full relative overflow-hidden">
      {/* Background Images - Hidden on mobile, visible on larger screens */}
      <div className="hidden md:block absolute left-0 bottom-[6%] w-full h-[50vh]">
        <Image
          src="/images/candidate-intro.png"
          alt=""
          aria-hidden="true"
          fill
          className="object-contain object-left"
        />
      </div>
      <div className="hidden md:block absolute right-0 bottom-[6%] w-full h-[50vh] scale-x-[-1]">
        <Image
          src="/images/candidate-intro.png"
          alt=""
          aria-hidden="true"
          fill
          className="object-contain object-right"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-semibold text-[#1F514C] mb-6 sm:mb-8 lg:mb-10 leading-tight sm:leading-tight md:leading-tight">
            Why FaujX?
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-normal text-[#1F514C] mb-4 sm:mb-6 leading-relaxed sm:leading-relaxed md:leading-relaxed">
            A mission-driven platform transforming engineers into job-ready
            talent.
          </p>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {featureCards.map(card => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.id}
                className="relative rounded-2xl p-4 sm:p-5 lg:p-6 transition-all duration-200 border border-[#c0c0c0] border-b-0 bg-gradient-to-t from-[#f0f0f0] to-[#ffffff] hover:shadow-lg"
              >
                {/* Icon */}
                <div className="size-8 sm:size-10 lg:size-12 bg-gradient-to-br from-[#2A6B65] to-[#1F514C] rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <IconComponent
                    size={20}
                    className="sm:w-6 sm:h-6 lg:w-7 lg:h-7"
                    color="#319F43"
                  />
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold text-[#1F514C] mb-3 sm:mb-4 lg:mb-6 leading-tight sm:leading-tight md:leading-tight">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm md:text-base lg:text-base 2xl:text-lg text-[#1F514C] font-normal leading-relaxed sm:leading-relaxed md:leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
