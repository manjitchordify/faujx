import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function GuidanceCard() {
  return (
    <section className="w-full" id="book-mentor">
      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-0 overflow-hidden">
        <div className="relative order-2 max-lg:min-h-[60vh] lg:order-1">
          <Image
            src={'/mentorship.jpg'}
            fill
            alt="Person in video call mentorship session"
            className="object-cover"
          />
        </div>

        <div className="order-1 lg:order-2 bg-gradient-to-br from-[#2A6B65] to-[#1F514C] p-6 lg:p-12 flex flex-col justify-center">
          <div className="flex flex-col gap-4 w-full lg:max-w-[90%] mx-auto">
            <div className="flex-1 flex flex-col gap-4">
              <h2 className="text-white text-3xl md:text-4xl 2xl:text-5xl font-semibold leading-tight mb-4 lg:mb-6 xl:mb-8">
                Book-a-Mentor
              </h2>

              <div className="space-y-4">
                <div className="text-lg lg:text-xl 2xl:text-2xl flex items-center space-x-3">
                  <svg
                    className="size-[1.125em] text-black flex-shrink-0 bg-white rounded-full p-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-white font-medium">
                    Career Advice & Roadmap planning
                  </span>
                </div>

                <div className="text-lg lg:text-xl 2xl:text-2xl flex items-center space-x-3">
                  <svg
                    className="size-[1.125em] text-black flex-shrink-0 bg-white rounded-full p-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-white font-medium">
                    Mock Interviews & Project Reviews
                  </span>
                </div>

                <div className="text-lg lg:text-xl 2xl:text-2xl flex items-center space-x-3">
                  <svg
                    className="size-[1.125em] text-black flex-shrink-0 bg-white rounded-full p-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-white font-medium">
                    Debugging & Code Reviews
                  </span>
                </div>

                <div className="text-lg lg:text-xl 2xl:text-2xl flex items-center space-x-3">
                  <svg
                    className="size-[1.125em] text-black flex-shrink-0 bg-white rounded-full p-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-white font-medium">
                    Tech Stack & System Design guidance
                  </span>
                </div>
              </div>
            </div>

            <Link
              href={'/engineer/dashboard/browse-mentors'}
              className="mt-6 cursor-pointer bg-[#EAEAE2] hover:bg-gray-300 text-[#1F514C] font-semibold py-2.5 text-xl px-8 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 self-start"
            >
              Book a Free Mentor Call
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
