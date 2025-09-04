'use client';

import McqAssessment from '@/components/engineer/mcq/McqAssessment';
import Button from '@/components/ui/Button';
import { generateMCQs } from '@/services/McqService';
import { MCQData, McqQuestion, resumeDataType } from '@/types/mcq';
import { useCallback, useEffect, useState, useRef } from 'react';
import { ClipLoader } from 'react-spinners';

interface mcqProps {
  name: string;
  jd_s3_key: string;
  resume_data: resumeDataType;
}

interface CacheEntry {
  data: MCQData;
  expiryTime: number;
}

const CACHE_DURATION = 30 * 60 * 1000;
const BATCH_DELAY = 2000;

const Mcq = ({ jd_s3_key = '', resume_data }: mcqProps) => {
  const instructions = [
    'Read each question carefully before answering',
    'Select the best possible answer from the given options',
    'Keep an eye on the timer at the top-right corner',
    'Once submitted, you cannot change your answers',
  ];

  const [mcqData, setMcqData] = useState<MCQData | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());
  const sessionIdRef = useRef<string>('');
  const isGeneratingRef = useRef(false);

  // Generate unique cache key - memoized to prevent unnecessary recalculations
  const cacheKey = useRef<string>('');
  useEffect(() => {
    cacheKey.current = `${jd_s3_key}_${JSON.stringify(resume_data).slice(0, 100)}`;
  }, [jd_s3_key, resume_data]);

  // Cache management
  const getCachedData = useCallback(() => {
    const cached = cacheRef.current.get(cacheKey.current);
    if (cached && Date.now() < cached.expiryTime) {
      return cached.data;
    }
    if (cached) cacheRef.current.delete(cacheKey.current);
    return null;
  }, []);

  const setCachedData = useCallback((data: MCQData) => {
    cacheRef.current.set(cacheKey.current, {
      data,
      expiryTime: Date.now() + CACHE_DURATION,
    });
  }, []);

  // Generate questions with sequential API calls (2 calls of 5 questions each)
  const getMcqData = useCallback(async () => {
    if (isGeneratingRef.current) {
      console.log('MCQ generation already in progress, skipping...');
      return;
    }

    try {
      isGeneratingRef.current = true;
      setError('');
      setLoading(true);

      // Check cache first
      const cachedData = getCachedData();
      if (cachedData) {
        setMcqData(cachedData);
        setLoading(false);
        return;
      }

      // Generate session ID ONCE for both calls to prevent duplicates
      sessionIdRef.current = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log(
        'Starting MCQ generation with session ID:',
        sessionIdRef.current
      );

      const allQuestions: McqQuestion[] = [];
      const baseResponse: MCQData = await generateMCQs({
        jd_s3_key,
        resume_data,
        num_questions: 5,
        session_id: sessionIdRef.current,
      });

      allQuestions.push(...baseResponse.questions);

      // Show first 5 questions immediately (user can start)
      const partialData: MCQData = {
        ...baseResponse,
        questions: baseResponse.questions.map(
          (item: McqQuestion, index: number) => ({
            ...item,
            question_id: index + 1,
          })
        ),
        total_questions: baseResponse.questions.length,
      };
      setMcqData(partialData);
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));

      const secondBatchResponse: MCQData = await generateMCQs({
        jd_s3_key,
        resume_data,
        num_questions: 5,
        session_id: sessionIdRef.current,
      });

      allQuestions.push(...secondBatchResponse.questions);

      const finalQuestions = allQuestions.map((item, index) => ({
        ...item,
        question_id: index + 1,
      }));

      const completeData: MCQData = {
        ...baseResponse,
        questions: finalQuestions,
        total_questions: finalQuestions.length,
      };

      setMcqData(completeData);
      setCachedData(completeData);
    } catch (err: unknown) {
      console.error('MCQ Generation Error:', err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to generate questions. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
      isGeneratingRef.current = false;
    }
  }, [jd_s3_key, resume_data, getCachedData, setCachedData]);

  // Only call getMcqData once when component mounts or when essential props change
  useEffect(() => {
    if (!mcqData && !loading && !isGeneratingRef.current) {
      getMcqData();
    }
  }, [mcqData, loading, getMcqData]);

  // Handle prop changes separately
  useEffect(() => {
    setMcqData(undefined);
    setError('');

    const timeoutId = setTimeout(() => {
      if (!isGeneratingRef.current) {
        getMcqData();
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [jd_s3_key, resume_data, getMcqData]);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <ClipLoader
            color={'#1F514C'}
            loading={true}
            size={60}
            aria-label="Generating questions"
          />
          <p className="text-sm text-gray-600">
            Generating personalized MCQ questions...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center items-center">
        <div className="flex flex-col items-center gap-4 max-w-md text-center p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Generation Failed
            </h3>
            <p className="text-sm text-red-600 mb-4 bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </p>
          </div>
          <Button
            text="Try Again"
            onClick={() => {
              isGeneratingRef.current = false;
              getMcqData();
            }}
            className="bg-[#1F514C] hover:bg-[#164239] px-8 py-3 rounded-2xl transition-colors"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col lg:flex-row pt-4 md:pt-6 lg:pt-[35px] pb-4 md:pb-6 lg:pb-8">
      <aside className="hidden md:flex md:w-full lg:w-1/5 flex-col px-4 md:px-6 lg:px-10 relative mb-4 lg:mb-0">
        <InstructionPanel instructions={instructions} />
        <div className="hidden lg:block absolute top-0 right-0 w-[2px] h-[100%] bg-[#D6D6D6]" />
      </aside>

      <main className="flex-1 flex flex-col min-h-0">
        {mcqData ? (
          <div className="flex-1 flex flex-col min-h-0 px-4 md:px-6 lg:pl-24 lg:pr-0">
            <div className="flex-1 flex flex-col min-h-0">
              <McqAssessment mcqData={mcqData} />
            </div>
          </div>
        ) : (
          <EmptyState
            onGenerate={() => {
              isGeneratingRef.current = false;
              getMcqData();
            }}
          />
        )}
      </main>

      <MobileInstructions instructions={instructions} />
    </div>
  );
};

const InstructionPanel = ({ instructions }: { instructions: string[] }) => (
  <div className="mt-4 flex flex-col gap-2 bg-[#F9FAFB] p-3 md:p-4 lg:p-2 rounded-lg lg:rounded-none w-full lg:w-auto">
    <h2 className="text-sm md:text-base font-medium mb-2">Instructions</h2>
    <ul className="flex flex-col gap-1 md:gap-2 ml-4" role="list">
      {instructions.map((instruction, index) => (
        <li key={index} className="text-xs md:text-sm list-disc text-gray-700">
          {instruction}
        </li>
      ))}
    </ul>
  </div>
);

const EmptyState = ({ onGenerate }: { onGenerate: () => void }) => (
  <div className="flex-1 flex justify-center items-center min-h-[400px]">
    <div className="flex flex-col items-center gap-4 text-center p-6">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
        <svg
          className="w-8 h-8 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Ready to Start
        </h3>
        <p className="text-gray-600 mb-4">
          Generate your personalized assessment questions
        </p>
      </div>
      <Button
        text="Generate Assessment"
        onClick={onGenerate}
        className="bg-[#1F514C] hover:bg-[#164239] px-8 py-3 rounded-2xl transition-colors"
      />
    </div>
  </div>
);

const MobileInstructions = ({ instructions }: { instructions: string[] }) => (
  <div className="md:hidden w-full px-4 pb-4 mt-auto">
    <details className="bg-[#F9FAFB] border border-gray-200 rounded-lg overflow-hidden">
      <summary className="font-medium text-sm cursor-pointer p-4 hover:bg-gray-50 transition-colors select-none">
        <span>View Instructions</span>
      </summary>
      <div className="px-4 pb-4 pt-2 border-t border-gray-100">
        <ul className="ml-4 space-y-2" role="list">
          {instructions.map((instruction, index) => (
            <li key={index} className="text-xs list-disc text-gray-700">
              {instruction}
            </li>
          ))}
        </ul>
      </div>
    </details>
  </div>
);

export default Mcq;
