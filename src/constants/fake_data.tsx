import {
  FailedInterviewResponse,
  SuccessInterviewScheduleResponse,
} from '@/types/interview';

export const fake_slotBookingResponse: SuccessInterviewScheduleResponse = {
  success: true,
  message: 'Interview scheduled successfully',
  data: {
    candidateId: '4e6d7c95-f3ac-4381-923c-d52e00f00728',
    userId: '29df8bdb-5cc2-4e74-bd64-042096386b84',
    interview: {
      candidateId: '4e6d7c95-f3ac-4381-923c-d52e00f00728',
      interviewerId: '4ab21e92-b031-4c57-9c59-e511224f5172',
      requestedSlots: [
        {
          endTime: '2025-08-25T11:00:00Z',
          timezone: 'UTC',
          startTime: '2025-08-25T10:00:00Z',
        },
        {
          endTime: '2025-08-26T15:00:00Z',
          timezone: 'UTC',
          startTime: '2025-08-26T14:00:00Z',
        },
      ],
      scheduledSlot: {
        startTime: '2025-08-26T14:00:00Z',
        endTime: '2025-08-26T15:00:00Z',
        timezone: 'UTC',
      },
      interviewType: 'technical',
      status: 'scheduled',
      notes: 'Prefer technical interview focused on React and Node.js',
      durationMinutes: 60,
      meetingLink: null,
      meetingId: null,
      feedback: null,
      rating: null,
      rejectionReason: null,
      scheduledAt: null,
      completedAt: null,
      cancelledAt: null,
      id: '3599c6ca-00da-4461-8f1d-9d2954852661',
      availableAlternativeSlots: [],
      resumeShared: true,
      calendarInviteSent: true,
      reminderSent: false,
      createdAt: '2025-08-21T12:36:03.863Z',
      updatedAt: '2025-08-21T12:36:03.888Z',
    },
    scheduledSlot: {
      startTime: '2025-08-26T14:00:00Z',
      endTime: '2025-08-26T15:00:00Z',
      timezone: 'UTC',
    },
    status: 'scheduled',
  },
};

export const fake_slotBookingAlternative: FailedInterviewResponse = {
  success: false,
  message: 'No interviewers available for the requested time slots',
  alternativeSlots: [],
  data: {
    candidateId: '4e6d7c95-f3ac-4381-923c-d52e00f00728',
    userId: '29df8bdb-5cc2-4e74-bd64-042096386b84',
    requestedSlots: [
      {
        startTime: '2025-08-25T10:00:00Z',
        endTime: '2025-08-25T11:00:00Z',
        timezone: 'UTC',
      },
      {
        startTime: '2025-08-26T14:00:00Z',
        endTime: '2025-08-26T16:00:00Z',
        timezone: 'UTC',
      },
    ],
    alternativeSlots: [
      {
        startTime: '2025-08-25T09:00:00.000Z',
        endTime: '2025-08-25T10:00:00.000Z',
        timezone: 'UTC',
      },
      {
        startTime: '2025-08-25T11:00:00.000Z',
        endTime: '2025-08-25T12:00:00.000Z',
        timezone: 'UTC',
      },
      {
        startTime: '2025-08-25T12:00:00.000Z',
        endTime: '2025-08-25T13:00:00.000Z',
        timezone: 'UTC',
      },
      {
        startTime: '2025-08-25T13:00:00.000Z',
        endTime: '2025-08-25T14:00:00.000Z',
        timezone: 'UTC',
      },
      {
        startTime: '2025-08-25T14:00:00.000Z',
        endTime: '2025-08-25T15:00:00.000Z',
        timezone: 'UTC',
      },
    ],
    availableInterviewers: [],
  },
};

export const fake_resume_data = {
  jd_s3_key: 'Jr. AIML JD.docx',
  resume_data: {
    experience: [
      {
        title: 'Automation Test Lead',
        company: 'Wipro LIMITED',
        duration: 'December 2022 - Current',
        start_date: '2022-12',
        end_date: 'Present',
        description:
          'UI Automation with Cypress/Selenium, API Automation with Cypress and Rest Assured, Business Analysis, SRS preparation, Test case preparation, Web Application Testing, Process Automation',
        responsibilities: [
          'UI Automation with Cypress/Selenium',
          'API Automation with Cypress and Rest Assured',
          'Business Analysis',
          'SRS preparation',
          'Test case preparation',
          'Web Application Testing',
          'Process Automation',
        ],
      },
      {
        title: 'Automation Test Analyst',
        company: 'TCS LIMITED',
        duration: 'August 2019 - December 2021',
        start_date: '2019-08',
        end_date: '2021-12',
      },
      {
        title: 'SENIOR TEST ENGINEER',
        company: 'INFOSYS LIMITED',
        duration: 'July 2014 - July 2019',
        start_date: '2014-07',
        end_date: '2019-07',
      },
    ],
    projects: [
      {
        name: 'UI Automation with Cypress/ Selenium',
        description: 'Automating UI testing using Cypress and Selenium',
        technologies: ['Cypress', 'Selenium'],
        duration: 'December 2022 - Current',
      },
      {
        name: 'API Automation with Cypress and Rest Assured',
        description: 'Automating API testing using Cypress and Rest Assured',
        technologies: ['Cypress', 'Rest Assured'],
        duration: 'August 2019 - December 2021',
      },
    ],
    skills: {
      technical: [
        'Java',
        'JavaScript',
        'Selenium',
        'Cypress',
        'BDD',
        'Cucumber',
        'Rest Assured',
        'Jenkins',
        'AWS',
        'MySQL',
        'Mongo DB',
      ],
      soft: ['Business Analysis', 'Process Automation'],
      languages: ['English', 'Hindi', 'Malayalam', 'Tamil'],
      certifications: [
        'Certificate of Special Recognition from Costco client',
        'Certificate of Appreciation from Walgreens client',
        'Trinfy ACE Award',
        'Infosys Insta Award',
      ],
      tools: ['Jira', 'Azure ADO', 'HP-ALM', 'Test rail', 'Gcp'],
      project_management: ['Agile'],
    },
  },
  num_questions: 20,
};
export const fake_jd_s3_key = 'Jr. AIML JD.docx';
