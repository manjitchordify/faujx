'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import {
  ChevronLeft,
  ChevronRight,
  Briefcase,
  GraduationCap,
  Laptop,
  Lightbulb,
  AlertTriangle,
} from 'lucide-react';
import { NavigationOptions } from 'swiper/types';

// Updated blog data with audience segmentation (mapped to your provided copy)
const blogData = {
  startups: [
    {
      id: 1,
      title:
        'Why Your Next Junior Hire Should Be a Vetted Intern, Not a Freelancer',
      subtitle: 'Highlight ROI, vetting rigor, faster onboarding.',
      author: 'Editorial Team',
      date: 'July 18, 2025',
      image: '/images/candidate-blog-1.jpg',
      cta: 'See How It Works',
      ctaLink: '/blog/vetted-interns-vs-freelancers',
    },
    {
      id: 2,
      title:
        'From Screening to Success: How We Vet Interns with a 90% Interview Pass Rate',
      subtitle: 'Break down the 5-stage vetting funnel with examples.',
      author: 'Editorial Team',
      date: 'July 17, 2025',
      image: '/images/candidate-blog-1.jpg',
      cta: 'Read the Funnel',
      ctaLink: '/blog/5-stage-intern-vetting-funnel-90-pass',
    },
    {
      id: 3,
      title:
        'AI/ML Interns on Demand: How Startups Can Access Premium Talent Without Breaking the Bank',
      subtitle:
        'Emphasize Growth & Enterprise plans, success stories, and pricing model.',
      author: 'Editorial Team',
      date: 'July 16, 2025',
      image: '/images/candidate-blog-1.jpg',
      cta: 'View Plans',
      ctaLink: '/pricing',
    },
    {
      id: 4,
      title: 'How to Build Your Tech Team in Under 7 Days Using ChordifyED',
      subtitle:
        'Time-to-match metrics, onboarding support, and interview concierge services.',
      author: 'Editorial Team',
      date: 'July 15, 2025',
      image: '/images/candidate-blog-1.jpg',
      cta: 'Start Hiring',
      ctaLink: '/hire-interns',
    },
    {
      id: 5,
      title: 'What Startups Get Wrong About Intern Hiring (and How to Fix It)',
      subtitle: 'Cost comparisons, ATS overhead, churn data.',
      author: 'Editorial Team',
      date: 'July 14, 2025',
      image: '/images/candidate-blog-1.jpg',
      cta: 'Fix Your Funnel',
      ctaLink: '/blog/startup-intern-hiring-mistakes',
    },
  ],
  universities: [
    {
      id: 6,
      title: 'What Makes a Job-Ready Intern in 2025? Inside Our Skills Matrix',
      subtitle:
        'Showcase technical expectations by role: React, DevOps, AI/ML, and more.',
      author: 'Academic Partnerships',
      date: 'July 21, 2025',
      image: '/images/candidate-blog-1.jpg',
      cta: 'See the Matrix',
      ctaLink: '/blog/job-ready-intern-2025-skills-matrix',
    },
    {
      id: 7,
      title:
        'How University-Backed Badges Can Boost Intern Visibility and Hiring Rates',
      subtitle:
        'LMS integration, certification visibility, and peer-review showcases.',
      author: 'Academic Partnerships',
      date: 'July 20, 2025',
      image: '/images/candidate-blog-1.jpg',
      cta: 'Partner With Us',
      ctaLink: '/book-demo',
    },
    {
      id: 8,
      title: 'From Campus to Code: Launching Global Intern Careers with FaujX',
      subtitle: 'Pathways, mentor support, and LMS prep tracks.',
      author: 'FaujX Team',
      date: 'July 19, 2025',
      image: '/images/candidate-blog-1.jpg',
      cta: 'Explore FaujX',
      ctaLink: '/blog/from-campus-to-code-faujx',
    },
  ],
  interns: [
    {
      id: 9,
      title: 'Don’t Have a Degree? Here’s How to Get Hired on FaujX Anyway',
      subtitle: 'Skills-first, LMS certifications, mentor support.',
      author: 'FaujX Mentors',
      date: 'July 18, 2025',
      image: '/images/candidate-blog-1.jpg',
      cta: 'Start Your Career',
      ctaLink: '/signup',
    },
    {
      id: 10,
      title:
        'What Happens If I Don’t Clear the Interview? Your Path to a Comeback',
      subtitle:
        'Reapplication routes, mentor reviews, and course-based re-entry.',
      author: 'FaujX Mentors',
      date: 'July 17, 2025',
      image: '/images/candidate-blog-1.jpg',
      cta: 'See Your Path',
      ctaLink: '/blog/interview-retry-comeback-path',
    },
    {
      id: 11,
      title:
        'React vs. Fullstack vs. AI/ML: Which Internship Track is Right for You?',
      subtitle: 'Compare skill paths, output expectations, and tools used.',
      author: 'Career Coaching',
      date: 'July 16, 2025',
      image: '/images/candidate-blog-1.jpg',
      cta: 'Choose a Track',
      ctaLink: '/blog/react-vs-fullstack-vs-aiml',
    },
    {
      id: 12,
      title: 'How to Use Your FaujX Profile to Get Noticed by Top Startups',
      subtitle:
        'Project showcases, mentor badges, and match score optimization.',
      author: 'FaujX Team',
      date: 'July 15, 2025',
      image: '/images/candidate-blog-1.jpg',
      cta: 'Optimize Profile',
      ctaLink: '/blog/standout-faujx-profile',
    },
  ],
  'thought-leadership': [
    {
      id: 13,
      title:
        'The Intern Hiring Revolution: Why B2B Subscription Hiring is Here to Stay',
      subtitle:
        'Promote the $799–$1,999/month tiers; benefits vs. traditional hiring.',
      author: 'Strategy',
      date: 'July 22, 2025',
      image: '/images/candidate-blog-1.jpg',
      cta: 'Read Why',
      ctaLink: '/blog/intern-hiring-revolution-subscription',
    },
    {
      id: 14,
      title:
        'From Andela to Internshala: What Makes a Premium Intern Marketplace Different?',
      subtitle: 'Competitive landscape comparison.',
      author: 'Strategy',
      date: 'July 20, 2025',
      image: '/images/candidate-blog-1.jpg',
      cta: 'See the Comparison',
      ctaLink: '/blog/premium-intern-marketplace-differentiation',
    },
    {
      id: 15,
      title:
        'Inside the Global Tech Talent Shortage: Why Intern-First Hiring is the Smartest Strategy in 2025',
      subtitle:
        'Market opportunity, regional demand stats, and platform advantage.',
      author: 'Strategy',
      date: 'July 19, 2025',
      image: '/images/candidate-blog-1.jpg',
      cta: 'View Insights',
      ctaLink: '/blog/global-tech-talent-shortage-intern-first',
    },
    {
      id: 16,
      title:
        'Beyond Keywords: Why Resume Capability Intelligence Is the Future of AI Hiring',
      subtitle: 'Capability graphs for fairer, smarter hiring.',
      author: 'R&D',
      date: 'July 18, 2025',
      image: '/images/candidate-blog-1.jpg',
      cta: 'Look Ahead',
      ctaLink: '/blog/resume-capability-intelligence-future',
    },
  ],
  'ai-pitfalls': [
    {
      id: 17,
      title:
        'The Hidden Pitfalls of AI-Based Interviews (And How FaujX Solves Them)',
      subtitle:
        'Bias, lack of context, rigid assessments—solved with adaptive AI + human-in-the-loop.',
      author: 'FaujX Team',
      date: 'July 22, 2025',
      image: '/images/candidate-blog-1.jpg',
      cta: 'See the Fix',
      ctaLink: '/blog/hidden-pitfalls-of-ai-interviews',
    },
    {
      id: 18,
      title:
        'Can AI Really Judge a Developer? Lessons from 1,000+ Interview Reviews',
      subtitle:
        'Where AI got it wrong—and how a hybrid AI + panel improved outcomes.',
      author: 'Assessments',
      date: 'July 21, 2025',
      image: '/images/candidate-blog-1.jpg',
      cta: 'Read the Lessons',
      ctaLink: '/blog/can-ai-judge-a-developer',
    },
    {
      id: 19,
      title: 'What Not to Do in an AI Interview: Candidate Mistakes to Avoid',
      subtitle:
        'Poor mic setup, ignoring instructions, blank screens, over-reliance on ChatGPT—with recovery tips.',
      author: 'Assessments',
      date: 'July 20, 2025',
      image: '/images/candidate-blog-1.jpg',
      cta: 'Avoid These',
      ctaLink: '/blog/ai-interview-mistakes-to-avoid',
    },
    {
      id: 20,
      title:
        'Why AI-Only Vetting Fails for Startups (and What to Look for Instead)',
      subtitle:
        'Risks of automated scores; value of project showcases and adaptive paths.',
      author: 'Assessments',
      date: 'July 19, 2025',
      image: '/images/candidate-blog-1.jpg',
      cta: 'What to Look For',
      ctaLink: '/blog/why-ai-only-vetting-fails',
    },
    {
      id: 21,
      title: 'Beyond the Bot: How FaujX Adds the Human Edge to AI Interviews',
      subtitle:
        'Mentor-led reviews, candidate feedback loops, and panel interviews.',
      author: 'FaujX Team',
      date: 'July 18, 2025',
      image: '/images/candidate-blog-1.jpg',
      cta: 'Our Approach',
      ctaLink: '/blog/beyond-the-bot-human-edge',
    },
  ],
};

