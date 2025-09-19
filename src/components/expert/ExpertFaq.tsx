'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const ExpertFaq: React.FC = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: 'How do I become an expert with FaujX?',
      answer:
        'Apply via the platform. You’ll undergo a qualification and onboarding process.',
    },
    {
      id: 2,
      question: 'How are experts compensated?',
      answer: 'Experts earn per mentorship session or interview participation.',
    },
    {
      id: 3,
      question: 'Can I choose areas I want to mentor in?',
      answer: 'Yes. You can define your skill focus and availability.',
    },
    {
      id: 4,
      question: 'Do I get public visibility?',
      answer:
        'Yes. Top-rated mentors and experts are showcased on the platform.',
    },
  ];

  const toggleItem = (itemId: number) => {
    setOpenItem(openItem === itemId ? null : itemId);
  };

  return (
    <section id="frequently-asked-questions" className="py-16 md:py-20">
      <div className="w-full max-w-4xl mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center ">
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight sm:leading-tight md:leading-tight lg:leading-tight font-semibold text-[#1F514C] tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center font-normal text-[#1F514C] mb-4 sm:mb-5 md:mt-6 lg:mt-8 md:mb-3 leading-relaxed sm:leading-relaxed md:leading-relaxed">
          Here are the top questions our experts ask before getting started.
        </p>

        <div className="mt-12 space-y-4" id="accordion">
          {faqData.map(item => {
            const isOpen = openItem === item.id;
            return (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md"
              >
                <button
                  className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none"
                  onClick={() => toggleItem(item.id)}
                >
                  <span className="text-lg font-medium text-gray-900">
                    {item.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#1F514C] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
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
                      <p className="mb-2 last:mb-0">{item.answer}</p>
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
};

export default ExpertFaq;
