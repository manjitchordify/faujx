'use client';
import React, { useRef, useState } from 'react';
import { CheckCircle, RotateCcw, Send } from 'lucide-react';
import {
  uploadProfileVideoApi,
  type ProfileVideoUploadResponse,
} from '@/services/profileSetupService';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { updateProfileSetup } from '@/store/slices/userSlice';

// Define a more flexible error type
interface UploadError {
  message: string;
  code?: string;
  status?: number;
  [key: string]: unknown;
}

interface ReviewVideoProps {
  videoBlob?: Blob;
  videoFile?: File;
  recordingTime?: number;
  videoUrl: string;
  onBack: () => void;
  onRetake: () => void;
  onSubmit?: () => void; // Made optional since we're handling submission internally
  onUploadSuccess?: (response: ProfileVideoUploadResponse) => void; // Use the imported type
  onUploadError?: (error: UploadError) => void; // Keep our error type
}

const ReviewVideo: React.FC<ReviewVideoProps> = ({
  videoBlob,
  videoFile,
  recordingTime = 0,
  videoUrl,
  onBack,
  onRetake,
  onSubmit,
  onUploadSuccess,
  onUploadError,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const reviewVideoRef = useRef<HTMLVideoElement>(null);

  const router = useRouter();
  const dispatch = useDispatch();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Determine which file to upload (priority: videoBlob > videoFile)
      const fileToUpload = videoBlob || videoFile;

      if (!fileToUpload) {
        throw new Error('No video file available for upload');
      }

      // Call the profile video upload API
      const response = await uploadProfileVideoApi(fileToUpload);

      console.log('Profile video uploaded successfully:', response);
      dispatch(updateProfileSetup(true));
      router.push('/engineer/dashboard');

      // Call success callback if provided
      if (onUploadSuccess) {
        onUploadSuccess(response);
      }

      // Call the original onSubmit if provided (for backward compatibility)
      if (onSubmit) {
        await onSubmit();
      }
    } catch (error) {
      console.error('Profile video upload failed:', error);

      // Create a properly typed error object
      const uploadError: UploadError = {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to upload profile video. Please try again.',
        ...(error && typeof error === 'object' ? error : {}),
      };

      // Call error callback if provided
      if (onUploadError) {
        onUploadError(uploadError);
      } else {
        // Default error handling
        alert(uploadError.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
        <h2 className="text-3xl font-medium text-gray-900 mb-8 text-center flex items-center justify-center gap-3">
          <CheckCircle className="w-8 h-8 text-green-600" />
          Review Your Video
        </h2>

        {/* Video Preview */}
        <div className="space-y-6">
          <div className="bg-gray-100 rounded-xl overflow-hidden">
            <video
              ref={reviewVideoRef}
              src={videoUrl}
              controls
              className="w-full h-96 object-contain bg-black"
              onLoadedMetadata={() => {
                if (reviewVideoRef.current) {
                  console.log(
                    'Video duration:',
                    reviewVideoRef.current.duration
                  );
                }
              }}
            />
          </div>

          {/* Video Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="font-medium text-gray-900 mb-4">Video Details:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Source:</span>
                <span className="ml-2 font-medium">
                  {videoBlob ? 'Recorded' : 'Uploaded'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Size:</span>
                <span className="ml-2 font-medium">
                  {(
                    (videoBlob?.size || videoFile?.size || 0) /
                    (1024 * 1024)
                  ).toFixed(1)}{' '}
                  MB
                </span>
              </div>
              {videoBlob && recordingTime > 0 && (
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <span className="ml-2 font-medium">
                    {formatTime(recordingTime)}
                  </span>
                </div>
              )}
              {videoFile && (
                <div>
                  <span className="text-gray-600">File Name:</span>
                  <span className="ml-2 font-medium">{videoFile.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Review Checklist */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h4 className="font-medium text-blue-900 mb-4">
              Review Checklist:
            </h4>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start">
                <span className="inline-block w-1 h-1 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Audio is clear and without background noise
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1 h-1 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Face is well-lit and centered in the frame
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1 h-1 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Script is followed completely and clearly
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1 h-1 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Video quality is acceptable
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6 mt-8">
        <button
          onClick={onRetake}
          disabled={isSubmitting}
          className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-8 py-4 rounded-xl text-lg font-medium transition-colors duration-200 shadow-sm flex items-center gap-3"
        >
          <RotateCcw className="w-5 h-5" />
          Retake Video
        </button>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-8 py-4 rounded-xl text-lg font-medium transition-colors duration-200 shadow-sm flex items-center gap-3"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Uploading...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Upload Profile Video
            </>
          )}
        </button>
      </div>

      {/* Back Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="text-gray-500 hover:text-gray-700 disabled:text-gray-300 px-4 py-2 text-sm transition-colors duration-200"
        >
          Back to Start
        </button>
      </div>
    </div>
  );
};

export default ReviewVideo;
