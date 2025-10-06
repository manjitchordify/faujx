// ----------------------
// Types for coding assignments
// ----------------------
export interface GenerateCodingAssignmentsParams {
  jd_s3_key: string;
  resume_data: ResumeData;
  num_assignments: number;
  difficulty_mix: string;
  languages: string[];
}

export interface GenerateCodingAIMLAssignmentsParams {
  user_capabilities: { technical_skills: string[] };
}

export interface ResumeData {
  contact: Contact;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skills;
  summary: string;
  // score: number;
  category: string;
  // processing_time_ms: number;
  // file_info: null;
  // analysis: null;
}

export interface Contact {
  name: string;
  email: string;
  phone: string;
  linkedin: string | null;
  github: string | null;
  location: string;
  website: string | null;
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  start_date: string;
  end_date: string;
  description: string | null;
  responsibilities: string[];
  key_roles: string[];
  location: string | null;
  employment_type: string | null;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  field: string | null;
  gpa: string;
  location: string | null;
  honors: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  duration: string;
  url: string | null;
  repository: string | null;
  role: string | null;
}

export interface Skills {
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

// StarterCode interface - JavaScript only
export interface StarterCode {
  javascript: string;
}

export interface Assignment {
  assignment_id: number;
  title: string;
  problem_statement: string;
  difficulty: string;
  category: string;
  input_format?: string;
  output_format?: string;
  constraints?: string[];
  examples?: Example[];
  test_cases?: TestCase[];
  starter_code?: StarterCode;
  solution_approach?: string;
  time_complexity?: string;
  space_complexity?: string;
  skills_tested: string[];
  estimated_time_minutes: number;
  hints?: string[];
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: string;
  expected_output: string;
  description: string;
  is_hidden: boolean;
}

export interface DifficultyDistribution {
  easy: number;
  medium: number;
  hard: number;
}

export interface Metadata {
  candidate_name: string;
  candidate_email: string;
  jd_file_size: number;
  jd_last_modified: string;
  candidate_skills: string[];
  current_role: string;
}

export interface CodingAssignmentsResponse {
  total_assignments: number;
  assignments: Assignment[];
  job_title: string;
  jd_source: string;
  generation_timestamp: string;
  metadata: Metadata;
  total_estimated_time_minutes: number;
  difficulty_distribution: DifficultyDistribution;
  skills_coverage: string[];
}

export interface CodingAIMLAssignmentResponse {
  selected_problem: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    required_skills: string[];
    category: string;
    domain: string;
    dataset_size: string;
    problem_type: string;
    tools_required: string[];
    time_limit: number;
    s3_key: string;
    s3_dataset_key: string;
    pdf_url: string;
    dataset_url: string;
    evaluation_metrics: string[];
    tags: string[];
  };
  match_score: number;
  match_reasoning: string;
  alternative_problems: Array<{
    id: string;
    title: string;
    match_score: number;
    pdf_url: string;
  }>;
  metadata: {
    total_problems_analyzed: number;
    selection_timestamp: string;
    difficulty_preference: string;
    category_preference: string | null;
  };
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
