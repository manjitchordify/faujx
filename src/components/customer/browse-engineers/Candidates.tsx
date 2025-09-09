import { setCustomerFavourites } from '@/store/slices/customerSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { Candidate } from '@/types/customer';
import { FC } from 'react';
import CandidateCard from './CandidateCard';

interface CandidatesProps {
  candidates: Candidate[];
}
const Candidates: FC<CandidatesProps> = ({ candidates }) => {
  const { CustomerFavourites } = useAppSelector(store => store.customer);
  const dispatch = useAppDispatch();
  const handleAddFav = (candidate: Candidate) => {
    dispatch(setCustomerFavourites([...CustomerFavourites, candidate]));
  };

  const handleRemoveFav = (candidate: Candidate) => {
    const filterFav = CustomerFavourites.filter(
      item => item.id !== candidate.id
    );
    dispatch(setCustomerFavourites(filterFav));
  };

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
