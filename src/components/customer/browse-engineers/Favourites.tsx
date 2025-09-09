import { useAppDispatch, useAppSelector } from '@/store/store';
import React, { useState } from 'react';
import CandidateCard from './CandidateCard';
import { Candidate } from '@/types/customer';
import { setCustomerShortlisted } from '@/store/slices/customerSlice';
import Button from '@/components/ui/Button';
import { showToast } from '@/utils/toast/Toast';
import ShortListModal from './modals/ShortListModal';

function Favourites() {
  const [showShortListModal, setShowShortListModal] = useState(true);

  const { CustomerShortlisted, CustomerFavourites } = useAppSelector(
    srore => srore.customer
  );
  const dispatch = useAppDispatch();
  const selectedShortlisedIds = CustomerShortlisted.map(item => item.id);

  const handleAddShortListed = (candidate: Candidate) => {
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

      {showShortListModal && (
        <ShortListModal onClose={() => setShowShortListModal(false)} />
      )}
    </>
  );
}

export default Favourites;
