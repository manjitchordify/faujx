'use client';
import React from 'react';
import { motion } from 'framer-motion';

const ReadyToStartLearning: React.FC = () => {
  const handleStartLearning = () => {
    window.location.href = 'https://www.chordifyed.com/';
  };

  return (
    <section className="py-10 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="bg-white rounded-3xl shadow-xl border border-gray-100 px-8 py-16 md:px-16 md:py-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Main Heading */}
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl  text-[#4C3D57] mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Ready to start learning?
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Upskill with mentors, projects, and certificates that matter.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.button
              onClick={handleStartLearning}
              className="px-4 py-2 bg-gradient-to-r cursor-pointer from-[#1F514C] to-[#2a837a] text-white rounded-2xl hover:opacity-90 transition-all duration-300 flex items-center justify-between shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg font-medium min-w-[200px]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Learning Today
              <motion.div
                className="w-12 h-12 bg-[#2a837a] bg-opacity-20 rounded-lg flex items-center justify-center text-white ml-4"
                whileHover={{ x: 2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
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
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReadyToStartLearning;
