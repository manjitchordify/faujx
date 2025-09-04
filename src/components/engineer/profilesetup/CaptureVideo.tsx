'use client';
import React, { useState, useEffect } from 'react';
import { Camera, Upload } from 'lucide-react';
import RecordVideo from './RecordVideo';
import UploadVideo from './UploadVideo';
import ReviewVideo from './ReviewVideo';
import { getVideoSummaryApi } from '@/services/profileSetupService';

const CaptureVideo: React.FC = () => {
  const [mode, setMode] = useState<'initial' | 'capture' | 'upload' | 'review'>(
    'initial'
  );
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [script, setScript] = useState<string>('');
  const [isLoadingScript, setIsLoadingScript] = useState(true);

  // Fetch script on component mount
  useEffect(() => {
    const fetchScript = async () => {
      try {
        setIsLoadingScript(true);
        const fullScript = await getVideoSummaryApi();
        setScript(fullScript);
      } catch (error) {
        console.error('Error fetching video script:', error);
        // Keep default template if API fails
        setScript('');
      } finally {
        setIsLoadingScript(false);
      }
    };

    fetchScript();
  }, []);

  const handleCaptureVideo = () => {
    setMode('capture');
  };

  const handleUploadVideo = () => {
    setMode('upload');
  };

  const handleVideoRecorded = (blob: Blob, duration: number) => {
    const url = URL.createObjectURL(blob);
    setVideoBlob(blob);
    setVideoUrl(url);
    setRecordingTime(duration);
    setMode('review');
  };

  const handleVideoUploaded = (file: File) => {
    const url = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(url);
    setMode('review');
  };

  const goBack = () => {
    // Clean up video URLs
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      setVideoUrl(null);
    }

    setMode('initial');
    setVideoBlob(null);
    setVideoFile(null);
    setRecordingTime(0);
  };

  const handleRetake = () => {
    // Clean up current video
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      setVideoUrl(null);
    }

    if (videoBlob) {
      // If it was a recorded video, go back to capture mode
      setVideoBlob(null);
      setRecordingTime(0);
      handleCaptureVideo();
    } else {
      // If it was an uploaded video, go back to upload mode
      setVideoFile(null);
      setMode('upload');
    }
  };

  const handleSubmit = async () => {
    // Simulate submission process
    await new Promise(resolve => setTimeout(resolve, 2000));

    const videoData = videoBlob || videoFile;
    console.log('Submitting video:', {
      type: videoBlob ? 'recorded' : 'uploaded',
      size: videoData?.size,
      duration: recordingTime || 'unknown',
    });

    // Reset everything after successful submission
    goBack();
  };

  if (mode === 'capture') {
    return (
      <RecordVideo onBack={goBack} onVideoRecorded={handleVideoRecorded} />
    );
  }

  if (mode === 'upload') {
    return (
      <UploadVideo onBack={goBack} onVideoUploaded={handleVideoUploaded} />
    );
  }

  if (mode === 'review' && videoUrl) {
    return (
      <ReviewVideo
        videoBlob={videoBlob || undefined}
        videoFile={videoFile || undefined}
        recordingTime={recordingTime}
        videoUrl={videoUrl}
        onBack={goBack}
        onRetake={handleRetake}
        onSubmit={handleSubmit}
      />
    );
  }

  // Initial view with both options
  return (
    <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      {/* {onBack && (
        <div className="mb-6">
          <button
            onClick={onBack}
            className="text-green hover:text-green-600 text-sm font-medium mb-4 flex items-center gap-2 cursor-pointer"
          >
            ← Back to ProfileUpload
          </button>
        </div>
      )} */}
      {/* Two column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Instructions Panel */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
          <h2 className="text-2xl font-medium text-gray-900 mb-8">
            Instructions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Script Reading</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  A script will be provided to you.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Read it clearly and at a steady pace.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Camera Setup</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Use your laptop&apos;s built-in or external camera.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Place the camera at eye level.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Keep your face centered in the frame.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Lighting</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Sit in a well-lit area, preferably facing natural light or a
                  soft light source.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Avoid strong backlight (e.g., window behind you).
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Sound</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Ensure you are in a quiet environment with no background
                  noise.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Speak loudly and clearly.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Use earphones with a mic if available.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Script Template Panel */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
          <h2 className="text-2xl font-medium text-gray-900 mb-8">
            Script Template
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            {isLoadingScript ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-pulse text-gray-500">
                  Loading script...
                </div>
              </div>
            ) : script ? (
              <div className="whitespace-pre-wrap">{script}</div>
            ) : (
              <>
                <p>
                  <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mr-3"></span>
                  <strong>
                    Hello, my name is [Your Name], and I&apos;m currently a
                    student at [Your College Name].
                  </strong>
                </p>

                <p className="ml-4">
                  Today, I&apos;ll be sharing my project titled [Project Title]
                  which I built using the [Domain/Technology Used] domain.
                </p>

                <p>
                  <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mr-3"></span>
                  <strong>This project focuses on</strong> [briefly explain
                  purpose — e.g., solving real-world problems in healthcare,
                  improving learning experiences, or enhancing data security].
                </p>

                <p className="ml-4">
                  Through this work, I&apos;ve gained skills in [Key Skills:
                  e.g., coding, UI/UX design, problem-solving, teamwork], and
                  learned how to apply them in a practical environment.
                </p>

                <p>
                  <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mr-3"></span>
                  <strong>
                    I&apos;m excited to showcase my work and the capabilities
                    I&apos;ve developed through this project.
                  </strong>
                </p>

                <p className="ml-4">
                  Thank you.{' '}
                  <span className="text-gray-900 font-medium">*</span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-evenly">
        <button
          onClick={handleCaptureVideo}
          className="bg-teal-700 hover:bg-teal-800 text-white px-12 py-4 rounded-xl text-lg font-medium transition-colors duration-200 shadow-sm flex items-center gap-3"
        >
          <Camera className="w-5 h-5" />
          Capture Video
        </button>
        <button
          onClick={handleUploadVideo}
          className="bg-teal-700 hover:bg-teal-800 text-white px-12 py-4 rounded-xl text-lg font-medium transition-colors duration-200 shadow-sm flex items-center gap-3"
        >
          <Upload className="w-5 h-5" />
          Upload Video
        </button>
      </div>
    </div>
  );
};

export default CaptureVideo;
