'use client';
import Image from 'next/image';
import React, { useState } from 'react';

const MentorsSection = () => {
  const [hoveredMentor, setHoveredMentor] = useState<number | null>(null);
  const [hoveredBio, setHoveredBio] = useState<number | null>(null);

  const mentors = [
    {
      id: 1,
      name: 'Mohit Bhure',
      image: '/images/expert/mentor12.jpeg',
      alt: 'Mohit Bhure - AI & Full-Stack Mentor',
      role: 'AI Software Engineer',
      company: 'Codingbyts AI-Tech Private Limited',
      bio: 'Mohit is a full-stack development, and knowledge engineering. With deep experience in Python, React, Node.js, and modern frameworks, he builds scalable AI-powered applications and leads innovative tech solutions.',
      expertise: [
        'Artificial Intelligence (AI)',
        'Intelligent Agents',
        'Knowledge Engineering',
        'Full-Stack Development',
        'Python',
        'React.js',
        'Node.js',
        'MySQL',
        'PostgreSQL',
        'PHP',
        'Laravel',
        'AngularJS',
        'JavaScript',
        'Git',
      ],
    },

    {
      id: 2,
      name: 'Karthikeyan ',
      image: '/images/expert/mentor[2].jpeg',
      alt: 'Karthikeyan Dharmalingam - Full-Stack Mentor',
      role: 'Senior Full-Stack Developer',
      company: 'TritonTech & Services Pvt Ltd',
      bio: 'Karthikeyan is a seasoned full-stack developer with expertise in modern frontend frameworks and backend technologies. With professional experience across companies like TritonTech, Chordify, and Juice Media, he specializes in building scalable web applications, API integrations, and enterprise-grade solutions.',
      expertise: [
        'React.js',
        'Angular',
        'Node.js',
        'Next.js',
        'TypeScript',
        'PostgreSQL',
        'MongoDB',
        'MySQL',
        'REST API',
        'Agile Methodologies',
        'Frontend Development',
        'Web Applications',
      ],
    },

    {
      id: 3,
      name: 'Manjit Singh',
      image: '/images/expert/mentor[3].jpg',
      alt: 'Michael Rodriguez - Full Stack Developer Mentor',
      role: 'Full Stack Developer',
      company: 'Netflix',
      bio: 'Manjit is a full-stack Developer with expertise in building high-scale applications. He mentors developers on system design, database optimization, and cloud architecture.',
      expertise: ['System Design', 'Database', 'Cloud Architecture'],
    },
    {
      id: 4,
      name: 'Taranjeet Singh',
      image: '/images/expert/mentor[4].jpg',
      alt: 'Taranjeet Singh - DevOps & Cloud Mentor',
      role: 'DevOps & Cloud Engineer',
      company: 'Amazon Web Services',
      bio: 'Taranjeet specializes in DevOps and cloud application development with strong expertise in database technologies. With years of hands-on experience, he helps teams build scalable, reliable, and efficient cloud-based solutions.',
      expertise: [
        'DevOps',
        'Cloud Application Development',
        'MySQL',
        'PostgreSQL',
      ],
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
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden border border-gray-100 w-full max-w-xs mx-auto sm:max-w-none"
                onMouseEnter={() => setHoveredMentor(mentor.id)}
                onMouseLeave={() => setHoveredMentor(null)}
              >
                {/* Image */}
                <div className="relative w-full h-48 sm:h-52 md:h-56 lg:h-60 xl:h-64 overflow-hidden">
                  <Image
                    src={mentor.image}
                    fill
                    alt={mentor.alt}
                    className="object-cover object-top group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Bio Card */}
                <div className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
                  {/* Name */}
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg md:text-xl">
                    {mentor.name}
                  </h3>

                  {/* Role and Company */}
                  <div className="space-y-1">
                    <p className="text-sm sm:text-base text-gray-600">
                      {mentor.role}
                    </p>
                  </div>

                  {/* Bio Description with Tooltip */}
                  <div className="relative">
                    <p
                      className="text-gray-700 text-sm leading-relaxed line-clamp-4 cursor-pointer hover:text-gray-900 transition-colors duration-200"
                      onMouseEnter={() => setHoveredBio(mentor.id)}
                      onMouseLeave={() => setHoveredBio(null)}
                    >
                      {mentor.bio}
                    </p>

                    {/* Bio Tooltip */}
                    {hoveredBio === mentor.id && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 pointer-events-none">
                        <div className="bg-gray-900 text-white p-4 rounded-lg shadow-xl max-w-sm w-80">
                          <div className="text-sm leading-relaxed">
                            <div className="font-semibold mb-2 text-blue-300">
                              About {mentor.name}
                            </div>
                            <div className="text-gray-100">{mentor.bio}</div>
                          </div>
                          {/* Arrow */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expertise Tags */}
                  {/* <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full border border-blue-200 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div> */}
                </div>

                {/* Main Tooltip (for card hover) */}
                {hoveredMentor === mentor.id && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-40">
                    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-xl max-w-xs w-64">
                      <div className="text-sm leading-relaxed">
                        <div className="font-semibold mb-2">{mentor.name}</div>
                        <div className="text-gray-300 text-xs mb-2">
                          {mentor.role} at {mentor.company}
                        </div>
                        <div className="text-gray-100">{mentor.bio}</div>
                        {mentor.expertise.length > 0 && (
                          <div className="mt-3">
                            <div className="text-xs text-gray-400 mb-1">
                              Expertise:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {mentor.expertise
                                .slice(0, 6)
                                .map((skill, index) => (
                                  <span
                                    key={index}
                                    className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded-full"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              {mentor.expertise.length > 6 && (
                                <span className="text-xs text-gray-400">
                                  +{mentor.expertise.length - 6} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MentorsSection;
