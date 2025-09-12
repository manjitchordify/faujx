import Button from '@/components/ui/Button';
import { submitMCQs } from '@/services/McqService';
import { MCQData, McqQuestion, McqUserResponse } from '@/types/mcq';
import { showToast } from '@/utils/toast/Toast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import McqCard from './McqCard';
import CountdownStopwatchExample from './Timer';
import { normalizeError } from '@/types/error';
import { PASS_SCORE } from '@/constants/pass_score';
import { useAppSelector } from '@/store/store';
import { completeMCQStage, getProfileStages } from '@/services/engineerService';

interface McqAssessmentProps {
  mcqData: MCQData;
}
type action = 'prev' | 'next' | 'skip';

const McqAssessment = ({ mcqData }: McqAssessmentProps) => {
  const [selectedQuestion, setSelectedQuestion] = useState<McqQuestion>(
    mcqData.questions[0]
  );
  const [submitLoader, setSubmitLoader] = useState(false);
  const totalNumQuestions = mcqData.questions.length;
  const [userResponseList, setUserResponseList] = useState<McqUserResponse[]>(
    []
  );
  const router = useRouter();
  const { enginnerRole } = useAppSelector(state => state.persist);

  const handleSelection = (
    selected: string[],
    attended: McqUserResponse['attended'],
    isCorrect: boolean,
    submitted_answer: string
  ) => {
    setUserResponseList(prev => {
      const modifiedPrev: McqUserResponse[] = prev.map(item => {
        if (item.question_id === selectedQuestion.question_id) {
          return {
            ...item,
            selectedResponse: selected,
            submitted_answer: submitted_answer,
            attended: attended,
            isSelectedCorrect: isCorrect,
          };
        }
        return { ...item };
      });
      return modifiedPrev;
    });
  };

  const handleChangeQuestion = (action: action) => {
    const questionNum = Number(selectedQuestion.question_id) - 1;
    if (action == 'next' && questionNum + 1 != totalNumQuestions) {
      setSelectedQuestion(mcqData.questions[questionNum + 1]);
      return;
    }
    if (action == 'prev') {
      setSelectedQuestion(mcqData.questions[questionNum - 1]);
    }
    if (action == 'skip' && questionNum + 1 != totalNumQuestions) {
      setSelectedQuestion(mcqData.questions[questionNum + 1]);
      handleSelection([], 'skipped', false, '');
      return;
    }
  };

  //   FINISH
  const handleFinish = async () => {
    console.log('USER RESPONSE LIST:', userResponseList);

    const goNext = (score?: number) => {
      if (typeof score === 'number' && score < PASS_SCORE) {
        return router.replace(`/engineer/feedback?score=${score}&type=mcq`);
      }

      if (['devops', 'aiml'].some(role => enginnerRole?.includes(role))) {
        return router.replace('/engineer/interview/select-slot');
      }

      return router.replace('/engineer/coding/coding-intro');
    };

    try {
      setSubmitLoader(true);
      const data = await submitMCQs(userResponseList);
      console.log('SUBMIT MCQ API:', data);

      // Update stage tracking after successful API call
      const passed =
        typeof data?.score === 'number' ? data.score >= PASS_SCORE : true;
      await completeMCQStage(data, passed); // Changed: pass data instead of userResponseList

      return goNext(data?.score);
    } catch (error: unknown) {
      const normalized = normalizeError(error);

      if (normalized.message === 'You have already submitted your answers.') {
        showToast(normalized.message, 'warning');
        try {
          const stages = await getProfileStages();
          if (stages?.lastStage === 'mcq' && stages?.lastStatus === 'passed') {
            return goNext();
          } else {
            return goNext();
          }
        } catch (stageError) {
          console.warn('Failed to check profile stages:', stageError);
          return goNext();
        }
      }

      showToast('Try Again', 'error');

      // Mark MCQ as failed on error
      try {
        await completeMCQStage(null, false); // Changed: pass null for failed case
      } catch (stageError) {
        console.warn('Failed to update MCQ stage on error:', stageError);
      }
    } finally {
      setSubmitLoader(false);
    }
  };
  useEffect(() => {
    const updatedUserResponseList: McqUserResponse[] = mcqData.questions.map(
      item => {
        return {
          ...item,
          selectedResponse: [],
          attended: 'notAttended',
          isSelectedCorrect: false,
          submitted_answer: '',
        };
      }
    );
    setUserResponseList(updatedUserResponseList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full pr-0 lg:pr-50">
      {/* Topic Header, Timer, End Test Button */}
      <div className="w-full mb-6 md:mb-8 lg:mb-[40px] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div className="w-full md:w-auto">
          <p className="text-sm md:text-base lg:text-xl font-semibold leading-tight">
            MCQ Assessment – {mcqData.job_title} (Level 1)
          </p>
          <p className="text-xs md:text-sm text-[#9b9b9b] mt-1">
            Question {selectedQuestion.question_id} of {mcqData.total_questions}
          </p>
        </div>

        <div className="flex flex-row gap-3 md:gap-4 lg:gap-6 items-center w-full md:w-auto justify-between md:justify-end">
          <div className="flex flex-row items-center gap-1">
            <Image
              src="/images/mcq/timer.png"
              alt="Timer"
              height={30}
              width={30}
              className="h-5 md:h-6 lg:h-7 w-auto"
              priority
            />
            <CountdownStopwatchExample
              initialSeconds={mcqData.total_questions * 60}
              className="text-xs md:text-sm font-medium"
              onComplete={handleFinish}
            />
          </div>

          <button
            onClick={handleFinish}
            className="bg-red-600 hover:bg-red-700 transition-colors px-3 py-2 md:px-4 md:py-2 text-white rounded-lg text-xs md:text-sm font-medium"
          >
            End Test
          </button>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="w-full mb-6 md:mb-8 lg:mb-[42px] h-2 md:h-[7px] rounded-[5px] shadow-[0px_2px_8px_0px_#00000020] md:shadow-[0px_4px_16.3px_0px_#00000040] bg-gray-200">
        <div
          style={{
            width: `${(selectedQuestion.question_id / totalNumQuestions) * 100}%`,
          }}
          className="h-full rounded-[5px] bg-gradient-to-r from-[#1BCC9D] to-[#0D664E] transition-all duration-300"
        ></div>
      </div>

      {/* Questions Options Box */}
      <div className="w-full mb-6">
        <McqCard
          selectedQuestion={selectedQuestion}
          handleSelection={handleSelection}
          userResponseList={userResponseList}
          isMultiple={
            selectedQuestion.correct_answer.split(',').length > 1 ? true : false
          }
        />
      </div>

      {/* NAVIGATION BUTTONS */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 pb-4">
        <button
          onClick={() => {
            handleChangeQuestion('prev');
          }}
          disabled={Number(selectedQuestion.question_id) == 1}
          className="w-full sm:w-auto order-2 sm:order-1 px-6 md:px-8 py-2 md:py-3 bg-[#D9D9D9] hover:bg-[#CCCCCC] transition-colors rounded-[5px] text-sm md:text-base font-medium disabled:bg-[#878787] invisible"
        >
          Previous
        </button>

        <div className="w-full sm:w-auto order-1 sm:order-2 flex flex-row justify-center sm:justify-end items-center gap-3">
          <button
            onClick={() => {
              handleChangeQuestion('skip');
            }}
            className="flex-1 sm:flex-none px-4 md:px-6 py-2 md:py-3 bg-[#63A9FF] hover:bg-[#4A8EE8] transition-colors rounded-[5px] text-white text-sm md:text-base font-medium"
          >
            Skip
          </button>
          {Number(selectedQuestion.question_id) === totalNumQuestions ? (
            <Button
              text="Finish"
              onClick={handleFinish}
              isLoading={submitLoader}
              className="flex-1 sm:flex-none px-4 md:px-6 py-2 md:py-3 bg-[#41873F] hover:bg-[#2E6B2C] transition-colors rounded-[5px] text-white text-sm md:text-base font-medium"
            />
          ) : (
            <Button
              text="Next"
              onClick={() => {
                handleChangeQuestion('next');
              }}
              className="flex-1 sm:flex-none px-4 md:px-6 py-2 md:py-3 bg-[#41873F] hover:bg-[#2E6B2C] transition-colors rounded-[5px] text-white text-sm md:text-base font-medium"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default McqAssessment;
