'use client';
import React, { useState, useRef, useCallback } from 'react';
import { Video, Play, Pause, RotateCcw, Check } from 'lucide-react';
import { showToast } from '@/utils/toast/Toast';

interface VideoRecorderProps {
  onVideoReady: (blob: Blob, recordingTime: number) => void;
  onClose: () => void;
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({
  onVideoReady,
  onClose,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true,
      });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      showToast('Unable to access camera. Please check permissions.', 'error');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
  }, [mediaStream]);

  const startRecording = useCallback(() => {
    if (!mediaStream) return;

    try {
      const mediaRecorder = new MediaRecorder(mediaStream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedBlob(blob);
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = URL.createObjectURL(blob);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      showToast('Unable to start recording. Please try again.', 'error');
    }
  }, [mediaStream]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      stopCamera();
    }
  }, [isRecording, stopCamera]);

  const playRecording = useCallback(() => {
    if (videoRef.current && recordedBlob) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, recordedBlob]);

  const resetRecording = useCallback(() => {
    setRecordedBlob(null);
    setIsPlaying(false);
    setRecordingTime(0);
    if (videoRef.current) {
      videoRef.current.src = '';
    }
    startCamera();
  }, [startCamera]);

  const useRecording = useCallback(() => {
    if (recordedBlob) {
      onVideoReady(recordedBlob, recordingTime);
    }
  }, [recordedBlob, recordingTime, onVideoReady]);

  React.useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [startCamera, stopCamera]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Record Video</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="relative bg-black rounded-lg overflow-hidden mb-4">
          <video
            ref={videoRef}
            autoPlay
            muted={!recordedBlob}
            className="w-full h-64 object-cover"
            onEnded={() => setIsPlaying(false)}
          />

          {isRecording && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm">
              REC {formatTime(recordingTime)}
            </div>
          )}
        </div>

        <div className="flex justify-center gap-3">
          {!recordedBlob ? (
            <>
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  disabled={!mediaStream}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                  <Video size={20} />
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Pause size={20} />
                  Stop Recording
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={playRecording}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                onClick={resetRecording}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <RotateCcw size={20} />
                Re-record
              </button>
              <button
                onClick={useRecording}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Check size={20} />
                Use This Video
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoRecorder;
