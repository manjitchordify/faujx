import { addToCustomerFavourites } from '@/services/customerService';
import { setCustomerFavourites } from '@/store/slices/customerSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { Candidate, CustomerTabs } from '@/types/customer';
import { showToast } from '@/utils/toast/Toast';
import { FC, useCallback, useEffect, useState } from 'react';
import CandidateCard from './CandidateCard';
import { getPublishedCandidates } from '@/services/customerService';
import Loader from '@/components/ui/Loader';

interface CandidatesProps {
  candidates: Candidate[];
  setSelectedTab: React.Dispatch<React.SetStateAction<CustomerTabs>>;
  selectedTab: CustomerTabs;
  selectedRole: string;
  setPublishedCandidates: (candidates: Candidate[] | null) => void;
  publishedCandidates: Candidate[] | null;
}

const Candidates: FC<CandidatesProps> = ({
  candidates,
  selectedRole,
  setPublishedCandidates,
  publishedCandidates,
}) => {
  const { CustomerFavourites } = useAppSelector(store => store.customer);
  const loggedInUser = useAppSelector(state => state.user.loggedInUser);
  const dispatch = useAppDispatch();
  const [candidateLoader, setCandidateLoader] = useState(false);

  const isLoggedIn = !!loggedInUser?.accessToken;

  const getAllPublishedCandidates = useCallback(async () => {
    try {
      setCandidateLoader(true);
      const res = await getPublishedCandidates();
      // const filterData = res.filter(
      //   item =>
      //     item?.skills.length > 0 &&
      //     item.preferredLocations &&
      //     item.capabilities.length > 0
      // );
      setPublishedCandidates(res);
    } catch (error) {
      console.log(error);
      showToast('Try Again', 'error');
    } finally {
      setCandidateLoader(false);
    }
  }, [setPublishedCandidates]);

  useEffect(() => {
    if (!publishedCandidates) {
      getAllPublishedCandidates();
    }
  }, [getAllPublishedCandidates, publishedCandidates]);

  const handleAddFav = async (candidate: Candidate) => {
    if (!isLoggedIn) {
      return showToast('Please Login to Add Favourites', 'warning');
    }
    if (CustomerFavourites.length == 8) {
      return showToast('Max Candidate Selected', 'warning');
    }
    dispatch(setCustomerFavourites([...CustomerFavourites, candidate]));

    try {
      await addToCustomerFavourites(candidate.id);
    } catch (error) {
      showToast('Not Added', 'error');
      console.error(error);
    }
  };

  if (candidateLoader) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader text="Getting Candidates ..." />
      </div>
    );
  }

  if (candidates.length == 0) {
    return (
      <div className="w-full h-full min-h-[calc(100vh-290px)] flex justify-center items-center uppercase text-[14px]">
        NO CANDIDATES
        <span className="text-[#888888] font-extrabold">
          &nbsp;&nbsp;{`${selectedRole}`}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Section for Candidates */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <h2 className="text-xl font-semibold text-blue-800">
            All Candidates
          </h2>
        </div>
        <p className="text-blue-700 mb-4">
          Browse through all available candidates in your talent pool. Use
          filters to find the perfect match for your team.
        </p>
      </div>

      {/* Candidate Cards */}
      <div className="flex flex-wrap gap-6">
        {candidates.map(candidate => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            cardType={'candidates'}
            handleAdd={handleAddFav}
            handleRemove={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default Candidates;
