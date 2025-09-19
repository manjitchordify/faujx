'use client';
import React, { useEffect, useRef, useState } from 'react';
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
    companyLogo: '/images/engineer/testimonials/chordify.avif',
    position: 'React Developer',
    name: 'Abhijith BR',
    role: 'Software Developer',
    profileImage: '/images/engineer/testimonials/abhijith.jpeg',
    testimonial:
      "Faujx didn't just find me a job, they connected me with a company where I've been able to grow my skills and thrive alongside an incredible team for the past two years.",
  },
  {
    id: 2,
    company: 'Chordify',
    companyLogo: '/images/engineer/testimonials/chordify.avif',
    position: 'Frontend Developer',
    name: 'Sirajje Kisirinya',
    role: 'junior Developer',
    profileImage: '/images/engineer/testimonials/sirajje.jpg',
    testimonial:
      'My internship with FaujX has been one of the most rewarding parts of my career journey so far. I not only gained hands-on experience in tech most especially in  web development  but also learned from mentors who genuinely care about growth. The culture is welcoming, innovative, and inspiring. i also thank chordify for introducing Faujx  and i cant wait to benefit from it  — a great place to start and grow',
  },
  {
    id: 3,
    company: 'Chordify',
    companyLogo: '/images/engineer/testimonials/chordify.avif',
    position: 'Frontend Developer',
    name: 'Athira KS',
    role: 'junior Developer',
    profileImage: '/images/engineer/testimonials/athira.jpeg',
    testimonial:
      "Working with Faujx was a game-changer for my career. They matched me with a role that perfectly aligned with my skills and aspirations. Two years later, I'm still grateful for the opportunity.",
  },
  {
    id: 4,
    company: 'Chordify',
    companyLogo: '/images/engineer/testimonials/chordify.avif',
    position: 'Back End Developer',
    name: 'Ruth Masagazi',
    role: 'Developer',
    profileImage: '/images/engineer/testimonials/ruth.jpeg',
    testimonial:
      'My internship and React program at Chordify through FaujX has been a game changer. I learned to work with new frameworks and gained hands-on experience. I’m now applying these skills in a company project with confidence.',
  },
  {
    id: 5,
    company: 'Chordify',
    companyLogo: '/images/engineer/testimonials/chordify.avif',
    position: 'Back End Developer',
    name: 'Preethesh',
    role: 'Developer',
    profileImage: '/images/engineer/testimonials/preethesh.jpeg',
    testimonial:
      'Faujx made my job search seamless and successful. The role they secured for me has been exactly what I needed – challenging work, continuous learning, and a supportive team environment.',
  },
  {
    id: 6,
    company: 'Chordify',
    companyLogo: '/images/engineer/testimonials/chordify.avif',
    position: 'Back End Developer',
    name: 'Aaron Efrata',
    role: 'Developer',
    profileImage: '/images/engineer/testimonials/aaron.jpg',
    testimonial:
      'FaujX, has been a transformative part of my learning journey. The upskilling programs in modern frontend technologies like React.js and Vite.js significantly improved my development workflow. The internship opportunity further allowed me to apply these skills in practical environments and real-world projects.',
  },
  {
    id: 7,
    company: 'Chordify',
    companyLogo: '/images/engineer/testimonials/chordify.avif',
    position: 'Back End Developer',
    name: 'Shadia Nankya',
    role: 'Developer',
    profileImage: '/images/engineer/testimonials/shadia.jpeg',
    testimonial:
      'FaujX didn’t just give me an internship—it connected me to Chordify Tech India Pvt. Ltd., where I gained real-world skills in Next.js, TypeScript, and Figma. The experience helped me grow as a developer and strengthened my passion for front-end development and UI/UX design.',
  },
];

// Testimonial Card Component
const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="bg-white border border-[#D9D9D9] rounded-2xl shadow-lg p-4 md:p-6 lg:p-8 2xl:p-10 mx-2 md:mx-4 w-full max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 sm:gap-6 md:gap-8 xl:gap-10 items-center">
        {/* Left Side - Company Info */}
        <div className="space-y-2 md:space-y-4 lg:space-y-6 text-center">
          <div className="text-[#1F514C] font-medium text-lg">Placed at</div>
          <div className="rounded-lg p-6 w-32 h-20 md:w-44 md:h-28 mx-auto flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src={testimonial.companyLogo || '/default-logo.png'}
                alt={`${testimonial.company || 'Company'} logo`}
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="text-[#1F514C] font-semibold text-lg md:text-xl lg:text-2xl">
            {testimonial.position || 'React Developer'}
          </div>
        </div>

        {/* Right Side - Person Info */}
        <div className="space-y-2 md:space-y-2 lg:space-y-2 p-2 md:p-4 lg:p-4 border border-[#D9D9D9] rounded-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
              {testimonial.profileImage ? (
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
                {testimonial.name || 'Emily Carter'}
              </div>
              <div className="text-[#1F514C] text-xs">
                {testimonial.role || 'Software Developer'}
              </div>
            </div>
          </div>
          <div className="text-[#1F514C] leading-relaxed text-base md:text-lg">
            &quot;
            {testimonial.testimonial ||
              'The advanced candidate matching process saved us so much time. We quickly found skilled professionals who fit our company culture perfectly. Highly recommend their services'}
            &quot;
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoSlide = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
    }

    autoSlideRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % testimonials.length);
    }, 4000);
  };

  const stopAutoSlide = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }
  };

  const goToNext = () => {
    setCurrentSlide(prev => (prev + 1) % testimonials.length);
    if (isAutoPlaying) {
      stopAutoSlide();
      startAutoSlide();
    }
  };

  const goToPrev = () => {
    setCurrentSlide(
      prev => (prev - 1 + testimonials.length) % testimonials.length
    );
    if (isAutoPlaying) {
      stopAutoSlide();
      startAutoSlide();
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    if (isAutoPlaying) {
      stopAutoSlide();
      startAutoSlide();
    }
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
    stopAutoSlide();
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
    startAutoSlide();
  };

  useEffect(() => {
    if (isAutoPlaying) {
      startAutoSlide();
    }

    return () => {
      stopAutoSlide();
    };
  }, [isAutoPlaying]);

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
        className="absolute right-0 bottom-0 w-auto h-[90%] object-contain opacity-20"
        aria-hidden="true"
      />
      <Image
        src="/images/candidate-testimonials.png"
        alt=""
        width={400}
        height={600}
        className="absolute rotate-180 left-0 bottom-0 w-auto h-[90%] object-contain opacity-20"
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

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={goToPrev}
            className="absolute left-0 md:left-4 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 bg-white rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl transition-all duration-200 hover:scale-110"
            aria-label="Previous testimonial"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-gray-700"
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
            className="absolute right-0 md:right-4 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 bg-white rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl transition-all duration-200 hover:scale-110"
            aria-label="Next testimonial"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-gray-700"
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

          {/* Carousel Container */}
          <div
            className="overflow-hidden mx-12 md:mx-20"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {testimonials.map(testimonial => (
                <div key={testimonial.id} className="w-full flex-shrink-0">
                  <div className="flex justify-center">
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide
                    ? 'bg-[#1F514C] scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
