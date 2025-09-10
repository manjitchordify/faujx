'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Define the testimonial type
interface Testimonial {
  message: string;
  name: string;
  title: string;
  image: string;
}

// Define props for AvatarComponent
interface AvatarComponentProps {
  testimonial: Testimonial;
  index: number;
}

export default function UserStories() {
  const [showAllCards, setShowAllCards] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [imageErrors, setImageErrors] = useState(new Set<number>());

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's 'md' breakpoint is 768px
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const testimonials: Testimonial[] = [
    {
      message:
        "What used to take us weeks now happens in days, thanks to Faujx's incredibly streamlined approach.",
      name: 'Shomron Jacob',
      title: 'itearate.ai',
      image: '',
    },
    {
      message:
        'An absolute standout! This platform delivers robust tools, effortless connectivity, and usability.',
      name: 'Leslie Chen',
      title: 'Rise Lean',
      image: '/images/customer/testmonial/leslie_chen1.jpeg',
    },
    {
      message:
        'The team was exceptionally professional and responsive, working closely with us throughout the entire process.',
      name: 'Nithin Ahuja',
      title: '',
      image: '',
    },
    // {
    //   message:
    //     'Simply exceptional! This service provides outstanding talent, seamless processes, and unmatched results.',
    //   name: 'John Hollingsworth',
    //   title: 'Founder of educeri',
    //   image: '',
    // },
    // {
    //   message:
    //     'Genuinely impressive! This solution delivers expert candidates, smooth collaboration, and consistent excellence.',
    //   name: 'Sachin Gupta',
    //   title: 'JuiceMedia.AI',
    //   image: '',
    // },
    // {
    //   message:
    //     "I'm truly grateful for the comprehensive vetting process that ensured exceptionally quality candidates.",
    //   name: 'Maria Piennar',
    //   title: 'COO,Femmar',
    //   image: '/images/customer/testmonial/maria_femmar.jpeg',
    // },
  ];

  const initialCardCount = isMobile ? 3 : 6;
  const displayedTestimonials = showAllCards
    ? testimonials
    : testimonials.slice(0, initialCardCount);

  const handleToggleShowAll = () => {
    setShowAllCards((prev: boolean) => !prev);
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev: Set<number>) => new Set(prev).add(index));
  };

  // Generate a consistent background color based on the name
  const getAvatarColor = (name: string): string => {
    const colors = ['bg-black'];

    const hash = name.split('').reduce((acc: number, char: string) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    return colors[Math.abs(hash) % colors.length];
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((word: string) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2); // Limit to 2 characters for better display
  };

  const AvatarComponent: React.FC<AvatarComponentProps> = ({
    testimonial,
    index,
  }) => {
    const showFallback = !testimonial.image || imageErrors.has(index);

    if (showFallback) {
      return (
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg border-2 border-white shadow-sm ${getAvatarColor(testimonial.name)}`}
        >
          {getInitials(testimonial.name)}
        </div>
      );
    }

    return (
      <Image
        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
        src={testimonial.image}
        alt={`Profile of ${testimonial.name}`}
        width={48}
        height={48}
        onError={() => handleImageError(index)}
      />
    );
  };

  return (
    <section id="success-stories">
      <div className="w-full py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center ">
            <p className="text-3xl sm:text-4xl md:text-6xl leading-tight font-light text-[#1F514C] tracking-tight">
              <span className="text-[#1F514C] font-medium mt-3 tracking-tight">
                What Our Users Say
              </span>
            </p>
          </div>
          <p className="text-3xl text-center font-light text-[#1F514C] mb-5 md:mt-8 md:mb-3">
            Hear from businesses who&apos;ve transformed their workflows with
            our solutions.
          </p>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 mt-12">
            <AnimatePresence mode="wait">
              {displayedTestimonials.map(
                (testimonial: Testimonial, index: number) => (
                  <motion.div
                    key={index}
                    className="p-6 bg-[#F6FBFF] rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 "
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    layout
                  >
                    <p className="mb-6 text-gray-800 leading-relaxed font-sans">
                      &ldquo;{testimonial.message}&rdquo;
                    </p>
                    <div className="flex items-center">
                      <div className="relative">
                        <AvatarComponent
                          testimonial={testimonial}
                          index={index}
                        />
                      </div>

                      {/* Vertical dotted divider */}
                      <div className="mx-4 h-12 border-l-3 border-dotted border-[#767676]"></div>

                      <div>
                        <div className="font-semibold text-gray-900 font-sans">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-600 font-sans">
                          {testimonial.title}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
          {testimonials.length > initialCardCount && (
            <div className="flex justify-center">
              <motion.button
                type="button"
                className="py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 font-sans"
                onClick={handleToggleShowAll}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showAllCards
                  ? 'Show Less'
                  : `Show More (+${testimonials.length - initialCardCount})`}
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
