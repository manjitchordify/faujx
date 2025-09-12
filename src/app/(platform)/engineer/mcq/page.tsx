'use client';
import Mcq from '@/components/engineer/mcq/Mcq';
import Loader from '@/components/ui/Loader';
import { getUserMCQSubmission } from '@/services/McqService';
import { RootState } from '@/store/store';
import { QuizSubmission } from '@/types/mcq';
import { getUserFromCookie } from '@/utils/apiHeader';
import { get_jd_s3_key_role } from '@/utils/helper/Helper';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Page = () => {
  const router = useRouter();

  const { resumeData, enginnerRole } = useSelector(
    (store: RootState) => store.persist
  );
  const [mcqSubmissionDetails, setMcqSubmissionDetails] = useState<
    QuizSubmission[]
  >([]);
  const [loader, setLoader] = useState<boolean>(true);

  const getUserMcqSubmission = useCallback(async () => {
    try {
      setLoader(true);
      const user = getUserFromCookie();
      const userId = user!.id;
      console.log('USED ID : ', userId);
      const res = await getUserMCQSubmission(userId as string);
      console.log('MCQ USER SUBMISSION : ', res);
      setMcqSubmissionDetails(res);
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  }, []);

  useEffect(() => {
    getUserMcqSubmission();
  }, [getUserMcqSubmission]);

  useEffect(() => {
    if (mcqSubmissionDetails.length > 0) {
      if (mcqSubmissionDetails[0].score < 60) {
        router.replace(
          `/engineer/feedback?score=${mcqSubmissionDetails[0]?.score}&type=mcq`
        );
      } else {
        router.replace('/engineer/coding/coding-intro');
      }
    }
  }, [mcqSubmissionDetails, router]);

  return (
    <>
      {!resumeData || !enginnerRole ? (
        <div className="w-full min-h-[calc(100vh-14.5625rem)] flex justify-center items-center">
          <div className="flex flex-col gap-2">
            <p className="text-xl font-medium text-gray-700 text-[16px]">
              No {!resumeData ? 'resume data' : 'role'} Available
            </p>
          </div>
        </div>
      ) : loader ? (
        <div className="w-full min-h-[calc(100vh-14.5625rem)] flex justify-center items-center">
          <Loader text="" />
        </div>
      ) : (
        <Mcq
          name="Edwin"
          jd_s3_key={get_jd_s3_key_role(enginnerRole)}
          resume_data={{
            jd_s3_key: get_jd_s3_key_role(enginnerRole),
            resume_data: resumeData!,
            num_questions: 5,
          }}
        />
      )}
    </>
  );
};

export default Page;
