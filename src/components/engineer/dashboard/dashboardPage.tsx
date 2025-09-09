'use client';
import React from 'react';
import { BookOpen, GraduationCap, Sparkles, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/store';

interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

const services: Service[] = [
  {
    title: 'Book a Mentor',
    description: 'Get 1:1 expert guidance (Paid)',
    icon: <BookOpen className="w-8 h-8 text-indigo-600" />,
    path: 'dashboard/browse-mentors',
  },
  {
    title: 'Interview Prep',
    description: 'Practice with mock tests (Free)',
    icon: <GraduationCap className="w-8 h-8 text-green-600" />,
    path: '#',
  },
  {
    title: 'Upskill with FaujX LMS',
    description: 'Boost your career with curated courses',
    icon: <Sparkles className="w-8 h-8 text-yellow-500" />,
    path: 'https://www.chordifyed.com/',
  },
];

const Services: React.FC = () => {
  const router = useRouter();
  const candidate_id = useAppSelector(state => state.user.loggedInUser?.id);

  return (
    <div className="w-full px-4 py-10 sm:px-10 lg:px-20 lg:py-28">
      {/* Header with Vetting Report button */}
      <div className="flex justify-end mb-8">
        <a
          href={`/vetting-report/candidate/${candidate_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-[#54A044] hover:bg-[#54A044] text-white rounded-lg font-medium transition-colors"
        >
          <FileText className="w-4 h-4" />
          Vetting Report
        </a>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <div
            key={i}
            className="rounded-2xl shadow-md hover:shadow-lg transition-all bg-white"
          >
            <div className="flex flex-col items-center text-center gap-4 p-6">
              {service.icon}
              <h2 className="text-lg font-semibold text-[#585858]">
                {service.title}
              </h2>
              <p className="text-gray-600 text-sm">{service.description}</p>
              <button
                onClick={() => router.push(service.path)}
                className="cursor-pointer mt-2 px-5 py-2 bg-[#54A044] text-white rounded-lg font-bold transition"
              >
                Explore
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
