'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Clock, Code, Zap } from 'lucide-react';
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

  const jd_s3_key = get_jd_s3_key_role(enginnerRole ?? '');

  const sampleRequestData = useMemo(() => {
    if (!resumeData) return null;

    const requestData: GenerateCodingAssignmentsParams = {
      jd_s3_key,
      resume_data: resumeData,
      num_assignments: 1,
      difficulty_mix: 'balanced',
      languages: ['python', 'javascript', 'java'],
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
            <div className="md:grid-cols-1 lg:grid-cols-2">
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

        {/* Add Link Button */}
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
