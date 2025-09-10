'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SkillBasedLearning() {
  return (
    <section className="bg-gray-100 py-6 md:pt-12 md:pb-24 w-full">
      <div className="container w-11/12 mx-auto px-6 lg:px-8 lg:w-4/5">
        {/* <div className="text-center mb-[max(1rem,5vh)] lg:mb-[max(3rem,15vh)]"> */}
        <motion.div
          className="text-center mb-[max(1rem,5vh)] lg:mb-[max(3rem,10vh)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-semibold text-[#1F514C] mb-2 leading-tight sm:leading-tight md:leading-tight">
            Upskill With FaujX LMS
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row justify-between gap-4 md:gap-12 lg:gap-0">
          <motion.div
            className="flex-1 w-full lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative w-full h-[200px] lg:h-[350px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/image-2.webp"
                alt="People working collaboratively at a desk with computers and notebooks"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>

          <motion.div
            className="flex-1 w-full lg:w-1/3 lg:pl-12"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex flex-col lg:max-w-[90%] mx-auto h-full">
              <div className="space-y-5 mb-8 text-black">
                {[
                  'Customized Training Programs',
                  'Live Collaboration',
                  'Scalable Solutions',
                  'Offline and Online session',
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="text-base sm:text-lg md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl leading-relaxed sm:leading-relaxed md:leading-relaxed flex items-center space-x-3"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  >
                    <svg
                      className="size-[1.125em] text-white flex-shrink-0 bg-black rounded-[.35em] p-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 1.0 }}
              >
                <Link
                  href="https://www.chordifyed.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-start cursor-pointer bg-gradient-to-r from-[#2A6B65] to-[#1F514C] hover:from-[#1F514C] hover:to-[#1a433f] text-[#EAEAE2] font-semibold py-3 px-8 rounded-3xl text-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Learn More
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
