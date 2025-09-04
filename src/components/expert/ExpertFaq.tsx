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
    <section className="py-16 md:py-20" id="faq">
      <div className="w-full max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-10 bg-[#F3F6F5] rounded-full mb-6">
            <span className="text-gray-600 font-medium text-sm">FAQ</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-normal text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 font-light max-w-2xl mx-auto text-base md:text-lg">
            Here are the top questions our experts ask before getting started.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map(item => {
            const isOpen = openItem === item.id;
            return (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md"
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-lg font-medium text-gray-900">
                    {item.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#1F514C]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {/* Answer Content */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-5 border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed mt-3">
                        {item.answer}
                      </p>
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
