'use client';
import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { uploadResume } from '@/services/expert/profileService';
import { showToast } from '@/utils/toast/Toast';

interface UploadResumeProps {
  onBack?: () => void;
  onComplete?: (file: File) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['.pdf', '.doc', '.docx'];
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const UploadResume: React.FC<UploadResumeProps> = ({ onBack, onComplete }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [showProcessing, setShowProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 5MB limit';
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return 'Please upload a PDF, DOC, or DOCX file';
    }

    return null;
  }, []); // No dependencies needed as MAX_FILE_SIZE and ALLOWED_MIME_TYPES are constants

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const error = validateFile(file);
      if (error) {
        showToast(error, 'error');
        return;
      }

      setUploadedFile(file);
    },
    [validateFile]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      const file = files[0];

      if (!file) return;

      const error = validateFile(file);
      if (error) {
        showToast(error, 'error');
        return;
      }

      setUploadedFile(file);
    },
    [validateFile]
  );

  const handleRemoveFile = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedFile(null);
    setShowProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleUpload = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();

      if (!uploadedFile) return;

      setShowProcessing(true);

      try {
        // Call the API to upload resume
        const response = await uploadResume(uploadedFile);

        console.log('Resume uploaded successfully:', response);

        // Show success toast
        showToast('Resume uploaded successfully!', 'success');

        // Call onComplete callback if provided
        onComplete?.(uploadedFile);

        // Navigate to next page after successful upload
        setTimeout(() => {
          router.push('/expert/interview/select-slot');
        }, 1000);
      } catch (error: unknown) {
        console.error('Resume upload error:', error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to upload resume. Please try again.';
        showToast(errorMessage, 'error');
        setShowProcessing(false);
      }
    },
    [uploadedFile, onComplete, router]
  );

  if (showProcessing) {
    return (
      <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="mb-6">
            <div className="w-16 h-16 border-4 border-[#1F514C] border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Uploading Resume
          </h2>
          <p className="text-gray-600">
            Please wait while we upload your resume...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-medium text-gray-900 mb-16 text-center">
          Upload your Resume
        </h1>

        <div className="bg-white rounded-3xl p-16 shadow-sm">
          <div
            className={`text-center transition-all duration-200 cursor-pointer ${
              isDragOver ? 'opacity-80' : ''
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            {!uploadedFile ? (
              <>
                <div className="mb-12 flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="81"
                    height="86"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#858585"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3v12" />
                    <path d="m17 8-5-5-5 5" />
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  </svg>
                </div>

                <p className="text-gray-700 text-base mb-6 font-medium">
                  Drag & drop area or click to browse files
                </p>

                <p className="text-gray-500 text-sm mb-1">
                  Accept formats: .pdf, .doc, .docx
                </p>
                <p className="text-gray-500 text-sm mb-12">Max size: 5.00MB</p>

                <button
                  className="bg-[#1F514C] hover:bg-teal-700 text-white px-8 py-3 rounded-xl transition-colors text-sm font-medium"
                  onClick={e => {
                    e.stopPropagation();
                    handleClick();
                  }}
                >
                  Upload
                </button>
              </>
            ) : (
              <div className="space-y-6">
                <div className="w-16 h-16 border-2 border-green-400 rounded-lg flex items-center justify-center mx-auto">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-green-500"
                  >
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                </div>

                <p className="text-gray-700 text-base font-medium">
                  File Ready for Upload
                </p>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-800 font-medium">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {formatFileSize(uploadedFile.size)}
                  </p>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={handleUpload}
                    className="bg-[#1F514C] hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    Upload Resume
                  </button>
                  <button
                    onClick={handleRemoveFile}
                    className="text-gray-600 hover:text-gray-800 text-sm px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        {onBack && (
          <div className="flex justify-center mt-8">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 text-sm px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Previous Step
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadResume;
