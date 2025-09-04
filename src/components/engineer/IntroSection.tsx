import Image from 'next/image';
import React from 'react';
import { PiNutFill } from 'react-icons/pi';

// Dynamic data for the cards
const featureCards = [
  {
    id: 1,
    icon: PiNutFill,
    title: 'Skill First',
    description:
      'Hire for ability, not just a resume. We connect opportunities with proven skills.',
  },
  {
    id: 2,
    icon: PiNutFill,
    title: 'Integration LMS',
    description:
      'Integrated learning before interviews. Boosts confidence and success rate. ',
  },
  {
    id: 3,
    icon: PiNutFill,
    title: 'Mentor Support',
    description:
      'Real-time access to industry experts. Get guidance exactly when you need.',
  },
  {
    id: 4,
    icon: PiNutFill,
    title: 'Faster Client Access',
    description:
      'Skip long hiring processes. Connect with clients in record time.',
  },
  {
    id: 5,
    icon: PiNutFill,
    title: 'Global Clients',
    description:
      'Work opportunities with global clients based in USA, Canada, Europe, Japan, South Korea, Singapore , India.',
  },
];

export default function IntroSection() {
  return (
    <section className="bg-[#f7f7f7] py-6 md:pt-16 md:pb-24 w-full relative">
      {/* Decorative wave shape */}
      {/* <div className="absolute top-0 left-0 w-96 h-96 bg-gray-200 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"></div> */}

      <div className="absolute left-0 bottom-[6%] w-full h-[50vh]">
        <Image
          src="/images/candidate-intro.png"
          // className="absolute left-0 bottom-[6%] w-auto h-[50vh] object-contain"
          alt="..."
          aria-hidden="true"
          fill
        />
      </div>
      <div className="absolute right-0 bottom-[6%] w-full h-[50vh] scale-x-[-1]">
        <Image
          src="/images/candidate-intro.png"
          // className="absolute right-0 bottom-[6%] w-auto h-[50vh] object-contain scale-x-[-1]"
          alt="..."
          aria-hidden="true"
          fill
        />
      </div>
      {/* <img
        src="/images/candidate-intro.png"
        className="absolute left-0 bottom-[6%] w-auto h-[50vh] object-contain"
        aria-hidden="true"
      />
      <img
        src="/images/candidate-intro.png"
        className="absolute right-0 bottom-[6%] w-auto h-[50vh] object-contain scale-x-[-1]"
        aria-hidden="true"
      /> */}

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Top Section */}
        <div className="text-center mb-16">
          <h2 className="text-2xl lg:text-3xl 2xl:text-4xl font-semibold text-[#1F514C] mb-10">
            Why FaujX?
          </h2>
          <p className="text-3xl lg:text-4xl max-w-[34ch] mx-auto 2xl:text-5xl font-semibold text-[#1F514C] mb-6">
            A mission-driven platform transforming engineers into job-ready
            talent.
          </p>
        </div>

        {/* Cards Section */}
        <div className="flex flex-wrap lg:w-11/12 mx-auto justify-center gap-6">
          {featureCards.map(card => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.id}
                className="basis-[max(calc(33.3%-1.5rem),15rem)] shrink-0 relative rounded-2xl p-4 transition-shadow duration-200 border border-[#c0c0c0] border-b-0 bg-gradient-to-t from-[#f0f0f0] to-[#ffffff]"
              >
                {/* Icon */}
                <div className="size-10 bg-[#1F514C] rounded-xl flex items-center justify-center mb-4">
                  <IconComponent size={24} color="#319F43" />
                </div>

                {/* Title */}
                <h3 className="md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold text-[#1F514C] mb-6">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-[#1F514C] font-semibold max-md:text-sm 2xl:text-lg leading-relaxed">
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
