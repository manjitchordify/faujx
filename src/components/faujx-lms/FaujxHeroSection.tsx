'use client';

// import Image from 'next/image';
import React from 'react';
import { motion, Variants } from 'framer-motion';

const LearningPlatform = () => {
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const titleVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const subtitleVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const buttonContainerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  // const imageVariants: Variants = {
  //   hidden: { opacity: 0, y: 50, scale: 0.95 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     scale: 1,
  //     transition: {
  //       duration: 1,
  //       ease: 'easeOut',
  //     },
  //   },
  // };

  const arrowVariants: Variants = {
    rest: { x: 0 },
    hover: { x: 4 },
  };

  return (
    <div className=" bg-gray-50">
      {/* Header Section */}
      <div className="bg-white pb-16 mt-25 px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h1
            className="text-5xl font-medium text-gray-800 mb-6"
            variants={titleVariants}
          >
            Learn Job-Ready Skills, Faster.
          </motion.h1>

          <motion.p
            className="mb-8 max-w-2xl mx-auto text-2xl text-gray-600 leading-relaxed mt-5"
            variants={subtitleVariants}
          >
            Upskill with mentors, verified certificates,
            <br />
            and hands-on projects.
          </motion.p>

          <motion.div
            className="flex gap-4 justify-center mb-12 mt-15"
            variants={buttonContainerVariants}
          >
            <motion.a
              href="https://www.chordifyed.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-2 text-gray-700 bg-white rounded-2xl border-gray-100 border-2 hover:bg-gray-50 shadow-lg transition-colors text-lg font-medium flex items-center justify-center"
              variants={buttonVariants}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              Start Learning
            </motion.a>

            <motion.a
              href="#explore-courses"
              className="px-4 py-2 bg-gradient-to-r from-[#9692F8] to-[#CDABF8] text-white rounded-2xl hover:opacity-90 transition-all duration-300 flex items-center justify-between shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg font-medium min-w-[200px]"
              variants={buttonVariants}
              whileHover={{
                scale: 1.05,
                y: -2,
                boxShadow: '0 15px 30px rgba(150,146,248,0.3)',
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
              initial="rest"
              animate="rest"
            >
              <span>Explore Courses</span>
              <motion.div
                className="w-12 h-12 bg-[#CEABFA] bg-opacity-20 rounded-lg flex items-center justify-center text-white ml-4"
                variants={arrowVariants}
                whileHover="hover"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Dashboard Image */}
        {/* <motion.div
          className="max-w-2xl mx-auto px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        > */}
        {/* <motion.div
            className="relative rounded-2xl overflow-hidden"
            variants={imageVariants}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3 },
            }}
          > */}
        {/* <motion.div
              initial={{ scale: 1.1 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            > */}
        {/* <Image
                src="/images/faujxlms/faujxDashboard.png"
                alt="Dashboard Preview"
                width={1200}
                height={800}
                className="w-full h-auto"
                priority
              />
            </motion.div> */}

        {/* Subtle overlay effect on hover */}
        {/* <motion.div
              className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </motion.div> */}
      </div>
    </div>
  );
};

export default LearningPlatform;
