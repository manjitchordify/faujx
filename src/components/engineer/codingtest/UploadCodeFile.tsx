import React, { useState, useRef } from 'react';
import { ApiError } from '@/types/codingTestTypes';

interface AddGithubLinkProps {
  onSubmit?: (files: File[]) => Promise<void>;
  isTimeUp?: boolean;
  disabled?: boolean;
}

const UploadCodeFile: React.FC<AddGithubLinkProps> = ({
  onSubmit,
  isTimeUp = false,
  disabled = false,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine if interactions should be disabled
  const isInteractionDisabled = isTimeUp || disabled;

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select files to upload');
      return;
    }

    if (isInteractionDisabled) {
      return;
    }

    setError('');

    try {
      // Call onSubmit callback if provided
      if (onSubmit) {
        await onSubmit(selectedFiles);
      }
    } catch (err: unknown) {
      console.error('Error submitting files:', err);

      // Handle API errors
      if (err && typeof err === 'object' && 'message' in err) {
        const apiError = err as ApiError;
        setError(
          apiError.message || 'Failed to upload files. Please try again.'
        );
      } else if (err instanceof Error) {
        setError(err.message || 'Failed to upload files. Please try again.');
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError('Failed to upload files. Please try again.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isInteractionDisabled) return;
    const files = Array.from(e.target.files || []);
    // Add new files to existing ones instead of replacing
    setSelectedFiles(prev => [...prev, ...files]);
    if (error) {
      setError(''); // Clear error when user selects files
    }
    // Reset input value to allow selecting the same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (isInteractionDisabled) return;
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (isInteractionDisabled) return;
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (isInteractionDisabled) return;
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    // Add new files to existing ones instead of replacing
    setSelectedFiles(prev => [...prev, ...files]);
    if (error) {
      setError('');
    }
  };

  const removeFile = (indexToRemove: number) => {
    if (isInteractionDisabled) return;
    setSelectedFiles(prev =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const openFileDialog = () => {
    if (!isInteractionDisabled) {
      fileInputRef.current?.click();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getUploadZoneText = () => {
    if (isTimeUp) {
      return {
        title: "Upload disabled - Time's up!",
        subtitle: 'You can only submit files that are already uploaded',
      };
    }
    if (disabled) {
      return {
        title: 'Processing submission...',
        subtitle: 'Please wait while we handle your files',
      };
    }
    return {
      title: 'Click to upload or drag multiple files here',
      subtitle: '',
    };
  };

  const uploadZoneText = getUploadZoneText();

  return (
    <div
      className={`flex flex-col items-center justify-center p-2 ${disabled ? 'opacity-70' : ''}`}
    >
      <div className="w-full max-w-6xl bg-white border border-gray-200 rounded-2xl shadow-lg p-2 sm:p-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl font-light text-gray-900 mb-2">
            Upload your answer files
          </h1>
          <p className="text-gray-600 text-sm">
            {disabled
              ? 'Processing your submission...'
              : 'Select or drag and drop your solution files'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm text-center">{error}</p>
            </div>
          </div>
        )}

        {/* File Upload Section */}
        <div className="mb-8">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            disabled={isInteractionDisabled}
            className="hidden"
          />

          {/* Drop zone */}
          <div
            onClick={!isInteractionDisabled ? openFileDialog : undefined}
            onDragOver={!isInteractionDisabled ? handleDragOver : undefined}
            onDragLeave={!isInteractionDisabled ? handleDragLeave : undefined}
            onDrop={!isInteractionDisabled ? handleDrop : undefined}
            className={`
              relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 min-h-[160px] flex flex-col items-center justify-center
              ${
                isInteractionDisabled
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                  : isDragOver
                    ? 'border-[#1F514C] bg-emerald-50 cursor-pointer'
                    : 'border-gray-300 hover:border-[#1F514C] hover:bg-gray-50 cursor-pointer'
              }
            `}
          >
            <div className="flex flex-col items-center gap-3">
              {/* Upload icon */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isInteractionDisabled ? 'bg-gray-200' : 'bg-gray-100'
                }`}
              >
                {isTimeUp ? (
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                ) : disabled ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                )}
              </div>

              {/* Upload text */}
              <div>
                <p
                  className={`text-lg font-medium mb-1 ${
                    isInteractionDisabled ? 'text-gray-500' : 'text-gray-900'
                  }`}
                >
                  {uploadZoneText.title}
                </p>
                {uploadZoneText.subtitle && (
                  <p className="text-sm text-gray-400">
                    {uploadZoneText.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Files Display */}
        {selectedFiles.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Selected Files ({selectedFiles.length})
              </h3>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${file.size}-${index}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* File icon */}
                    <div className="w-8 h-8 rounded bg-[#1F514C] flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>

                    {/* File details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  {/* Remove button */}
                  {!isInteractionDisabled && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="ml-3 p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                      title="Remove file"
                    >
                      <svg
                        className="w-5 h-5"
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
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={disabled || selectedFiles.length === 0}
            className={`
              px-8 py-3 rounded-full font-medium text-white transition-all duration-200
              ${
                !disabled && selectedFiles.length > 0
                  ? 'bg-[#1F514C] hover:bg-emerald-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-300 cursor-not-allowed'
              }
            `}
          >
            {disabled ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              `Submit ${selectedFiles.length > 0 ? `(${selectedFiles.length} files)` : ''}`
            )}
          </button>
        </div>

        {/* Helper text */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            {isTimeUp
              ? "Time's up! You can only submit files that have already been uploaded."
              : disabled
                ? 'Your files are being processed. Please wait...'
                : 'You can upload multiple files at once. Each file should contain part of your solution code.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadCodeFile;
