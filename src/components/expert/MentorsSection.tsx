import Image from 'next/image';
import React from 'react';

const MentorsSection = () => {
  const getCompanyColor = (company: string) => {
    switch (company) {
      case 'Google':
        return 'bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent';
      case 'Meta':
        return 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent';
      case 'Netflix':
        return 'bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent';
      case 'Apple':
        return 'bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent';
      default:
        return 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent';
    }
  };

  const getCompanyIcon = (company: string) => {
    switch (company) {
      case 'Google':
        return (
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        );
      case 'Meta':
        return (
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              fill="#1877F2"
            />
          </svg>
        );
      case 'Netflix':
        return (
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 22.951c-.043-7.86-.004-15.549.002-22.95zM5.398 0L0 24h4.601L9.99 0z"
              fill="#E50914"
            />
          </svg>
        );
      case 'Apple':
        return (
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
              fill="#000000"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              fill="#6B7280"
            />
          </svg>
        );
    }
  };

  const mentors = [
    {
      id: 1,
      name: 'Sarah Chen',
      image: '/images/expert/mentor[1].jpeg',
      alt: 'Sarah Chen - UX Design Mentor',
      role: 'Senior UX Designer',
      company: 'Google',
      bio: 'Sarah is a passionate UX designer with 8+ years of experience creating intuitive digital experiences. She specializes in user research, prototyping, and design systems.',
      expertise: ['User Research', 'Prototyping', 'Design Systems'],
    },
    {
      id: 2,
      name: 'Emma Johnson',
      image: '/images/expert/mentor[2].jpeg',
      alt: 'Emma Johnson - Frontend Development Mentor',
      role: 'Lead Frontend Developer',
      company: 'Meta',
      bio: 'Emma is a frontend expert who loves building scalable web applications. She has mentored 50+ developers and specializes in React, TypeScript, and performance optimization.',
      expertise: ['React', 'TypeScript', 'Performance'],
    },
    {
      id: 3,
      name: 'Michael Rodriguez',
      image: '/images/expert/mentor[3].png',
      alt: 'Michael Rodriguez - Full Stack Developer Mentor',
      role: 'Full Stack Architect',
      company: 'Netflix',
      bio: 'Michael is a full-stack architect with expertise in building high-scale applications. He mentors developers on system design, database optimization, and cloud architecture.',
      expertise: ['System Design', 'Database', 'Cloud Architecture'],
    },
    {
      id: 4,
      name: 'Alex Kim',
      image: '/images/expert/mentor[4].jpg',
      alt: 'Alex Kim - Creative Design Mentor',
      role: 'Creative Director',
      company: 'Apple',
      bio: 'Alex leads creative teams in designing award-winning digital products. With 10+ years in the industry, he focuses on brand strategy, visual design, and creative leadership.',
      expertise: ['Brand Strategy', 'Visual Design', 'Leadership'],
    },
  ];

  return (
    <div className="bg-white">
      <section className="text-center py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20 px-3 sm:px-4 md:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium text-gray-900 mb-6 sm:mb-8 md:mb-12 lg:mb-16">
          Top FaujX Mentors
        </h2>

        {/* Mentors Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {mentors.map(mentor => (
              <div
                key={mentor.id}
                className="flex flex-col mx-auto w-full max-w-xs sm:max-w-none"
              >
                {/* Image */}
                <div className="w-full h-48 sm:h-52 md:h-56 lg:h-60 xl:h-64 rounded-t-xl sm:rounded-t-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105 relative">
                  <Image
                    src={mentor.image}
                    fill
                    alt={mentor.alt}
                    className="object-cover transition-transform duration-300 hover:scale-110"
                    sizes="(max-width: 640px) 320px, (max-width: 768px) 384px, (max-width: 1024px) 256px, (max-width: 1280px) 288px, 320px"
                  />
                </div>

                {/* Bio Card */}
                <div className="w-full h-[280px] bg-white rounded-b-xl sm:rounded-b-2xl shadow-lg border border-gray-100 p-3 sm:p-4 md:p-5 lg:p-6 text-left flex flex-col">
                  <h3 className="text-gray-900 font-semibold text-sm sm:text-base md:text-lg lg:text-xl mb-1 sm:mb-2 flex-shrink-0">
                    {mentor.name}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-2 sm:mb-3 flex-shrink-0 flex items-center gap-1 sm:gap-2">
                    {mentor.role} at{' '}
                    <span
                      className={`font-semibold flex items-center gap-1 ${getCompanyColor(mentor.company)}`}
                    >
                      {getCompanyIcon(mentor.company)}
                      {mentor.company}
                    </span>
                  </p>
                  <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mb-3 sm:mb-4 pr-1">
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                      {mentor.bio}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-auto flex-shrink-0">
                    {mentor.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full border border-blue-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
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
