import Image from 'next/image';
import React from 'react';

interface ProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string | null;
  userName?: string;
}

const ProfilePictureModal: React.FC<ProfilePictureModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  userName = 'User',
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Profile Picture</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-center">
            {imageUrl ? (
              <div className="relative">
                <Image
                  src={imageUrl}
                  fill={true}
                  alt={`${userName}'s profile`}
                  className="w-80 h-80 object-cover rounded-2xl shadow-lg"
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                {/* Fallback avatar if image fails to load */}
                <div className=" w-80 h-80 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg flex items-center justify-center">
                  <span className="text-white text-6xl font-bold">
                    {getInitials(userName)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-80 h-80 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <p className="text-white text-lg font-medium mb-2">
                    No profile picture
                  </p>
                  <p className="text-white text-opacity-80 text-sm">
                    Upload a picture to see it here
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="text-center mt-6">
            <h3 className="text-xl font-semibold text-gray-900">{userName}</h3>
            <p className="text-gray-500 mt-1">Profile Picture</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Close
            </button>
            {imageUrl && (
              <a
                href={imageUrl}
                download={`${userName.toLowerCase().replace(' ', '_')}_profile_picture.jpg`}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Download Image
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureModal;
