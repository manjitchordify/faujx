import { InterviewSlot } from '@/types/interview';
import { getAuthAxiosConfig } from '@/utils/apiHeader';
import axios, { AxiosError } from 'axios';

function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    if (axiosError.response) {
      throw {
        status: axiosError.response.status,
        message: axiosError.response.data?.message || axiosError.message,
        data: axiosError.response.data,
      };
    } else if (axiosError.request) {
      throw {
        status: 0,
        message: 'Network error',
        code: 'NETWORK_ERROR',
      };
    } else {
      throw {
        status: 0,
        message: axiosError.message || 'Request setup error',
        code: 'REQUEST_ERROR',
      };
    }
  }
  throw {
    status: 0,
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
}

export const submitInterviewSlots = async (payload: InterviewSlot[]) => {
  try {
    const config = getAuthAxiosConfig();
    const res = await axios.post(
      `/candidates/submit-interview-slots`,
      {
        slots: payload,
        interviewType: 'technical',
        notes: 'Prefer technical interview focused on React and Node.js',
      },
      config
    );
    return res.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

export const submitInterviewCandidateFeedback = async (payload: {
  feedback: string;
  interviewId: string;
}) => {
  try {
    const config = getAuthAxiosConfig();
    const res = await axios.post(
      `/candidates/candidate-feedback?interviewId=${payload.interviewId}`,
      { feedback: payload.feedback },
      config
    );
    return res.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

export const getAllInterviewsCandidate = async () => {
  try {
    const config = getAuthAxiosConfig();
    const res = await axios.get(`/candidates/interviews`, config);
    return res.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};
