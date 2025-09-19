import { addToCustomerFavourites } from '@/services/customerService';
import { setCustomerFavourites } from '@/store/slices/customerSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { Candidate, CustomerTabs } from '@/types/customer';
import { showToast } from '@/utils/toast/Toast';
import { FC } from 'react';
import CandidateCard from './CandidateCard';

interface CandidatesProps {
  candidates: Candidate[];
  setSelectedTab: React.Dispatch<React.SetStateAction<CustomerTabs>>;
  selectedTab: CustomerTabs;
  selectedRole: string;
}

const Candidates: FC<CandidatesProps> = ({ candidates, selectedRole }) => {
  const { CustomerFavourites } = useAppSelector(store => store.customer);
  const loggedInUser = useAppSelector(state => state.user.loggedInUser);
  const dispatch = useAppDispatch();
  // const [favAddLoader, setAddFavLoader] = useState<boolean>(false);
  const isLoggedIn = !!loggedInUser?.accessToken;

  const handleAddFav = async (candidate: Candidate) => {
    if (!isLoggedIn) {
      return showToast('Please Login to Add Favourites', 'warning');
    }
    if (CustomerFavourites.length == 8) {
      return showToast('Max Candidate Selected', 'warning');
    }
    dispatch(setCustomerFavourites([...CustomerFavourites, candidate]));

    try {
      // setAddFavLoader(true);
      await addToCustomerFavourites(candidate.id);
    } catch (error) {
      showToast('Not Added', 'error');
      console.error(error);
    } finally {
      // setAddFavLoader(false);
    }
  };

  // const handleRemoveFav = (candidate: Candidate) => {
  //   const filterFav = CustomerFavourites.filter(
  //     item => item.id !== candidate.id
  //   );
  //   dispatch(setCustomerFavourites(filterFav));
  // };

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
    <>
      {candidates.map(candidate => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          cardType={'candidates'}
          handleAdd={handleAddFav}
          handleRemove={() => {}}
        />
      ))}
    </>
  );
};

export default Candidates;
