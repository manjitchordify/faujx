import React from 'react';
import Image from 'next/image';
import SectionHeader from './SectionHeader';

// Custom SVG Icons with consistent sizing and viewBox
const UsersIcon = () => (
  <svg
    className="w-6 h-6 lg:w-7 lg:h-7"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    className="w-6 h-6 lg:w-7 lg:h-7"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const GraduationCapIcon = () => (
  <svg
    className="w-6 h-6 lg:w-7 lg:h-7"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
    />
  </svg>
);

const ArrowLeftRightIcon = () => (
  <svg
    className="w-6 h-6 lg:w-7 lg:h-7"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
    />
  </svg>
);

const DollarSignIcon = () => (
  <svg
    className="w-6 h-6 lg:w-7 lg:h-7"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    className="w-6 h-6 lg:w-7 lg:h-7"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

function WhyChooseUs() {
  const benefits = [
    {
      icon: UsersIcon,
      title: 'Job-Ready Engineers',
      description: 'Pre-vetted talent across top tech skills.',
    },
    {
      icon: ClockIcon,
      title: 'Faster Hiring',
      description: 'Save 60+ hours on end-to-end hiring.',
    },
    {
      icon: GraduationCapIcon,
      title: 'LMS Powered',
      description: 'Upskill candidates via ChordifyED.',
    },
    {
      icon: ArrowLeftRightIcon,
      title: 'Cost-Efficient',
      description: 'Reduce cost per hire significantly.',
    },
    {
      icon: DollarSignIcon,
      title: 'One-Time Pricing',
      description: 'No recurring fees or hidden costs.',
    },
    {
      icon: CheckCircleIcon,
      title: 'High Success Rate',
      description: '95% candidate retention after 6 months.',
    },
  ];

  return (
    <section className="w-full min-h-screen py-2 relative overflow-hidden">
      {/* Left Side Decorative Background */}
      <Image
        src="/images/candidate-intro.png"
        alt=""
        width={400}
        height={300}
        className="absolute left-0 bottom-[15%] w-auto h-[50vh] object-contain"
        aria-hidden="true"
      />

      {/* Right Side Decorative Background */}
      <Image
        src="/images/candidate-intro.png"
        alt=""
        width={400}
        height={300}
        className="absolute right-0 bottom-[15%] w-auto h-[50vh] object-contain scale-x-[-1]"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-6 relative z-10">
        {/* Title */}
        <div className="mb-16">
          <SectionHeader mainText="Why choose us ?" aboutSection="" />
        </div>
        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div
                key={index}
                className="bg-[#F4F4F4] rounded-2xl p-8 lg:p-8Smart Vetting Process hover:shadow-xl transition-all duration-300 border border-gray-200 min-h-[140px] lg:min-h-[150px] flex flex-col"
              >
                {/* Title with Icon */}
                <div className="flex items-center gap-4 mb-4 lg:mb-6">
                  <div className="text-[#41873F] flex items-center justify-center flex-shrink-0">
                    <IconComponent />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-semibold text-[#41873F]">
                    {benefit.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-base lg:text-lg leading-relaxed flex-1">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
