import CustomTabs from '@/components/ui/CustomTabs';
import { setIsFavouriteInfoSeen } from '@/store/slices/customerSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { CustomerTabs } from '@/types/customer';
import React, { FC, useState } from 'react';
import CandidateCard from './CandidateCard';
import InterviewFeedbackCard from './cards/InterviewFeedbackCard';
import ShortListModal from './modals/ShortListModal';

interface MyInterviewsProps {
  setSelectedTab: React.Dispatch<React.SetStateAction<CustomerTabs>>;
  selectedTab: CustomerTabs;
}

type interviewTabs = 'Scheduled' | 'Completed';

const MyInterviews: FC<MyInterviewsProps> = ({}) => {
  const interViewTabs: interviewTabs[] = ['Scheduled', 'Completed'];
  const [showShortListModal, setShowShortListModal] = useState(true);
  const [selectedInterviewTab, setSelectedInterviewTab] =
    useState<interviewTabs>('Scheduled');

  const { CustomerFavourites, isFavouriteInfoSeen } = useAppSelector(
    srore => srore.customer
  );
  const dispatch = useAppDispatch();

  const handleTabChnage = (tabText: string) => {
    console.log('TAB TEXT : ', tabText);
    setSelectedInterviewTab(tabText as interviewTabs);
  };

  const CompletedCandidate = [
    {
      role: 'Full Stack Developer',
      profileImage: '/images/blurPic.png',
      date: 'Thu, 14 Aug 2025',
      duration: '10:30 60 min',
    },
    {
      role: 'Full Stack Developer',
      profileImage: '/images/blurPic.png',
      date: 'Thu, 14 Aug 2025',
      duration: '10:30 60 min',
    },
    {
      role: 'Full Stack Developer',
      profileImage: '/images/blurPic.png',
      date: 'Thu, 14 Aug 2025',
      duration: '10:30 60 min',
    },
    {
      role: 'Full Stack Developer',
      profileImage: '/images/blurPic.png',
      date: 'Thu, 14 Aug 2025',
      duration: '10:30 60 min',
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      <CustomTabs textArr={interViewTabs} onChange={handleTabChnage} />
      <div className="w-full flex flex-wrap gap-6">
        {selectedInterviewTab == 'Scheduled'
          ? CustomerFavourites.map(candidate => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                cardType={'myInterview'}
              />
            ))
          : CompletedCandidate.map((item, index) => (
              <InterviewFeedbackCard key={index} candidate={item} />
            ))}
      </div>

      {!isFavouriteInfoSeen && showShortListModal && (
        <ShortListModal
          onClose={() => {
            setShowShortListModal(false);
            dispatch(setIsFavouriteInfoSeen(true));
          }}
        />
      )}
    </div>
  );
};

export default MyInterviews;
