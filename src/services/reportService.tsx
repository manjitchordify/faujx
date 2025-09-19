import { getAuthAxiosConfig } from '@/utils/apiHeader';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { ApiError } from '@/types/resume.types';

// ----------------------
// Profile submission types
// ----------------------
export interface ProfileSubmissionData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  location?: string;
  currentDesignation?: string;
  currentCompany?: string;
  expectedSalary?: number | null;
  skills?: string[];
  experienceYears?: number | null;
  preferredLocations?: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  summary?: string;
  category?: string;
  websiteUrl?: string;
  experience?: Array<{
    title: string;
    company: string;
    start_date: string;
    end_date: string;
    description: string;
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    start_date: string;
    end_date: string;
    grade: string;
  }>;
  projects?: Array<{
    title: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
  resumeUrl?: string;
  resumeKey?: string;
  resumeParseScore?: number;
  vettingScore?: number;
  resumeParsedAt?: string;
  resumeParseErrors?: string[];
  watchedVideos?: Array<{
    title: string;
    description: string;
    link: string;
    kind: string;
  }>;
  isWatched?: number;
  isVetted?: number;
}

export interface ProfileSubmissionResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

// ----------------------
// Capability Matching Types
// ----------------------

// Define the resume data structure expected by the capability matching API
export interface ResumeDataForMatching {
  personal_info?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  experience?: Array<{
    title: string;
    company: string;
    duration?: string;
    start_date?: string;
    end_date?: string;
    description?: string;
    responsibilities?: string[];
    key_roles?: string[];
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    field?: string;
    year?: string;
    gpa?: string;
  }>;
  skills?: {
    technical?: string[];
    soft?: string[];
    tools?: string[];
    frameworks?: string[];
    languages?: string[];
    certifications?: string[];
  };
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    repository?: string;
    role?: string;
  }>;
  summary?: string;
  total_experience_years?: number;
  current_role?: string;
  [key: string]: unknown; // Allow for additional fields
}

export interface CapabilityMatchingRequest {
  jd_s3_key: string;
  resume_data: ResumeDataForMatching;
}

