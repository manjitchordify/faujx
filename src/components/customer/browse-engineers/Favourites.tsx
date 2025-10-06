import { useAppDispatch, useAppSelector } from '@/store/store';
import React, { FC, useEffect, useState, useCallback } from 'react';
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
  getFavouriteCustomerCandidates,
} from '@/services/customerService';
import { CircleMinus } from 'lucide-react';

interface FavouritesProps {
  setSelectedTab: React.Dispatch<React.SetStateAction<CustomerTabs>>;
  selectedTab: CustomerTabs;
  candidates: Candidate[]; // Filtered candidates passed from Dashboard
}

const Favourites: FC<FavouritesProps> = ({
  setSelectedTab,
  selectedTab,
  candidates,
}) => {
  const [showShortListModal, setShowShortListModal] = useState(true);
  const [showFloating, setShowFloating] = useState(false);
  const [shortlistAddLoader, setShortlistAddLoader] = useState<boolean>(false);
  const [shortlistRemoveLoader, setShortlistRemoveLoader] =
    useState<boolean>(false);
  const [favouritesLoader, setFavouritesLoader] = useState<boolean>(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate>();

  const { CustomerShortlisted, CustomerFavourites, isFavouriteInfoSeen } =
    useAppSelector(store => store.customer);
  const dispatch = useAppDispatch();
  const selectedShortlisedIds = CustomerShortlisted.map(item => item.id);

  const getAllFavourites = useCallback(async () => {
    try {
      setFavouritesLoader(true);
      const favouriteCandidates: Candidate[] =
        await getFavouriteCustomerCandidates();
      dispatch(setCustomerFavourites(favouriteCandidates));
    } catch (error) {
      console.log(error);
      showToast('Failed to load favourites', 'error');
    } finally {
      setFavouritesLoader(false);
    }
  }, [dispatch]);

  useEffect(() => {
    // Only load if we don't have favourites data or if the component is being viewed
    if (selectedTab === 'Favourites') {
      getAllFavourites();
    }
  }, [selectedTab, getAllFavourites]);

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
      showToast('Not Removed', 'error');
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

  if (favouritesLoader) {
    return (
      <div className="w-full">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500"></div>
        </div>
      </div>
    );
  }

  // Use filtered candidates for display, but show total count from store
  if (candidates.length == 0) {
    return (
      <div className="w-full h-full min-h-[calc(100vh-290px)] flex justify-center items-center">
        {CustomerFavourites.length === 0
          ? 'NO FAVOURITES'
          : 'NO FAVOURITES MATCH YOUR FILTERS'}
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        {/* Updated Header Section for Favourites */}
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <h2 className="text-xl font-semibold text-gray-800">
              Favourite Candidates
            </h2>
          </div>
          <p className="text-gray-500 mb-4">
            Candidates you&apos;ve marked as favourites for quick access and
            future opportunities.
          </p>
        </div>

        <div className="flex flex-wrap gap-6">
          {candidates.map(candidate => (
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
                    className="w-full bg-[#e72323] rounded-2xl py-2 cursor-pointer"
                    isLoading={
                      selectedCandidate?.id == candidate.id
                        ? shortlistRemoveLoader
                        : false
                    }
                    icon={
                      <CircleMinus
                        className="w-6 h-6"
                        fill={'#FFFFFF'}
                        color="#e72323"
                      />
                    }
                  />
                </div>
              }
            />
          ))}
        </div>
      </div>

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
