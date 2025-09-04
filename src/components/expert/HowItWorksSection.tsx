import React from 'react';

interface Step {
  number: number;
  title: string;
  description?: string;
}

const HowItWorksSection: React.FC = () => {
  const steps: Step[] = [
    {
      number: 1,
      title: 'Apply to Join',
    },
    {
      number: 2,
      title: 'Attend Panel Review',
    },
    {
      number: 3,
      title: 'Get Onboarded',
    },
    {
      number: 4,
      title: 'Set Your Rate & Calendar',
    },
    {
      number: 5,
      title: 'Mentor. Submit. Get Paid.',
    },
  ];

  return (
    <section
      className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8"
      id="aboutus"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 mb-4">
            How It Works?
          </h2>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Desktop Layout */}
          <div className="hidden lg:block">
            {/* Top Row - Steps 1, 2, 3 */}
            <div className="flex items-center justify-center mb-8 lg:mb-12">
              {steps.slice(0, 3).map((step, index) => (
                <div key={step.number} className="flex items-center">
                  {/* Step Circle */}
                  <div className="relative group">
                    <div className="size-[min(12rem,12vw)] xl:size-[min(15rem,15vw)] bg-black rounded-full flex items-center justify-center text-white text-lg xl:text-xl font-extralight transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
                      <span className="text-center text-lg xl:text-2xl leading-tight px-4 xl:px-6">
                        {step.title}
                      </span>
                    </div>
                    {/* Step Number */}
                    <div className="absolute top-1 right-1 xl:top-2 xl:right-2 2xl:top-0 2xl:right-0 size-10 xl:size-12 2xl:size-16 bg-[#66B848] rounded-full flex items-center justify-center text-white font-normal text-sm xl:text-lg lg:text-xl 2xl:text-3xl shadow-lg">
                      {step.number}
                    </div>
                  </div>

                  {/* Arrow (except for last item) */}
                  {index < 2 && (
                    <div className="mx-4 xl:mx-8">
                      <svg
                        width="32"
                        height="35"
                        viewBox="0 0 55 43"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="xl:w-10 xl:h-[43px]"
                      >
                        <path
                          d="M1.83398 21.5H9.85482M53.1673 21.5L33.9173 2.25M53.1673 21.5L33.9173 40.75M53.1673 21.5H19.4798"
                          stroke="#66B848"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Row - Steps 4, 5 */}
            <div className="flex items-center justify-center">
              {steps.slice(3, 5).map((step, index) => (
                <div key={step.number} className="flex items-center">
                  {/* Step Circle */}
                  <div className="relative group">
                    <div className="size-[min(12rem,12vw)] xl:size-[min(15rem,15vw)] bg-black rounded-full flex items-center justify-center text-white text-lg xl:text-xl font-extralight transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
                      <span className="text-center leading-tight px-4 xl:px-6 text-lg xl:text-2xl">
                        {step.title}
                      </span>
                    </div>
                    {/* Step Number */}
                    <div className="absolute top-1 right-1 xl:top-2 xl:right-2 2xl:top-0 2xl:right-0 size-10 xl:size-12 2xl:size-16 bg-[#66B848] rounded-full flex items-center justify-center text-white font-normal text-sm xl:text-lg lg:text-xl 2xl:text-3xl shadow-lg">
                      {step.number}
                    </div>
                  </div>

                  {/* Arrow (except for last item) */}
                  {index < 1 && (
                    <div className="mx-4 xl:mx-8">
                      <svg
                        width="32"
                        height="35"
                        viewBox="0 0 55 43"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="xl:w-10 xl:h-[43px]"
                      >
                        <path
                          d="M1.83398 21.5H9.85482M53.1673 21.5L33.9173 2.25M53.1673 21.5L33.9173 40.75M53.1673 21.5H19.4798"
                          stroke="#66B848"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden">
            <div className="space-y-6 sm:space-y-8">
              {steps.map((step, index) => (
                <div key={step.number} className="flex flex-col items-center">
                  {/* Step Circle */}
                  <div className="relative group">
                    <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-black rounded-full flex items-center justify-center text-white text-base sm:text-lg md:text-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                      <span className="text-center leading-tight px-3 sm:px-4">
                        {step.title}
                      </span>
                    </div>
                    {/* Step Number */}
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg shadow-lg">
                      {step.number}
                    </div>
                  </div>

                  {/* Vertical Arrow (except for last item) */}
                  {index < steps.length - 1 && (
                    <div className="my-4 sm:my-6">
                      <svg
                        width="20"
                        height="32"
                        viewBox="0 0 24 40"
                        fill="none"
                        className="text-green-500 sm:w-6 sm:h-10"
                      >
                        <path
                          d="M12 2L12 38M12 38L2 28M12 38L22 28"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
