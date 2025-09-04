'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  rating: number;
}

const StudentTestimonials = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(0);

  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, _setCurrentIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Vineesh AU',
      role: 'Front-End Developer',
      image: '/images/engineer/testimonials/Vineesh1.jpeg',
      rating: 4.5,
    },
    {
      id: 2,
      name: 'Athira KS',
      role: 'Software Developer',
      image: '/images/engineer/testimonials/Athira1.jpeg',
      rating: 4,
    },
    {
      id: 3,
      name: 'Abhijith BR',
      role: 'Developer',
      image: '/images/engineer/testimonials/Abhijith1.jpeg',
      rating: 4,
    },
    {
      id: 4,
      name: 'Preethesh',
      role: 'Software Developer',
      image: '/images/engineer/testimonials/Preethesh2.jpeg',
      rating: 5,
    },
  ];

  const setCurrentIndex = (index: number) => {
    currentIndexRef.current = index;
    _setCurrentIndex(index);
  };

  const startAutoSlide = useCallback(() => {
    clearInterval(intervalRef.current!);
    intervalRef.current = setInterval(() => {
      const nextIndex = (currentIndexRef.current + 1) % testimonials.length;
      setCurrentIndex(nextIndex);
    }, 3000);
  }, [testimonials.length]);

  const stopAutoSlide = useCallback(() => {
    clearInterval(intervalRef.current!);
  }, []);

  const nextCard = () => {
    stopAutoSlide();
    const nextIndex = (currentIndexRef.current + 1) % testimonials.length;
    setCurrentIndex(nextIndex);
    startAutoSlide();
  };

  const prevCard = () => {
    stopAutoSlide();
    const prevIndex =
      (currentIndexRef.current - 1 + testimonials.length) % testimonials.length;
    setCurrentIndex(prevIndex);
    startAutoSlide();
  };

  useEffect(() => {
    if (!isPaused) {
      startAutoSlide();
    } else {
      stopAutoSlide();
    }

    return () => stopAutoSlide();
  }, [isPaused, startAutoSlide, stopAutoSlide]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-2xl ${index < rating ? 'text-green-500' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  const getSlideWidth = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 416;
      if (window.innerWidth >= 768) return 416;
      return 320;
    }
    return 416;
  };

  const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
    <div className="flex-shrink-0 bg-white rounded-xl p-8 shadow-lg border-2 border-[#C6F9B1] w-96 lg:w-96 md:w-80 sm:w-72 mx-2 md:mx-3 lg:mx-4">
      <div className="flex items-center mb-6">
        <div className="flex-shrink-0 mr-4">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>
        <div className="flex-grow text-left">
          <h3 className="font-light text-lg xl:text-xl text-gray-900 mb-1">
            {testimonial.name}
          </h3>
          <p className="text-[#1F514C] font-semibold text-[10px]">
            {testimonial.role}
          </p>
        </div>
      </div>
      <div className="flex">{renderStars(testimonial.rating)}</div>
    </div>
  );

  return (
    <section className="text-center py-16 px-6">
      <div className="mx-auto">
        <h2 className="text-4xl md:text-5xl font-medium text-gray-900 mb-4">
          Our Students feedback
        </h2>
        <p className="text-gray-600 text-4xl md:text-2xl mt-10 font-extralight mb-16 max-w-3xl mx-auto">
          Explore the incredible advantages of enrolling in our courses and
          enhancing your skills.
        </p>

        <div className="relative flex items-center justify-center">
          <button
            onClick={prevCard}
            className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 mr-4 md:mr-6 lg:mr-8"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <div
            className="overflow-hidden w-[320px] md:w-[672px] lg:w-[1248px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="flex transition-transform duration-1000 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * getSlideWidth()}px)`,
              }}
            >
              {testimonials.map(testimonial => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                />
              ))}

              {testimonials.map(testimonial => (
                <TestimonialCard
                  key={`duplicate-${testimonial.id}`}
                  testimonial={testimonial}
                />
              ))}
            </div>
          </div>

          <button
            onClick={nextCard}
            className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ml-4 md:ml-6 lg:ml-8"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  stopAutoSlide();
                  setCurrentIndex(index);
                  startAutoSlide();
                }}
                className={`h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? 'bg-green-500 w-8'
                    : 'bg-gray-300 hover:bg-gray-400 w-3'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentTestimonials;
