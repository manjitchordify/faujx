import { Metadata } from 'next';
import Content from '@/components/main/Content';

export const metadata: Metadata = {
  title: 'FaujX - Mission-Driven Tech Hiring Platform | Home',
  description:
    'FaujX is a mission-driven tech hiring platform that discovers, vets, upskills, and deploys Foundation Engineers. Choose your role: Customer, Engineer, or Expert.',
  keywords:
    'tech hiring platform, foundation engineers, software development, career acceleration, tech recruitment, engineering talent',
  openGraph: {
    title: 'FaujX - Mission-Driven Tech Hiring Platform',
    description:
      'Choose your role: Customer, Engineer, or Expert. Discover, vet, upskill, and deploy Foundation Engineers.',
    type: 'website',
    url: 'https://faujx.com/',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'FaujX - Tech Hiring Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FaujX - Mission-Driven Tech Hiring Platform',
    description:
      'Choose your role: Customer, Engineer, or Expert. Discover, vet, upskill, and deploy Foundation Engineers.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://faujx.com/',
  },
};

export default function Home() {
  return <Content />;
}
