export interface MCQData {
  total_questions: number;
  job_title: string;
  jd_source: string;
  generation_timestamp: string; // ISO datetime string
  questions: McqQuestion[];
  metadata: Metadata;
}

export interface McqQuestion {
  question_id: number;
  question: string;
  choices: Choice[];
  correct_answer: string; // e.g., "A", "B"
  difficulty: 'easy' | 'medium' | 'hard';
  category: string; // e.g., "technical", "practical", "behavioral"
  explanation: string;
}

export interface Choice {
  option: string; // e.g., "A", "B", "C", "D"
  text: string;
}

export interface Metadata {
  candidate_name: string;
  candidate_email: string;
  jd_file_size: number;
  jd_last_modified: string; // ISO datetime string
  top_skills_evaluated: string[];
}

export interface McqUserResponse extends McqQuestion {
  question_id: number;
  selectedResponse: string[];
  attended: 'attended' | 'skipped' | 'notAttended';
  isSelectedCorrect: boolean;
  submitted_answer: string;
}

export interface resumeDataType {
  jd_s3_key: string;
  resume_data: object;
  num_questions: number;
}

// Allowed values for attended status
export type AttendedStatus = 'attended' | 'skipped' | 'notAttended';

// Allowed values for question type
export type QuestionType = 'single_choice' | 'multiple_choice';

// Difficulty levels
export type Difficulty = 'easy' | 'medium' | 'hard';

// A single question
export interface Question {
  choices: Choice[];
  attended: AttendedStatus;
  category: string;
  question: string;
  difficulty: Difficulty;
  explanation: string;
  question_id: number;
  question_type: QuestionType;
  correct_answer: string; // could be "D" or "A,B,D"
  selectedResponse: string[];
  submitted_answer: string;
  isSelectedCorrect: boolean;
}

// The root object
export interface QuizSubmission {
  id: string;
  questions: Question[];
  submittedAt: string; // ISO date string
  score: number;
  correctAnswers: number;
  totalQuestions: number;
}
