'use client';
import React, { useState, useEffect } from 'react';
import courseDataJson from '../../constants/courseData.json';
import { CourseData, CourseDataMap, Technology } from '../../types/course';
import Image from 'next/image';
import { useAppSelector } from '@/store/store';

const courseData: CourseDataMap = courseDataJson;

const CourseDetails: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string | null>(null);
  const { loggedInUser } = useAppSelector(state => state.user);
  console.log('data', loggedInUser);

  useEffect(() => {
    const path = window.location.pathname;
    const routeMatch = path.match(/faujx-lms\/(.+)/);
    if (routeMatch && courseData[routeMatch[1]]) {
      setCurrentRoute(routeMatch[1]);
    }
  }, []);

  const currentCourse: CourseData = courseData[currentRoute as string];
  if (!currentRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading course details...</p>
      </div>
    );
  }

  // Define color classes for technologies based on course type
  const getTechColor = (index: number): string => {
    const colors = ['bg-[#854DCD]'];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12 mt-10">
          <h1 className="text-4xl font-medium text-gray-800 mb-4">
            Explore Courses
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start mt-10">
          <div className="space-y-6 ">
            <h2 className="text-3xl font-medium text-gray-900">
              {currentCourse.title}
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {currentCourse.description}
            </p>
            <button className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700">
              Pay {currentCourse.price.global}
            </button>
            <div className="flex flex-wrap gap-3">
              {currentCourse.technologies.map(
                (tech: Technology, index: number) => (
                  <span
                    key={index}
                    className={`${getTechColor(index)} text-white px-4 py-2 rounded-full font-medium`}
                  >
                    {tech.name}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="flex justify-center mb-10">
            <div className="w-full max-w-lg">
              <Image
                src={currentCourse.image}
                alt={`${currentCourse.title} Course Roadmap`}
                priority
                width={500}
                height={400}
                className="w-full h-[80vh] object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
