export interface Candidate {
  id: number;
  role: string;
  skills: string[];
  capabilities: string[];
  salary: string;
  location: string;
  profileImage?: string;
}

export type CustomerTabs =
  | 'Candidates'
  | 'Favourites'
  | 'Shortlisted'
  | 'My Interviews';

export type InterviewCandidate = {
  role: string;
  profileImage: string;
  date: string;
  duration: string;
};
