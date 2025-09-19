// CandidateCard.tsx
import CustomSpinner from '@/components/ui/CustomSpinner';
import { useAppSelector } from '@/store/store';
import { Candidate } from '@/types/customer';
import { Heart, Star, Eye, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { FC, ReactNode, useState } from 'react';
import CandidateDetailsModal from './CandidateDetailsModal';

interface CandidateCardProps {
  candidate: Candidate;
  cardType?: 'favourites' | 'shortlisted' | 'candidates' | 'myInterview';
  handleAdd?: (candidate: Candidate) => void;
  handleRemove?: (candidate: Candidate) => void;
  buttons?: ReactNode;
}

const CandidateCard: FC<CandidateCardProps> = ({
  candidate,
  cardType,
  handleAdd = () => {},
  handleRemove = () => {},
  buttons,
}) => {
  const { CustomerFavourites } = useAppSelector(store => store.customer);
  const selectedFavouritedIds = CustomerFavourites.map(item => item.id);
  const isSelected = selectedFavouritedIds.includes(candidate.id);
  const [addLoader, setAddLoader] = useState<boolean>(false);
  const [removeLoader, setRemoveLoader] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleAddCandidate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setAddLoader(true);
    await handleAdd(candidate);
    setAddLoader(false);
  };

  const handleRemoveCandidate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setRemoveLoader(true);
    await handleRemove(candidate);
    setRemoveLoader(false);
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
    console.log('candidate', candidate);
  };

  const handleSeeMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        key={candidate.id}
        className="flex flex-col gap-4 bg-white rounded-xl shadow-lg border border-gray-100 p-4 w-full max-w-md sm:max-w-lg md:max-w-xl lg:w-[calc(50%-16px)] mx-auto cursor-pointer hover:shadow-xl transition-shadow duration-200"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Left Side - Profile Image Only */}
          <div className="w-full sm:w-1/2 flex items-center justify-center">
            <div className="w-24 h-28 sm:w-full sm:h-32 md:h-36 lg:h-full rounded-lg bg-gradient-to-br from-orange-200 via-yellow-200 to-pink-200 overflow-hidden relative">
              {/* Simulating the blurred profile image */}
              {candidate.user.profilePic ? (
                <Image
                  src={candidate.user.profilePic}
                  alt={`${candidate.roleTitle} profile`}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover rounded-lg blur-sm"
                  onError={e => {
                    // Fallback to gradient background if image fails to load
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full rounded-lg bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <Image
                    src={'/images/blurPic.png'}
                    alt={`${candidate.roleTitle} profile`}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover rounded-lg blur-sm"
                    onError={e => {
                      // Fallback to gradient background if image fails to load
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Side - All Content */}
          <div className="w-full sm:w-1/2">
            {/* Header with Role and Star */}
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-base sm:text-lg font-semibold text-green-600">
                {candidate.roleTitle}
              </h3>
              <div className="bg-gray-500 rounded-full p-1.5">
                <Star className="w-3 h-3 text-white fill-current" />
              </div>
            </div>

            {/* Skills Section */}
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 bg-green-100 text-green-700 text-xs sm:text-sm rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {candidate.skills.length > 3 && (
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs sm:text-sm rounded-full font-medium">
                    +{candidate.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Capabilities Section */}
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Capability
              </h4>
              <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                {candidate.capabilities
                  ?.slice(0, 2)
                  .map((capability, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5 flex-shrink-0">
                        •
                      </span>
                      <span className="leading-relaxed line-clamp-2 overflow-hidden text-ellipsis">
                        {capability.explanation}
                      </span>
                    </li>
                  ))}
              </ul>
              {candidate.capabilities && candidate.capabilities.length > 0 && (
                <button
                  onClick={handleSeeMore}
                  className="mt-2 text-indigo-600 hover:text-indigo-700 text-xs font-medium flex items-center gap-1"
                >
                  See more details
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Salary and Location */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-green-600">$</span>
                <span className="text-sm font-semibold text-gray-900">
                  {candidate.expectedSalary.toString().replace('$', '')}
                </span>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                {candidate.location}
              </span>
            </div>

            {/* Action Button */}
            {cardType == 'candidates' && (
              <button
                className="w-full py-2.5 px-4 bg-[#6C63FF] text-white rounded-lg text-sm font-semibold hover:bg-[#564dff] transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
                onClick={e => {
                  e.stopPropagation();
                  if (isSelected) {
                    handleRemoveCandidate(e);
                  } else {
                    handleAddCandidate(e);
                  }
                }}
              >
                {addLoader || removeLoader ? (
                  <CustomSpinner loaderSize={20} />
                ) : (
                  <>
                    {isSelected ? 'Favourites' : 'Add to favourites'}
                    <Heart
                      className="w-4 h-4"
                      fill={`${isSelected ? 'white' : '#6C63FF'}`}
                    />
                  </>
                )}
              </button>
            )}

            {cardType == 'myInterview' && (
              <button
                className="w-full py-2.5 px-4 bg-[#6C63FF] text-white rounded-lg text-sm font-semibold hover:bg-[#564dff] transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
                onClick={e => {
                  e.stopPropagation();
                  handleCardClick();
                }}
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
            )}
          </div>
        </div>

        {/* BUTTONS ACCORDING TO THE SELECTED TAB */}
        {buttons}
      </div>

      {/* Candidate Details Modal */}
      <CandidateDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        candidate={candidate}
      />
    </>
  );
};

export default CandidateCard;
