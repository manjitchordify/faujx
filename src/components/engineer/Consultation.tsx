import React from 'react';
import Image from 'next/image';

export default function Consultation() {
  return (
    <section className="w-full">
      <div className="flex flex-col lg:flex-row min-h-[400px]">
        {/* Left Side - Content */}
        <div className="lg:flex-[0.6] bg-[#1F514C] py-16 lg:py-20 flex flex-col justify-center">
          <div className="w-full lg:max-w-[90%] mx-auto px-6 lg:px-8">
            <h2 className="text-white max-w-[25ch] text-4xl lg:text-5xl font-bold leading-tight lg:leading-none mb-6">
              Take the first step toward building your dream team.
            </h2>

            <p className="text-white max-w-[58ch] text-lg lg:text-xl leading-relaxed mb-8 opacity-90">
              Start using Foundation Engineers today and connect with top
              companies faster and more efficiently!
            </p>

            <button className="bg-[#EAEAE2] hover:bg-gray-300 text-[#1F514C] font-semibold py-4 px-8 rounded-2xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-block">
              Start my journey
            </button>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="lg:flex-[0.4] relative min-h-[400px] lg:min-h-[500px]">
          <Image
            src="/image-3.webp"
            alt="Smiling woman with curly hair in professional setting"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
