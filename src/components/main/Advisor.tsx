'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAppDispatch } from '@/store/store';
import { setMainContent } from '@/store/slices/uiSlice';

interface AdvisorData {
  id: number;
  name: string;
  title: string;
  expertise: string[];
  experience: string;
  rating: number;
  hourlyRate: number;
  avatar: string;
  description: string;
  skills: string[];
  availability: string;
  linkedin: string;
}

const Advisor: React.FC = () => {
  const dispatch = useAppDispatch();
  const [selectedAdvisor, setSelectedAdvisor] = useState<AdvisorData | null>(
    null
  );

  // Dummy data for advisors
  const advisors: AdvisorData[] = [
    {
      id: 1,
      name: 'Paul Zaengle',
      title: 'Co-Founder and Managing Partner at Nimbl',
      expertise: ['System Design', 'Cloud Architecture', 'Microservices'],
      experience: '15+ years',
      rating: 4.9,
      hourlyRate: 150,
      avatar: '/images/advisors/paul.jpeg',
      description:
        'Paul is a seasoned professional with over two decades of experience in boutique and multinational professional services firms. He is the Co-Founder and Managing Partner of Nimbl Consulting, LLC, a professional services company delivering strategy, design, technology, analytics, and managed services to clients in highly regulated industries. At Nimbl, Paul and his team focus on creating personalized experiences and high-quality solutions delivered with speed and scale. With a strong client-first mindset and a proven track record of building trusted partnerships, he continues to help organizations grow while optimizing costs through innovative, tailored solutions.',
      skills: ['AWS', 'Kubernetes', 'Docker', 'Node.js', 'Python', 'React'],
      availability: 'Available for 1:1 sessions',
      linkedin: 'https://www.linkedin.com/in/paulzaengle/',
    },
    {
      id: 2,
      name: 'Surjeet Singh',
      title:
        'Former CEO, CFO - Information /Tech services, SaaS. Board Member, Advisor Private /Public companies, Private equity, Entrepreneur, Investor',
      expertise: ['Business Strategy', 'Financial Management', 'Leadership'],
      experience: '20+ years',
      rating: 4.8,
      hourlyRate: 120,
      avatar: '/images/advisors/surjeet.jpeg',
      description:
        'Surjeet Singh is a seasoned management professional with 20+ years of global, multi-industry leadership experience as an entrepreneur, CFO, CEO, and board member. He has advised founders and private equity firms, driving business turnarounds, strategic exits, and management transitions across IT services, SaaS, managed services, pharma, and telecom. He has a proven track record of delivering measurable outcomes—such as scaling SaaS and managed services revenue 3x with EBITDA growth to 25%, leading a $1.5B strategic exit at Patni Computer Services, and guiding successful acquisitions including Cymbal Corporation and Liquidhub. His diverse leadership journey spans public companies, private equity portfolio firms, and entrepreneurial ventures. An alumnus of Harvard Business School\'s Advanced Management Program, Surjeet is also a CPA and Cost & Management Accountant. Recognized by Business Today as one of India\'s "25 Hottest Young Executives" in 2008, he continues to bring deep expertise in scaling organizations, driving transformations, and fostering cross-functional collaboration in culturally diverse teams',
      skills: [
        'Business Strategy',
        'Financial Planning',
        'Leadership',
        'M&A',
        'Operations',
        'Team Building',
      ],
      availability: 'Available for group sessions',
      linkedin: 'https://www.linkedin.com/in/surjeetsingh68/',
    },
    {
      id: 3,
      name: 'Sachin Gupta',
      title: 'Engineering Leader, Investor',
      expertise: ['AI/ML', 'Software Engineering', 'Product Development'],
      experience: '8+ years',
      rating: 4.7,
      hourlyRate: 130,
      avatar: '/images/advisors/sachin.jpeg',
      description:
        'Hyper is a buy-side ad platform that uses a reinforcement learning AI to provide planning, trafficking, and optimization assistance to ad managers. It turns a simple campaign spec into a comprehensive multichannel media plan with hundreds of carefully chosen experiments across creative, audience segment, and channel. We also have been core partners in product and engineering development for leading companies such as Uber, FuelX, Inpwrd, Highwire, Nomis, Qventus, Weedmaps, and others.',
      skills: [
        'AI/ML',
        'Software Engineering',
        'Product Development',
        'Data Analytics',
        'Machine Learning',
        'System Architecture',
      ],
      availability: 'Available for technical consultations',
      linkedin: 'https://www.linkedin.com/in/sachingp/',
    },
  ];

  const handleAdvisorSelect = (advisor: AdvisorData) => {
    setSelectedAdvisor(advisor);
  };

  const handleBack = () => {
    if (selectedAdvisor) {
      setSelectedAdvisor(null);
    } else {
      // Go back to main content using Redux
      dispatch(setMainContent('main'));
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const profileVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
      },
    },
  };

  const imageVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotateY: -15,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 1,
        delay: 0.2,
      },
    },
  };

  const contentVariants = {
    hidden: {
      opacity: 0,
      x: 30,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        delay: 0.4,
      },
    },
  };

  if (selectedAdvisor) {
    return (
      <motion.div
        className="w-full min-h-screen bg-gray-50 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-6xl mx-auto px-4">
          {/* Back Button */}
          <motion.button
            onClick={handleBack}
            className="flex items-center text-[#1F514C] hover:text-[#1F514C]/80 mb-6 transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {selectedAdvisor ? 'Back to Advisors' : 'Back to Home'}
          </motion.button>

          {/* Advisor Detail View */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-[#1F514C] to-[#2A6B65] p-8 text-white">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src={selectedAdvisor.avatar}
                    alt={selectedAdvisor.name}
                    width={120}
                    height={120}
                    className="rounded-full border-4 border-white/20"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">
                      {selectedAdvisor.name}
                    </h1>
                    <motion.a
                      href={selectedAdvisor.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/90 hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg
                        className="w-7 h-7"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </motion.a>
                  </div>
                  <p className="text-xl text-white/90 mb-3">
                    {selectedAdvisor.title}
                  </p>
                  <div className="hidden flex items-center gap-4 text-white/80">
                    <span className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {selectedAdvisor.rating}
                    </span>
                    <span>•</span>
                    <span>{selectedAdvisor.experience}</span>
                    <span>•</span>
                    <span>${selectedAdvisor.hourlyRate}/hr</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 gap-8">
                {/* Full Width Description & Skills */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      About
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-justify">
                      {selectedAdvisor.description}
                    </p>
                  </div>

                  <div className="hidden">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      Expertise
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedAdvisor.expertise.map((skill, index) => (
                        <motion.span
                          key={index}
                          className="px-3 py-1 bg-[#1F514C]/10 text-[#1F514C] rounded-full text-sm font-medium"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  <div className="hidden">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      Technical Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedAdvisor.skills.map((skill, index) => (
                        <motion.span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Booking & Availability */}
                <div className="hidden space-y-6">
                  <motion.div
                    className="bg-gray-50 rounded-xl p-6"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Book a Session
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Hourly Rate:</span>
                        <span className="font-semibold text-[#1F514C]">
                          ${selectedAdvisor.hourlyRate}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Availability:</span>
                        <span className="text-sm text-green-600 font-medium">
                          {selectedAdvisor.availability}
                        </span>
                      </div>
                      <motion.button
                        className="w-full bg-[#1F514C] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#1F514C]/90 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Schedule Session
                      </motion.button>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-blue-50 rounded-xl p-6"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">
                      Quick Stats
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-blue-600">
                          Sessions Completed
                        </span>
                        <span className="font-semibold">247</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-600">
                          Student Success Rate
                        </span>
                        <span className="font-semibold">94%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-600">Response Time</span>
                        <span className="font-semibold">&lt; 2 hours</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1 className="text-4xl lg:text-6xl font-bold text-[#1F514C] mb-6">
            Advisors
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Connect with industry professionals who can guide your career, help
            you master new skills, and provide insights from real-world
            experience.
          </p>
        </motion.div>

        {/* Business Advisors */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-[#1F514C] text-center mb-12">
            Business Advisors
          </h2>
        </motion.div>

        {/* Advisor Profiles */}
        <motion.div
          className="space-y-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Profile 1: Image Left, Bio Right */}
          <motion.div
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            variants={profileVariants}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
              {/* Left - Image */}
              <motion.div
                className="relative bg-gradient-to-br from-[#1F514C] to-[#2A6B65] p-8 flex items-center justify-center"
                variants={imageVariants}
              >
                <div className="relative">
                  <Image
                    src={advisors[0].avatar}
                    alt={advisors[0].name}
                    width={400}
                    height={400}
                    className="rounded-full border-8 border-white/20 shadow-2xl"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* Right - Bio */}
              <motion.div
                className="p-12 flex flex-col justify-center"
                variants={contentVariants}
              >
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-4xl font-bold text-gray-800">
                      {advisors[0].name}
                    </h2>
                    <motion.a
                      href={advisors[0].linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1F514C] hover:text-[#1F514C]/80 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </motion.a>
                  </div>
                  <p className="text-xl text-[#1F514C] font-semibold mb-4">
                    {advisors[0].title}
                  </p>
                  <div className="hidden flex items-center gap-4 text-gray-600 mb-6">
                    <span className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {advisors[0].rating}
                    </span>
                    <span>•</span>
                    <span>{advisors[0].experience}</span>
                    <span>•</span>
                    <span className="font-semibold text-[#1F514C]">
                      ${advisors[0].hourlyRate}/hr
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed mb-8 text-justify">
                  {advisors[0].description}
                </p>

                <div className="hidden mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {advisors[0].expertise.map((skill, index) => (
                      <motion.span
                        key={index}
                        className="px-4 py-2 bg-[#1F514C]/10 text-[#1F514C] rounded-full text-sm font-medium"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <motion.button
                  onClick={() => handleAdvisorSelect(advisors[0])}
                  className="bg-[#1F514C] text-white py-4 px-8 rounded-xl font-semibold text-lg hover:bg-[#1F514C]/90 transition-colors shadow-lg cursor-pointer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  View Full Profile
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* Profile 2: Bio Left, Image Right */}
          <motion.div
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            variants={profileVariants}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
              {/* Left - Bio */}
              <motion.div
                className="p-12 flex flex-col justify-center order-2 lg:order-1"
                variants={contentVariants}
              >
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-4xl font-bold text-gray-800">
                      {advisors[1].name}
                    </h2>
                    <motion.a
                      href={advisors[1].linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1F514C] hover:text-[#1F514C]/80 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </motion.a>
                  </div>
                  <p className="text-xl text-[#1F514C] font-semibold mb-4">
                    {advisors[1].title}
                  </p>
                  <div className="hidden flex items-center gap-4 text-gray-600 mb-6">
                    <span className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {advisors[1].rating}
                    </span>
                    <span>•</span>
                    <span>{advisors[1].experience}</span>
                    <span>•</span>
                    <span className="font-semibold text-[#1F514C]">
                      ${advisors[1].hourlyRate}/hr
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed mb-8 text-justify">
                  {advisors[1].description}
                </p>

                <div className="hidden mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {advisors[1].expertise.map((skill, index) => (
                      <motion.span
                        key={index}
                        className="px-4 py-2 bg-[#1F514C]/10 text-[#1F514C] rounded-full text-sm font-medium"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <motion.button
                  onClick={() => handleAdvisorSelect(advisors[1])}
                  className="bg-[#1F514C] text-white py-4 px-8 rounded-xl font-semibold text-lg hover:bg-[#1F514C]/90 transition-colors shadow-lg cursor-pointer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  View Full Profile
                </motion.button>
              </motion.div>

              {/* Right - Image */}
              <motion.div
                className="relative bg-gradient-to-br from-[#1F514C] to-[#2A6B65] p-8 flex items-center justify-center order-1 lg:order-2"
                variants={imageVariants}
              >
                <div className="relative">
                  <Image
                    src={advisors[1].avatar}
                    alt={advisors[1].name}
                    width={400}
                    height={400}
                    className="rounded-full border-8 border-white/20 shadow-2xl"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Technical Advisor Section */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-[#1F514C] text-center mb-12">
              Technical Advisor
            </h2>
          </motion.div>

          {/* Profile 3: Image Left, Bio Right */}
          <motion.div
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            variants={profileVariants}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
              {/* Left - Image */}
              <motion.div
                className="relative bg-gradient-to-br from-[#1F514C] to-[#2A6B65] p-8 flex items-center justify-center"
                variants={imageVariants}
              >
                <div className="relative">
                  <Image
                    src={advisors[2].avatar}
                    alt={advisors[2].name}
                    width={400}
                    height={400}
                    className="rounded-full border-8 border-white/20 shadow-2xl"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* Right - Bio */}
              <motion.div
                className="p-12 flex flex-col justify-center"
                variants={contentVariants}
              >
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-4xl font-bold text-gray-800">
                      {advisors[2].name}
                    </h2>
                    <motion.a
                      href={advisors[2].linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1F514C] hover:text-[#1F514C]/80 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </motion.a>
                  </div>
                  <p className="text-xl text-[#1F514C] font-semibold mb-4">
                    {advisors[2].title}
                  </p>
                  <div className="hidden flex items-center gap-4 text-gray-600 mb-6">
                    <span className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {advisors[2].rating}
                    </span>
                    <span>•</span>
                    <span>{advisors[2].experience}</span>
                    <span>•</span>
                    <span className="font-semibold text-[#1F514C]">
                      ${advisors[2].hourlyRate}/hr
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed mb-8 text-justify">
                  {advisors[2].description}
                </p>

                <div className="hidden mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {advisors[2].expertise.map((skill, index) => (
                      <motion.span
                        key={index}
                        className="px-4 py-2 bg-[#1F514C]/10 text-[#1F514C] rounded-full text-sm font-medium"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <motion.button
                  onClick={() => handleAdvisorSelect(advisors[2])}
                  className="bg-[#1F514C] text-white py-4 px-8 rounded-xl font-semibold text-lg hover:bg-[#1F514C]/90 transition-colors shadow-lg cursor-pointer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  View Full Profile
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <motion.button
            onClick={handleBack}
            className="flex items-center mx-auto text-[#1F514C] hover:text-[#1F514C]/80 transition-colors text-lg font-medium cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Advisor;
