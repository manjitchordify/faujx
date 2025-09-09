import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  Upload,
  Play,
  Pause,
  Square,
  Check,
  X,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import {
  getVideoSummaryApi,
  uploadProfileVideoApi,
} from '@/services/profileSetupService';

interface VideoUploadResponse {
  data?: {
    videoUrl: string;
  };
}

// Add proper typing for the API response
interface ApiUploadResponse {
  message: string;
  profileVideo?: string;
  success?: boolean;
}

interface SettingsVideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (response: VideoUploadResponse) => void;
}

type ViewType = 'initial' | 'recording' | 'upload' | 'review';

const SettingsVideoUploadModal: React.FC<SettingsVideoUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [currentView, setCurrentView] = useState<ViewType>('initial');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Add new state for script management
  const [script, setScript] = useState<string>('');
  const [isLoadingScript, setIsLoadingScript] = useState<boolean>(true);
  const [scriptError, setScriptError] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const uploadedFileRef = useRef<File | null>(null);
  // ADD THIS: Store the recorded blob
  const recordedBlobRef = useRef<Blob | null>(null);

  // Cleanup function
  const cleanup = useCallback((): void => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }
    chunksRef.current = [];
    uploadedFileRef.current = null;
    // Don't clear recordedBlobRef here - we need it for upload
  }, []);

  // Reset modal - now memoized with useCallback
  const resetModal = useCallback((): void => {
    cleanup();
    setCurrentView('initial');
    setIsRecording(false);
    setIsPaused(false);
    setRecordedVideo(null);
    setUploadedVideo(null);
    setIsDragOver(false);
    setIsUploading(false);
    // Clear the recorded blob when resetting
    recordedBlobRef.current = null;
    // Reset script states
    setScript('');
    setIsLoadingScript(true);
    setScriptError('');
  }, [cleanup]);

  // Function to fetch script from API
  const fetchVideoScript = async (): Promise<void> => {
    try {
      setIsLoadingScript(true);
      setScriptError('');

      const fullScript = await getVideoSummaryApi(); // Now returns just a string

      if (fullScript) {
        setScript(fullScript);
      } else {
        setScriptError(
          'No script available. Please try again or contact support.'
        );
      }
    } catch (error) {
      console.error('Error fetching video script:', error);
      setScriptError('Failed to load script. Please try again.');
    } finally {
      setIsLoadingScript(false);
    }
  };

  // Load script when modal opens
  useEffect(() => {
    if (isOpen && !script && !scriptError && !isLoadingScript) {
      setIsLoadingScript(true);
      fetchVideoScript();
    }
  }, [isOpen, script, scriptError, isLoadingScript]);

  // Start camera - FIXED VERSION
  const startCamera = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      });
      streamRef.current = stream;

      // Set the view first
      setCurrentView('recording');

      // Use setTimeout to ensure the video element is rendered
      setTimeout(() => {
        if (videoRef.current && streamRef.current) {
          videoRef.current.srcObject = streamRef.current;
          videoRef.current.play().catch(error => {
            console.error('Error playing video:', error);
          });
        }
      }, 100);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  // Start recording
  const startRecording = (): void => {
    if (!streamRef.current) return;

    chunksRef.current = [];
    mediaRecorderRef.current = new MediaRecorder(streamRef.current);

    mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const videoUrl = URL.createObjectURL(blob);

      // FIXED: Store the blob for upload
      recordedBlobRef.current = blob;

      setRecordedVideo(videoUrl);
      setCurrentView('review');
      // Clean up the camera stream after recording
      cleanup();
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
    setIsPaused(false);
  };

  // Pause/Resume recording
  const togglePauseRecording = (): void => {
    if (!mediaRecorderRef.current) return;

    if (isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    } else {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  // Stop recording
  const stopRecording = (): void => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => file.type.startsWith('video/'));

    if (videoFile) {
      const videoUrl = URL.createObjectURL(videoFile);
      setUploadedVideo(videoUrl);
      uploadedFileRef.current = videoFile;
      setCurrentView('review');
    }
  };

  // Handle file input - FIXED
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const videoUrl = URL.createObjectURL(file);
      setUploadedVideo(videoUrl);
      uploadedFileRef.current = file;
      setCurrentView('review');
    }
  };

  // Handle video upload to server - FIXED VERSION with proper typing
  const handleVideoUpload = async (): Promise<void> => {
    try {
      setIsUploading(true);

      let fileToUpload: File | Blob;

      // FIXED: Use the stored recorded blob
      if (recordedBlobRef.current) {
        // For recorded video, use the stored blob
        fileToUpload = recordedBlobRef.current;
      } else if (uploadedFileRef.current) {
        // For uploaded file, use the original file
        fileToUpload = uploadedFileRef.current;
      } else {
        throw new Error('No video to upload');
      }

      // Call your existing API with proper typing
      const result: ApiUploadResponse =
        await uploadProfileVideoApi(fileToUpload);

      // Check for successful upload based on message
      if (result.message && result.message.includes('successfully')) {
        // Transform the response to match your expected interface
        onUploadSuccess({
          data: {
            videoUrl:
              result.profileVideo || recordedVideo || uploadedVideo || '',
          },
        });
        handleClose();
      } else {
        // Log the full response to help debug
        console.error('Upload API response:', result);
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to upload video. Please try again.';
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // Close modal
  const handleClose = (): void => {
    cleanup();
    onClose();
    setTimeout(resetModal, 300);
  };

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Reset when modal opens - now includes resetModal in dependencies
  useEffect(() => {
    if (isOpen) {
      resetModal();
    }
  }, [isOpen, resetModal]);

  // Retry script loading
  const retryScriptLoad = (): void => {
    setScriptError('');
    fetchVideoScript();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-7xl  overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Upload your Self-Intro
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row min-h-[500px]">
          {/* Left Side */}
          <div className="flex-1 p-6 border-r border-gray-200">
            {currentView === 'initial' && (
              <div className="h-full flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Instructions
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 mb-8">
                  <li>• Sit or stand up</li>
                  <li>• A smile while you record it too</li>
                  <li>• Read it clearly and at a steady pace</li>
                  <li>• Camera Setup</li>
                  <li>• Use your laptop&apos;s built-in or external camera</li>
                  <li>• Place the camera at eye level</li>
                  <li>• Keep your face centered on the screen</li>
                  <li>• Lighting</li>
                  <li>
                    • Sit in a well-lit area, preferably facing natural light or
                    soft light source
                  </li>
                  <li>• Avoid strong backlighting (e.g., window behind you)</li>
                  <li>• Sound</li>
                  <li>
                    • Ensure you&apos;re in a quiet environment with no
                    background noise
                  </li>
                  <li>• Speak loudly and clearly</li>
                  <li>• Use earphones with a mic if available</li>
                </ul>

                <div className="space-y-3">
                  <button
                    onClick={startCamera}
                    className="w-full bg-teal-700 hover:bg-teal-800 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Camera size={20} />
                    Capture Video
                  </button>

                  <button
                    onClick={() => setCurrentView('upload')}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Upload size={20} />
                    Upload Video
                  </button>
                </div>
              </div>
            )}

            {currentView === 'recording' && (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recording
                  </h3>
                  <button
                    onClick={resetModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <RotateCcw size={18} className="text-gray-600" />
                  </button>
                </div>

                <div className="relative flex-1 bg-black rounded-lg overflow-hidden mb-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-[300px] rounded-lg bg-black object-cover"
                  />
                  {isRecording && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      {isPaused ? 'PAUSED' : 'RECORDING'}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 justify-center">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors"
                    >
                      <Play size={20} fill="white" />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={togglePauseRecording}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded-full transition-colors"
                      >
                        {isPaused ? (
                          <Play size={20} fill="white" />
                        ) : (
                          <Pause size={20} fill="white" />
                        )}
                      </button>
                      <button
                        onClick={stopRecording}
                        className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full transition-colors"
                      >
                        <Square size={20} fill="white" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {currentView === 'upload' && (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Upload Video
                  </h3>
                  <button
                    onClick={resetModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <RotateCcw size={18} className="text-gray-600" />
                  </button>
                </div>

                <div
                  className={`flex-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${
                    isDragOver
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={e => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                >
                  <Upload size={48} className="text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drag and drop your video here
                  </p>
                  <p className="text-sm text-gray-600 mb-6">or</p>

                  <label className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg cursor-pointer transition-colors">
                    Browse Files
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>

                  <p className="text-xs text-gray-500 mt-4">
                    Supported formats: MP4, WebM, MOV
                  </p>
                </div>
              </div>
            )}

            {currentView === 'review' && (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Review Video
                  </h3>
                  <button
                    onClick={resetModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <RotateCcw size={18} className="text-gray-600" />
                  </button>
                </div>

                <div className="flex-1 bg-black rounded-lg overflow-hidden mb-4">
                  <video
                    src={recordedVideo || uploadedVideo || undefined}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={resetModal}
                    disabled={isUploading}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Re-record
                  </button>
                  <button
                    onClick={handleVideoUpload}
                    disabled={isUploading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Check size={18} />
                        Upload
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Script Template */}
          <div className="flex-1 p-6 ">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Your Script
              </h3>
              {scriptError && (
                <button
                  onClick={retryScriptLoad}
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors"
                >
                  Retry
                </button>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg h-[calc(100vh-200px)] overflow-y-auto">
              {isLoadingScript ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Loader2
                      size={32}
                      className="text-gray-400 animate-spin mx-auto mb-4"
                    />
                    <p className="text-gray-600">Loading your script...</p>
                  </div>
                </div>
              ) : scriptError ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <X size={32} className="text-red-400 mx-auto mb-4" />
                    <p className="text-red-600 mb-4">{scriptError}</p>
                    <button
                      onClick={retryScriptLoad}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : script ? (
                <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">
                  {script}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No script available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsVideoUploadModal;
