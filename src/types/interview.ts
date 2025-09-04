export interface InterviewSlot {
  startTime: string; // ISO Date string e.g. "2025-08-25T10:00:00Z"
  endTime: string; // ISO Date string
  timezone: string; // e.g. "UTC"
}

export interface Interview {
  candidateId: string;
  interviewerId: string;
  requestedSlots: InterviewSlot[];
  scheduledSlot: InterviewSlot;
  interviewType: string; // e.g. "technical"
  status: string; // e.g. "scheduled"
  notes: string | null;
  durationMinutes: number;
  meetingLink: string | null;
  meetingId: string | null;
  feedback: string | null;
  rating: number | null;
  rejectionReason: string | null;
  scheduledAt: string | null; // ISO Date string | null
  completedAt: string | null;
  cancelledAt: string | null;
  id: string;
  availableAlternativeSlots: InterviewSlot[];
  resumeShared: boolean;
  calendarInviteSent: boolean;
  reminderSent: boolean;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

export interface InterviewData {
  candidateId: string;
  userId: string;
  interview: Interview;
  scheduledSlot: InterviewSlot;
  status: string;
}

export interface SuccessInterviewScheduleResponse {
  success: true;
  message: string;
  data: InterviewData;
}

export interface FailedInterviewResponse {
  success: false;
  message: string;
  data: {
    candidateId: string;
    userId: string;
    requestedSlots: InterviewSlot[];
    alternativeSlots: InterviewSlot[];
    availableInterviewers: []; // if interviewer structure is known, replace `any` with proper type
  };
}

export type InterviewResponse =
  | SuccessInterviewScheduleResponse
  | FailedInterviewResponse;

// ------------- FETCL USER INTERVIEW TYPES
// Common slot structure
interface TimeSlot {
  startTime: string; // ISO string
  endTime: string; // ISO string
  timezone: string;
}

// Interviewer availability slot
interface AvailabilitySlot {
  day: string; // e.g., "monday"
  startTime: string; // e.g., "10:00"
  endTime: string; // e.g., "20:00"
  timezone: string;
}

// User info (interviewer’s user account)
interface User {
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
  dateOfBirth: string; // ISO date string
  location: string;
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

// Interviewer details
interface Interviewer {
  id: string;
  userId: string;
  designation: string;
  department: string;
  seniorityLevel: string;
  availableTimings: AvailabilitySlot[];
  interviewTypes: string[];
  skills: string[];
  maxInterviewsPerDay: number;
  isActive: boolean;
  timezone: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

// Main Interview Response
export interface InterviewDetails {
  id: string;
  candidateId: string;
  interviewerId: string;
  requestedSlots: TimeSlot[];
  scheduledSlot: TimeSlot;
  interviewType: string;
  status: string;
  meetingLink: string | null;
  meetingId: string | null;
  notes: string;
  feedback: string | null;
  interviewerFeedback: string | null;
  rating: number | null;
  durationMinutes: number;
  rejectionReason: string | null;
  availableAlternativeSlots: TimeSlot[];
  resumeShared: boolean;
  calendarInviteSent: boolean;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
  scheduledAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  interviewer: Interviewer;
}
