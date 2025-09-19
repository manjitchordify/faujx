import React, { useState, useCallback, useMemo } from 'react';
import SandpackIDE from '@/components/sandbox/sandboxIDE';
import { Clock, Code, Zap, AlertTriangle } from 'lucide-react';
import {
  Assignment,
  CodingAssignmentsResponse,
} from '@/services/codingAssignmentsTypes';
import CodeSandboxInstructions from './codesandoxInstruction';
import { useAppSelector } from '@/store/store';
import { useEffect } from 'react';

interface UseTimerOptions {
  totalMinutes: number;
  onTimeUp?: () => void;
  onTimeWarning?: () => void;
}

const useTimer = ({
  totalMinutes,
  onTimeUp,
  onTimeWarning,
}: UseTimerOptions) => {
  const totalSeconds = totalMinutes * 60;

  const persistedStart = localStorage.getItem('timerStart');
  const startTime = persistedStart ? parseInt(persistedStart, 10) : Date.now();

  if (!persistedStart) {
    localStorage.setItem('timerStart', startTime.toString());
  }

  const [timeLeft, setTimeLeft] = useState(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    return Math.max(totalSeconds - elapsed, 0);
  });
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(totalSeconds - elapsed, 0);
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        onTimeUp?.();
      } else if (remaining === 600) {
        setShowWarning(true);
        onTimeWarning?.();

        setTimeout(() => {
          setShowWarning(false);
        }, 5000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, totalSeconds, onTimeUp, onTimeWarning]);

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }, []);

  const getTimerColor = useCallback(() => {
    if (timeLeft <= 300) return 'text-red-600';
    if (timeLeft <= 600) return 'text-orange-500';
    return 'text-green-600';
  }, [timeLeft]);

  const resetTimer = useCallback(() => {
    localStorage.removeItem('timerStart');
    localStorage.setItem('timerStart', Date.now().toString());
    setShowWarning(false);
  }, []);

  return {
    timeLeft,
    isTimeUp: timeLeft === 0,
    showWarning,
    formatTime,
    getTimerColor,
    resetTimer,
  };
};

const TimerDisplay: React.FC<{
  timeLeft: number;
  formatTime: (seconds: number) => string;
  getTimerColor: () => string;
}> = React.memo(({ timeLeft, formatTime, getTimerColor }) => {
  const timerColor = getTimerColor();

  return (
    <div className="flex justify-center mb-6">
      <div className="bg-white rounded-2xl shadow-lg px-6 py-3 border-2 border-gray-100">
        <div className="flex items-center gap-3">
          <Clock className={`w-5 h-5 ${timerColor}`} />
          <div className="text-center">
            <div className={`text-2xl font-mono font-bold ${timerColor}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Time Remaining
            </div>
          </div>
          {timeLeft <= 300 && (
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
});

TimerDisplay.displayName = 'TimerDisplay';

const TimeWarningAlert: React.FC = React.memo(() => (
  <div className="mb-4 mx-auto max-w-md">
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center gap-2">
      <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0" />
      <p className="text-orange-800 text-sm font-medium">
        Only 10 minutes remaining!
      </p>
    </div>
  </div>
));

TimeWarningAlert.displayName = 'TimeWarningAlert';

const TimeUpAlert: React.FC = React.memo(() => (
  <div className="mb-4 mx-auto max-w-md">
    <div className="bg-red-50 border border-red-200 rounded-lg p-2 flex items-center gap-3">
      <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
      <div>
        <p className="text-red-800 font-semibold text-sm mb-1">
          Time&apos;s Up! The coding environment has been disabled. Please
          submit your work.
        </p>
      </div>
    </div>
  </div>
));

TimeUpAlert.displayName = 'TimeUpAlert';

const SandboxTest: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const assignmentsData: CodingAssignmentsResponse | null = useAppSelector(
    state => state.persist.assignmentsData
  );

  const { timeLeft, isTimeUp, showWarning, formatTime, getTimerColor } =
    useTimer({
      totalMinutes: assignmentsData?.total_estimated_time_minutes || 0,
      onTimeUp: useCallback(() => {}, []),
      onTimeWarning: useCallback(() => {
        console.log('Time warning: 10 minutes remaining');
      }, []),
    });

  const handleModalOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const assignmentsList = useMemo(() => {
    if (!assignmentsData?.assignments) return null;

    return assignmentsData.assignments.map((assignment: Assignment) => (
      <div
        key={assignment.assignment_id}
        className="bg-white rounded-3xl shadow-lg p-6 sm:p-8"
      >
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-medium text-gray-900 pr-4">
            {assignment.title}
          </h2>
        </div>
        <p className="text-gray-700 mb-4 text-sm leading-relaxed">
          {assignment.problem_statement}
        </p>
        <button
          onClick={handleModalOpen}
          className="cursor-pointer font-semibold text-emerald-900 hover:text-emerald-700 underline transition-colors duration-200"
        >
          Coding Instructions
        </button>
      </div>
    ));
  }, [assignmentsData?.assignments, handleModalOpen]);

  return (
    <>
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-semibold mb-4 text-center">Coding Test</h1>

        {assignmentsData && (
          <>
            {isTimeUp && <TimeUpAlert />}
            {showWarning && <TimeWarningAlert />}

            <div className="flex justify-center gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <Code className="w-4 h-4" />
                {assignmentsData.total_assignments} Assignments
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {assignmentsData.total_estimated_time_minutes} mins
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                {assignmentsData.job_title}
              </span>
            </div>

            <TimerDisplay
              timeLeft={timeLeft}
              formatTime={formatTime}
              getTimerColor={getTimerColor}
            />

            <div className="mb-8">
              <div className="md:grid-cols-1 lg:grid-cols-2">
                {assignmentsList}
                <div className="text-center mt-8" />
              </div>
            </div>
          </>
        )}

        {/* Coding Environment */}
        {assignmentsData && (
          <div
            style={{
              position: 'relative',
              pointerEvents: isTimeUp ? 'none' : 'auto',
            }}
          >
            <SandpackIDE
              key="sandpack-ide-stable"
              assignments={assignmentsData}
              disabled={isTimeUp}
              readOnly={isTimeUp}
            />
          </div>
        )}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 bg-opacity-50 z-50">
          <div className="max-w-5xl relative max-h-[80vh] overflow-y-auto rounded-md">
            <CodeSandboxInstructions showCancel onCancel={handleModalClose} />
          </div>
        </div>
      )}
    </>
  );
};

export default SandboxTest;
