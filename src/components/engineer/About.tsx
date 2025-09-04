import Image from 'next/image';
import React from 'react';

export default function AboutSection() {
  return (
    <section className="bg-white py-6 md:pt-16 md:pb-24 w-full relative">
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Top Section */}
        <div className="text-center mb-8 lg:mb-12 2xl:mb-16">
          <h2 className="text-2xl lg:text-3xl 2xl:text-4xl font-semibold text-[#1F514C] mb-10">
            What is FaujX?
          </h2>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-2xl sm:text-3xl md:text-4xl lg:leading-tight lg:text-5xl 2xl:text-5xl max-w-[28ch] min-[1728px]:text-6xl font-semibold text-[#1F514C] mb-6">
              FaujX is your gateway to global tech careers
            </p>
            {/* <p className="text-xl md:text-2xl lg:text-3xl 2xl:text-4xl text-[#3F3D56] mb-8"> */}
            <p className="font-semibold md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-[#3F3D56] mb-8">
              Students | Bootcamp Grads | Self-Taught Coders
            </p>
            <button className="bg-[#54A044] cursor-pointer hover:bg-[#54A044]/75 text-white font-semibold py-4 px-8 lg:px-12 2xl:px-16 mb-10 rounded-3xl max-md:text-sm xl:text-lg transition-all duration-200 transform hover:-translate-y-0.5">
              Explore Skills in Demand
            </button>
          </div>
          <div className="relative">
            <Image
              src="/images/skills.jpeg"
              width={600}
              height={400}
              alt="..."
              className="max-md:w-4/5 md:absolute md:h-full object-contain md:object-right max-md:mx-auto md:ml-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
