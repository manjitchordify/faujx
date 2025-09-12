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
      title: 'Vetting Process',
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
      title: 'Get Engaged',
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
        <div className="relative pt-4 pb-12">
          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div
              className="grid h-[250px] xl:h-[280px] gap-0 max-w-4xl mx-auto"
              style={{
                gridTemplateColumns:
                  'auto minmax(60px, 80px) auto minmax(60px, 80px) auto minmax(60px, 80px) auto minmax(60px, 80px) auto',
                gridTemplateRows: '1fr auto 1fr',
              }}
            >
              <div className="flex items-center justify-center -mr-4 xl:-mr-6">
                <div className="relative group">
                  <div className="size-[min(10rem,10vw)] xl:size-[min(12rem,12vw)] bg-gray-900 rounded-full flex items-center justify-center text-white text-sm xl:text-lg font-extralight transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
                    <div className="text-center flex flex-col items-center justify-center h-full">
                      <div className="text-2xl xl:text-3xl font-bold text-[#66B848] mb-2">
                        {steps[0].number}
                      </div>
                      <span className="text-sm xl:text-lg leading-tight px-2 xl:px-3 text-center">
                        {steps[0].title}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div></div>

              <div className="flex items-center justify-center"></div>

              <div></div>

              {/* Step 3 */}
              <div className="flex items-center justify-center -mx-4 xl:-mx-6">
                <div className="relative group">
                  <div className="size-[min(9rem,9vw)] xl:size-[min(11rem,11vw)] bg-gray-900 rounded-full flex items-center justify-center text-white text-sm xl:text-lg font-extralight transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
                    <div className="text-center flex flex-col items-center justify-center h-full">
                      <div className="text-xl xl:text-2xl font-bold text-[#66B848] mb-2">
                        {steps[2].number}
                      </div>
                      <span className="text-sm xl:text-lg leading-tight px-2 xl:px-3 text-center">
                        {steps[2].title}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div></div>

              <div className="flex items-center justify-center"></div>

              <div></div>

              <div className="flex items-center justify-center -ml-4 xl:-ml-6">
                <div className="relative group">
                  <div className="size-[min(9rem,9vw)] xl:size-[min(11rem,11vw)] bg-gray-900 rounded-full flex items-center justify-center text-white text-sm xl:text-lg font-extralight transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
                    <div className="text-center flex flex-col items-center justify-center h-full">
                      <div className="text-xl xl:text-2xl font-bold text-[#66B848] mb-2">
                        {steps[4].number}
                      </div>
                      <span className="text-sm xl:text-lg leading-tight px-2 xl:px-3 text-center">
                        {steps[4].title}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div></div>
              <div className="flex items-center justify-center">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 55 43"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="xl:w-12 xl:h-12 transform rotate-45"
                >
                  <path
                    d="M1.83398 21.5H9.85482M53.1673 21.5L33.9173 2.25M53.1673 21.5L33.9173 40.75M53.1673 21.5H19.4798"
                    stroke="#66B848"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div></div>
              <div className="flex items-center justify-center">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 55 43"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="xl:w-12 xl:h-12 transform -rotate-45"
                >
                  <path
                    d="M1.83398 21.5H9.85482M53.1673 21.5L33.9173 2.25M53.1673 21.5L33.9173 40.75M53.1673 21.5H19.4798"
                    stroke="#66B848"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div></div>
              <div className="flex items-center justify-center">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 55 43"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="xl:w-12 xl:h-12 transform rotate-45"
                >
                  <path
                    d="M1.83398 21.5H9.85482M53.1673 21.5L33.9173 2.25M53.1673 21.5L33.9173 40.75M53.1673 21.5H19.4798"
                    stroke="#66B848"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div></div>
              <div className="flex items-center justify-center">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 55 43"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="xl:w-12 xl:h-12 transform -rotate-45"
                >
                  <path
                    d="M1.83398 21.5H9.85482M53.1673 21.5L33.9173 2.25M53.1673 21.5L33.9173 40.75M53.1673 21.5H19.4798"
                    stroke="#66B848"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div></div>
              <div></div>
              <div></div>
              <div className="flex items-center justify-center -mx-4 xl:-mx-6">
                <div className="relative group">
                  <div className="size-[min(9rem,9vw)] xl:size-[min(11rem,11vw)] bg-gray-900 rounded-full flex items-center justify-center text-white text-sm xl:text-lg font-extralight transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
                    <div className="text-center flex flex-col items-center justify-center h-full">
                      <div className="text-xl xl:text-2xl font-bold text-[#66B848] mb-2">
                        {steps[1].number}
                      </div>
                      <span className="text-sm xl:text-lg leading-tight px-2 xl:px-3 text-center">
                        {steps[1].title}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div></div>
              <div></div>
              <div></div>
              <div className="flex items-center justify-center -mx-4 xl:-mx-6">
                <div className="relative group">
                  <div className="size-[min(9rem,9vw)] xl:size-[min(11rem,11vw)] bg-gray-900 rounded-full flex items-center justify-center text-white text-sm xl:text-lg font-extralight transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
                    <div className="text-center flex flex-col items-center justify-center h-full">
                      <div className="text-xl xl:text-2xl font-bold text-[#66B848] mb-2">
                        {steps[3].number}
                      </div>
                      <span className="text-sm xl:text-lg leading-tight px-2 xl:px-3 text-center">
                        {steps[3].title}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div></div>
            </div>
          </div>

          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden">
            <div className="space-y-6 sm:space-y-8">
              {steps.map((step, index) => (
                <div key={step.number} className="flex flex-col items-center">
                  {/* Step Circle */}
                  <div className="relative group">
                    <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-gray-900 rounded-full flex items-center justify-center text-white text-base sm:text-lg md:text-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                      <div className="text-center flex flex-col items-center justify-center h-full">
                        <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#66B848] mb-2">
                          {step.number}
                        </div>
                        <span className="text-sm sm:text-base md:text-lg leading-tight px-3 sm:px-4 text-center">
                          {step.title}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vertical Arrow (except for last item) */}
                  {index < steps.length - 1 && (
                    <div className="my-4 sm:my-6">
                      <svg
                        width="32"
                        height="48"
                        viewBox="0 0 24 40"
                        fill="none"
                        className="text-[#66B848] sm:w-10 sm:h-16"
                      >
                        <path
                          d="M12 2L12 38M12 38L2 28M12 38L22 28"
                          stroke="currentColor"
                          strokeWidth="5"
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
