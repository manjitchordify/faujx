'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

const features = [
  {
    id: 1,
    title: 'Job-ready Skills',
    description:
      'Practical, industry-focused learning with project-based assessments.',
    color: 'bg-gradient-to-br from-purple-400 to-purple-500',
  },
  {
    id: 2,
    title: 'Mentor Access',
    description:
      'Connect with experts for guidance, feedback, and career tips.',
    color: 'bg-gradient-to-br from-purple-400 to-purple-500',
  },
  {
    id: 3,
    title: 'Verified Certificates',
    description:
      'Shareable certificates to showcase your achievements on LinkedIn.',
    color: 'bg-gradient-to-br from-purple-400 to-purple-500',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export default function WhatisFaujx() {
  return (
    <section className="pb-20  ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-medium text-gray-900 mb-6">
            What is FaujX LMS ?
          </h2>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Practical training with mentors and verified certificates
            <br />
            to help you get hired and stand out.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {features.map((feature, idx) => (
            <motion.div
              key={feature.id}
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              className="bg-[#F9F2FB] border-[#D9D9D9] border-2 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 py-10"
            >
              {/* Number Badge and Title in same row */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#E6DAF5] via-[#BFA7DF] to-[#9874C8] rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {feature.id}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {feature.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
