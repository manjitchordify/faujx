import RoadmapClient from './RoadmapClient';
import { Metadata } from 'next';

// Generate metadata for each roadmap type
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (slug === 'frontend') {
    return {
      title: 'Frontend Development Roadmap | FaujX - Complete Learning Path',
      description:
        'Master frontend development with our comprehensive roadmap. Learn HTML, CSS, JavaScript, React, and modern frontend technologies step by step.',
      keywords:
        'frontend development, web development, HTML, CSS, JavaScript, React, frontend roadmap, web development learning path',
      openGraph: {
        title: 'Frontend Development Roadmap | FaujX',
        description:
          'Master frontend development with our comprehensive roadmap. Learn HTML, CSS, JavaScript, React, and modern frontend technologies.',
        type: 'website',
        url: 'https://faujx.com/roadmap/frontend/',
        images: [
          {
            url: '/images/coding/coding_assignments.png',
            width: 1200,
            height: 630,
            alt: 'Frontend Development Roadmap',
          },
        ],
      },
      alternates: {
        canonical: 'https://faujx.com/roadmap/frontend/',
      },
    };
  }

  if (slug === 'backend') {
    return {
      title: 'Backend Development Roadmap | FaujX - Complete Learning Path',
      description:
        'Master backend development with our comprehensive roadmap. Learn Node.js, Python, databases, APIs, and server-side technologies step by step.',
      keywords:
        'backend development, server-side development, Node.js, Python, databases, APIs, backend roadmap, server development learning path',
      openGraph: {
        title: 'Backend Development Roadmap | FaujX',
        description:
          'Master backend development with our comprehensive roadmap. Learn Node.js, Python, databases, APIs, and server-side technologies.',
        type: 'website',
        url: 'https://faujx.com/roadmap/backend/',
        images: [
          {
            url: '/images/coding/coding_assignments.png',
            width: 1200,
            height: 630,
            alt: 'Backend Development Roadmap',
          },
        ],
      },
      alternates: {
        canonical: 'https://faujx.com/roadmap/backend/',
      },
    };
  }

  return {
    title: 'Development Roadmap | FaujX - Learning Paths',
    description:
      'Explore comprehensive development roadmaps for frontend and backend technologies. Master modern web development with structured learning paths.',
    alternates: {
      canonical: 'https://faujx.com/roadmap/',
    },
  };
}

export default function RoadmapPage() {
  return <RoadmapClient />;
}
