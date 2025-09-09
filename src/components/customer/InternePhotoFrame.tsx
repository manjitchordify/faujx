'use client';
import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// TypeScript interfaces
interface Developer {
  name: string;
  image: string;
  skills: string[];
  capabilities: string[];
  workType: string;
  role: 'developer' | 'expert' | 'mentor';
}

// Animation variants with proper typing
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// Sample profiles data
const profiles: Developer[] = [
  // Developers
  {
    name: 'Olivia Smith',
    image: '/images/customer/image 10.png',
    skills: ['React', 'Node', 'CSS', 'HTML', 'Redux', 'GraphQL'],
    capabilities: [
      'Full-stack development with modern JavaScript frameworks',
      'API design and database optimization',
      'Agile development and team collaboration',
    ],
    workType: 'Remote',
    role: 'developer',
  },
  {
    name: 'John Doe',
    image: '/images/customer/image 11.png',
    skills: ['Vue', 'Python', 'MongoDB', 'Django', 'AWS', 'REST API'],
    capabilities: [
      'Cloud infrastructure and deployment automation',
      'Backend architecture and microservices design',
      'Database management and performance tuning',
    ],
    workType: 'Remote',
    role: 'developer',
  },
  // Experts
  {
    name: 'Dr. Sarah Johnson',
    image: '/images/customer/image 9.jpg',
    skills: [
      'Angular',
      'Java',
      'PostgreSQL',
      'Spring Boot',
      'Docker',
      'Kubernetes',
    ],
    capabilities: [
      'Enterprise application development and scaling',
      'Container orchestration and DevOps practices',
      'System architecture and security implementation',
    ],
    workType: 'Hybrid',
    role: 'expert',
  },
  {
    name: 'Michael Chen',
    image: '/images/customer/image 12.png',
    skills: [
      'TypeScript',
      'Next.js',
      'Tailwind',
      'React Query',
      'Firebase',
      'Jest',
    ],
    capabilities: [
      'Modern frontend development and user experience design',
      'Testing strategies and quality assurance',
      'Performance optimization and code maintainability',
    ],
    workType: 'Remote',
    role: 'expert',
  },
  // Mentors
  {
    name: 'Alex Rodriguez',
    image: '/images/customer/image 10.png',
    skills: [
      'Leadership',
      'Team Management',
      'Agile',
      'Scrum',
      'Product Strategy',
      'Communication',
    ],
    capabilities: [
      'Technical leadership and team building',
      'Career development and growth planning',
      'Cross-functional collaboration and stakeholder management',
    ],
    workType: 'Remote',
    role: 'mentor',
  },
  {
    name: 'Emma Thompson',
    image: '/images/customer/image 11.png',
    skills: [
      'Python',
      'Machine Learning',
      'Data Science',
      'AI',
      'Research',
      'Innovation',
    ],
    capabilities: [
      'Advanced technical mentoring and knowledge transfer',
      'Research and development guidance',
      'Innovation strategy and emerging technology adoption',
    ],
    workType: 'Hybrid',
    role: 'mentor',
  },
];

const InternePhotoFrame: React.FC = () => {
  const [currentProfile, setCurrentProfile] = useState<number>(0);

  const nextProfile = (): void => {
    setCurrentProfile((prev: number) => (prev + 1) % profiles.length);
  };

  const prevProfile = (): void => {
    setCurrentProfile(
      (prev: number) => (prev - 1 + profiles.length) % profiles.length
    );
  };

  const profile: Developer = profiles[currentProfile];

  // Role-based styling
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'developer':
        return 'bg-[#418B3D]';
      case 'expert':
        return 'bg-[#3B82F6]';
      case 'mentor':
        return 'bg-[#8B5CF6]';
      default:
        return 'bg-[#418B3D]';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'developer':
        return 'Developer';
      case 'expert':
        return 'Expert';
      case 'mentor':
        return 'Mentor';
      default:
        return 'Developer';
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-white">
      <motion.div
        className="max-w-7xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
      >
        {/* Profile Card Section */}
        <motion.div
          className="relative flex items-center justify-center mb-12 sm:mb-16 lg:mb-20"
          variants={cardVariants}
        >
          {/* Container for card and arrows */}
          <div className="relative flex items-center justify-center w-full max-w-5xl mx-auto">
            {/* Left Arrow */}
            <motion.button
              onClick={prevProfile}
              className="flex-shrink-0 p-2 sm:p-3 rounded-full bg-white shadow-lg hover:shadow-xl border border-gray-200 mr-4 sm:mr-6 lg:mr-8 z-10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              aria-label="Previous profile"
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
            </motion.button>

            {/* Profile Card */}
            <motion.div
              key={currentProfile}
              className="bg-[#1F514C] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 max-w-sm sm:max-w-2xl lg:max-w-4xl w-full flex-shrink-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-xl overflow-hidden bg-gray-800">
                    <Image
                      src={profile.image}
                      alt={`${profile.name} profile`}
                      width={192}
                      height={192}
                      className="w-full h-full object-cover"
                      priority={currentProfile === 0}
                    />
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 w-full text-center lg:text-left">
                  {/* Header with Name and Role */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                    <div className="text-white text-xl sm:text-2xl lg:text-3xl font-bold">
                      {profile.name}
                    </div>
                    <span
                      className={`${getRoleColor(profile.role)} text-white px-3 py-1 rounded-full font-semibold text-xs`}
                    >
                      {getRoleLabel(profile.role)}
                    </span>
                  </div>

                  {/* Skills and Capabilities Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Skills Section */}
                    <div>
                      <h3 className="text-white mb-2 font-bold text-lg">
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill: string, index: number) => (
                          <span
                            key={index}
                            className={`${getRoleColor(profile.role)} text-white px-3 py-1.5 rounded-full font-medium text-xs`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Capabilities Section */}
                    <div>
                      <h3 className="text-white mb-2 font-bold text-lg">
                        Capabilities
                      </h3>
                      <ul className="space-y-1.5">
                        {profile.capabilities.map(
                          (capability: string, index: number) => (
                            <li
                              key={index}
                              className="text-white text-sm flex items-start"
                            >
                              <span
                                className={`${getRoleColor(profile.role).replace('bg-', 'text-')} mr-2 mt-1 flex-shrink-0`}
                              >
                                •
                              </span>
                              <span>{capability}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Arrow */}
            <motion.button
              onClick={nextProfile}
              className="flex-shrink-0 p-2 sm:p-3 rounded-full bg-white shadow-lg hover:shadow-xl border border-gray-200 ml-4 sm:ml-6 lg:ml-8 z-10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              aria-label="Next profile"
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
            </motion.button>
          </div>
        </motion.div>

        {/* Dots Indicator for Profile Cards */}
        <div className="flex justify-center mt-6 sm:mt-8 gap-1.5 sm:gap-2">
          {profiles.map((_: Developer, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentProfile(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentProfile
                  ? 'bg-[#1F514C] w-6 sm:w-8'
                  : 'bg-gray-300 hover:bg-gray-400 w-2'
              }`}
              type="button"
              aria-label={`Go to profile ${index + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default InternePhotoFrame;
