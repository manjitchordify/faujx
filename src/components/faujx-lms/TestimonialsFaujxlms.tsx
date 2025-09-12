'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Image from 'next/image';

const TestimonialsFaujxlms = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Samily Sasi',
      testimonial:
        'Amazing platform with excellent course structure. Highly recommend to anyone starting their tech career.',
      image: '/images/engineer/testimonials/samily1.jpeg',
      rating: 5,
    },
    {
      id: 2,
      name: 'Vineesh AU',
      testimonial:
        'Chordify helped me learn faster with clear courses and great mentor support.',
      image: '/images/engineer/testimonials/Vineesh1.jpeg', // Update with actual path
      rating: 4,
    },

    {
      id: 3,
      name: 'Sidharth',
      testimonial:
        'The hands-on approach and mentor guidance made all the difference in my learning journey.',
      image: '/images/engineer/testimonials/sidharth1.jpeg', // Update with actual path
      rating: 5,
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      prev => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating
            ? 'fill-[#1F514C] text-[#1F514C]'
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ));
  };

  return (
    <section id="our-students" className="py-20 px-6 bg-[#FCF8FD]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-[1F514C] font-medium mb-4 text-lg">Testimonials</p>
          <h2 className="text-4xl md:text-5xl font-medium text-gray-800">
            What our students are saying
          </h2>
        </div>

        {/* Testimonial Slider */}
        <div className="relative max-w-3xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Testimonial Content */}
            <div className="text-left flex flex-col h-full">
              {/* Testimonial Text - Fixed height container */}
              <div className="flex-1 mb-3 mt-12">
                <div className="h-32 md:h-40 flex items-start">
                  <h3 className="text-2xl md:text-3xl  text-gray-700 leading-relaxed">
                    {testimonials[currentSlide].testimonial}
                  </h3>
                </div>
              </div>

              {/* Rating and Name - Fixed position */}
              <div className="flex justify-between">
                <div className="mb-8 ">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex gap-1">
                      {renderStars(testimonials[currentSlide].rating)}
                    </div>
                  </div>

                  <div className="h-8 flex items-center">
                    <p className="text-2xl font-semibold text-[#1F514C]">
                      {testimonials[currentSlide].name}
                    </p>
                  </div>
                </div>
                {/* Navigation Arrows - Fixed position */}
                <div className="flex gap-4 ">
                  <button
                    onClick={prevSlide}
                    className="w-12 h-12 cursor-pointer rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400 hover:border-purple-400 hover:text-purple-400 transition-all duration-300"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="w-12 h-12 cursor-pointer rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400 hover:border-purple-400 hover:text-purple-400 transition-all duration-300"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Profile Image */}
            <div className="relative">
              <div className="relative w-full max-w-sm mx-auto">
                <div className="aspect-[4/5] relative rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src={testimonials[currentSlide].image}
                    alt={testimonials[currentSlide].name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>

              {/* Decorative Background Circle */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-purple-100 rounded-full -z-10 opacity-60"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-purple-200 rounded-full -z-10 opacity-40"></div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-12 gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? 'bg-[#1F514C] w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsFaujxlms;
