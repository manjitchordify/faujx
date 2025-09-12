'use client';
import React, { useState, useRef, useCallback } from 'react';
import { Upload, Video } from 'lucide-react';
import { showToast } from '@/utils/toast/Toast';
import VideoRecorder from './VideoRecorder';
import ReviewVideo from './ReviewVideo';

interface VideoData {
  file?: File;
  blob?: Blob;
  url: string;
  recordingTime?: number;
}

interface SelfIntroVideoProps {
  onComplete?: (file: File | Blob) => void;
  onBack?: () => void;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_TYPES = ['video/mp4', 'video/mov', 'video/webm'];

const SelfIntroVideo: React.FC<SelfIntroVideoProps> = ({
  onComplete,
  onBack,
}) => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'review'>('upload');
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [showRecorder, setShowRecorder] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      showToast(
        'Please select a valid video file (MP4, MOV, or WEBM)',
        'error'
      );
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      showToast('File size must be less than 100MB', 'error');
      return false;
    }
    return true;
  }, []); // No dependencies needed as ALLOWED_TYPES and MAX_FILE_SIZE are constants

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && validateFile(file)) {
        const url = URL.createObjectURL(file);
        setVideoData({
          file,
          url,
        });
        setCurrentStep('review');
      }
    },
    [validateFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const file = e.dataTransfer.files[0];
      if (file && validateFile(file)) {
        const url = URL.createObjectURL(file);
        setVideoData({
          file,
          url,
        });
        setCurrentStep('review');
      }
    },
    [validateFile]
  );

  const handleVideoRecorded = useCallback(
    (blob: Blob, recordingTime: number) => {
      const url = URL.createObjectURL(blob);
      setVideoData({
        blob,
        url,
        recordingTime,
      });
      setShowRecorder(false);
      setCurrentStep('review');
    },
    []
  );

  const handleRetake = useCallback(() => {
    setVideoData(null);
    setCurrentStep('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleBackToUpload = useCallback(() => {
    setVideoData(null);
    setCurrentStep('upload');
  }, []);

  const handleFinalComplete = useCallback(() => {
    if (videoData) {
      const finalFile = videoData.file || videoData.blob;
      onComplete?.(finalFile!);
    }
  }, [videoData, onComplete]);

  // Show Review Video Component
  if (currentStep === 'review' && videoData) {
    return (
      <ReviewVideo
        videoFile={videoData.file}
        videoBlob={videoData.blob}
        videoUrl={videoData.url}
        recordingTime={videoData.recordingTime}
        onBack={handleBackToUpload}
        onRetake={handleRetake}
        onUploadSuccess={handleFinalComplete}
      />
    );
  }

  // Show Main Upload Interface
  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-5xl">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-light text-gray-900 text-center mb-8 sm:mb-12">
          Upload your Self-Intro video
        </h1>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Instructions Card */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Instructions
            </h3>

            <div className="space-y-6">
              {/* Script Reading */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">
                  Script Reading
                </h4>
                <ul className="text-sm text-gray-600 space-y-2 pl-4">
                  <li>• A script will be provided to you.</li>
                  <li>• Read it clearly and at a steady pace.</li>
                </ul>
              </div>

              {/* Camera Setup */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Camera Setup</h4>
                <ul className="text-sm text-gray-600 space-y-2 pl-4">
                  <li>• Use your laptop&apos;s built-in or external camera.</li>
                  <li>• Place the camera at eye level.</li>
                  <li>• Keep your face centered in the frame.</li>
                </ul>
              </div>

              {/* Lighting */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Lighting</h4>
                <ul className="text-sm text-gray-600 space-y-2 pl-4">
                  <li>
                    • Sit in a well-lit area, preferably facing natural light or
                    a soft light source.
                  </li>
                  <li>• Avoid strong backlight (e.g., window behind you).</li>
                </ul>
              </div>

              {/* Sound */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Sound</h4>
                <ul className="text-sm text-gray-600 space-y-2 pl-4">
                  <li>
                    • Ensure you are in a quiet environment with no background
                    noise.
                  </li>
                  <li>• Speak loudly and clearly.</li>
                  <li>• Use earphones with a mic if available.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Script Template Card */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Script Template
            </h3>

            <div className="text-sm text-gray-700 leading-relaxed space-y-4">
              <p>
                <strong>
                  &ldquo;Hello, my name is [Your Name], and I&apos;m currently a
                  student at [Your College Name].&rdquo;
                </strong>
              </p>

              <p>
                Today, I&apos;ll be sharing my project titled [Project Title],
                which I built using the [Domain/Technology Used] domain.
              </p>

              <p>
                This project focuses on [briefly explain purpose — e.g., solving
                real-world problems in healthcare, improving learning
                experiences, or enhancing data security].
              </p>

              <p>
                Through this work, I&apos;ve gained skills in [Key Skills -
                e.g., coding, UI/UX design, problem-solving, teamwork], and
                learned how to apply them in a practical environment.
              </p>

              <p>
                I&apos;m excited to showcase my work and the capabilities
                I&apos;ve developed through this project.
              </p>

              <p className="font-medium">Thank you.&rdquo;</p>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div
          className={`rounded-xl p-12 text-center transition-all duration-200 bg-white ${
            isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <h3 className="text-lg font-medium text-gray-600">
              Drag & drop area or click to browse files
            </h3>
            <p className="text-sm text-gray-500">
              Accept formats: .mp4, .mov, .webm
            </p>
            <p className="text-sm text-gray-500 mb-6">Max size: 100MB</p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#1F514C] hover:bg-teal-700 text-white px-8 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Upload size={20} />
                Upload Video
              </button>
              <button
                onClick={() => setShowRecorder(true)}
                className="bg-[#1F514C] hover:bg-teal-700 text-white px-8 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Video size={20} />
                Capture Video
              </button>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".mp4,.mov,.webm"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Video Recorder Modal */}
        {showRecorder && (
          <VideoRecorder
            onVideoReady={handleVideoRecorded}
            onClose={() => setShowRecorder(false)}
          />
        )}

        {onBack && (
          <div className="flex justify-center mt-8">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 text-sm px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Previous Step
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelfIntroVideo;
