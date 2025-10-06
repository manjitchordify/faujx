'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Clock, Code, FileText, Database } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { useRouter } from 'next/navigation';
import {
  CodingAIMLAssignmentResponse,
  ApiError,
} from '@/services/codingAssignmentsTypes';
import { generateCodingAIAssignmentsApi } from '@/services/codingAssignmentsService';
import { setAIMLAssignmentsData as setAIMLAssignmentsDataAction } from '@/store/slices/persistSlice';

const defaultAIMLJDConfig = {
  jd_requirements: {
    role_title: 'Data Scientist',
    required_skills: ['Python', 'Machine Learning', 'Deep Learning'],
    experience_range: '2-5 years',
    role_level: 'Mid-level',
    focus_areas: ['Predictive Modeling', 'Classification'],
  },
  difficulty_preference: 'Medium',
  category_preference: 'string',
  problem_type_preference: 'string',
  domain_preference: 'string',
  exclude_problem_ids: ['string'],
} as const;

const AimlCodingTest = () => {
  const { resumeData, assignmentsData: storedAssignments } = useAppSelector(
    state => ({
      resumeData: state.persist.resumeData,
      assignmentsData: state.persist.assignmentsAIMLData,
    })
  );

  const dispatch = useAppDispatch();
  const router = useRouter();

  const [aimlAssignmentData, setAimlAssignmentData] =
    useState<CodingAIMLAssignmentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAIMLAssignments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');

      const requestData = {
        user_capabilities: {
          technical_skills: (resumeData?.skills as string[]) || [],
        },
        jd_requirements: defaultAIMLJDConfig,
      };

      const response = await generateCodingAIAssignmentsApi(requestData);

      setAimlAssignmentData(response);
      dispatch(setAIMLAssignmentsDataAction(response));
    } catch (err: unknown) {
      console.error(err);
      if (err && typeof err === 'object' && 'message' in err) {
        setError((err as ApiError).message || 'Failed to load assignments.');
      } else if (err instanceof Error) {
        setError(err.message || 'Failed to load assignments.');
      } else {
        setError('Failed to load assignments.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [resumeData, dispatch]);

  useEffect(() => {
    if (!storedAssignments) {
      loadAIMLAssignments();
    } else if (storedAssignments) {
      setAimlAssignmentData(storedAssignments);
      setIsLoading(false);
    }
  }, [storedAssignments, isLoading, loadAIMLAssignments]);

  const handleContinue = () => {
    router.push('/engineer/coding/coding-test');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1F514C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Generating AI/ML Assignment...
          </h2>
          <p className="text-gray-600">
            Please wait while we prepare personalized assignments for you...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadAIMLAssignments}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!aimlAssignmentData) return null;

  const { selected_problem } = aimlAssignmentData;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mb-4">
            AIML Assignment
          </h1>
          {selected_problem && (
            <div className="flex justify-center gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <Code className="w-4 h-4" />
                Assignment
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {selected_problem.time_limit} mins
              </span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            {selected_problem.title}
          </h2>
          <p className="text-gray-700 mb-4 text-sm leading-relaxed">
            {selected_problem.description}
          </p>

          <div className="flex flex-wrap gap-3">
            {selected_problem.pdf_url && (
              <a
                href={selected_problem.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700"
              >
                <FileText className="w-4 h-4" />
                View Assignment PDF
              </a>
            )}
            {selected_problem.dataset_url && (
              <a
                href={selected_problem.dataset_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700"
              >
                <Database className="w-4 h-4" />
                Download Dataset
              </a>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            className="px-16 py-3 rounded-[20px] font-medium text-white bg-[#1F514C] hover:bg-[#17403c]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default AimlCodingTest;
