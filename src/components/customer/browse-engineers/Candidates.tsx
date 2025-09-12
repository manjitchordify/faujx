import { setCustomerFavourites } from '@/store/slices/customerSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { Candidate, CustomerTabs } from '@/types/customer';
import { FC } from 'react';
import CandidateCard from './CandidateCard';
import { showToast } from '@/utils/toast/Toast';

interface CandidatesProps {
  candidates: Candidate[];
  setSelectedTab: React.Dispatch<React.SetStateAction<CustomerTabs>>;
  selectedTab: CustomerTabs;
}

const Candidates: FC<CandidatesProps> = ({ candidates }) => {
  const { CustomerFavourites } = useAppSelector(store => store.customer);
  const dispatch = useAppDispatch();
  const handleAddFav = (candidate: Candidate) => {
    if (CustomerFavourites.length == 8) {
      return showToast('Max Candidate Selected', 'warning');
    }
    dispatch(setCustomerFavourites([...CustomerFavourites, candidate]));
  };

  const handleRemoveFav = (candidate: Candidate) => {
    const filterFav = CustomerFavourites.filter(
      item => item.id !== candidate.id
    );
    dispatch(setCustomerFavourites(filterFav));
  };

  if (candidates.length == 0) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        NO CANDIDATES
      </div>
    );
  }

  return (
    <>
      {candidates.map(candidate => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          cardType={'candidates'}
          handleAdd={handleAddFav}
          handleRemove={handleRemoveFav}
        />
      ))}
    </>
  );
};

export default Candidates;
