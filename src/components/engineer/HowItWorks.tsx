import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
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
        <h2 className="mb-14 text-[#1F514C] text-3xl max-w-[22ch] mx-auto text-center font-semibold">
          How it works?
        </h2>

        <div className="w-[88%] mx-auto flex flex-col max-md:gap-[max(1vw,1rem)] gap-[3vw] mb-12">
          <div className="flex max-md:flex-col justify-center gap-[max(1vw,1rem)]">
            {stepsRow1.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="relative rounded-lg basis-[min(100%,15rem)] md:basis-[calc(50%-3vw)] lg:basis-[25%] flex flex-col items-start border border-[#DCDCDC]">
                  <div
                    className={`${poly.className} leading-none absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-[#6C63FF] text-white font-bold rounded-full size-12 flex items-center justify-center text-2xl`}
                  >
                    {step.number}
                  </div>
                  <div className="bg-[#1F514C] rounded-t-lg text-[#6CC04A] font-semibold text-lg w-full text-center py-5">
                    {step.title}
                  </div>
                  <div className="bg-white w-full p-4 text-black space-y-2 text-xs -mt-1 rounded-lg flex-1">
                    <div className="relative aspect-square mx-auto h-[4rem]">
                      {step.img && (
                        <Image
                          src={step.img}
                          // className="h-full object-contain mx-auto"
                          fill
                          alt={step.title}
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#3b6e27]">
                        What it is:
                      </h3>
                      <p>{step.whatItIs}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#3b6e27]">
                        Focus:
                      </h3>
                      <p>{step.focus}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#3b6e27]">
                        Outcome:
                      </h3>
                      <p>{step.outcome}</p>
                    </div>
                  </div>
                </div>
                {index !== stepsRow1.length - 1 && (
                  <div className="self-center flex">
                    <ArrowRight className="m-auto size-[max(3rem,5vw)] max-md:rotate-90 text-[#1F514C]" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="md:hidden self-center flex">
            <ArrowRight className="m-auto size-[max(3rem,5vw)] max-md:rotate-90 text-[#1F514C]" />
          </div>
          <div className="flex max-md:flex-col justify-center gap-[max(1vw,1rem)]">
            {stepsRow2.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="relative rounded-lg basis-[min(100%,15rem)] md:basis-[calc(50%-3vw)] lg:basis-[25%] flex flex-col items-start border border-[#DCDCDC]">
                  <div
                    className={`${poly.className} leading-none absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-[#6C63FF] text-white font-bold rounded-full size-12 flex items-center justify-center text-2xl`}
                  >
                    {step.number}
                  </div>
                  <div className="bg-[#1F514C] rounded-t-lg text-[#6CC04A] font-semibold text-lg w-full text-center py-5">
                    {step.title}
                  </div>
                  <div className="bg-white w-full p-4 text-black space-y-2 text-xs -mt-1 rounded-lg flex-1">
                    <div className="relative aspect-square mx-auto h-[4rem]">
                      {step.img && (
                        <Image
                          src={step.img}
                          // className="h-full object-contain mx-auto"
                          fill
                          alt={step.title}
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#3b6e27]">
                        What it is:
                      </h3>
                      <p>{step.whatItIs}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#3b6e27]">
                        Focus:
                      </h3>
                      <p>{step.focus}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#3b6e27]">
                        Outcome:
                      </h3>
                      <p>{step.outcome}</p>
                    </div>
                  </div>
                </div>
                {index !== stepsRow2.length - 1 && (
                  <div className="self-center flex">
                    <ArrowRight className="m-auto size-[max(3rem,5vw)] max-md:rotate-90 text-[#1F514C]" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
