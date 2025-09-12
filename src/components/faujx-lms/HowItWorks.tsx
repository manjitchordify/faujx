'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';

const StepIntoLearning = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselData = [
    {
      id: 1,
      step: 'Step 1',
      title: 'Sign Up & Choose',
      description: 'Create an account and pick your first course',
      icon: <User className="w-14 h-14" />,
    },
    {
      id: 2,
      step: 'Step 2',
      title: 'Learn with Mentors',
      description: 'Live mentor sessions + hands-on labs',
      icon: <User className="w-14 h-14" />,
    },
    {
      id: 3,
      step: 'Step 3',
      title: 'Earn Certificates',
      description: 'Showcase your achievements with recognized certificates',
      icon: <User className="w-14 h-14" />,
    },
    {
      id: 4,
      step: 'Step 4',
      title: 'Get Job-Ready',
      description: 'Interview prep & job support',
      icon: <User className="w-14 h-14" />,
    },
  ];

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % carouselData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselData.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % carouselData.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      prev => (prev - 1 + carouselData.length) % carouselData.length
    );
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const leftContentVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const carouselVariants: Variants = {
    hidden: { opacity: 0, x: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const slideVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 20 : -20,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3, ease: 'easeIn' },
    }),
  };

  const iconVariants: Variants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: { delay: 0.2, duration: 0.5, ease: 'easeOut' },
    },
  };

  const textVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.5 } },
  };

  return (
    <section id="HowitWorksfaujx" className="bg-[#1F514C] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="grid lg:grid-cols-3 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Left Content */}
          <motion.div
            className="text-white lg:col-span-2"
            variants={leftContentVariants}
          >
            <motion.p
              className="text-whitefont-medium mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              How it works
            </motion.p>
            <motion.h2
              className="text-5xl font-medium mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Step Into Learning
            </motion.h2>
            <motion.p
              className="text-gray-300 text-2xl leading-loose"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              From sign-up to job-ready — &nbsp;&nbsp; your learning
              &nbsp;journey
              <br /> made simple.
            </motion.p>
          </motion.div>

          {/* Right - Carousel */}
          <motion.div
            className="relative lg:col-span-1"
            variants={carouselVariants}
          >
            <div className="bg-white rounded-2xl p-6 shadow-xl min-h-[280px] flex flex-col justify-center overflow-hidden relative">
              {/* Step Badge (STATIC, no animation) */}
              <div className="absolute top-4 left-4">
                <div className="bg-[#d0dfde] text-[#1F514C] px-3 py-1 rounded-full text-sm font-medium border border-purple-200">
                  {carouselData[currentSlide].step}
                </div>
              </div>

              <div className="text-center">
                <AnimatePresence mode="wait" custom={currentSlide}>
                  <motion.div
                    key={currentSlide}
                    custom={currentSlide}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    {/* Icon */}
                    <motion.div
                      className="w-24 h-24 bg-gradient-to-br from-[#6c9490] via-[#457671] to-[#1F514C] rounded-xl flex items-center justify-center text-white mb-5 mx-auto"
                      variants={iconVariants}
                      initial="initial"
                      animate="animate"
                    >
                      {carouselData[currentSlide].icon}
                    </motion.div>

                    {/* Title */}
                    <motion.h3
                      className="text-2xl font-bold text-gray-800 mb-3"
                      variants={textVariants}
                      initial="initial"
                      animate="animate"
                    >
                      {carouselData[currentSlide].title}
                    </motion.h3>

                    {/* Description */}
                    <motion.p
                      className="text-gray-600 text-xl"
                      variants={textVariants}
                      initial="initial"
                      animate="animate"
                      transition={{ delay: 0.5 }}
                    >
                      {carouselData[currentSlide].description}
                    </motion.p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Navigation */}
            <motion.button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>

            <motion.button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>

            {/* Dots */}
            <motion.div
              className="flex justify-center mt-5 space-x-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              {carouselData.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                    currentSlide === index
                      ? 'bg-[#ffffff] w-6'
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default StepIntoLearning;
