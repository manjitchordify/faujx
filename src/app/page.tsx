"use client";

import React, { useState } from "react";
import Link from "next/link";

const FAQ = [
  {
    q: "Who is FaujX for?",
    a: "Customers hiring great junior engineers, Engineers seeking high-quality roles, and Experts who love mentoring.",
  },
  {
    q: "How does matching work?",
    a: "AI assessments + expert interviews + focused upskilling to ensure consistently high-quality matches.",
  },
];

const Content = () => {
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Coming Soon Header */}
      <section className="w-full py-12 px-4 bg-[#EAEAE2] border-t border-black/5">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1F514C]/10 px-4 py-2 ring-1 ring-[#1F514C]/20">
            <span className="text-5xl font-semibold text-[#1F514C]">
              Coming Soon...
            </span>
          </div>
          <h2 className="mt-4 text-2xl lg:text-3xl font-bold text-[#1F514C]">
            New experiences for Customers, Engineers, and Experts
          </h2>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-[url('/landingpage_background.png')] bg-auto">
        <div className="flex flex-col items-center justify-center px-2 lg:px-4 py-12 lg:py-20 max-w-7xl mx-auto">
          <div className="w-full max-w-2xl text-center mt-11">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-[#1F514C] leading-tight">
              FaujX
            </h1>
            <div className="mb-8">
              <p className="text-xl lg:text-2xl text-[#1F514C] mb-2 font-medium">
                Hire smarter, grow faster.
              </p>
              <p className="text-xl lg:text-2xl text-[#1F514C] font-medium">
                Apply better, get hired quicker.
              </p>
            </div>

            {/* Tab-style Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
              <Link
                href="#"
                className="px-6 py-3 bg-[#EAEAE2] text-black rounded-full font-medium text-base transition-all duration-300 hover:bg-[#1F514C] hover:text-white hover:scale-105 shadow-lg text-center min-w-[140px]"
              >
                I&apos;m a Customer
              </Link>
              <Link
                href="#"
                className="px-6 py-3 bg-[#EAEAE2] text-black rounded-full font-medium text-base transition-all duration-300 hover:bg-[#1F514C] hover:text-white hover:scale-105 shadow-lg text-center min-w-[140px]"
              >
                I&apos;m an Engineer
              </Link>
              <Link
                href="#"
                className="px-6 py-3 bg-[#EAEAE2] text-black rounded-full font-medium text-base transition-all duration-300 hover:bg-[#1F514C] hover:text-white hover:scale-105 shadow-lg text-center min-w-[140px]"
              >
                I&apos;m an Expert
              </Link>
            </div>

            <p className="mt-4 text-base lg:text-lg leading-relaxed text-[#1F514C]/90">
              a global, premium talent acceleration platform designed to connect
              vetted, job-ready Foundation Engineers—with leading tech companies
              across India, the U.S., Europe, Canada, and Singapore. It
              integrates AI-powered assessment with expert interviews and
              LMS-based upskilling to ensure a high-quality talent match.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="w-full max-w-5xl mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "AI-Powered Vetting",
                desc: "Structured assessments tailored to junior engineering skills.",
              },
              {
                title: "Expert Interviews",
                desc: "Human-in-the-loop reviews for signal over noise.",
              },
              {
                title: "Global Opportunities",
                desc: "India, U.S., Europe, Canada, Singapore — one pipeline.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl bg-white/90 backdrop-blur p-5 ring-1 ring-black/5 shadow-sm"
              >
                <div className="text-lg font-semibold text-[#1F514C]">
                  {f.title}
                </div>
                <p className="mt-1 text-sm text-[#1F514C]/80">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 bg-white border-t border-black/5">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center">
          <p className="text-sm text-[#1F514C]/70 text-center">
            © {new Date().getFullYear()} FaujX. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Content;
