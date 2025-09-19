'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';

const ExploreCourses = () => {
  const router = useRouter();

  const courses = [
    {
      id: 1,
      title: 'Frontend',
      subtitle: 'Development',
      link: 'frontend',
      image: '/images/faujxlms/frontend.png',
    },
    {
      id: 2,
      title: 'Backend',
      subtitle: 'Development',
      link: 'backend',
      image: '/images/faujxlms/backend.png',
    },
    {
      id: 3,
      title: 'Fullstack',
      subtitle: 'Development',
      link: 'fullstack',
      image: '/images/faujxlms/fullstack.png',
    },
    {
      id: 4,
      title: 'AI / ML',
      subtitle: '',
      link: 'aiml',
      image: '/images/faujxlms/aiml.png',
    },
    {
      id: 5,
      title: 'DevOps',
      subtitle: '',
      link: 'devops',
      image: '/images/faujxlms/devops.png',
    },
  ];

  const handleCourseClick = (courseLink: string) => {
    router.push(`/faujx-lms/courses/${courseLink}`);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const containerBoxVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className="py-16 px-6 bg-white" id="explore-courses">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-medium text-gray-800 mb-4">
            Explore Courses
          </h2>
        </motion.div>

        {/* Course Cards Container */}
        <motion.div
          className="border border-gray-300 rounded-lg p-8 bg-gray-50"
          variants={containerBoxVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {courses.map((course, idx) => (
              <motion.div
                key={course.id}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
                className="text-center group cursor-pointer"
                onClick={() => handleCourseClick(course.link)}
              >
                {/* Icon Container */}
                <motion.div
                  className="rounded-2xl mb-4 mx-auto w-32 h-32 flex items-center justify-center"
                  whileHover={{
                    rotate: [0, -2, 2, 0],
                    transition: { duration: 0.3 },
                  }}
                >
                  <Image
                    src={course.image}
                    alt={`${course.title} ${course.subtitle}`}
                    width={128}
                    height={128}
                    className="object-contain rounded-2xl w-full h-full transition-transform duration-300"
                  />
                </motion.div>

                {/* Course Title */}
                <motion.div
                  className="text-gray-700"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 + 0.3 }}
                >
                  <h3 className="text-lg font-semibold leading-tight">
                    {course.title}
                  </h3>
                  {course.subtitle && (
                    <p className="text-lg font-semibold leading-tight">
                      {course.subtitle}
                    </p>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExploreCourses;
