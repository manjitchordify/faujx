'use client';
import React, { useEffect, useRef } from 'react';
import { StackedCarousel } from 'react-stacked-center-carousel';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Testimonial {
  id: number;
  company: string;
  companyLogo: string;
  position: string;
  name: string;
  role: string;
  profileImage: string;
  testimonial: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    company: 'Chordify',
    companyLogo: '/images/engineer/testimonials/chordifyLogo copy.avif',
    position: 'React Developer',
    name: 'Abhijith BR',
    role: 'Software Developer',
    profileImage: '/images/engineer/testimonials/abhijith1.jpeg',
    testimonial:
      "Faujx didn't just find me a job, they connected me with a company where I've been able to grow my skills and thrive alongside an incredible team for the past two years.",
  },
  {
    id: 2,
    company: 'Chordify',
    companyLogo: '/images/engineer/testimonials/chordifyLogo copy.avif',
    position: 'Frontend Developer',
    name: 'Athira KS',
    role: 'junior Developer',
    profileImage: '/images/engineer/testimonials/Athira1.jpeg',
    testimonial:
      "Working with Faujx was a game-changer for my career. They matched me with a role that perfectly aligned with my skills and aspirations. Two years later, I'm still grateful for the opportunity.",
  },
  {
    id: 3,
    company: 'Chordify',
    companyLogo: '/images/engineer/testimonials/chordifyLogo copy.avif',
    position: 'Back End Developer',
    name: 'Preethesh',
    role: 'Developer',
    profileImage: '/images/engineer/testimonials/Preethesh2.jpeg',
    testimonial:
      'Faujx made my job search seamless and successful. The role they secured for me has been exactly what I needed – challenging work, continuous learning, and a supportive team environment.',
  },
];

interface CardProps {
  data: Testimonial[];
  dataIndex: number;
}

// Updated Card component to handle the data prop correctly
const Card = ({ data, dataIndex }: CardProps) => {
  const testimonial = data[dataIndex];

  return (
    <div className="bg-white border border-[#D9D9D9] rounded-2xl shadow-lg p-4 md:p-6 lg:p-8 2xl:p-10 mx-4 max-w-3xl w-full">
      <div className="grid md:grid-cols-[auto_1fr] gap-4 sm:gap-6 md:gap-8 xl:gap-10 items-center">
        {/* Left Side - Company Info */}
        <div className="space-y-2 md:space-y-4 lg:space-y-6 text-center">
          <div className="text-[#1F514C] font-medium text-lg">Placed at</div>
          <div className="rounded-lg p-6 w-44 h-28 mx-auto flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src={testimonial?.companyLogo || '/default-logo.png'}
                alt={`${testimonial?.company || 'Company'} logo`}
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="text-[#1F514C] font-semibold text-lg md:text-xl lg:text-2xl">
            {testimonial?.position || 'React Developer'}
          </div>
        </div>

        {/* Right Side - Person Info */}
        <div className="space-y-2 md:space-y-2 lg:space-y-2 p-2 md:p-4 lg:p-4 border border-[#D9D9D9] rounded-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
              {testimonial?.profileImage ? (
                <Image
                  src={testimonial.profileImage}
                  alt={`${testimonial.name} profile`}
                  width={64}
                  height={64}
                  className="object-cover rounded-full"
                />
              ) : (
                <svg
                  className="w-8 h-8 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div>
              <div className="font-medium text-gray-800 text-xl">
                {testimonial?.name || 'Emily Carter'}
              </div>
              <div className="text-[#1F514C] text-xs">
                {testimonial?.role || 'Software Developer'}
              </div>
            </div>
          </div>
          <div className="text-[#1F514C] leading-relaxed text-lg">
            &quot;
            {testimonial?.testimonial ||
              'The advanced candidate matching process saved us so much time. We quickly found skilled professionals who fit our company culture perfectly. Highly recommend their services'}
            &quot;
          </div>
        </div>
      </div>
    </div>
  );
};

Card.displayName = 'TestimonialCard';

export default function Testimonials() {
  const ref = useRef<StackedCarousel | null>(null);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoSlide = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
    }

    autoSlideRef.current = setInterval(() => {
      if (ref.current) {
        ref.current.goNext();
      }
    }, 3000);
  };

  const stopAutoSlide = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }
  };

  const goToNext = () => {
    stopAutoSlide();
    ref.current?.goNext();
    startAutoSlide();
  };

  const goToPrev = () => {
    stopAutoSlide();
    ref.current?.goBack();
    startAutoSlide();
  };

  useEffect(() => {
    startAutoSlide();

    return () => {
      stopAutoSlide();
    };
  }, []);

  return (
    <section
      className="w-full py-6 md:py-8 lg:py-12 xl:py-16 relative overflow-hidden"
      id="testimonials"
    >
      <Image
        src="/images/candidate-testimonials.png"
        alt=""
        width={400}
        height={600}
        className="absolute right-0 bottom-0 w-auto h-[90%] object-contain"
        aria-hidden="true"
      />
      <Image
        src="/images/candidate-testimonials.png"
        alt=""
        width={400}
        height={600}
        className="absolute rotate-180 left-0 bottom-0 w-auto h-[90%] object-contain"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-4 md:mb-8 lg:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl lg:text-4xl 2xl:text-5xl font-medium text-[#1F514C] mb-4">
            Voices of FaujX
          </h2>
        </motion.div>

        <div
          style={{ width: '100%', position: 'relative', minHeight: '500px' }}
        >
          {/* Navigation Buttons */}
          <button
            onClick={goToPrev}
            className="absolute cursor-pointer left-0 max-md:-translate-x-1/2 md:left-4 top-1/2 transform -translate-y-1/2 z-30 w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl transition-all duration-200 hover:scale-110"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute cursor-pointer right-0 max-md:translate-x-1/2 md:right-4 top-1/2 transform -translate-y-1/2 z-30 w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl transition-all duration-200 hover:scale-110"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <StackedCarousel
            ref={ref}
            slideComponent={Card}
            slideWidth={768}
            carouselWidth={1400}
            data={testimonials}
            maxVisibleSlide={3}
            disableSwipe={false}
            customScales={[1, 0.85, 0.7]}
            transitionTime={450}
            useGrabCursor={true}
          />
        </div>
      </div>
    </section>
  );
}
