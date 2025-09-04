'use client';
import React, { useEffect, useState } from 'react';
import Button from '@/components/customer/shared/Button';
import Image from 'next/image';

const pricingCards = [
  {
    type: 'pricing',
    title: ['Ready to', 'Subscribe?'],
    items: ['Pay once to unlock Profiles', 'Pay once when you hire '],
    buttonText: 'Unlock profiles',
    buttonAction: () => console.log('Start for $100 clicked'),
  },
  {
    type: 'cta',
    title: ['Ready to', 'Hire?'],
    subtitle: 'Find pre-vetted engineers now',
    buttonText: 'Browse Candidates',
    buttonAction: () => console.log('Browse Candidates clicked'),
  },
  {
    type: 'support',
    title: ['Still', 'Unsure?'],
    subtitle: 'Talk to our team for questions.',
    buttonText: 'Chat with FaujX Support',
    buttonAction: () => console.log('Chat with FaujX Support clicked'),
  },
];

export default function PricingPlans() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <section id="pricing" className="w-full">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="max-w-7xl mx-auto">
          {/* All cards in equal columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-4 lg:gap-6 xl:gap-8">
            {pricingCards.map((card, index) => (
              <div
                key={index}
                className={`w-full bg-white border border-gray-200 rounded-lg p-4 sm:p-6 md:p-5 lg:p-6 xl:p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[300px] ${
                  visible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Consistent top content area */}
                <div className="flex-grow flex flex-col">
                  <h3 className="text-xl sm:text-2xl md:text-xl lg:text-2xl xl:text-5xl font-medium text-gray-900 mb-4 sm:mb-5 md:mb-4 lg:mb-5 xl:mb-6 leading-tight">
                    {Array.isArray(card.title) ? (
                      <>
                        {card.title[0]}
                        <br />
                        {card.title[1]}
                      </>
                    ) : (
                      card.title
                    )}
                  </h3>

                  {/* Content area - either items or subtitle */}
                  <div className="flex-grow mb-6 sm:mb-8 md:mb-6 lg:mb-8 xl:mb-10">
                    {card.items ? (
                      <ul className="space-y-3 sm:space-y-4 md:space-y-3 lg:space-y-4 xl:space-y-3">
                        {card.items.map((item, i) => (
                          <li key={i} className="flex items-start">
                            <div className="relative w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 mt-0.5 mr-3 sm:mr-4 md:mr-3 lg:mr-4 flex-shrink-0">
                              <Image
                                src="/images/customer/point.svg"
                                alt="points"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="text-gray-900 text-sm sm:text-base md:text-sm lg:text-base xl:text-lg leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : card.subtitle ? (
                      <p className="text-gray-600 text-sm sm:text-base md:text-sm lg:text-base xl:text-xl leading-relaxed mt-7">
                        {card.subtitle}
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Consistent bottom button area */}
                <div className="mt-auto">
                  <Button
                    text={card.buttonText}
                    className="w-full py-3 sm:py-4 md:py-3 lg:py-4 xl:py-5 bg-[#1F514C] hover:bg-[#1a433f] text-white font-medium transition-colors text-sm sm:text-base md:text-sm lg:text-base xl:text-lg rounded-2xl"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
