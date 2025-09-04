'use client';
import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { User } from 'lucide-react';
import Image from 'next/image';
import { uploadProfilePicApi } from '@/services/profileSetupService';

interface ProfilePicProps {
  onFileSelect?: (file: File) => void;
  onBack?: () => void;
  onProceed?: () => void; // Called after successful upload
  maxSizeInMB?: number;
  acceptedFormats?: string[];
  className?: string;
}

const ProfilePic: React.FC<ProfilePicProps> = ({
  onFileSelect,
  onProceed,
  maxSizeInMB = 5,
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  const validateFile = (file: File): boolean => {
    if (!acceptedFormats.includes(file.type)) {
      alert('Please select a valid image file (JPEG, JPG, PNG, or WebP)');
      return false;
    }
    if (file.size > maxSizeInBytes) {
      alert(`File size must be less than ${maxSizeInMB}MB`);
      return false;
    }
    return true;
  };

  const handleFile = (file: File): void => {
    if (validateFile(file)) {
      setSelectedFile(file);
      setUploadError(null); // Clear any previous errors
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setPreviewUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      onFileSelect?.(file);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleBrowseClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleProceed = async (): Promise<void> => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Upload the profile picture
      const response = await uploadProfilePicApi(selectedFile);

      console.log('Profile picture uploaded successfully:', response);

      // Navigate to next screen after successful upload
      if (onProceed) {
        onProceed();
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = (): void => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    return (bytes / (1024 * 1024)).toFixed(2);
  };

  const getAcceptString = (): string => {
    return acceptedFormats.map(format => format.split('/')[1]).join(',');
  };

  return (
    <div className={`max-w-6xl mx-auto p-6 ${className}`}>
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-md">
          <div
            className={`
              border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 cursor-pointer
              ${
                isDragOver
                  ? 'border-green-400 bg-green-50'
                  : selectedFile
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
              }
            `}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={!isUploading ? handleBrowseClick : undefined}
            role="button"
            tabIndex={0}
            aria-label="Upload area - drag and drop or click to browse files"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={`.${getAcceptString()}`}
              onChange={handleFileSelect}
              className="hidden"
              aria-hidden="true"
              disabled={isUploading}
            />

            <div className="flex flex-col items-center space-y-4">
              {previewUrl ? (
                <div className="relative">
                  <Image
                    src={previewUrl}
                    alt="Selected file preview"
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                  />
                  <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-500" />
                </div>
              )}

              <div className="text-center">
                {selectedFile ? (
                  <>
                    <p className="text-sm font-medium text-green-700 mb-1">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(selectedFile.size)} MB
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 font-medium mb-2">
                      {isUploading
                        ? 'Uploading...'
                        : 'Drag & drop area or click to browse files'}
                    </p>
                    <p className="text-xs text-gray-500 mb-1">
                      Accept formats: {getAcceptString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Max size: {maxSizeInMB}MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {uploadError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{uploadError}</p>
            </div>
          )}

          <div className="mt-6 flex space-x-3">
            <button
              onClick={handleProceed}
              disabled={!selectedFile || isUploading}
              className={`
                flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center justify-center
                ${
                  selectedFile && !isUploading
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
              type="button"
            >
              {isUploading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                'Proceed'
              )}
            </button>

            {selectedFile && !isUploading && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                type="button"
              >
                Reset
              </button>
            )}
          </div>

          {isDragOver && (
            <div className="mt-4 text-center">
              <p className="text-green-600 font-medium text-sm">
                Drop your file here!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePic;
