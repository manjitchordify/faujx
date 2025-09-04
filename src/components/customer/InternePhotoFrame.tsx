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
  workType: string;
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

// Sample developers data
const developers: Developer[] = [
  {
    name: 'Olivia Smith',
    image: '/images/customer/image 10.png',
    skills: ['React', 'Node', 'CSS', 'HTML', 'Redux', 'GraphQL'],
    workType: 'Remote',
  },
  {
    name: 'John Doe',
    image: '/images/customer/image 11.png',
    skills: ['Vue', 'Python', 'MongoDB', 'Django', 'AWS', 'REST API'],
    workType: 'Remote',
  },
  {
    name: 'Sarah Johnson',
    image: '/images/customer/image 9.jpg',
    skills: [
      'Angular',
      'Java',
      'PostgreSQL',
      'Spring Boot',
      'Docker',
      'Kubernetes',
    ],
    workType: 'Hybrid',
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
    workType: 'Remote',
  },
  {
    name: 'Olivia Smith',
    image: '/images/customer/image 10.png',
    skills: ['React', 'Node', 'CSS', 'HTML', 'Redux', 'GraphQL'],
    workType: 'Remote',
  },
  {
    name: 'John Doe',
    image: '/images/customer/image 11.png',
    skills: ['Vue', 'Python', 'MongoDB', 'Django', 'AWS', 'REST API'],
    workType: 'Remote',
  },
  {
    name: 'Sarah Johnson',
    image: '/images/customer/image 9.jpg',
    skills: [
      'Angular',
      'Java',
      'PostgreSQL',
      'Spring Boot',
      'Docker',
      'Kubernetes',
    ],
    workType: 'Hybrid',
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
    workType: 'Remote',
  },
];

const InternePhotoFrame: React.FC = () => {
  const [currentDeveloper, setCurrentDeveloper] = useState<number>(0);

  const nextDeveloper = (): void => {
    setCurrentDeveloper((prev: number) => (prev + 1) % developers.length);
  };

  const prevDeveloper = (): void => {
    setCurrentDeveloper(
      (prev: number) => (prev - 1 + developers.length) % developers.length
    );
  };

  const developer: Developer = developers[currentDeveloper];

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
              onClick={prevDeveloper}
              className="flex-shrink-0 p-2 sm:p-3 rounded-full bg-white shadow-lg hover:shadow-xl border border-gray-200 mr-4 sm:mr-6 lg:mr-8 z-10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              aria-label="Previous developer"
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
            </motion.button>

            {/* Profile Card */}
            <motion.div
              key={currentDeveloper}
              className="bg-[#1F514C] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 max-w-sm sm:max-w-md lg:max-w-2xl w-full flex-shrink-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 lg:gap-8">
                {/* Profile Image */}
                <div className="flex-shrink-0 w-full sm:w-auto">
                  <div className="w-full sm:w-40 lg:w-52 h-48 sm:h-56 lg:h-64 rounded-lg sm:rounded-xl overflow-hidden bg-gray-800 mx-auto sm:mx-0">
                    <Image
                      src={developer.image}
                      alt={`${developer.name} profile`}
                      width={208}
                      height={256}
                      className="w-full h-full object-cover"
                      priority={currentDeveloper === 0}
                    />
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 w-full text-center sm:text-left">
                  <div className="text-white text-xl sm:text-2xl lg:text-3xl mb-4 sm:mb-6">
                    {developer.name}
                  </div>

                  {/* Skills Section */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-white  mb-2 sm:mb-3 font-bold text-xl">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      {developer.skills.map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="bg-[#418B3D] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Work Type Badge */}
                  <div className="flex justify-center sm:justify-end">
                    <span className="bg-white text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 !rounded-[20px] font-semibold text-xs sm:text-sm border-2 border-[#418B3D]">
                      {developer.workType}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Arrow */}
            <motion.button
              onClick={nextDeveloper}
              className="flex-shrink-0 p-2 sm:p-3 rounded-full bg-white shadow-lg hover:shadow-xl border border-gray-200 ml-4 sm:ml-6 lg:ml-8 z-10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              aria-label="Next developer"
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
            </motion.button>
          </div>
        </motion.div>

        {/* Dots Indicator for Profile Cards */}
        <div className="flex justify-center mt-6 sm:mt-8 gap-1.5 sm:gap-2">
          {developers.map((_: Developer, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentDeveloper(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentDeveloper
                  ? 'bg-[#1F514C] w-6 sm:w-8'
                  : 'bg-gray-300 hover:bg-gray-400 w-2'
              }`}
              type="button"
              aria-label={`Go to developer ${index + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default InternePhotoFrame;
