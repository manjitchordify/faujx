import React, { useState, useRef, useEffect } from 'react';
import { Camera, Play, Pause, Square } from 'lucide-react';
import { getVideoSummaryApi } from '@/services/profileSetupService';
import { toast } from 'react-toastify';

interface RecordVideoProps {
  onBack: () => void;
  onVideoRecorded: (videoBlob: Blob, recordingTime: number) => void;
}

const RecordVideo: React.FC<RecordVideoProps> = ({
  onBack,
  onVideoRecorded,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [script, setScript] = useState<string>('');
  const [isLoadingScript, setIsLoadingScript] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
  const didInitialize = useRef(false);

  React.useEffect(() => {
    if (didInitialize.current) return; // Prevent double execution
    didInitialize.current = true;
    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        if (error instanceof DOMException) {
          if (
            error.name === 'NotAllowedError' ||
            error.name === 'PermissionDeniedError'
          ) {
            toast.error(
              'Camera access was denied. Please allow camera permissions.'
            );
            // Or: toast.error('Camera access was denied. Please allow camera permissions.');
          } else if (error.name === 'NotFoundError') {
            toast.error('No camera found on this device.');
          } else {
            toast.error('Unable to access camera. Please check your settings.');
          }
        } else {
          toast.error('Unexpected error accessing camera.');
        }

        // Go back if needed
        onBack();
      }
    };

    initializeCamera();

    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [onBack]);

  const startRecording = () => {
    if (streamRef.current) {
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      console.log('Recording started');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      setIsPaused(!isPaused);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      const chunks: Blob[] = [];

      mediaRecorderRef.current.ondataavailable = event => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const videoBlob = new Blob(chunks, { type: 'video/webm' });
        onVideoRecorded(videoBlob, recordingTime);
      };

      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Stop camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      console.log('Recording stopped');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Video Recording Panel */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
          <h2 className="text-2xl font-medium text-gray-900 mb-8 flex items-center gap-3">
            <Camera className="w-6 h-6 text-teal-700" />
            Record Your Video
          </h2>

          <div className="space-y-6">
            {/* Video Preview */}
            <div className="relative bg-gray-100 rounded-xl overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-64 object-cover"
              />

              {isRecording && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  REC {formatTime(recordingTime)}
                </div>
              )}
            </div>

            {/* Recording Controls */}
            <div className="flex justify-center gap-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  Start Recording
                </button>
              ) : (
                <>
                  <button
                    onClick={pauseRecording}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    {isPaused ? (
                      <Play className="w-4 h-4" />
                    ) : (
                      <Pause className="w-4 h-4" />
                    )}
                    {isPaused ? 'Resume' : 'Pause'}
                  </button>

                  <button
                    onClick={stopRecording}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <Square className="w-4 h-4" />
                    Stop Recording
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Script Template Panel */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
          <h2 className="text-2xl font-medium text-gray-900 mb-8">
            Script Template
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
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

      {/* Back Button */}
      <div className="flex justify-center">
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white px-12 py-4 rounded-xl text-lg font-medium transition-colors duration-200 shadow-sm"
        >
          Back to Options
        </button>
      </div>
    </div>
  );
};

export default RecordVideo;
