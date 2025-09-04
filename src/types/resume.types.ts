export interface ExperienceItem {
  title: string;
  company: string;
  start_date: string;
  end_date: string;
  description: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  start_date: string;
  end_date: string;
  grade: string;
}

export interface ProjectItem {
  title: string;
  description: string;
  technologies: string[];
  url?: string;
}

// Parsed data structures from API
export interface ParsedExperience {
  title: string;
  company: string;
  duration: string;
  end_date: string;
  location: string | null;
  key_roles: string[];
  start_date: string;
  description: string | null;
  employment_type: string | null;
  responsibilities: string[];
}

export interface ParsedEducation {
  gpa: string;
  year: string;
  field: string | null;
  degree: string;
  honors: string[];
  location: string | null;
  institution: string;
}

export interface ParsedProject {
  name: string;
  description: string;
  technologies: string[];
  duration: string | null;
  url: string | null;
  repository: string | null;
  role: string | null;
}

export interface ParsedSkills {
  technical: string[];
  soft: string[];
  languages: string[];
  certifications: string[];
  tools: string[];
  frameworks: string[];
  area_of_expertise: string[];
  project_management: string[];
  specializations: string[];
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string | null;
  phone: string;
  profilePic: string | null;
  profilePicKey: string | null;
  profileVideoKey: string | null;
  profileVideo: string | null;
  dateOfBirth: string | null;
  location: string | null;
  country: string | null;
  userType: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  resetToken: string | null;
  resetTokenExpiry: string | null;
  googleId: string | null;
  verificationToken: string | null;
  verificationTokenExpiry: string | null;
  isSubscribed: boolean;
  subscribedAt: string | null;
}

// Add proper type definitions for role and interviews
export interface Role {
  id: string;
  title: string;
  department?: string;
  level?: string;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  location?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  interviewerId: string;
  roleId: string;
  scheduledAt: string;
  duration: number; // in minutes
  type: 'phone' | 'video' | 'in-person' | 'technical' | 'behavioral';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  meetingLink?: string;
  notes?: string;
  rating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeData {
  id: string;
  userId: string;
  preferredMonthlySalary?: string;
  currencyType?: string;
  workMode?: string[];
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  location?: string;
  experienceYears?: number;
  currentDesignation?: string;
  currentCompany?: string;
  expectedSalary?: number;
  preferredLocations?: string[];
  skills?: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  websiteUrl?: string | null;
  summary?: string;
  category?: string;
  experience?: ExperienceItem[];
  education?: EducationItem[];
  projects?: ProjectItem[];
  resumeUrl?: string;
  resumeKey?: string;
  resumeParseScore?: number;
  vettingScore?: number;
  vettingStatus?: string;
  roleTitle?: string;
  joiningPeriod?: string;
  isWillingToRelocate?: boolean;
  isOpenToOtherLocations?: boolean;
  relocationConfirmed?: boolean;
  isPreliminaryVideoCompleted?: boolean;
  resumeParsedAt?: string;
  resumeParseErrors?: string[];
  missingFields?: string[];
  createdAt?: string;
  updatedAt?: string;
  codingTestLink?: string | null;
  isWatched?: number;
  phase1Completed?: boolean;
  email?: string;
  // Parsed data from API
  parsedEducation?: ParsedEducation[];
  parsedExperience?: ParsedExperience[];
  parsedProjects?: ParsedProject[];
  parsedSkills?: ParsedSkills;

  // User data
  user?: User;
  role?: Role; // Changed from any
  interviews?: Interview[]; // Changed from any[]
}

// ----------------------
// API Response Types
// ----------------------
export interface ResumeUploadResponse {
  message: string;
  data: ResumeData;
  missingFields: string[];
}

export interface ResumeGetResponse extends ResumeData {
  message?: string;
}

export interface ResumeDeleteResponse {
  success: boolean;
  message: string;
}

// ----------------------
// Component Props Types
// ----------------------
export interface PDFProcessingProps {
  uploadedFile: File;
  onComplete: (resumeData: ResumeData) => void;
  onReupload: () => void;
}

// ----------------------
// Error Handling Types
// ----------------------
export interface ProcessingError {
  field: string;
  message: string;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  data?: unknown; // Changed from any
}

// ----------------------
// Form State Types
// ----------------------
export interface FormValidationError {
  field: string;
  message: string;
}

export interface UploadState {
  isUploading: boolean;
  progress: number;
  currentStep: string;
  error?: string;
}

// ----------------------
// Profile Submission Types
// ----------------------
export interface ProfileSubmissionData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  location?: string;
  currentDesignation?: string;
  currentCompany?: string;
  expectedSalary?: number;
  skills?: string[];
  experienceYears?: number;
  preferredLocations?: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  websiteUrl?: string;
  summary?: string;
  category?: string;
  experience?: ExperienceItem[];
  education?: EducationItem[];
  projects?: ProjectItem[];

  // Additional fields that might be expected by backend
  resumeUrl?: string;
  resumeKey?: string;
  resumeParseScore?: number;
  vettingScore?: number;
  resumeParsedAt?: string;
  resumeParseErrors?: string[];
  watchedVideos?: WatchedVideo[];
  isWatched?: number;
}

// Type for the actual API submission (only includes fields with values)
export type ProfileSubmissionRequest = Partial<ProfileSubmissionData>;

export interface WatchedVideo {
  title: string;
  description: string;
  link: string;
  kind: string;
}
