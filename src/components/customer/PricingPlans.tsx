'use client';
import React, { useEffect, useState } from 'react';
import Button from '@/components/customer/shared/Button';

const pricingCards = [
  {
    type: 'pricing',
    title: ['Radical', 'Simple Pricing'],
    items: ['Pay once to unlock Profiles and to hire '],
    buttonText: 'Unlock profiles',
    buttonAction: () => console.log('Unlock profiles clicked'),
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {pricingCards.map((card, index) => (
              <div
                key={index}
                className={`w-full bg-white border border-gray-200 rounded-lg p-6 lg:p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[320px] ${
                  visible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Content area */}
                <div className="flex-grow flex flex-col">
                  <h3 className="text-2xl lg:text-3xl xl:text-4xl font-medium text-gray-900 mb-6 leading-tight">
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
                  <div className="flex-grow mb-8">
                    {card.items ? (
                      <ul className="space-y-4">
                        {card.items.map((item, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-gray-900 text-base lg:text-lg leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : card.subtitle ? (
                      <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                        {card.subtitle}
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Button area */}
                <div className="mt-auto">
                  <Button
                    text={card.buttonText}
                    onClick={card.buttonAction}
                    className="w-full py-4 bg-[#1F514C] hover:bg-[#1a433f] text-white font-medium transition-colors text-base lg:text-lg rounded-2xl"
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