export interface CapabilityMatchingResponse {
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

// ----------------------
// Submit Capabilities Types
// ----------------------
// Reusing CapabilityMatchingResponse since the structure is identical
export type SubmitCapabilitiesData = CapabilityMatchingResponse;

export interface SubmitCapabilitiesResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

interface ProfileStages {
  lastStage?: string;
  lastStatus?: string;
}
// ----------------------
// Report API Response Types
// ----------------------
export interface ReportExecutiveSummary {
  profileStages: ProfileStages;
  candidateName: string;
  positionApplied: string;
  department: string;
  reportDate: string;
  evaluatedBy: string;
  overallRecommendation: string;
}

export interface ReportPersonalInfo {
  fullName: string;
  location: string | null;
  experience: string;
  currentRole: string;
}

export interface ReportEducation {
  gpa: string | null;
  year: string;
  field: string | null;
  degree: string;
  honors: string[];
  location: string | null;
  institution: string | null;
}

export interface ReportExperience {
  title: string;
  company: string;
  end_date: string;
  start_date: string;
  description: string;
}

export interface ResumeAnalysis {
  personalInfo: ReportPersonalInfo;
  education: ReportEducation[];
  experience: ReportExperience[];
  skills: string[];
  resumeQuality: number;
}

export interface MCQTestOverview {
  totalQuestions: number;
  attempted: number;
  correct: number;
  score: string;
}

export interface CategoryWisePerformance {
  category: string;
  accuracy: string;
}

export interface StrengthsAndWeaknesses {
  strengths: string[];
  weaknesses: string[];
}

export interface TimeManagement {
  avgTimePerQuestion: string;
  observations: string;
}

export interface DifficultyAnalysis {
  easy: string;
  medium: string;
  hard: string;
}

export interface MCQAnalysis {
  testOverview: MCQTestOverview;
  categoryWisePerformance: CategoryWisePerformance[];
  strengthsAndWeaknesses: StrengthsAndWeaknesses;
  timeManagement: TimeManagement;
  difficultyAnalysis: DifficultyAnalysis;
}

export interface CompetencyScore {
  name: string;
  score: number;
}

export interface RoleSpecificSkill {
  name: string;
  weight: string;
  score: number;
}

export interface CapabilityAnalysis {
  coreCompetencies: CompetencyScore[];
  roleSpecificSkills: RoleSpecificSkill[];
  softSkills: CompetencyScore[];
  domainKnowledge: CompetencyScore[];
}

// ----------------------
// Coding Analysis Types
// ----------------------
export interface TestCaseResult {
  testCase: string;
  passed: boolean;
  expectedOutput?: string;
  actualOutput?: string;
  executionTime?: number;
  memoryUsed?: number;
}

export interface TestCasesPerformance {
  total: number;
  passed: number;
  failed: number;
  successRate: number;
  results?: TestCaseResult[];
  overallSuccess?: boolean;
}

export interface AdditionalNotes {
  codeStyle?: string;
  bestPractices?: string;
  optimizations?: string[];
  improvements?: string[];
  generalObservations?: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
}

export interface CodingAnalysis {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  // Optional properties that might be used in the frontend but not always present in API response
  problemSolving?: string;
  codeQuality?: string;
  efficiency?: string;
  languages?: string[];
  testCasesPerformance?: TestCasesPerformance;
  additionalNotes?: AdditionalNotes;
}

export interface Evaluation {
  technicalScore: number;
  culturalFitScore: number;
  communicationScore: number;
  summary: string;
  totalWeightedScore: number;
  recommendation: string;
  nextSteps: string[];
}

export interface InterviewNotes {
  interviewerFeedback: string[];
  keyHighlights: string[];
  concerns: string[];
  overallRating: number;
  notes: string[];
}
export interface scheduledSlotdata {
  startTime: string;
  endTime: string;
}

export interface InterviewData {
  id: string;
  candidateId: string;
  customerId: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  scheduledSlot?: scheduledSlotdata;
}

// Update your interface to match the actual data structure
export interface CandidateReportResponse {
  interviews: Array<{
    id: string;
    scheduledSlot: {
      startTime: string;
      endTime: string;
      timezone: string;
    };
    interviewType: string;
    status: string;
    notes: string;
    meetingLink: string;
    createdAt: string;
    interviewers: Array<{
      id: string;
      name: string;
      designation: string;
      department: string;
    }>;
  }>;
  name: string;
  executiveSummary: ReportExecutiveSummary;
  resumeAnalysis: ResumeAnalysis;
  mcq: MCQAnalysis;
  capability: CapabilityAnalysis;
  coding: CodingAnalysis;
  evaluation: Evaluation;
  interviewNotes: InterviewNotes;
}
// ----------------------
// Common error handling
// ----------------------
function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    if (axiosError.response) {
      throw {
        status: axiosError.response.status,
        message: axiosError.response.data?.message || axiosError.message,
        data: axiosError.response.data,
      } as ApiError;
    } else if (axiosError.request) {
      throw {
        status: 0,
        message: 'Network error',
        code: 'NETWORK_ERROR',
      } as ApiError;
    } else {
      throw {
        status: 0,
        message: axiosError.message || 'Request setup error',
        code: 'REQUEST_ERROR',
      } as ApiError;
    }
  }
  throw {
    status: 0,
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  } as ApiError;
}

export async function getReportApi(
  candidateId: string
): Promise<CandidateReportResponse> {
  try {
    const config = getAuthAxiosConfig();
    const response: AxiosResponse<CandidateReportResponse> = await axios.get(
      `reports/candidate/${candidateId}`,
      config
    );

    return response.data;

    // Return the actual API response data
    // return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}
