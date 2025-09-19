'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import courseData from '@/constants/courseData.json'; // Import from your data file

const CourseList = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br py-12 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Courses</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose from our comprehensive selection of courses designed to help
            you master the latest technologies and advance your career.
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(courseData).map(([key, course]) => (
            <div
              key={key}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col"
            >
              {/* Course Image */}
              <div
                className="h-48 flex items-center justify-center bg-[#1F514C] flex-shrink-0"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, #1F514C 0%, #2A6B65 50%, #1F514C 100%)',
                }}
              >
                <div className="text-white text-center p-4">
                  <svg
                    className="w-16 h-16 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <h3 className="text-xl font-bold">{course.title}</h3>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6 flex flex-col flex-grow">
                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>

                {/* Technologies */}
                <div className="mb-4 flex-grow">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Key Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {course.technologies.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-[#1F514C]/10 text-[#1F514C] text-xs rounded-md font-medium"
                      >
                        {tech.name}
                      </span>
                    ))}
                    {course.technologies.length > 3 && (
                      <div className="relative group">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium cursor-help">
                          +{course.technologies.length - 3} more
                        </span>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                          <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 max-w-xs">
                            <div className="flex flex-wrap gap-1">
                              {course.technologies.slice(3).map((tech, idx) => (
                                <span key={idx}>
                                  {tech.name}
                                  {idx < course.technologies.slice(3).length - 1
                                    ? ','
                                    : ''}
                                </span>
                              ))}
                            </div>
                            <svg
                              className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1"
                              width="8"
                              height="8"
                            >
                              <path d="M0 0 L4 8 L8 0 Z" fill="rgb(17 24 39)" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-2xl font-bold text-[#1F514C]">
                      {course.price.global}
                    </p>
                    <p className="text-xs text-gray-500">Full Course</p>
                  </div>
                  <button
                    onClick={() => router.push(`/faujx-lms/courses/${key}`)}
                    className="px-4 py-2 cursor-pointer bg-[#1F514C] text-white rounded-lg hover:bg-[#2A6B65] transition-all font-medium hover:shadow-lg hover:-translate-y-0.5 shadow-[#1F514C]/20"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseList;
