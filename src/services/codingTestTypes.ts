// ----------------------
// Types for coding test submission
// ----------------------
export interface SubmitCodingTestParams {
  link: string;
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
