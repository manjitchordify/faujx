export type CustomerTabs =
  | 'Candidates'
  | 'Favourites'
  | 'Shortlisted'
  | 'Scheduled Interviews'
  | 'Interviewed'
  | 'Hired';

export type InterviewCandidate = {
  candidate_id: string;
  id: string;
  role: string;
  profileImage: string;
  date: string;
  duration: string;
};

export interface CandidateUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePic: string | null;
}

export interface CandidateAnalysis {
  id: string;
  score: number;
  matchPercentage: number;
  capabilityGapCount: number;
  hasStrongMatch: boolean;
  matchedCapabilities: string[];
  missingCapabilities: string[];
  explanation: string;
  jobTitle: string | null;
  analysisTimestamp: string; // ISO date string
  metadata: {
    jd_source: string;
    top_skills: string[];
    current_role: string;
    candidate_email: string;
    total_experience_years: number;
  };
}

export interface ParsedSkills {
  soft?: string[];
  tools?: string[];
  languages?: string[];
  technical?: string[];
  frameworks?: string[];
  certifications?: string[];
  specializations?: string[];
  area_of_expertise?: string[];
  project_management?: string[];
}

export interface Candidate {
  preferredMonthlySalary: string;
  id: string;
  user: CandidateUser;
  capabilities: CandidateAnalysis[];
  roleTitle: string | null;
  summary: string | null;
  currentDesignation: string;
  currentCompany: string;
  expectedSalary: number;
  experienceYears: number;
  skills: string[];
  parsedSkills?: ParsedSkills; // Add the parsedSkills property
  currencyType: string | null;
  workMode: string[];
  preferredLocations: string[];
  location: string | null;
}

export interface PublishedCandidateType {
  id: string;
  status: 'published' | 'draft' | 'archived'; // extend if needed
  createdAt: string; // ISO string
  candidate: Candidate;
}
