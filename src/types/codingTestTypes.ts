// ----------------------
// Types for coding test submission
// ----------------------
export interface SubmitCodingTestParams {
  question: string;
  answerFiles: Record<string, string>;
  url: string;
  evaluationResult: CodingTestAISubmissionResponse;
  totalScore: number;
}

export interface FileData {
  filename: string;
  code: string;
}

export interface SubmitCodingTestParamsForAI {
  files: Record<string, string>;
  problem_statement: string;
  assessment_type: string;
  max_score: number;
}

export interface CodingTestSubmissionData {
  id: string;
  userId: string;
  link: string;
  submittedAt: string;
  status: string;
  score?: number;
  feedback?: string;
  // Add other fields as per your API response
}

export interface CodingTestSubmissionResponse {
  success: boolean;
  data: CodingTestSubmissionData;
  message?: string;
  overall_score?: number;
  passed: boolean;
  EvaluationResult: Record<string, string>;
}

export interface CodingTestAISubmissionResponse {
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

export interface CodingTestSubmissionData {
  [key: string]: unknown;
}

export interface ScoreBreakdown {
  functionality: number;
  code_quality: number;
  best_practices: number;
  completeness: number;
  performance: number;
}

// ----------------------
// Common error interface
// ----------------------
export interface ApiError {
  status: number;
  message: string;
  data?: unknown;
  code?: string;
}
