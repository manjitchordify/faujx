import React, { useState, useCallback, useMemo, useEffect } from 'react';
import SandpackIDE from '@/components/sandbox/sandboxIDE';
import {
  Clock,
  Code,
  Zap,
  AlertTriangle,
  Loader2,
  Database,
  FileText,
  ChevronDown,
  ChevronUp,
  Info,
  TestTube,
  Lightbulb,
  GitBranch,
  Terminal,
} from 'lucide-react';
import {
  Assignment,
  CodingAIMLAssignmentResponse,
  CodingAssignmentsResponse,
} from '@/services/codingAssignmentsTypes';
import CodeSandboxInstructions from './codesandoxInstruction';
import { useAppSelector } from '@/store/store';
import UploadCodeFile from './UploadCodeFile';
import {
  fetchAIMLCodingEvaluation,
  submitAIMLCodingTestApi,
} from '@/services/codingTestService';
import { completeCodingTestStage } from '@/services/engineerService';
import { showToast } from '@/utils/toast/Toast';
import { useRouter } from 'next/navigation';
import { setEvaluationResult } from '@/store/slices/persistSlice';
import { useDispatch } from 'react-redux';

interface UseTimerOptions {
  totalMinutes: number;
  onTimeUp?: () => void;
  onTimeWarning?: () => void;
}

