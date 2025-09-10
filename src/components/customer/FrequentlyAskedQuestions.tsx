'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'How do I view candidates?',
    answer:
      'After signing in, you can preview profiles. To unlock full details, choose an access tier or subscription.',
  },
  {
    question: "What if the candidate doesn't perform post-hire?",
    answer:
      'FaujX offers candidate replacement options and ongoing LMS support to boost success.',
  },
  {
    question: 'Can we integrate with our ATS?',
    answer:
      'Yes. ATS integrations like Lever and Greenhouse are available in Enterprise tiers.',
  },
  {
    question: 'Do you offer full-time and project-based roles?',
    answer:
      'Yes. Both models are supported depending on candidate and client preferences.',
  },
];

export default function FrequentlyAskedQuestions() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <section id="frequently-asked-questions" className="py-16 md:py-20">
      <div className="w-full max-w-4xl mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center ">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight sm:leading-tight md:leading-tight lg:leading-tight font-semibold text-[#1F514C] tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center font-normal text-[#1F514C] mb-4 sm:mb-5 md:mt-6 lg:mt-8 md:mb-3 leading-relaxed sm:leading-relaxed md:leading-relaxed">
          Here are the top questions our clients ask before getting started.
        </p>

        <div className="mt-12 space-y-4" id="accordion">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md"
              >
                <button
                  className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none"
                  onClick={() => toggleAccordion(index)}
                >
                  <span className="text-lg font-medium text-gray-900">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <Minus className="w-5 h-5 text-[#1F514C]" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-500" />
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
                    <div className="px-6 pb-4 text-gray-700 text-sm leading-relaxed">
                      {(Array.isArray(faq.answer)
                        ? faq.answer
                        : [faq.answer]
                      ).map((paragraph, i) => (
                        <p key={i} className="mb-2 last:mb-0">
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
