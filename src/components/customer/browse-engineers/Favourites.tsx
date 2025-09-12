import { useAppDispatch, useAppSelector } from '@/store/store';
import React, { FC, useEffect, useState } from 'react';
import CandidateCard from './CandidateCard';
import { Candidate, CustomerTabs } from '@/types/customer';
import {
  setCustomerShortlisted,
  setIsFavouriteInfoSeen,
} from '@/store/slices/customerSlice';
import Button from '@/components/ui/Button';
import { showToast } from '@/utils/toast/Toast';
import ShortListModal from './modals/ShortListModal';
import FloatingAction from './FloatingAction';

interface FavouritesProps {
  setSelectedTab: React.Dispatch<React.SetStateAction<CustomerTabs>>;
  selectedTab: CustomerTabs;
}

const Favourites: FC<FavouritesProps> = ({ setSelectedTab, selectedTab }) => {
  const [showShortListModal, setShowShortListModal] = useState(true);
  const [showFloating, setShowFloating] = useState(false);

  const { CustomerShortlisted, CustomerFavourites, isFavouriteInfoSeen } =
    useAppSelector(srore => srore.customer);
  const dispatch = useAppDispatch();
  const selectedShortlisedIds = CustomerShortlisted.map(item => item.id);

  const handleAddShortListed = (candidate: Candidate) => {
    if (CustomerShortlisted.length == 3) {
      return showToast('Max Candidate Shortlisted', 'warning');
    }

    if (selectedShortlisedIds.includes(candidate.id)) {
      showToast('Already Shortlited', 'success');
    } else {
      dispatch(setCustomerShortlisted([...CustomerShortlisted, candidate]));
    }
  };

  const handleRemoveShortlisted = (candidate: Candidate) => {
    const filterShortListed = CustomerShortlisted.filter(
      item => item.id !== candidate.id
    );
    dispatch(setCustomerShortlisted(filterShortListed));
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
      <div className="w-full h-full flex justify-center items-center">
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
          handleRemove={handleRemoveShortlisted}
          buttons={
            <div className="flex flex-row justify-between items-center gap-6">
              <Button
                text={
                  selectedShortlisedIds.includes(candidate.id)
                    ? 'Shortlisted'
                    : 'Shortlist'
                }
                onClick={() => handleAddShortListed(candidate)}
                className={`w-full rounded-2xl py-2 cursor-pointer ${selectedShortlisedIds.includes(candidate.id) ? 'bg-[#54A044]' : 'bg-[#D5D5D5]'}`}
              />
              <Button
                onClick={() => handleRemoveShortlisted(candidate)}
                text="Remove"
                className="w-full bg-[#E38888] rounded-2xl py-2 cursor-pointer"
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