const audienceTabs = [
  {
    key: 'startups',
    label: 'Startups, Tech Leads & Hiring Managers',
    icon: Briefcase,
  },
  {
    key: 'universities',
    label: 'Universities & Bootcamps',
    icon: GraduationCap,
  },
  { key: 'interns', label: 'Interns & Engineers', icon: Laptop },
  { key: 'thought-leadership', label: 'Thought Leadership', icon: Lightbulb },
  { key: 'ai-pitfalls', label: 'AI Interview Pitfalls', icon: AlertTriangle },
];

export default function Blog() {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const [activeTab, setActiveTab] = useState('startups');

  const currentBlogs = blogData[activeTab as keyof typeof blogData] || [];

  return (
    <section className="py-6 md:py-8 lg:py-12 xl:py-16" id="blog">
      <div className="container w-4/5 lg:max-w-[90%] mx-auto px-6 lg:px-8">
        <h2 className="text-3xl lg:text-4xl text-center 2xl:text-5xl font-semibold text-[#1F514C] mb-[max(1rem,5vh)] lg:mb-[max(3rem,10vh)]">
          Blog
        </h2>

        {/* Audience Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 lg:mb-12">
          {audienceTabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-[#1F514C] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        <div className="relative">
          <button
            ref={prevRef}
            className="absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 -translate-x-[calc(100%+1rem)] z-10 p-2 bg-[#1F514C] text-white shadow rounded-full hover:bg-[#1a4641] transition-colors"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6 text-inherit" />
          </button>
          <button
            ref={nextRef}
            className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 translate-x-[calc(100%+1rem)] z-10 p-2 bg-[#1F514C] text-white shadow rounded-full hover:bg-[#1a4641] transition-colors"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-6 h-6 text-inherit" />
          </button>

          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onInit={swiper => {
              const navigation = swiper.params.navigation as NavigationOptions;

              if (prevRef.current && nextRef.current && navigation) {
                navigation.prevEl = prevRef.current;
                navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {currentBlogs.map(blog => (
              <SwiperSlide key={blog.id}>
                <div className="h-90 space-y-4 bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="hidden relative overflow-hidden aspect-[7/5] bg-black/20 rounded-2xl">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      className="object-cover"
                      fill
                    />
                  </div>

                  <div className="flex flex-col justify-between h-full space-y-3">
                    <span className="inline-block text-sm font-bold underline">
                      {blog.date}
                    </span>

                    <h3 className="text-black leading-tight text-xl font-bold">
                      {blog.title}
                    </h3>

                    <p className="text-gray-600 text-sm font-medium leading-relaxed">
                      {blog.subtitle}
                    </p>

                    <p className="text-black text-sm font-semibold">
                      {blog.author}
                    </p>

                    <button
                      className="w-full mt-4 px-6 py-3 bg-[#1F514C] text-white font-semibold rounded-xl hover:bg-[#1a4641] transition-colors duration-200 shadow-md hover:shadow-lg"
                      onClick={() => (window.location.href = blog.ctaLink)}
                    >
                      {blog.cta}
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
