'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import SectionHeader from './SectionHeader';

const steps = [
  {
    title: 'Role-to-Resume Mapping',
    image: '/icons/step1.svg',
  },
  {
    title: 'AI Prescreening',
    image: '/icons/step2.svg',
  },
  {
    title: 'Coding Assessment',
    image: '/icons/step3.svg',
  },
  {
    title: 'Panel Interviews',
    image: '/icons/step4.svg',
  },
  {
    title: 'Certified Foundation Engineers',
    image: '/icons/step5.svg',
  },
];

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

const arrowVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.2 + 0.1,
      duration: 0.3,
      ease: 'easeOut',
    },
  }),
};

export default function VettingProcess() {
  return (
    <div className="relative w-full bg-white py-2">
      {/* Smart Vetting Process Section */}
      <div className="px-6 py-16 sm:px-8 lg:px-12 xl:px-16">
        <div className="max-w-8xl mx-auto">
          {/* Title */}
          <div className="mb-12">
            <SectionHeader mainText="Smart Vetting Process" aboutSection="" />
          </div>

          {/* Steps Container */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-4 xl:gap-6 mt-20 px-4 lg:px-8">
            {steps.map((step, idx) => (
              <React.Fragment key={idx}>
                <motion.div
                  custom={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={cardVariants}
                  className="flex flex-col items-center w-full max-w-[280px] lg:max-w-[200px] xl:max-w-[240px]"
                >
                  {/* Image hidden */}
                  {/* <div className="mb-6 flex justify-center w-24 h-24 lg:w-32 lg:h-32 xl:w-42 xl:h-52">
                    <Image
                      src={step.image}
                      alt={step.title}
                      width={300}
                      height={300}
                      className="object-contain w-full h-full"
                    />
                  </div> */}
                  <p className="text-center text-base lg:text-lg text-gray-700 leading-tight px-2">
                    {step.title}
                  </p>
                </motion.div>

                {/* Arrow between steps (except after the last step) */}
                {idx < steps.length - 1 && (
                  <motion.div
                    custom={idx}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={arrowVariants}
                    className="flex items-center justify-center w-12 h-8 lg:w-16 lg:h-10 flex-shrink-0"
                  >
                    <svg
                      width="64"
                      height="24"
                      viewBox="0 0 64 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-4 lg:w-14 lg:h-6 rotate-90 lg:rotate-0"
                    >
                      {/* Single path arrow */}
                      <path
                        d="M6 8 C4 8 2 10 2 12 C2 14 4 16 6 16 L46 16 L46 20 L62 12 L46 4 L46 8 Z"
                        fill="#0F766E"
                      />
                    </svg>
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
