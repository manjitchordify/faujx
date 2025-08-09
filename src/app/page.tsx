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
              vetted, job-ready junior software engineers—called Foundation
              Engineers—with leading tech companies across India, the U.S.,
              Europe, Canada, and Singapore. It integrates AI-powered assessment
              with expert interviews and LMS-based upskilling to ensure a
              high-quality talent match.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center justify-center gap-5">
              <Link
                href="https://twitter.com"
                aria-label="Follow on X"
                className="group"
              >
                <svg
                  className="h-6 w-6 fill-[#1F514C] opacity-80 group-hover:opacity-100"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2H21l-6.5 7.43L22 22h-6.8l-4.4-5.93L5.6 22H2l7.1-8.12L2 2h6.9l4 5.44L18.244 2Zm-1.19 18h1.86L7.02 3.91H5.06L17.054 20Z" />
                </svg>
              </Link>
              <Link
                href="https://www.linkedin.com"
                aria-label="Follow on LinkedIn"
                className="group"
              >
                <svg
                  className="h-6 w-6 fill-[#1F514C] opacity-80 group-hover:opacity-100"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7 0h3.8v2.2h.05c.53-1 1.82-2.2 3.75-2.2 4 0 4.75 2.6 4.75 6V24h-4v-7.1c0-1.7 0-3.8-2.3-3.8s-2.6 1.8-2.6 3.6V24h-4V8z" />
                </svg>
              </Link>
              <Link
                href="mailto:hello@faujx.com"
                aria-label="Email us"
                className="group"
              >
                <svg
                  className="h-6 w-6 fill-[#1F514C] opacity-80 group-hover:opacity-100"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 13 0 6V4l12 7L24 4v2l-12 7Zm12-9H0v16h24V4Z" />
                </svg>
              </Link>
            </div>
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

          {/* FAQ */}
          <div className="w-full max-w-3xl mt-12">
            <h3 className="text-xl font-bold text-[#1F514C] mb-4 text-center">
              Quick FAQ
            </h3>
            <div className="space-y-3">
              {FAQ.map((item, idx) => {
                const open = faqOpen === idx;
                return (
                  <div
                    key={item.q}
                    className="rounded-2xl bg-white/90 ring-1 ring-black/5 p-4"
                  >
                    <button
                      className="w-full flex items-center justify-between text-left"
                      onClick={() => setFaqOpen(open ? null : idx)}
                      aria-expanded={open}
                    >
                      <span className="font-medium text-[#1F514C]">
                        {item.q}
                      </span>
                      <span className="select-none text-[#1F514C]">
                        {open ? "–" : "+"}
                      </span>
                    </button>
                    {open && (
                      <p className="mt-2 text-sm text-[#1F514C]/80">{item.a}</p>
                    )}
                  </div>
                );
              })}
            </div>
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
