import React from 'react';
import SectionHeader from './SectionHeader';

// Custom SVG Icons with consistent styling
const BrainIcon = () => (
  <svg
    className="w-8 h-8 lg:w-10 lg:h-10"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
    />
  </svg>
);

const BookOpenIcon = () => (
  <svg
    className="w-8 h-8 lg:w-10 lg:h-10"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    className="w-8 h-8 lg:w-10 lg:h-10"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
    />
  </svg>
);

const DollarSignIcon = () => (
  <svg
    className="w-8 h-8 lg:w-10 lg:h-10"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const HandshakeIcon = () => (
  <svg
    className="w-8 h-8 lg:w-10 lg:h-10"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.58-5.84a14.927 14.927 0 015.84 2.58M15.59 14.37L9.631 8.41m5.96 5.96L9.631 8.41"
    />
  </svg>
);

function WhyDifferent() {
  const differentiators = [
    {
      icon: BrainIcon,
      title: 'AI + Human Vetting',
      description:
        'Advanced AI screening combined with expert human evaluation ensures only the best candidates reach you.',
      highlight: 'Smart Screening',
    },
    {
      icon: BookOpenIcon,
      title: 'Integrated LMS',
      description:
        'Built-in Learning Management System allows candidates to upskill and demonstrate continuous learning.',
      highlight: 'Skill Development',
    },
    {
      icon: UsersIcon,
      title: 'Experts & Mentor Network',
      description:
        'Access to industry experts and mentors who guide candidates through real-world challenges.',
      highlight: 'Expert Guidance',
    },
    {
      icon: DollarSignIcon,
      title: 'Simple Pricing',
      description:
        'Transparent, one-time pricing with no hidden fees or recurring charges. What you see is what you pay.',
      highlight: 'No Hidden Costs',
    },
    {
      icon: HandshakeIcon,
      title: 'Post Hire Support',
      description:
        'Ongoing support and mentorship for both candidates and employers to ensure successful long-term partnerships.',
      highlight: 'Long-term Success',
    },
  ];

  return (
    <section className="w-full min-h-screen py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-[#2A6B65] to-[#1F514C] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-[#2A6B65] to-[#1F514C] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-[#2A6B65] to-[#1F514C] rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 relative z-10">
        {/* Section Header */}
        <div className="mb-16 lg:mb-20">
          <SectionHeader
            mainText="Why FaujX is different from other Job Boards & Recruiting Agencies?"
            aboutSection=""
          />
        </div>

        {/* Differentiators Grid */}
        <div className="max-w-6xl mx-auto">
          {/* First Row - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-8 lg:mb-10">
            {differentiators.slice(0, 3).map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#1F514C]/20 hover:-translate-y-2"
                >
                  {/* Highlight Badge */}
                  <div className="absolute -top-3 left-6 bg-gradient-to-r from-[#2A6B65] to-[#1F514C] text-white px-4 py-1 rounded-full text-sm font-medium">
                    {item.highlight}
                  </div>

                  {/* Icon Container */}
                  <div className="mb-6">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-[#2A6B65] to-[#1F514C] rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                      <IconComponent />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-[#1F514C] transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-[#1F514C]/20 transition-all duration-300 pointer-events-none"></div>
                </div>
              );
            })}
          </div>

          {/* Second Row - 2 cards centered */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-4xl">
              {differentiators.slice(3, 5).map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index + 3}
                    className="group relative bg-white rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#1F514C]/20 hover:-translate-y-2"
                  >
                    {/* Highlight Badge */}
                    <div className="absolute -top-3 left-6 bg-gradient-to-r from-[#2A6B65] to-[#1F514C] text-white px-4 py-1 rounded-full text-sm font-medium">
                      {item.highlight}
                    </div>

                    {/* Icon Container */}
                    <div className="mb-6">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-[#2A6B65] to-[#1F514C] rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                        <IconComponent />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-[#1F514C] transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-[#1F514C]/20 transition-all duration-300 pointer-events-none"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 lg:mt-20 text-center">
          <div className="bg-gradient-to-r from-[#2A6B65] to-[#1F514C] rounded-3xl p-8 lg:p-12 text-white">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Ready to Experience the Difference?
            </h3>
            <p className="text-lg lg:text-xl opacity-90 mb-6 max-w-2xl mx-auto">
              Join hundreds of companies who have transformed their hiring
              process with FaujX.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button className="bg-white text-[#1F514C] px-8 py-3 rounded-2xl font-semibold hover:bg-gray-100 transition-colors duration-300">
                Start Hiring Today
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-2xl font-semibold hover:bg-white hover:text-[#1F514C] transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyDifferent;