enum LoadingState {
  IDLE = 'idle',
  SUBMITTING = 'submitting',
  EVALUATING = 'evaluating',
  COMPLETING = 'completing',
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

async function submitToAI(
  files: File[],
  candidate_id: string,
  assignmentsAIMLData: CodingAIMLAssignmentResponse,
  router: ReturnType<typeof useRouter>,
  dispatch: ReturnType<typeof useDispatch>,
  enginnerRole: string | null,
  setLoadingState: (state: LoadingState) => void
) {
  try {
    setLoadingState(LoadingState.SUBMITTING);
    const problem_statement =
      assignmentsAIMLData.selected_problem?.description ?? '';
    const problem_type =
      assignmentsAIMLData.selected_problem?.problem_type?.toLowerCase() ?? '';
    const submissionData = {
      files: files,
      problem_statement: problem_statement,
    };

    console.log('submission data', submissionData);
    const response = await submitAIMLCodingTestApi(submissionData);

    if (response) {
      setLoadingState(LoadingState.EVALUATING);

      const EvalData = {
        s3_bucket: 'faujx-dev',
        candidate_id: candidate_id,
        assessment_type: problem_type,
        max_score: 100,
        problem_statement: problem_statement,
      };

      const Evalresult = await fetchAIMLCodingEvaluation(EvalData);
      const result = Evalresult?.data?.evaluationResult;
      const passed = result?.passed || false;

      setLoadingState(LoadingState.COMPLETING);
      await completeCodingTestStage(null, passed);
      setLoadingState(LoadingState.IDLE);

      if (passed) {
        showToast(`Submitted successfully!`, 'success');
        router.push('/engineer/interview/select-slot');
      } else {
        dispatch(setEvaluationResult(result));
        showToast(`Evaluation completed!`, 'success');
        router.replace(
          `/engineer/feedback?score=${result?.overall_score}&type=aimlcoding`
        );
      }
    }
  } catch (error) {
    console.error('Submission error:', error);
    setLoadingState(LoadingState.IDLE);
    showToast('Submission failed. Please try again.', 'error');
    throw error;
  }
}

const LoadingOverlay: React.FC<{ loadingState: LoadingState }> = React.memo(
  ({ loadingState }) => {
    const getLoadingMessage = () => {
      switch (loadingState) {
        case LoadingState.SUBMITTING:
          return 'Submitting your code...';
        case LoadingState.EVALUATING:
          return 'Evaluating your code...';
        case LoadingState.COMPLETING:
          return 'Finalizing results...';
        default:
          return 'Processing...';
      }
    };

    if (loadingState === LoadingState.IDLE) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <div className="absolute inset-0 rounded-full border-2 border-blue-100"></div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {getLoadingMessage()}
              </h3>
              <p className="text-sm text-gray-600">
                {loadingState === LoadingState.EVALUATING
                  ? 'This may take a few moments as we analyze your solution...'
                  : 'Please wait while we process your submission.'}
              </p>
            </div>

            {loadingState === LoadingState.EVALUATING && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div
                  className="bg-blue-600 h-2 rounded-full animate-pulse"
                  style={{ width: '60%' }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

LoadingOverlay.displayName = 'LoadingOverlay';

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

// Assignment Details Component
const AssignmentDetails: React.FC<{ assignment: Assignment }> = React.memo(
  ({ assignment }) => {
    const [expandedSections, setExpandedSections] = useState<
      Record<string, boolean>
    >({});

    const toggleSection = useCallback((sectionId: string) => {
      setExpandedSections(prev => ({
        ...prev,
        [sectionId]: !prev[sectionId],
      }));
    }, []);

    return (
      <div className="mt-4 space-y-3 border-t pt-4">
        {/* Constraints */}
        {assignment.constraints && assignment.constraints.length > 0 && (
          <div className="border rounded-xl overflow-hidden">
            <button
              onClick={() =>
                toggleSection(`constraints-${assignment.assignment_id}`)
              }
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#1F514C]" />
                <span className="font-medium text-gray-900">Constraints</span>
              </div>
              {expandedSections[`constraints-${assignment.assignment_id}`] ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {expandedSections[`constraints-${assignment.assignment_id}`] && (
              <div className="px-4 pb-4 bg-gray-50">
                <ul className="space-y-1">
                  {assignment.constraints.map((constraint, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-700 flex items-start"
                    >
                      <span className="text-[#1F514C] mr-2">•</span>
                      <span>{constraint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Examples */}
        {assignment.examples && assignment.examples.length > 0 && (
          <div className="border rounded-xl overflow-hidden">
            <button
              onClick={() =>
                toggleSection(`examples-${assignment.assignment_id}`)
              }
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1F514C]" />
                <span className="font-medium text-gray-900">Examples</span>
              </div>
              {expandedSections[`examples-${assignment.assignment_id}`] ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {expandedSections[`examples-${assignment.assignment_id}`] && (
              <div className="px-4 pb-4 bg-gray-50 space-y-3">
                {assignment.examples.map((example, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 text-sm">
                    <div className="mb-2">
                      <span className="font-medium text-gray-700">Input:</span>
                      <pre className="mt-1 p-2 bg-gray-100 rounded overflow-x-auto text-xs">
                        {example.input}
                      </pre>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium text-gray-700">Output:</span>
                      <pre className="mt-1 p-2 bg-gray-100 rounded overflow-x-auto text-xs">
                        {example.output}
                      </pre>
                    </div>
                    {example.explanation && (
                      <div>
                        <span className="font-medium text-gray-700">
                          Explanation:
                        </span>
                        <p className="mt-1 text-gray-600">
                          {example.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Test Cases */}
        {assignment.test_cases && assignment.test_cases.length > 0 && (
          <div className="border rounded-xl overflow-hidden">
            <button
              onClick={() =>
                toggleSection(`testcases-${assignment.assignment_id}`)
              }
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <TestTube className="w-4 h-4 text-[#1F514C]" />
                <span className="font-medium text-gray-900">Test Cases</span>
                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                  {assignment.test_cases.filter(tc => !tc.is_hidden).length}{' '}
                  visible
                </span>
              </div>
              {expandedSections[`testcases-${assignment.assignment_id}`] ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {expandedSections[`testcases-${assignment.assignment_id}`] && (
              <div className="px-4 pb-4 bg-gray-50 space-y-3">
                {assignment.test_cases
                  .filter(tc => !tc.is_hidden)
                  .map((testCase, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-3 text-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-700">
                          Test Case {index + 1}
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="text-xs font-medium text-gray-600">
                          Description:
                        </span>
                        <p className="text-gray-700">{testCase.description}</p>
                      </div>
                      <div className="grid gap-2">
                        <div>
                          <span className="text-xs font-medium text-gray-600">
                            Input:
                          </span>
                          <pre className="mt-1 p-2 bg-gray-100 rounded overflow-x-auto text-xs">
                            {testCase.input}
                          </pre>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-600">
                            Expected Output:
                          </span>
                          <pre className="mt-1 p-2 bg-gray-100 rounded overflow-x-auto text-xs">
                            {testCase.expected_output}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                {assignment.test_cases.filter(tc => tc.is_hidden).length >
                  0 && (
                  <p className="text-xs text-gray-500 italic text-center">
                    + {assignment.test_cases.filter(tc => tc.is_hidden).length}{' '}
                    hidden test case(s)
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Starter Code */}
        {assignment.starter_code?.javascript && (
          <div className="border rounded-xl overflow-hidden">
            <button
              onClick={() =>
                toggleSection(`starter-${assignment.assignment_id}`)
              }
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#1F514C]" />
                <span className="font-medium text-gray-900">Starter Code</span>
                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                  JavaScript
                </span>
              </div>
              {expandedSections[`starter-${assignment.assignment_id}`] ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {expandedSections[`starter-${assignment.assignment_id}`] && (
              <div className="px-4 pb-4 bg-gray-50">
                <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-xs">
                  <code>{assignment.starter_code.javascript}</code>
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Solution Approach */}
        {assignment.solution_approach && (
          <div className="border rounded-xl overflow-hidden">
            <button
              onClick={() =>
                toggleSection(`solution-${assignment.assignment_id}`)
              }
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#1F514C]" />
                <span className="font-medium text-gray-900">
                  Solution Approach
                </span>
              </div>
              {expandedSections[`solution-${assignment.assignment_id}`] ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {expandedSections[`solution-${assignment.assignment_id}`] && (
              <div className="px-4 pb-4 bg-gray-50">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {assignment.solution_approach}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Hints */}
        {assignment.hints && assignment.hints.length > 0 && (
          <div className="border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection(`hints-${assignment.assignment_id}`)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#1F514C]" />
                <span className="font-medium text-gray-900">Hints</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                  {assignment.hints.length} hints
                </span>
              </div>
              {expandedSections[`hints-${assignment.assignment_id}`] ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {expandedSections[`hints-${assignment.assignment_id}`] && (
              <div className="px-4 pb-4 bg-gray-50">
                <div className="space-y-2">
                  {assignment.hints.map((hint, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-[#1F514C] font-medium text-sm mr-2">
                        Hint {index + 1}:
                      </span>
                      <span className="text-sm text-gray-700">{hint}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

AssignmentDetails.displayName = 'AssignmentDetails';

const SandboxTest: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.IDLE
  );
  const [showDetails, setShowDetails] = useState<Record<number, boolean>>({});

  const assignmentsData: CodingAssignmentsResponse | null = useAppSelector(
    state => state.persist.assignmentsData
  );
  const assignmentsAIMLData: CodingAIMLAssignmentResponse | null =
    useAppSelector(state => state.persist.assignmentsAIMLData);
  const { enginnerRole } = useAppSelector(state => state.persist);
  const { loggedInUser } = useAppSelector(state => state.user);
  const router = useRouter();
  const dispatch = useDispatch();

  const { timeLeft, isTimeUp, showWarning, formatTime, getTimerColor } =
    useTimer({
      totalMinutes:
        enginnerRole == 'aiml' && assignmentsAIMLData
          ? assignmentsAIMLData.selected_problem?.time_limit
          : assignmentsData?.total_estimated_time_minutes || 0,
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

  const handleAIMLSubmit = useCallback(
    async (files: File[]) => {
      if (!assignmentsAIMLData || !loggedInUser?.id) return;

      await submitToAI(
        files,
        loggedInUser.id,
        assignmentsAIMLData,
        router,
        dispatch,
        enginnerRole,
        setLoadingState
      );
    },
    [loggedInUser?.id, router, dispatch, assignmentsAIMLData, enginnerRole]
  );

  const toggleDetails = useCallback((assignmentId: number) => {
    setShowDetails(prev => ({
      ...prev,
      [assignmentId]: !prev[assignmentId],
    }));
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

        <div className="flex items-center gap-4">
          {enginnerRole !== 'aiml' && (
            <button
              onClick={handleModalOpen}
              className="cursor-pointer font-semibold text-emerald-900 hover:text-emerald-700 underline transition-colors duration-200"
            >
              Coding Instructions
            </button>
          )}

          <button
            onClick={() => toggleDetails(assignment.assignment_id)}
            className="flex items-center gap-2 text-[#1F514C] hover:text-[#2a6b65] font-medium transition-colors"
          >
            <span>View Details</span>
            {showDetails[assignment.assignment_id] ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Assignment Details Dropdown */}
        {showDetails[assignment.assignment_id] && (
          <AssignmentDetails assignment={assignment} />
        )}
      </div>
    ));
  }, [
    assignmentsData?.assignments,
    handleModalOpen,
    enginnerRole,
    showDetails,
    toggleDetails,
  ]);

  const isLoading = loadingState !== LoadingState.IDLE;

  return (
    <>
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-semibold mb-4 text-center">Coding Test</h1>

        {(assignmentsData || assignmentsAIMLData) && (
          <>
            {isTimeUp && <TimeUpAlert />}
            {showWarning && <TimeWarningAlert />}

            <div className="flex justify-center gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <Code className="w-4 h-4" />1 Assignments
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {enginnerRole == 'aiml' && assignmentsAIMLData
                  ? assignmentsAIMLData.selected_problem?.time_limit
                  : assignmentsData?.total_estimated_time_minutes || 0}{' '}
                mins
              </span>
              {enginnerRole == 'aiml' ? (
                <span className="flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  AIML Engineer
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  {assignmentsData?.job_title || ''}
                </span>
              )}
            </div>

            <TimerDisplay
              timeLeft={timeLeft}
              formatTime={formatTime}
              getTimerColor={getTimerColor}
            />

            <div className="mb-2">
              {enginnerRole === 'aiml' && assignmentsAIMLData ? (
                <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8">
                  <h2 className="text-xl font-medium text-gray-900 mb-3">
                    AIML Assignment
                  </h2>
                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                    {assignmentsAIMLData.selected_problem?.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mb-4">
                    {assignmentsAIMLData.selected_problem?.pdf_url && (
                      <a
                        href={assignmentsAIMLData.selected_problem.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        View Assignment PDF
                      </a>
                    )}
                    {assignmentsAIMLData.selected_problem?.dataset_url && (
                      <a
                        href={assignmentsAIMLData.selected_problem.dataset_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                      >
                        <Database className="w-4 h-4" />
                        Download Dataset
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="md:grid-cols-1 lg:grid-cols-2">
                  {assignmentsList}
                </div>
              )}
            </div>

            <div
              style={{
                position: 'relative',
                pointerEvents: isTimeUp || isLoading ? 'none' : 'auto',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {enginnerRole === 'aiml' ? (
                <UploadCodeFile
                  onSubmit={handleAIMLSubmit}
                  isTimeUp={isTimeUp}
                  disabled={isLoading}
                />
              ) : (
                <SandpackIDE
                  key="sandpack-ide-stable"
                  assignments={assignmentsData}
                  disabled={isTimeUp || isLoading}
                  readOnly={isTimeUp || isLoading}
                />
              )}
            </div>
          </>
        )}
      </div>

      <LoadingOverlay loadingState={loadingState} />

      {/* Modal */}
      {isOpen && !isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 bg-opacity-50 z-40">
          <div className="max-w-5xl relative max-h-[80vh] overflow-y-auto rounded-md">
            <CodeSandboxInstructions showCancel onCancel={handleModalClose} />
          </div>
        </div>
      )}
    </>
  );
};

export default SandboxTest;
