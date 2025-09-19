import { useAppDispatch, useAppSelector } from '@/store/store';
import React, { FC, useEffect, useState } from 'react';
import CandidateCard from './CandidateCard';
import { Candidate, CustomerTabs } from '@/types/customer';
import {
  setCustomerFavourites,
  setCustomerShortlisted,
  setIsFavouriteInfoSeen,
} from '@/store/slices/customerSlice';
import Button from '@/components/ui/Button';
import { showToast } from '@/utils/toast/Toast';
import ShortListModal from './modals/ShortListModal';
import FloatingAction from './FloatingAction';
import {
  addToCustomerShortlisted,
  deleteCustomerFavourites,
} from '@/services/customerService';
import { CircleMinus } from 'lucide-react';

interface FavouritesProps {
  setSelectedTab: React.Dispatch<React.SetStateAction<CustomerTabs>>;
  selectedTab: CustomerTabs;
}

const Favourites: FC<FavouritesProps> = ({ setSelectedTab, selectedTab }) => {
  const [showShortListModal, setShowShortListModal] = useState(true);
  const [showFloating, setShowFloating] = useState(false);
  const [shortlistAddLoader, setShortlistAddLoader] = useState<boolean>(false);
  const [shortlistRemoveLoader, setShortlistRemoveLoader] =
    useState<boolean>(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate>();

  const { CustomerShortlisted, CustomerFavourites, isFavouriteInfoSeen } =
    useAppSelector(srore => srore.customer);
  const dispatch = useAppDispatch();
  const selectedShortlisedIds = CustomerShortlisted.map(item => item.id);

  const handleAddShortListed = async (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    if (CustomerShortlisted.length == 3) {
      return showToast('Max Candidate Shortlisted', 'warning');
    }

    if (selectedShortlisedIds.includes(candidate.id)) {
      return showToast('Already Shortlisted', 'success');
    }

    try {
      setShortlistAddLoader(true);
      await addToCustomerShortlisted(candidate.id);
      dispatch(setCustomerShortlisted([...CustomerShortlisted, candidate]));
    } catch (error) {
      showToast('Not Added', 'error');
      console.error(error);
    } finally {
      setShortlistAddLoader(false);
    }
  };

  const handleRemoveFav = async (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    try {
      setShortlistRemoveLoader(true);
      await deleteCustomerFavourites(candidate.id);
      const filterShortListed = CustomerFavourites.filter(
        item => item.id !== candidate.id
      );
      dispatch(setCustomerFavourites(filterShortListed));
    } catch (error) {
      showToast('Not Added', 'error');
      console.error(error);
    } finally {
      setShortlistRemoveLoader(false);
    }
  };

  const handleView = () => {
    setSelectedTab('Shortlisted');
    setShowFloating(false);
  };

  useEffect(() => {
    if (CustomerShortlisted.length > 0) {
      setShowFloating(true);
    } else {
      setShowFloating(false);
    }
  }, [CustomerShortlisted]);

  if (CustomerFavourites.length == 0) {
    return (
      <div className="w-full h-full min-h-[calc(100vh-290px)] flex justify-center items-center">
        NO FAVOURITES
      </div>
    );
  }

  return (
    <>
      {CustomerFavourites.map(candidate => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          cardType={'favourites'}
          handleAdd={handleAddShortListed}
          handleRemove={handleRemoveFav}
          buttons={
            <div className="flex flex-row justify-between items-center gap-6">
              <Button
                text={
                  selectedShortlisedIds.includes(candidate.id)
                    ? 'Shortlisted'
                    : 'Shortlist'
                }
                onClick={() => handleAddShortListed(candidate)}
                className={`w-full rounded-2xl py-2 cursor-pointer border border-[#D5D5D5] 
                      ${
                        selectedShortlisedIds.includes(candidate.id)
                          ? 'bg-[#54A044] text-white'
                          : 'bg-transparent  !text-gray-800'
                      }`}
                isLoading={
                  selectedCandidate?.id === candidate.id
                    ? shortlistAddLoader
                    : false
                }
              />
              <Button
                onClick={() => handleRemoveFav(candidate)}
                text="Remove"
                className="w-full bg-[#E38888] rounded-2xl py-2 cursor-pointer"
                isLoading={
                  selectedCandidate?.id == candidate.id
                    ? shortlistRemoveLoader
                    : false
                }
                icon={
                  <CircleMinus
                    className="w-6 h-6"
                    fill={'#FFFFFF'}
                    color="#E38888"
                  />
                }
              />
            </div>
          }
        />
      ))}

      {!isFavouriteInfoSeen && showShortListModal && (
        <ShortListModal
          onClose={() => {
            setShowShortListModal(false);
            dispatch(setIsFavouriteInfoSeen(true));
          }}
        />
      )}

      {showFloating && selectedTab == 'Favourites' && (
        <FloatingAction
          text1={`You have shortlisted : ${CustomerShortlisted.length}/3`}
          text2="View"
          onView={() => handleView()}
        />
      )}
    </>
  );
};

export default Favourites;
