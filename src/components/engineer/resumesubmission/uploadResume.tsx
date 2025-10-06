'use client';

import React, { useState, useRef, useEffect } from 'react';
import SuccessComponent from '../shared/SuccessComponent';
import PDFProcessing from './PDFProcessing';
import { getAuthToken, getUserFromCookie } from '@/utils/apiHeader';
import { ResumeData } from '@/types/resume.types';
import { useDispatch } from 'react-redux';
import { setUserResumeData } from '@/store/slices/persistSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAppSelector } from '@/store/store';

interface UploadResumeProps {
  candidateId?: string;
}

const UploadResume: React.FC<UploadResumeProps> = ({ candidateId }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showProcessing, setShowProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  // Get profile stage data from Redux store - read from user slice instead of persist slice
  const loggedInUser = useAppSelector(state => state.user.loggedInUser);
  const lastStage = loggedInUser?.profileStages?.lastStage;
  const lastStatus = loggedInUser?.profileStages?.lastStatus;
  const userResumeData = useAppSelector(state => state.persist.resumeData);

  useEffect(() => {
    const userData = getUserFromCookie();
    const token = getAuthToken();
    if (userData && token) {
      setIsAuthenticated(true);
      if (lastStage === 'resumeUpload' && lastStatus === 'passed') {
        setShowSuccess(true);
      }
    } else {
      setIsAuthenticated(false);
    }

    setIsLoading(false);
  }, [
    candidateId,
    lastStage,
    lastStatus,
    userResumeData,
    router,
    loggedInUser,
  ]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type)) {
      // alert('Please upload a PDF, DOC, or DOCX file.');
      toast.error('Please upload a PDF, DOC, or DOCX file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB.');
      // alert('File size must be less than 5MB.');
      return;
    }
    if (!isAuthenticated) {
      toast.error('Please log in to upload your resume.');
      // alert('Please log in to upload your resume.');
      return;
    }
    setUploadedFile(file);
    setShowProcessing(true);
  };

  const handleClick = () => {
    if (!uploadedFile) {
      fileInputRef.current?.click();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemoveFile = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setUploadedFile(null);
    setShowProcessing(false);
    setShowSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReupload = () => {
    setUploadedFile(null);
    setShowProcessing(false);
    setShowSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleProcessingComplete = (_resumeData: ResumeData) => {
    console.log('Resume processing completed:', _resumeData.id);
    setShowProcessing(false);
    setShowSuccess(true);
    dispatch(setUserResumeData(_resumeData));
  };

  const handleSuccessAction = () => {
    // Navigate to MCQ test
    router.push('/engineer/mcq');
  };

  const handleRetryFromSuccess = () => {
    // Allow user to retry from success component if needed
    setShowSuccess(false);
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className="items-center justify-center p-26">
        <div className="bg-white max-w-2xl w-full p-8 text-center">
          <h1 className="text-4xl font-light text-gray-900 mb-8">Loading...</h1>
          <div className="text-gray-600 leading-relaxed">
            <p>Checking authentication status...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="items-center justify-center p-26">
        <div className="bg-white max-w-2xl w-full p-8 text-center">
          <h1 className="text-4xl font-light text-gray-900 mb-8">
            Authentication Required
          </h1>
          <div className="text-red-600 leading-relaxed">
            <p className="mb-4">Please log in to upload your resume.</p>
            <button
              onClick={() => (window.location.href = '/login')}
              className="bg-[#1F514C] hover:bg-[#164138] text-white px-6 py-2 rounded-lg mr-4"
            >
              Go to Login
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showProcessing && uploadedFile) {
    return (
      <div className="p-24">
        <PDFProcessing
          uploadedFile={uploadedFile}
          onComplete={handleProcessingComplete}
          onReupload={handleReupload}
        />
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="">
        <SuccessComponent
          title="Let's move on to the MCQ round"
          buttonText="Start MCQ Test"
          onButtonClick={handleSuccessAction}
          description="Your resume has been successfully uploaded and processed. Ready to test your skills?"
          // Optional: Add a retry button if the SuccessComponent supports it
          onRetry={handleRetryFromSuccess}
        />
      </div>
    );
  }

  return (
    <div className="items-center justify-center p-26">
      <div className="bg-white max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-8">
            Submit Resume
          </h1>
          <div className="text-gray-600 leading-relaxed">
            <p className="mb-2">
              Please upload a recent version of your resume.
            </p>
            <p>
              Supported formats: PDF, DOC, DOCX. Max file size less than 5MB.
            </p>
          </div>
        </div>

        <div
          className={`rounded-2xl p-12 text-center transition-all duration-200 cursor-pointer ${
            isDragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 bg-[#DFDFDF] hover:border-gray-400 hover:bg-gray-50'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="mb-6 flex justify-center">
            <div className="w-18 h-18 rounded-full flex items-center justify-center">
              <svg
                width="111"
                height="74"
                viewBox="0 0 111 74"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M89.3899 30.0347C88.2731 14.7445 76.2476 0 54.1922 0C34.0199 0 18.4637 13.2576 17.6398 30.9505C6.60296 33.9868 0.577148 44.4301 0.577148 52.0312C0.577148 63.7348 11.5774 74 24.1155 74H41.1154C41.4622 74 41.7948 73.8782 42.04 73.6613C42.2853 73.4445 42.4231 73.1504 42.4231 72.8438C42.4231 72.5371 42.2853 72.243 42.04 72.0262C41.7948 71.8093 41.4622 71.6875 41.1154 71.6875H24.1155C12.9688 71.6875 3.19252 62.5023 3.19252 52.0312C3.19252 44.9758 10.186 32.375 24.1155 32.375H28.0385C28.3853 32.375 28.718 32.2532 28.9632 32.0363C29.2084 31.8195 29.3462 31.5254 29.3462 31.2188C29.3462 30.9121 29.2084 30.618 28.9632 30.4012C28.718 30.1843 28.3853 30.0625 28.0385 30.0625H24.1155C22.7842 30.0625 21.5263 30.1943 20.2996 30.3839C21.3249 16.5321 33.2326 2.3125 54.1922 2.3125C76.653 2.3125 86.8843 17.8964 86.8843 32.375V35.8438C86.8843 36.1504 87.0221 36.4445 87.2673 36.6613C87.5126 36.8782 87.8452 37 88.192 37C88.5388 37 88.8714 36.8782 89.1167 36.6613C89.3619 36.4445 89.4997 36.1504 89.4997 35.8438V32.3542C97.3955 33.1196 107.807 40.6121 107.807 52.0312C107.807 60.8789 98.154 71.6875 86.8843 71.6875H67.2691C58.8005 71.6875 55.4999 68.7691 55.4999 61.2812V29.5607L66.1654 38.9726C66.2858 39.0831 66.43 39.1714 66.5894 39.2322C66.7489 39.293 66.9204 39.3251 67.094 39.3266C67.2677 39.3282 67.4399 39.2991 67.6007 39.2412C67.7615 39.1833 67.9076 39.0976 68.0306 38.9892C68.1535 38.8808 68.2508 38.7518 68.3168 38.6098C68.3828 38.4678 68.4161 38.3156 68.4149 38.1621C68.4136 38.0085 68.3778 37.8568 68.3095 37.7156C68.2412 37.5745 68.1418 37.4468 68.0171 37.3399L56.3499 27.0447C54.7964 25.6757 53.5907 25.6757 52.0398 27.0447L40.3726 37.3399C40.1344 37.558 40.0026 37.8501 40.0056 38.1532C40.0085 38.4564 40.1461 38.7464 40.3885 38.9608C40.631 39.1752 40.959 39.2968 41.3018 39.2994C41.6447 39.302 41.975 39.1855 42.2217 38.9749L52.8845 29.5607V61.2812C52.8845 70.078 57.3202 74 67.2691 74H86.8843C99.561 74 110.423 61.9195 110.423 52.0312C110.423 40.0826 99.3779 30.7377 89.3899 30.0347Z"
                  fill="#1F514C"
                />
              </svg>
            </div>
          </div>

          {!uploadedFile ? (
            <p className="text-gray-700 text-lg">
              Drag & drop your resume here, or click to upload
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-700 text-lg">File Ready for Upload</p>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-800 font-medium">
                  {uploadedFile.name}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  setShowProcessing(true);
                }}
                className="bg-[#1F514C] hover:bg-[#164138] text-white px-6 py-2 rounded-lg mr-4"
              >
                Upload Resume
              </button>
              <button
                onClick={handleRemoveFile}
                className="text-red-600 hover:text-red-800 text-sm px-6 py-2 border border-red-300 rounded-lg hover:bg-red-50"
              >
                Remove File
              </button>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default UploadResume;
