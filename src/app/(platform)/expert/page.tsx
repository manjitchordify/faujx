import ActionItemsSection from '@/components/expert/ActionItemsSection';
import ExpertDetail from '@/components/expert/ExpertDetail';
import ExpertFaq from '@/components/expert/ExpertFaq';
import ExpertHeader from '@/components/expert/ExpertHeader';
import HowItWorksSection from '@/components/expert/HowItWorksSection';
import MentorsSection from '@/components/expert/MentorsSection';
import StudentTestimonials from '@/components/expert/StudentTestimonials';

import React from 'react';

const page = () => {
  return (
    <>
      <meta
        name="description"
        content="This is the page for expert landing page for faujx"
      />
      <ExpertHeader />
      <ExpertDetail />
      <HowItWorksSection />
      <ActionItemsSection />
      <MentorsSection />
      <StudentTestimonials />
      <ExpertFaq />
    </>
  );
};

export default page;
