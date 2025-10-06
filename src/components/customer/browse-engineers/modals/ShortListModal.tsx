import ModalWrapper from '@/components/ui/ModalWrapper';
import { Info, X } from 'lucide-react';
import React, { FC } from 'react';

interface ShortListModalProps {
  onClose: () => void;
}

const ShortListModal: FC<ShortListModalProps> = ({ onClose }) => {
  return (
    <ModalWrapper onClose={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        className="relative flex justify-center items-center flex-col gap-2 sm:gap-3 bg-white p-6 sm:p-8 md:p-10 rounded-2xl mx-4 w-full max-w-xs sm:max-w-sm md:max-w-md"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200 group"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-gray-600" />
        </button>

        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <Info className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
        </div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-center">
          Candidate Selection
        </h2>

        <div className="text-gray-600 leading-relaxed text-sm sm:text-base text-center">
          <p className="mb-1">
            Now you can shortlist a maximum of
            <span className="font-bold text-gray-900"> 3 at a time</span> for
            further review
          </p>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ShortListModal;
