'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'Is it free?',
    answer:
      'Yes. Listing and basic LMS access are free. Mentorship and premium tracks are optional add-ons.',
  },
  {
    question: 'Do I need a degree?',
    answer:
      'No. FaujX is skills-first. Demonstrable skills matter more than credentials.',
  },
  {
    question: 'What happens if I fail an interview?',
    answer:
      'You get detailed feedback, personalized LMS track recommendations, and can reapply after improvement.',
  },
  {
    question: 'Will I get a certificate?',
    answer: 'Yes. For every completed LMS module and final vetting process.',
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <section
      className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white"
      id="faq"
    >
      <div className="w-full max-w-3xl mx-auto px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-gray-900 mb-4 leading-tight sm:leading-tight md:leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 font-normal text-base sm:text-lg md:text-xl max-w-xl mx-auto leading-relaxed sm:leading-relaxed md:leading-relaxed">
            Here are the top questions our community asks before getting
            started.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                <button
                  onClick={() => toggleAccordion(i)}
                  className="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none"
                >
                  <span className="text-lg font-medium text-gray-900">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#1F514C]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-4 text-gray-700 leading-relaxed text-sm">
                      {(Array.isArray(faq.answer)
                        ? faq.answer
                        : [faq.answer]
                      ).map((paragraph, j) => (
                        <p key={j} className="mb-2 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
