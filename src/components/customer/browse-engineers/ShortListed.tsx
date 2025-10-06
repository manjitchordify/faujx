import Button from '@/components/ui/Button';
import {
  deleteCustomerShortlisted,
  getShortlistedCustomerCandidates,
} from '@/services/customerService';
import { setCustomerShortlisted } from '@/store/slices/customerSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { Candidate, CustomerTabs } from '@/types/customer';
import { showToast } from '@/utils/toast/Toast';
import { SquareUser } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { FC, useState, useCallback, useEffect } from 'react';
import CandidateCard from './CandidateCard';

interface ShortListedProps {
  setSelectedTab: React.Dispatch<React.SetStateAction<CustomerTabs>>;
  selectedTab: CustomerTabs;
  candidates: Candidate[]; // Filtered candidates passed from Dashboard
}

const ShortListed: FC<ShortListedProps> = ({ candidates, selectedTab }) => {
  const { CustomerShortlisted } = useAppSelector(store => store.customer);
  const { loggedInUser } = useAppSelector(store => store.user);
  const [shortlistRemoveLoader, setShortlistRemoveLoader] =
    useState<boolean>(false);
  const [shortlistedLoader, setShortlistedLoader] = useState<boolean>(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate>();

  const dispatch = useAppDispatch();
  const router = useRouter();

  const getAllShortListed = useCallback(async () => {
    try {
      setShortlistedLoader(true);
      const shortlistedCandidates: Candidate[] =
        await getShortlistedCustomerCandidates();
      dispatch(setCustomerShortlisted(shortlistedCandidates));
    } catch (error) {
      console.log(error);
      showToast('Failed to load shortlisted candidates', 'error');
    } finally {
      setShortlistedLoader(false);
    }
  }, [dispatch]);

  useEffect(() => {
    // Only load if we don't have shortlisted data or if the component is being viewed
    if (selectedTab === 'Shortlisted') {
      getAllShortListed();
    }
  }, [selectedTab, getAllShortListed]);

  const ViewProfile = (candidate: Candidate) => {
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
      showToast('Not Removed', 'error');
      console.error(error);
    } finally {
      setShortlistRemoveLoader(false);
    }
  };

  if (shortlistedLoader) {
    return (
      <div className="w-full">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  // Use filtered candidates for display, but show total count from store
  if (candidates.length == 0) {
    return (
      <div className="w-full h-full min-h-[calc(100vh-290px)] flex justify-center items-center">
        {CustomerShortlisted.length === 0
          ? 'NO SHORTLISTED'
          : 'NO SHORTLISTED CANDIDATES MATCH YOUR FILTERS'}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Section for Shortlisted */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <h2 className="text-xl font-semibold text-purple-800">
            Shortlisted Candidates
          </h2>
        </div>
        <p className="text-purple-700 mb-4">
          Candidates who have been shortlisted for specific positions and are
          ready for the next stage of evaluation.
        </p>
      </div>

      {/* Shortlisted Candidate Cards */}
      <div className="flex flex-wrap gap-6">
        {candidates.map(candidate => (
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
      </div>
    </div>
  );
};

export default ShortListed;
