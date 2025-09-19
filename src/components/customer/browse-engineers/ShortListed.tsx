import Button from '@/components/ui/Button';
import { deleteCustomerShortlisted } from '@/services/customerService';
import { setCustomerShortlisted } from '@/store/slices/customerSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { Candidate, CustomerTabs } from '@/types/customer';
import { showToast } from '@/utils/toast/Toast';
import { SquareUser } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { FC, useState } from 'react';
import CandidateCard from './CandidateCard';

interface ShortListedProps {
  setSelectedTab: React.Dispatch<React.SetStateAction<CustomerTabs>>;
  selectedTab: CustomerTabs;
}

const ShortListed: FC<ShortListedProps> = ({}) => {
  const { CustomerShortlisted } = useAppSelector(store => store.customer);
  const { loggedInUser } = useAppSelector(store => store.user);
  const [shortlistRemoveLoader, setShortlistRemoveLoader] =
    useState<boolean>(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate>();

  const dispatch = useAppDispatch();
  const router = useRouter();

  const ViewProfile = (candidate: Candidate) => {
    //   dispatch(setCustomerShortlisted([...CustomerShortlisted, candidate]));
    // router.push('/profile/slug');
    if (loggedInUser?.isPremium) {
      router.push(`/customer/browse-engineers/${candidate.id}/profile`);
    } else {
      router.push(`/customer/pricing`);
    }
  };

  const handleRemoveShortlisted = async (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    try {
      setShortlistRemoveLoader(true);
      await deleteCustomerShortlisted(candidate.id);
      const filterShortListed = CustomerShortlisted.filter(
        item => item.id !== candidate.id
      );
      dispatch(setCustomerShortlisted(filterShortListed));
    } catch (error) {
      showToast('Not Added', 'error');
      console.error(error);
    } finally {
      setShortlistRemoveLoader(false);
    }
  };

  if (CustomerShortlisted.length == 0) {
    return (
      <div className="w-full h-full min-h-[calc(100vh-290px)] flex justify-center items-center">
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
                onClick={() => ViewProfile(candidate)}
                className="w-full bg-[#6C63FF] rounded-2xl py-2 cursor-pointer"
                icon={<SquareUser className="w-5 h-5" />}
              />
              <Button
                onClick={() => handleRemoveShortlisted(candidate)}
                text="Delete"
                className="w-full bg-[#CA0909] rounded-2xl py-2 cursor-pointer"
                isLoading={
                  selectedCandidate?.id == candidate.id
                    ? shortlistRemoveLoader
                    : false
                }
              />
            </div>
          }
        />
      ))}
    </>
  );
};

export default ShortListed;
