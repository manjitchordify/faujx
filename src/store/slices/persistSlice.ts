import { ResumeData } from '@/types/resume.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CapabilityResponse {
  score: number;
  jd_capabilities: string[];
  resume_capabilities: string[];
  matched_capabilities: string[];
  missing_capabilities: string[];
  explanation: string;
  job_title: string | null;
  candidate_name: string;
  analysis_timestamp: string;
  metadata: {
    jd_source: string;
    candidate_email: string;
    current_role: string;
    top_skills: string[];
    total_experience_years: number;
  };
}

interface EvaluationResult {
  overall_score: number;
  max_score: number;
  score_breakdown: {
    functionality: number;
    code_quality: number;
    best_practices: number;
    completeness: number;
    performance: number;
  };
  passed: boolean;
  summary: string;
  strengths: string[];
  improvements: string[];
  code_issues: string[];
  processing_time: number;
  confidence_level: number;
}

interface persistState {
  value: number;
  resumeData: ResumeData | null;
  enginnerRole: string | null;
  capabilityResponse: CapabilityResponse | null;
  evaluationResult: EvaluationResult | null;
}

const initialState: persistState = {
  value: 0,
  resumeData: null,
  enginnerRole: null,
  capabilityResponse: null,
  evaluationResult: null,
};

const persistSlice = createSlice({
  name: 'persist',
  initialState,
  reducers: {
    setUserResumeData: (state, action: PayloadAction<ResumeData>) => {
      state.resumeData = action.payload;
    },
    setEnginnerRole: (state, action: PayloadAction<string>) => {
      state.enginnerRole = action.payload;
    },
    setCapabilityResponse: (
      state,
      action: PayloadAction<CapabilityResponse>
    ) => {
      state.capabilityResponse = action.payload;
    },
    setEvaluationResult: (state, action: PayloadAction<EvaluationResult>) => {
      state.evaluationResult = action.payload;
    },
    clearCapabilityResponse: state => {
      state.capabilityResponse = null;
    },
    clearAllData: state => {
      state.resumeData = null;
      state.enginnerRole = null;
      state.capabilityResponse = null;
      state.evaluationResult = null;
    },
  },
});

export const {
  setUserResumeData,
  setEnginnerRole,
  setCapabilityResponse,
  setEvaluationResult,
  clearCapabilityResponse,
  clearAllData,
} = persistSlice.actions;
export default persistSlice.reducer;
