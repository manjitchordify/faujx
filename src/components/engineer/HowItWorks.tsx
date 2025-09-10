'use client';
import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';
import { Poly } from 'next/font/google';

const poly = Poly({
  weight: '400',
  subsets: ['latin'],
});

const stepsRow1 = [
  {
    number: 1,
    title: 'AI Pre-screen',
    desc: 'Initial profile screening using AI.We assess your readiness for the role instantly.',
    img: '/images/candidate-ai-doc.png',
    whatItIs:
      'Automated screening using AI to analyze resumes, portfolios, and public profiles.',
    focus: 'Skills alignment, experience relevance, and role fit prediction.',
    outcome:
      'Candidates aligned with role requirements progress to the next stage.',
  },
  {
    number: 2,
    title: 'AI Quiz',
    desc: 'Answer adaptive, track-based multiple choice questions.Benchmarked against industry standards using AI.',
    img: '/images/candidate-speech-bubble.png',
    whatItIs: 'Quick adaptive quiz assessing domain-specific fundamentals.',
    focus: 'Core theoretical knowledge and applied problem-solving speed.',
    outcome:
      'Strong problem-solvers advance, while gaps in fundamentals are flagged.',
  },
  {
    number: 3,
    title: 'Code Review',
    desc: 'Solve practical problems in a live browser environment.Focus on logic, structure, and code quality.',
    img: '/images/candidate-magnify-glass.png',
    whatItIs:
      'Manual evaluation of submitted code solutions or GitHub repositories.',
    focus: 'Code structure, readability, maintainability, and best practices.',
    outcome:
      'Clean, maintainable code moves forward; poor practices are filtered out.',
  },
];

const stepsRow2 = [
  {
    number: 4,
    title: 'Technical Interview',
    desc: 'Interact with domain experts in a guided session.We evaluate functional and communication skills.',
    img: '/images/candidate-meeting.png',
    whatItIs: 'Review of all prior signals with in-depth technical probes.',
    focus: 'Depth of knowledge, problem-solving, and clarity of thought.',
    outcome: 'Depth of knowledge and clarity of thought determine advancement.',
  },
  {
    number: 5,
    title: 'Panel Interview',
    desc: 'Your vetted profile goes live to top employers.Showcase reports, code samples, and intro video.',
    img: '/images/candidate-interview.png',
    whatItIs:
      'Group interview to validate technical and behavioral competencies.',
    focus:
      'System design, collaboration, communication, and leadership potential.',
    outcome:
      'Candidates with strong technical and behavioral consensus progress.',
  },
  {
    number: 6,
    title: 'Final Scorecard',
    desc: 'Successful candidates are added to the FaujX talent pool. Profiles become available for matching with opportunities.',
    img: '/images/candidate-scorecard.png',
    whatItIs: 'Consolidated performance summary from all stages.',
    focus: 'Composite score across AI and human-led evaluations.',
    outcome: 'Certified performance level awarded with a summary report.',
  },
];

export default function HowItWorks() {
  return (
    // <section className="bg-white py-6 md:pt-8 md:pb-16 w-full relative">
    <section className="bg-white py-6 md:pt-6 md:pb-12 w-full relative">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.h2
          className="mb-14 text-[#1F514C] text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl max-w-[22ch] mx-auto text-center font-semibold leading-tight sm:leading-tight md:leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          How It Works
        </motion.h2>

        <div className="w-[88%] mx-auto flex flex-col gap-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stepsRow1.map((step, index) => (
              <motion.div
                key={step.number}
                className="relative rounded-xl flex flex-col items-start border border-[#DCDCDC] shadow-sm hover:shadow-lg transition-all duration-300 bg-white overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {/* Header with integrated number */}
                <div className="bg-gradient-to-r from-[#2A6B65] to-[#1F514C] w-full px-6 py-4 relative">
                  <div className="flex items-center gap-4">
                    <div
                      className={`${poly.className} bg-[#54A044] text-white font-bold rounded-full size-10 flex items-center justify-center text-lg shadow-md flex-shrink-0`}
                    >
                      {step.number}
                    </div>
                    <h3 className="text-[#6CC04A] font-semibold text-lg leading-tight">
                      {step.title}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full p-6 space-y-4 flex-1">
                  <div className="relative aspect-square mx-auto h-[5rem]">
                    {step.img && (
                      <Image
                        src={step.img}
                        fill
                        alt={step.title}
                        className="object-contain"
                      />
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-bold text-[#1F514C] mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#54A044] rounded-full"></div>
                        What it is:
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {step.whatItIs}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-[#1F514C] mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#54A044] rounded-full"></div>
                        Focus:
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {step.focus}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-[#1F514C] mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#54A044] rounded-full"></div>
                        Outcome:
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {step.outcome}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stepsRow2.map((step, index) => (
              <motion.div
                key={step.number}
                className="relative rounded-xl flex flex-col items-start border border-[#DCDCDC] shadow-sm hover:shadow-lg transition-all duration-300 bg-white overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (index + 3) * 0.1 }}
              >
                {/* Header with integrated number */}
                <div className="bg-gradient-to-r from-[#2A6B65] to-[#1F514C] w-full px-6 py-4 relative">
                  <div className="flex items-center gap-4">
                    <div
                      className={`${poly.className} bg-[#54A044] text-white font-bold rounded-full size-10 flex items-center justify-center text-lg shadow-md flex-shrink-0`}
                    >
                      {step.number}
                    </div>
                    <h3 className="text-[#6CC04A] font-semibold text-lg leading-tight">
                      {step.title}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full p-6 space-y-4 flex-1">
                  <div className="relative aspect-square mx-auto h-[5rem]">
                    {step.img && (
                      <Image
                        src={step.img}
                        fill
                        alt={step.title}
                        className="object-contain"
                      />
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-bold text-[#1F514C] mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#54A044] rounded-full"></div>
                        What it is:
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {step.whatItIs}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-[#1F514C] mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#54A044] rounded-full"></div>
                        Focus:
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {step.focus}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-[#1F514C] mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#54A044] rounded-full"></div>
                        Outcome:
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {step.outcome}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
