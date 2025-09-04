import Image from 'next/image';
import React from 'react';

const MentorsSection = () => {
  const mentors = [
    {
      id: 1,
      name: 'Sarah Chen',
      image: '/images/expert/mentor1.jpg',
      alt: 'Sarah Chen - UX Design Mentor',
    },
    {
      id: 2,
      name: 'Emma Johnson',
      image: '/images/expert/mentor2.png',
      alt: 'Emma Johnson - Frontend Development Mentor',
    },
    {
      id: 3,
      name: 'Michael Rodriguez',
      image: '/images/expert/mentor3.png',
      alt: 'Michael Rodriguez - Full Stack Developer Mentor',
    },
    {
      id: 4,
      name: 'Alex Kim',
      image: '/images/expert/mentor4.png',
      alt: 'Alex Kim - Creative Design Mentor',
    },
  ];

  return (
    <div className="bg-white">
      <section className="text-center py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 mb-8 sm:mb-12 md:mb-16">
          Top FaujX Mentors
        </h2>

        {/* Mentors Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {mentors.map(mentor => (
              <div key={mentor.id} className="flex-shrink-0 group">
                <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-48 md:h-56 lg:w-56 lg:h-64 xl:w-64 xl:h-72 rounded-2xl sm:rounded-3xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 relative">
                  <Image
                    src={mentor.image}
                    fill
                    alt={mentor.alt}
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 640px) 128px, (max-width: 768px) 144px, (max-width: 1024px) 192px, (max-width: 1280px) 224px, 256px"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MentorsSection;
