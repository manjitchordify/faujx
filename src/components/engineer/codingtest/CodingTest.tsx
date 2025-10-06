'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Clock,
  Code,
  Zap,
  ChevronDown,
  ChevronUp,
  Info,
  TestTube,
  Lightbulb,
  GitBranch,
  Terminal,
  FileCode,
} from 'lucide-react';
import { generateCodingAssignmentsApi } from '@/services/codingAssignmentsService';
import {
  CodingAssignmentsResponse,
  Assignment,
  ApiError,
  GenerateCodingAssignmentsParams,
  ResumeData,
} from '@/services/codingAssignmentsTypes';
import { get_jd_s3_key_role } from '@/utils/helper/Helper';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { setAssignmentsData as setAssignmentsDataAction } from '@/store/slices/persistSlice';
import { useRouter } from 'next/navigation';

interface CodingTestProps {
  onNext?: () => void;
}

const CodingTest: React.FC<CodingTestProps> = () => {
  const {
    resumeData,
    enginnerRole,
    assignmentsData: storedAssignments,
  } = useAppSelector(state => ({
    resumeData: state.persist.resumeData as ResumeData | null,
    enginnerRole: state.persist.enginnerRole,
    assignmentsData: state.persist.assignmentsData,
  }));

  const dispatch = useAppDispatch();
  const router = useRouter();

  const [error, setError] = useState('');
  const [localAssignmentsData, setLocalAssignmentsData] =
    useState<CodingAssignmentsResponse | null>(storedAssignments || null);
  const [isLoadingAssignments, setIsLoadingAssignments] =
    useState(!storedAssignments);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const jd_s3_key = get_jd_s3_key_role(enginnerRole ?? '');

  const sampleRequestData = useMemo(() => {
    if (!resumeData) return null;

    const requestData: GenerateCodingAssignmentsParams = {
      jd_s3_key,
      resume_data: resumeData,
      num_assignments: 1,
      difficulty_mix: 'balanced',
      languages: ['javascript'],
    };

    return requestData;
  }, [resumeData, jd_s3_key]);

  const loadCodingAssignments = useCallback(async () => {
    if (!sampleRequestData) return;

    try {
      setIsLoadingAssignments(true);
      setError('');

      const response = await generateCodingAssignmentsApi(sampleRequestData);
      setLocalAssignmentsData(response);
      dispatch(setAssignmentsDataAction(response));
    } catch (err: unknown) {
      console.error('Error fetching assignments:', err);
      if (err && typeof err === 'object' && 'message' in err) {
        const apiError = err as ApiError;
        setError(apiError.message || 'Failed to load assignments.');
      } else if (err instanceof Error) {
        setError(err.message || 'Failed to load assignments.');
      } else {
        setError('Failed to load assignments.');
      }
    } finally {
      setIsLoadingAssignments(false);
    }
  }, [sampleRequestData, dispatch]);

  useEffect(() => {
    if (!storedAssignments && sampleRequestData) {
      loadCodingAssignments();
    } else if (storedAssignments) {
      setLocalAssignmentsData(storedAssignments);
      setIsLoadingAssignments(false);
    }
  }, [storedAssignments, sampleRequestData, loadCodingAssignments]);

  const handleContinue = () => {
    router.push('/engineer/coding/coding-test');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Loading state
  if (isLoadingAssignments) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1F514C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Generating Your Coding Test
          </h2>
          <p className="text-gray-600">
            Please wait while we prepare personalized assignments for you...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mb-4">
            Coding Test
          </h1>
          {localAssignmentsData && (
            <div className="flex justify-center gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <Code className="w-4 h-4" />
                {localAssignmentsData.total_assignments} Assignments
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {localAssignmentsData.total_estimated_time_minutes} mins
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                {localAssignmentsData.job_title}
              </span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 max-w-md mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm text-center">{error}</p>
              <button
                onClick={loadCodingAssignments}
                className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Assignments Section */}
        {localAssignmentsData && (
          <div className="mb-8">
            <div className="space-y-6">
              {localAssignmentsData.assignments.map(
                (assignment: Assignment) => (
                  <div
                    key={assignment.assignment_id}
                    className="bg-white rounded-3xl shadow-lg p-6 sm:p-8"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h2 className="text-xl font-medium text-gray-900 pr-4">
                        {assignment.title}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                          assignment.difficulty
                        )} uppercase`}
                      >
                        {assignment.difficulty}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                      {assignment.problem_statement}
                    </p>

                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-900">
                          Category:{' '}
                        </span>
                        <span className="text-gray-600 capitalize">
                          {assignment.category}
                        </span>
                      </div>

                      <div>
                        <span className="font-medium text-gray-900">
                          Skills Tested:{' '}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {assignment.skills_tested.map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs capitalize"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Time and Complexity Info */}
                      <div className="flex flex-wrap gap-4 pt-2">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs">
                            Est. {assignment.estimated_time_minutes} mins
                          </span>
                        </div>
                        {assignment.time_complexity && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Zap className="w-3 h-3" />
                            <span className="text-xs">
                              Time: {assignment.time_complexity}
                            </span>
                          </div>
                        )}
                        {assignment.space_complexity && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Code className="w-3 h-3" />
                            <span className="text-xs">
                              Space: {assignment.space_complexity}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Additional Details - Collapsible Sections */}
                    <div className="mt-6 space-y-3 border-t pt-4">
                      {/* Constraints */}
                      {assignment.constraints &&
                        assignment.constraints.length > 0 && (
                          <div className="border rounded-xl overflow-hidden">
                            <button
                              onClick={() =>
                                toggleSection(
                                  `constraints-${assignment.assignment_id}`
                                )
                              }
                              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <Info className="w-4 h-4 text-[#1F514C]" />
                                <span className="font-medium text-gray-900">
                                  Constraints
                                </span>
                              </div>
                              {expandedSections[
                                `constraints-${assignment.assignment_id}`
                              ] ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                            {expandedSections[
                              `constraints-${assignment.assignment_id}`
                            ] && (
                              <div className="px-4 pb-4 bg-gray-50">
                                <ul className="space-y-1">
                                  {assignment.constraints.map(
                                    (constraint, index) => (
                                      <li
                                        key={index}
                                        className="text-sm text-gray-700 flex items-start"
                                      >
                                        <span className="text-[#1F514C] mr-2">
                                          •
                                        </span>
                                        <span>{constraint}</span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                      {/* Examples */}
                      {assignment.examples &&
                        assignment.examples.length > 0 && (
                          <div className="border rounded-xl overflow-hidden">
                            <button
                              onClick={() =>
                                toggleSection(
                                  `examples-${assignment.assignment_id}`
                                )
                              }
                              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <FileCode className="w-4 h-4 text-[#1F514C]" />
                                <span className="font-medium text-gray-900">
                                  Examples
                                </span>
                              </div>
                              {expandedSections[
                                `examples-${assignment.assignment_id}`
                              ] ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                            {expandedSections[
                              `examples-${assignment.assignment_id}`
                            ] && (
                              <div className="px-4 pb-4 bg-gray-50 space-y-3">
                                {assignment.examples.map((example, index) => (
                                  <div
                                    key={index}
                                    className="bg-white rounded-lg p-3 text-sm"
                                  >
                                    <div className="mb-2">
                                      <span className="font-medium text-gray-700">
                                        Input:
                                      </span>
                                      <pre className="mt-1 p-2 bg-gray-100 rounded overflow-x-auto text-xs">
                                        {example.input}
                                      </pre>
                                    </div>
                                    <div className="mb-2">
                                      <span className="font-medium text-gray-700">
                                        Output:
                                      </span>
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
                      {assignment.test_cases &&
                        assignment.test_cases.length > 0 && (
                          <div className="border rounded-xl overflow-hidden">
                            <button
                              onClick={() =>
                                toggleSection(
                                  `testcases-${assignment.assignment_id}`
                                )
                              }
                              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <TestTube className="w-4 h-4 text-[#1F514C]" />
                                <span className="font-medium text-gray-900">
                                  Test Cases
                                </span>
                                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                                  {
                                    assignment.test_cases.filter(
                                      tc => !tc.is_hidden
                                    ).length
                                  }{' '}
                                  visible
                                </span>
                              </div>
                              {expandedSections[
                                `testcases-${assignment.assignment_id}`
                              ] ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                            {expandedSections[
                              `testcases-${assignment.assignment_id}`
                            ] && (
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
                                        <p className="text-gray-700">
                                          {testCase.description}
                                        </p>
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
                                {assignment.test_cases.filter(
                                  tc => tc.is_hidden
                                ).length > 0 && (
                                  <p className="text-xs text-gray-500 italic text-center">
                                    +{' '}
                                    {
                                      assignment.test_cases.filter(
                                        tc => tc.is_hidden
                                      ).length
                                    }{' '}
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
                              toggleSection(
                                `starter-${assignment.assignment_id}`
                              )
                            }
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Terminal className="w-4 h-4 text-[#1F514C]" />
                              <span className="font-medium text-gray-900">
                                Starter Code
                              </span>
                              <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                                JavaScript
                              </span>
                            </div>
                            {expandedSections[
                              `starter-${assignment.assignment_id}`
                            ] ? (
                              <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
                          {expandedSections[
                            `starter-${assignment.assignment_id}`
                          ] && (
                            <div className="px-4 pb-4 bg-gray-50">
                              {/* Code Display */}
                              <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-xs">
                                <code>
                                  {assignment.starter_code.javascript}
                                </code>
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
                              toggleSection(
                                `solution-${assignment.assignment_id}`
                              )
                            }
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <GitBranch className="w-4 h-4 text-[#1F514C]" />
                              <span className="font-medium text-gray-900">
                                Solution Approach
                              </span>
                            </div>
                            {expandedSections[
                              `solution-${assignment.assignment_id}`
                            ] ? (
                              <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
                          {expandedSections[
                            `solution-${assignment.assignment_id}`
                          ] && (
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
                            onClick={() =>
                              toggleSection(`hints-${assignment.assignment_id}`)
                            }
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Lightbulb className="w-4 h-4 text-[#1F514C]" />
                              <span className="font-medium text-gray-900">
                                Hints
                              </span>
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                {assignment.hints.length} hints
                              </span>
                            </div>
                            {expandedSections[
                              `hints-${assignment.assignment_id}`
                            ] ? (
                              <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
                          {expandedSections[
                            `hints-${assignment.assignment_id}`
                          ] && (
                            <div className="px-4 pb-4 bg-gray-50">
                              <div className="space-y-2">
                                {assignment.hints.map((hint, index) => (
                                  <div key={index} className="flex items-start">
                                    <span className="text-[#1F514C] font-medium text-sm mr-2">
                                      Hint {index + 1}:
                                    </span>
                                    <span className="text-sm text-gray-700">
                                      {hint}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Skills Coverage */}
            <div className="mt-8 bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Skills Coverage
              </h3>
              <div className="flex flex-wrap gap-2">
                {localAssignmentsData.skills_coverage.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#1F514C] text-white rounded-full text-sm capitalize"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="flex justify-center px-6">
          <button
            onClick={handleContinue}
            disabled={isLoadingAssignments}
            className={`
              px-16 md:px-12 py-3 rounded-[20px] font-medium text-white transition-all duration-200 relative bg-[#1f514C] hover:bg-[#1f514C]
              ${
                !isLoadingAssignments
                  ? 'shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'cursor-not-allowed'
              }
            `}
          >
            <div className="flex items-center gap-2">Continue</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodingTest;
