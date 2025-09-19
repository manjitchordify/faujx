import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title?: string;
  subtitle?: string;
}

const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  title = 'Introduction Video',
  subtitle,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleClose = useCallback(() => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    onClose();
  }, [onClose]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset video when modal closes
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isOpen]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-4xl mx-4 animate-in fade-in zoom-in duration-300">
        <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 p-2 bg-white/10 cursor-pointer hover:bg-white/20 rounded-full backdrop-blur-md transition-colors duration-200"
            aria-label="Close video"
          >
            <X size={24} className="text-white" />
          </button>

          {/* Video Player */}
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-auto max-h-[70vh]"
            onEnded={handleVideoEnd}
            controls={false}
            onClick={togglePlayPause}
          />

          {/* Custom Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Play/Pause Button */}
                <button
                  onClick={togglePlayPause}
                  className="p-3 bg-white/20 cursor-pointer hover:bg-white/30 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause size={24} className="text-white " />
                  ) : (
                    <Play size={24} className="text-white ml-1" />
                  )}
                </button>

                {/* Mute/Unmute Button */}
                <button
                  onClick={toggleMute}
                  className="p-3 bg-white/20 cursor-pointer hover:bg-white/30 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX size={24} className="text-white" />
                  ) : (
                    <Volume2 size={24} className="text-white" />
                  )}
                </button>
              </div>

              {/* Video Title */}
              <div className="text-white">
                <p className="text-lg font-medium">{title}</p>
                {subtitle && (
                  <p className="text-sm text-white/70">{subtitle}</p>
                )}
              </div>
            </div>
          </div>

          {/* Play button overlay when paused */}
          {!isPlaying && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              onClick={togglePlayPause}
            >
              <button
                className="p-6 bg-white/10 cursor-pointer rounded-full backdrop-blur-md hover:bg-white/20 transition-all duration-200 hover:scale-110"
                aria-label="Play video"
              >
                <Play size={48} className="text-white ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
