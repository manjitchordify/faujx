'use client';

import { useState } from 'react';
import {
  User,
  Star,
  Calendar,
  Briefcase,
  Activity,
  Code,
  ClipboardList,
  Check,
} from 'lucide-react';
import Image from 'next/image';

export default function EngineerProfile() {
  const [activeTab, setActiveTab] = useState<
    'capabilities' | 'skills' | 'assessment'
  >('capabilities');

  return (
    <div className="min-h-[calc(100vh-14.5625rem)] bg-white w-full pt-8 pb-16 px-4">
      <div className="w-full container mx-auto rounded-lg flex flex-col lg:flex-row gap-6">
        {/* Left Column */}
        <div className="w-full lg:w-1/4 flex flex-col items-center">
          <Image
            src="/profile-avatar.png"
            alt="User Avatar"
            className="w-32 h-32 rounded-full object-cover"
            width={128}
            height={128}
          />
          <h2 className="mt-4 text-2xl text-[#2563EB] font-medium">
            Full Stack Developer
          </h2>

          <div className="mt-6 space-y-3 w-full xl:w-4/5 mx-auto">
            <button className="w-full py-2 px-4 border border-[#D5D5D5] text-[#585858] rounded flex items-center justify-between hover:bg-gray-50">
              <User size={18} /> <span>Self Intro</span>
            </button>
            <button className="w-full py-2 px-4 border border-[#D5D5D5] text-[#585858] rounded flex items-center justify-between hover:bg-gray-50">
              <span>Add to Favourites</span> <Star size={18} />
            </button>
            <button className="w-full py-2 px-4 border border-[#D5D5D5] text-[#585858] rounded flex items-center justify-between hover:bg-gray-50">
              <Calendar size={18} /> <span>Schedule Interview</span>
            </button>
            <button className="w-full py-2 px-4 border border-[#D5D5D5] text-[#585858] rounded flex items-center justify-between hover:bg-gray-50">
              <span>Hire Now</span> <Briefcase size={18} />
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full flex flex-col lg:w-3/4">
          {/* About Section */}
          <section className="mb-6">
            <h3 className="text-3xl font-semibold mb-4">About</h3>
            <p className="text-[#3A3A3A] lg:text-lg 2xl:text-xl">
              Passionate full-stack developer with 5+ years of experience
              building scalable web applications. Specialized in React, Node.js,
              and cloud technologies. Strong advocate for clean code,
              test-driven development, and agile methodologies. Led multiple
              successful projects from conception to deployment, consistently
              delivering high-quality solutions that exceed client expectations.
            </p>
          </section>

          {/* Tab Container */}
          <div className="rounded-2xl shadow-[0px_4px_19.8px_0px_#00000040] flex-1">
            {/* Tab List */}
            <div className="flex border-b border-[#AEAEAE]">
              {[
                {
                  key: 'capabilities',
                  icon: <Activity size={18} />,
                  label: 'Capabilities',
                },
                { key: 'skills', icon: <Code size={18} />, label: 'Skills' },
                {
                  key: 'assessment',
                  icon: <ClipboardList size={18} />,
                  label: 'Assessment',
                },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 min-w-[20ch] text-sm font-medium transition-all border-b-2 ${
                    activeTab === tab.key
                      ? 'border-[#0052CC] text-[#2563EB] bg-white'
                      : 'border-transparent text-[#585858] hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6 lg:p-8 border-t border-gray-200">
              {activeTab === 'capabilities' && (
                <div className="space-y-3 px-6 py-4 text-[#585858]">
                  {[
                    'Passed HackerRank React Developer Assessment',
                    'Certified in Accessibility Best Practices',
                    'Completed AWS Frontend Web Development Training',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-[#6CC04A] text-white rounded-full">
                        <Check size={16} />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="space-y-4 px-6 py-4">
                  {[
                    { label: 'JavaScript', value: 90 },
                    { label: 'React', value: 85 },
                    { label: 'TypeScript', value: 75 },
                  ].map(skill => (
                    <div key={skill.label}>
                      <div className="flex text-sm justify-between mb-2">
                        <span className="text-[#585858] font-medium">
                          {skill.label}
                        </span>
                        <span className="text-sm text-[#585858]">
                          {skill.value}%
                        </span>
                      </div>
                      <div className="w-full bg-[#E5E7EB] rounded h-3 overflow-hidden">
                        <div
                          className="h-2.5 rounded bg-gradient-to-r from-[#1F514C] via-[#54A044] to-[#66B848]"
                          style={{ width: `${skill.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'assessment' && (
                <div className="flex gap-4 px-6 py-4 text-[#585858]">
                  <div className="aspect-square shrink-0 basis-[20ch] text-center rounded-2xl grid place-content-center border border-[#9747FF] shadow-[0px_4px_15.4px_0px_#00000040]">
                    <h3 className="text-black text-lg font-medium mb-4">
                      MCQ Round
                    </h3>
                    <p>Score: 85%</p>
                  </div>
                  <div className="aspect-square shrink-0 basis-[20ch] text-center rounded-2xl grid place-content-center border border-[#FFDA45] shadow-[0px_4px_15.4px_0px_#00000040]">
                    <h3 className="text-black text-lg font-medium mb-4">
                      MCQ Round
                    </h3>
                    <p>Score: 85%</p>
                  </div>
                  <div className="aspect-square shrink-0 basis-[20ch] text-center rounded-2xl grid place-content-center border border-[#E38888] shadow-[0px_4px_15.4px_0px_#00000040]">
                    <h3 className="text-black text-lg font-medium mb-4">
                      MCQ Round
                    </h3>
                    <p>Score: 85%</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
