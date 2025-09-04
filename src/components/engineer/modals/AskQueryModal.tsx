'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import ModalWrapper from '@/components/ui/ModalWrapper';

interface AskQueryModalProps {
  onSubmit: (queryText: string) => void;
  onClose?: () => void;
  placeholder?: string;
  initialValue?: string;
}

const AskQueryModal: React.FC<AskQueryModalProps> = ({
  onSubmit,
  onClose,
  placeholder = 'Enter your query here...',
  initialValue = '',
}) => {
  const [queryText, setQueryText] = useState(initialValue);

  const handleSubmit = () => {
    if (queryText.trim()) {
      onSubmit(queryText.trim());
      if (onClose) onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <ModalWrapper onClose={handleClose}>
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 w-4/5 max-w-2xl mx-auto shadow-2xl relative"
      >
        {/* Close button - optional if onClose is provided */}
        {onClose && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}

        {/* Header with icon and title */}
        <div className="flex items-center justify-center mb-6 sm:mb-8">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Purple question mark circle */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl sm:text-3xl font-bold">
                ?
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Ask your Query
            </h2>
          </div>
        </div>

        {/* Textarea */}
        <div className="mb-6 sm:mb-8">
          <textarea
            value={queryText}
            onChange={e => setQueryText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="w-full h-40 sm:h-48 lg:h-56 p-4 sm:p-6 text-base sm:text-lg text-gray-700 placeholder-gray-400 border border-gray-200 rounded-2xl resize-none outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            autoFocus
          />
        </div>

        {/* Submit button */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!queryText.trim()}
            className={`
              px-8 sm:px-12 lg:px-16 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-2xl transition-all duration-200 min-w-[120px] sm:min-w-[150px]
              ${
                queryText.trim()
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Submit
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default AskQueryModal;
