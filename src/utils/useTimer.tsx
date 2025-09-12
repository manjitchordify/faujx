import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerProps {
  totalMinutes: number;
  onTimeUp?: () => void;
  onTimeWarning?: () => void;
  warningThreshold?: number; // in seconds, default 600 (10 minutes)
}

interface UseTimerReturn {
  timeLeft: number;
  isActive: boolean;
  isTimeUp: boolean;
  showWarning: boolean;
  formatTime: (seconds: number) => string;
  getTimerColor: () => string;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
}

export const useTimer = ({
  totalMinutes,
  onTimeUp,
  onTimeWarning,
  warningThreshold = 600,
}: UseTimerProps): UseTimerReturn => {
  const [timeLeft, setTimeLeft] = useState(totalMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const warningShownRef = useRef(false);
  const timeUpHandledRef = useRef(false);

  const startTimer = useCallback(() => {
    setIsActive(true);
  }, []);

  const stopTimer = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    setTimeLeft(totalMinutes * 60);
    setIsActive(false);
    setIsTimeUp(false);
    setShowWarning(false);
    warningShownRef.current = false;
    timeUpHandledRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [totalMinutes]);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  const getTimerColor = useCallback(() => {
    if (timeLeft <= 300) return 'text-red-600'; // Last 5 minutes - red
    if (timeLeft <= warningThreshold) return 'text-orange-600'; // Warning threshold - orange
    return 'text-gray-600'; // Normal - gray
  }, [timeLeft, warningThreshold]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;

          if (
            newTime <= warningThreshold &&
            newTime > warningThreshold - 5 &&
            !warningShownRef.current
          ) {
            setShowWarning(true);
            warningShownRef.current = true;
            onTimeWarning?.();
            setTimeout(() => setShowWarning(false), 5000);
          }

          // Time up
          if (newTime <= 0 && !timeUpHandledRef.current) {
            timeUpHandledRef.current = true;
            setIsActive(false);
            setIsTimeUp(true);
            onTimeUp?.();
            return 0;
          }

          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, timeLeft, warningThreshold, onTimeUp, onTimeWarning]);

  useEffect(() => {
    if (totalMinutes > 0 && !isActive && !isTimeUp) {
      setTimeLeft(totalMinutes * 60);
      setIsActive(true);
    }
  }, [totalMinutes, isActive, isTimeUp]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    timeLeft,
    isActive,
    isTimeUp,
    showWarning,
    formatTime,
    getTimerColor,
    startTimer,
    stopTimer,
    resetTimer,
  };
};
