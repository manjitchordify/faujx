import { useAppDispatch, useAppSelector } from '@/store/store';
import React from 'react';
import CandidateCard from './CandidateCard';
import Button from '@/components/ui/Button';
import { setCustomerShortlisted } from '@/store/slices/customerSlice';
import { Candidate } from '@/types/customer';
import { useRouter } from 'next/navigation';

function ShortListed() {
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
}

export default ShortListed;
