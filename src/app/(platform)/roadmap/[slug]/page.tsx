'use client';
import FrontendRoadmapFlow from '@/components/roadmap/frontendroadmap/FrontendRoadmapFlow';
import BackendRoadmapFlow from '@/components/roadmap/backendroadmap/BackendRoadmapFlow';
import { useParams } from 'next/navigation';

import React from 'react';

const roadmapComponents = {
  backend: BackendRoadmapFlow,
  frontend: FrontendRoadmapFlow,
} as const;

type RoadmapSlug = keyof typeof roadmapComponents;

const Page = () => {
  const params = useParams();
  const slug = params?.slug as string;

  const isValidSlug = (slug: string): slug is RoadmapSlug => {
    return slug in roadmapComponents;
  };

  if (slug && isValidSlug(slug)) {
    const RoadmapComponent = roadmapComponents[slug];
    return <RoadmapComponent />;
  }

  return <p className="text-gray-600 mb-4">The roadmap does not exist.</p>;
};

export default Page;
