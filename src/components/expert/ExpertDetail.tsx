import React from 'react';

const ExpertDetail: React.FC = () => {
  const expertBenefits = [
    {
      title: 'Career Advice & Roadmap Guidance',
      icon: 'career',
    },
    {
      title: 'Mock Interviews with Feedback',
      icon: 'interview',
    },
    {
      title: 'Debugging & Project Review',
      icon: 'debug',
    },
    {
      title: 'Tech Stack & System Design Guidance',
      icon: 'tech',
    },
  ];

  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case 'career':
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            aria-hidden="true"
            role="img"
          >
            <path
              d="M24 4L30 10H38V18L44 24L38 30V38H30L24 44L18 38H10V30L4 24L10 18V10H18L24 4Z"
              fill="#1F514C"
            />
            <path
              d="M24 8L28 12H36V20L40 24L36 28V36H28L24 40L20 36H12V28L8 24L12 20V12H20L24 8Z"
              fill="#2A6B65"
            />
            <circle cx="24" cy="24" r="6" fill="white" />
            <path
              d="M21 24L23 26L27 22"
              stroke="#1F514C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'interview':
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            aria-hidden="true"
            role="img"
          >
            <rect x="8" y="12" width="32" height="24" rx="4" fill="#1F514C" />
            <rect x="10" y="14" width="28" height="20" rx="2" fill="#2A6B65" />
            <circle cx="18" cy="22" r="3" fill="white" />
            <path
              d="M26 22C26 24.2091 24.2091 26 22 26C19.7909 26 18 24.2091 18 22"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <rect x="14" y="30" width="20" height="2" rx="1" fill="white" />
            <rect x="16" y="34" width="16" height="2" rx="1" fill="white" />
          </svg>
        );
      case 'debug':
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            aria-hidden="true"
            role="img"
          >
            <rect x="6" y="8" width="36" height="32" rx="4" fill="#1F514C" />
            <rect x="8" y="10" width="32" height="28" rx="2" fill="#2A6B65" />
            <rect x="12" y="14" width="24" height="2" rx="1" fill="white" />
            <rect x="12" y="18" width="20" height="2" rx="1" fill="white" />
            <rect x="12" y="22" width="16" height="2" rx="1" fill="white" />
            <rect x="12" y="26" width="18" height="2" rx="1" fill="white" />
            <circle cx="32" cy="20" r="4" fill="white" />
            <path
              d="M30 20L32 22L34 20"
              stroke="#1F514C"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'tech':
        return (
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            aria-hidden="true"
            role="img"
          >
            <path d="M24 4L8 16V32L24 44L40 32V16L24 4Z" fill="#1F514C" />
            <path d="M24 8L12 18V30L24 40L36 30V18L24 8Z" fill="#2A6B65" />
            <rect x="20" y="20" width="8" height="8" rx="2" fill="white" />
            <rect x="18" y="18" width="12" height="2" rx="1" fill="white" />
            <rect x="18" y="30" width="12" height="2" rx="1" fill="white" />
            <rect x="16" y="20" width="2" height="8" rx="1" fill="white" />
            <rect x="30" y="20" width="2" height="8" rx="1" fill="white" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-8 sm:pb-12 md:pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 mb-4 sm:mb-6">
            Why Become a FaujX Expert?
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light px-4">
            At FaujX, we don&apos;t just assess engineers—we elevate them. As an
            expert, you play a critical role in building a generation of
            disciplined, capable, and deployment-ready tech professionals.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {expertBenefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex flex-col items-center justify-center min-h-[180px] sm:min-h-[200px] md:min-h-[220px] text-center">
                {/* Icon */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center mb-6 sm:mb-8">
                  {renderIcon(benefit.icon)}
                </div>

                {/* Title */}
                <div className="flex items-center flex-1">
                  <h3 className="text-base sm:text-lg md:text-xl font-medium text-gray-900 leading-tight text-center max-w-full">
                    {benefit.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertDetail;
