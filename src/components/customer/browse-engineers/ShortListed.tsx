import { useAppDispatch, useAppSelector } from '@/store/store';
import React, { FC } from 'react';
import CandidateCard from './CandidateCard';
import Button from '@/components/ui/Button';
import { setCustomerShortlisted } from '@/store/slices/customerSlice';
import { Candidate, CustomerTabs } from '@/types/customer';
import { useRouter } from 'next/navigation';

interface ShortListedProps {
  setSelectedTab: React.Dispatch<React.SetStateAction<CustomerTabs>>;
  selectedTab: CustomerTabs;
}

const ShortListed: FC<ShortListedProps> = ({}) => {
  const { CustomerShortlisted } = useAppSelector(store => store.customer);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const ViewProfile = () => {
    //   dispatch(setCustomerShortlisted([...CustomerShortlisted, candidate]));
    router.push('/profile/slug');
  };

  const handleRemoveShortlisted = (candidate: Candidate) => {
    const filterShortListed = CustomerShortlisted.filter(
      item => item.id !== candidate.id
    );
    dispatch(setCustomerShortlisted(filterShortListed));
  };

  if (CustomerShortlisted.length == 0) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        NO SHORTLISTED
      </div>
    );
  }

  return (
    <>
      {CustomerShortlisted.map(candidate => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          cardType={'shortlisted'}
          buttons={
            <div className="flex flex-row justify-between items-center gap-6">
              <Button
                text="View Profile"
                onClick={() => ViewProfile()}
                className="w-full bg-[#6C63FF] rounded-2xl py-2 cursor-pointer"
              />
              <Button
                onClick={() => handleRemoveShortlisted(candidate)}
                text="Delete"
                className="w-full bg-[#CA0909] rounded-2xl py-2 cursor-pointer"
              />
            </div>
          }
        />
      ))}
    </>
  );
};

export default ShortListed;
