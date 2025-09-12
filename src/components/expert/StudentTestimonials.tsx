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
  feedback: string;
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
      feedback:
        'The mentorship program helped me transition from a junior developer to a senior role. The personalized guidance and real-world projects were invaluable.',
    },
    {
      id: 2,
      name: 'Athira KS',
      role: 'Software Developer',
      image: '/images/engineer/testimonials/Athira1.jpeg',
      rating: 4,
      feedback:
        'Excellent learning experience with hands-on projects and industry-relevant curriculum. The instructors are knowledgeable and supportive.',
    },
    {
      id: 3,
      name: 'Abhijith BR',
      role: 'Developer',
      image: '/images/engineer/testimonials/Abhijith1.jpeg',
      rating: 4,
      feedback:
        'Great platform for skill development. The coding challenges and peer learning environment helped me grow significantly as a developer.',
    },
    {
      id: 4,
      name: 'Preethesh',
      role: 'Software Developer',
      image: '/images/engineer/testimonials/Preethesh2.jpeg',
      rating: 5,
      feedback:
        'Outstanding program that exceeded my expectations. The practical approach and industry connections opened doors to amazing opportunities.',
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
    return Array.from({ length: 5 }, (_, index) => {
      const starIndex = index + 1;
      const isFilled = starIndex <= Math.floor(rating);
      const isHalfFilled = starIndex === Math.ceil(rating) && rating % 1 !== 0;

      return (
        <span
          key={index}
          className={`text-lg sm:text-xl ${
            isFilled || isHalfFilled ? 'text-[#1F514C]' : 'text-gray-300'
          }`}
        >
          {isHalfFilled ? '☆' : '★'}
        </span>
      );
    });
  };

  const getSlideWidth = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 512; // lg:w-[480px] + mx-4*2
      if (window.innerWidth >= 768) return 448; // md:w-[420px] + mx-4*2
      if (window.innerWidth >= 640) return 416; // sm:w-96 + mx-3*2
      return 352; // w-80 + mx-2*2
    }
    return 512;
  };

  const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
    <div className="flex-shrink-0 bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:border-[#1F514C]/20 hover:shadow-xl transition-all duration-300 w-80 sm:w-96 md:w-[420px] lg:w-[480px] mx-2 sm:mx-3 md:mx-4">
      <div className="flex items-start mb-4 sm:mb-6">
        <div className="flex-shrink-0 mr-4 sm:mr-5">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            width={56}
            height={56}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
          />
        </div>
        <div className="flex-grow text-left">
          <h3 className="font-semibold text-base sm:text-lg md:text-xl text-[#1F514C] mb-1">
            {testimonial.name}
          </h3>
          <p className="text-[#1F514C] font-medium text-sm sm:text-base mb-3">
            {testimonial.role}
          </p>
          <div className="flex mb-4">{renderStars(testimonial.rating)}</div>
        </div>
      </div>
      <div className="text-gray-700 text-sm sm:text-base leading-relaxed italic">
        &ldquo;{testimonial.feedback}&rdquo;
      </div>
    </div>
  );

  return (
    <section className="text-center py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1F514C] mb-4">
          Our Engineers feedback
        </h2>
        <p className="text-[#1F514C] text-lg sm:text-xl md:text-2xl mt-6 sm:mt-8 md:mt-10 font-light mb-8 sm:mb-12 md:mb-16 max-w-3xl mx-auto px-4">
          Explore the incredible advantages of enrolling in our courses and
          enhancing your skills.
        </p>

        <div className="relative flex items-center justify-center">
          <button
            onClick={prevCard}
            className="bg-white rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 mr-2 sm:mr-4 md:mr-6 lg:mr-8 border border-gray-200"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#1F514C]" />
          </button>

          <div
            className="overflow-hidden w-[320px] sm:w-[384px] md:w-[768px] lg:w-[1024px]"
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
            className="bg-white rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ml-2 sm:ml-4 md:ml-6 lg:ml-8 border border-gray-200"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#1F514C]" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  stopAutoSlide();
                  setCurrentIndex(index);
                  startAutoSlide();
                }}
                className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? 'bg-[#1F514C] w-6 sm:w-8'
                    : 'bg-gray-300 hover:bg-[#1F514C]/50 w-2 sm:w-3'
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
