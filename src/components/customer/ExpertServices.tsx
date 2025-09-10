'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

const services = [
  'Complement your hiring process',
  'Code reviews',
  'Tech stack suggestions',
  'Architecture reviews',
];

export default function ExpertServices() {
  return (
    <div className="w-full max-w-7xl mx-auto bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Section - Expert Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[450px] order-1"
        >
          <Image
            src="/images/customer/expert_image.png"
            alt="Expert at desk with laptop showing video call"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Right Section - Services */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-[#2A6B65] to-[#1F514C] flex flex-col justify-center items-start text-white relative p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 order-2 min-h-[250px] sm:min-h-[300px] md:min-h-[350px] lg:h-[400px] xl:h-[450px]"
        >
          <div className="w-full flex flex-col justify-center h-full">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold mb-3 sm:mb-4 md:mb-6 lg:mb-8 xl:mb-10 text-white leading-tight sm:leading-tight md:leading-tight lg:leading-tight">
              Expert and their Services
            </h2>

            <div className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5 mb-4 sm:mb-6 lg:mb-0">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center space-x-2 sm:space-x-3 md:space-x-4"
                >
                  <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      width="6"
                      height="6"
                      className="sm:w-2 sm:h-2 md:w-3 md:h-3"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.5 3L7.5 6L4.5 9"
                        stroke="#374151"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg text-white leading-relaxed">
                    {service}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Learn More Button - Responsive positioning */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="w-auto self-center md:self-center lg:absolute lg:bottom-6 lg:right-6 xl:bottom-8 xl:right-8"
          >
            <Link
              href="/expert"
              className="inline-block bg-white text-[#1F514C] px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 text-xs sm:text-sm md:text-base lg:text-sm xl:text-base"
            >
              Learn More
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
