'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  getReportApi,
  CandidateReportResponse,
} from '@/services/reportService';
import { useParams } from 'next/navigation';
import ShareModal from './components/shareModal';
declare global {
  interface Window {
    html2pdf?: unknown; // or a more specific type if you know it
  }
}

// Type definitions
interface AssessmentScore {
  label: string;
  score: string;
  description: string;
  status: 'excellent' | 'good' | 'pending';
  percentage?: number;
}

interface Skill {
  name: string;
  level: string;
  percentage: number;
}

interface InterviewStructureBlock {
  duration: string;
  title: string;
  description: string;
  type: 'technical' | 'problem' | 'soft-skills';
  emoji: string;
}

interface EvaluationCriteria {
  percentage: string;
  title: string;
  details: string;
}

interface DevelopmentPhase {
  period: string;
  skills: string[];
}

interface CandidateData {
  name: string;
  role: string;
  overallScore: number;
  stageProgress: string;
  initials: string;
  interviewDate: string;
  assessmentScores: AssessmentScore[];
  strengths: Skill[];
  growthAreas: Skill[];
  interviewStructure: InterviewStructureBlock[];
  evaluationCriteria: EvaluationCriteria[];
  developmentPhases: DevelopmentPhase[];
}

interface InfographicReportProps {
  candidateData?: CandidateData;
}

// Function to map API response to component data
const mapApiDataToCandidate = (
  apiData: CandidateReportResponse
): CandidateData => {
  // Helper function to get initials from name
  const getInitials = (name: string): string => {
    return (
      name
        .trim()
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase() || 'NA'
    );
  };

  // Helper function to determine stage progress
  const getStageProgress = (lastStage: string): string => {
    if (lastStage === 'interview') {
      return '4/4';
    } else if (lastStage === 'codingTest' || lastStage === 'coding') {
      return '3/4';
    } else if (lastStage === 'mcq') {
      return '2/4';
    } else {
      return '1/4';
    }
  };

  // Helper function to format interview date
  const getFormattedInterviewDate = (
    apiData: CandidateReportResponse
  ): string => {
    // Handle interviews as array or single object
    let interview = null;

    if (Array.isArray(apiData.interviews) && apiData.interviews.length > 0) {
      interview = apiData.interviews[0];
    }

    if (interview) {
      // Use scheduled slot times from the interview
      const scheduledSlot = interview.scheduledSlot;
      const startTimeStr = scheduledSlot?.startTime;
      const endTimeStr = scheduledSlot?.endTime || startTimeStr;

      if (startTimeStr) {
        const startTime = new Date(startTimeStr);
        const endTime = new Date(endTimeStr);

        // Check if dates are valid
        if (!isNaN(startTime.getTime())) {
          // Format date as "January 25, 2025"
          const dateOptions: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          };
          const formattedDate = startTime.toLocaleDateString(
            'en-US',
            dateOptions
          );

          // Format time range as "2:00 PM - 3:30 PM"
          const timeOptions: Intl.DateTimeFormatOptions = {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          };
          const startTimeFormatted = startTime.toLocaleTimeString(
            'en-US',
            timeOptions
          );
          const endTimeFormatted = endTime.toLocaleTimeString(
            'en-US',
            timeOptions
          );

          return `${formattedDate} • ${startTimeFormatted} - ${endTimeFormatted}`;
        }
      }
    }

    // Fallback to default date
    return 'January 25, 2025 • 2:00 PM - 3:30 PM';
  };

  // Helper function to determine status based on score
  const getScoreStatus = (score: number): 'excellent' | 'good' | 'pending' => {
    if (score >= 75) return 'excellent';
    if (score >= 40) return 'good';
    return 'good';
  };

  // Helper function to get score description
  const getScoreDescription = (score: number, type: string): string => {
    if (type === 'coding') {
      if (score >= 70) return 'Good implementation with room for improvement';
      if (score >= 50) return 'Basic functionality with significant issues';
      return 'Major improvements needed';
    }
    if (type === 'mcq') {
      if (score >= 70) return 'Strong theoretical knowledge';
      if (score >= 50) return 'Adequate understanding with gaps';
      return 'Needs improvement in fundamentals';
    }
    return 'Assessment completed';
  };

  // Calculate overall score (average of available scores)
  const codingScore = apiData.coding?.overallScore || 0;
  const mcqScore = parseInt(
    apiData.mcq?.testOverview?.score?.split('%')[0] || '0'
  );
  const resumeScore = apiData.resumeAnalysis?.resumeQuality || 0;
  const overallScore = Math.round((codingScore + mcqScore + resumeScore) / 3);

  // Map strengths from MCQ, coding, and capability data
  const strengths: Skill[] = [];
  const growthAreas: Skill[] = [];

  // Process MCQ category performance for strengths
  if (apiData.mcq?.categoryWisePerformance) {
    apiData.mcq.categoryWisePerformance.forEach(category => {
      const percentage = parseInt(category.accuracy.replace('% accuracy', ''));
      const skill = {
        name: category.category,
        level:
          percentage >= 80
            ? 'Expert'
            : percentage >= 60
              ? 'Advanced'
              : percentage >= 40
                ? 'Proficient'
                : 'Developing',
        percentage: percentage,
      };

      if (percentage >= 50) {
        strengths.push(skill);
      } else {
        growthAreas.push(skill);
      }
    });
  }

  // Add capability data to strengths and growth areas
  if (apiData.capability) {
    // Add core competencies
    if (apiData.capability.coreCompetencies) {
      apiData.capability.coreCompetencies.forEach(competency => {
        const percentage = (competency.score / 10) * 100; // Convert 10-point scale to percentage
        const skill = {
          name: competency.name,
          level:
            competency.score >= 8
              ? 'Expert'
              : competency.score >= 6
                ? 'Advanced'
                : competency.score >= 4
                  ? 'Proficient'
                  : 'Developing',
          percentage: percentage,
        };

        if (competency.score >= 6) {
          strengths.push(skill);
        } else {
          growthAreas.push(skill);
        }
      });
    }

    // Add soft skills
    if (apiData.capability.softSkills) {
      apiData.capability.softSkills.forEach(skill => {
        const percentage = (skill.score / 10) * 100; // Convert 10-point scale to percentage
        const skillData = {
          name: skill.name,
          level:
            skill.score >= 8
              ? 'Expert'
              : skill.score >= 6
                ? 'Advanced'
                : skill.score >= 4
                  ? 'Proficient'
                  : 'Developing',
          percentage: percentage,
        };

        if (skill.score >= 6) {
          strengths.push(skillData);
        } else {
          growthAreas.push(skillData);
        }
      });
    }

    // Add domain knowledge
    if (apiData.capability.domainKnowledge) {
      apiData.capability.domainKnowledge.forEach(knowledge => {
        const percentage = (knowledge.score / 10) * 100; // Convert 10-point scale to percentage
        const skill = {
          name: knowledge.name,
          level:
            knowledge.score >= 8
              ? 'Expert'
              : knowledge.score >= 6
                ? 'Advanced'
                : knowledge.score >= 4
                  ? 'Proficient'
                  : 'Developing',
          percentage: percentage,
        };

        if (knowledge.score >= 6) {
          strengths.push(skill);
        } else {
          growthAreas.push(skill);
        }
      });
    }

    // Add role-specific skills
    if (apiData.capability.roleSpecificSkills) {
      apiData.capability.roleSpecificSkills.forEach(roleSkill => {
        const percentage = (roleSkill.score / 10) * 100; // Convert 10-point scale to percentage
        const skill = {
          name: roleSkill.name,
          level:
            roleSkill.score >= 8
              ? 'Expert'
              : roleSkill.score >= 6
                ? 'Advanced'
                : roleSkill.score >= 4
                  ? 'Proficient'
                  : 'Developing',
          percentage: percentage,
        };

        if (roleSkill.score >= 6) {
          strengths.push(skill);
        } else {
          growthAreas.push(skill);
        }
      });
    }
  }

  // Add coding-specific skills based on strengths and weaknesses
  if (apiData.coding) {
    // Add strengths as skills
    if (apiData.coding.strengths) {
      apiData.coding.strengths.forEach(strength => {
        strengths.push({
          name: strength,
          level: 'Proficient',
          percentage: 75,
        });
      });
    }

    // Add weaknesses as growth areas
    if (apiData.coding.weaknesses) {
      apiData.coding.weaknesses.slice(0, 4).forEach(weakness => {
        let skillName = 'Code Quality';
        let percentage = 40;

        if (weakness.toLowerCase().includes('test')) {
          skillName = 'Testing & Quality Assurance';
          percentage = 25;
        } else if (weakness.toLowerCase().includes('component')) {
          skillName = 'Component Architecture';
          percentage = 30;
        } else if (weakness.toLowerCase().includes('error')) {
          skillName = 'Error Handling & Debugging';
          percentage = 35;
        } else if (weakness.toLowerCase().includes('performance')) {
          skillName = 'Performance Optimization';
          percentage = 40;
        }

        growthAreas.push({
          name: skillName,
          level: 'Developing',
          percentage: percentage,
        });
      });
    }
  }

  // Add experience-based skills from resume
  if (apiData.resumeAnalysis?.experience?.length > 0) {
    const experience = apiData.resumeAnalysis.experience[0];
    const description = experience.description || '';

    if (description) {
      const hasReact = description.toLowerCase().includes('react');
      const hasNode = description.toLowerCase().includes('node');
      const hasAWS = description.toLowerCase().includes('aws');
      const isLeadRole = (experience.title || '')
        .toLowerCase()
        .includes('lead');

      if (hasReact) {
        strengths.push({
          name: 'React Development',
          level: 'Expert',
          percentage: 85,
        });
      }

      if (hasNode) {
        strengths.push({
          name: 'Backend Development',
          level: 'Expert',
          percentage: 80,
        });
      }

      if (hasAWS) {
        strengths.push({
          name: 'Cloud Technologies (AWS)',
          level: 'Advanced',
          percentage: 75,
        });
      }

      if (isLeadRole) {
        strengths.push({
          name: 'Technical Leadership',
          level: 'Expert',
          percentage: 90,
        });
      }
    }
  }

  // Limit to 4 skills each and remove duplicates
  const uniqueStrengths = strengths
    .filter(
      (skill, index, self) =>
        index === self.findIndex(s => s.name === skill.name)
    )
    .slice(0, 4);

  const uniqueGrowthAreas = growthAreas
    .filter(
      (skill, index, self) =>
        index === self.findIndex(s => s.name === skill.name)
    )
    .slice(0, 4);

  // Get stage progress and interview date
  const stageProgress = getStageProgress(
    apiData.executiveSummary?.profileStages?.lastStage || ''
  );
  const formattedInterviewDate = getFormattedInterviewDate(apiData);

  return {
    name:
      apiData.name ||
      apiData.executiveSummary?.candidateName?.trim() ||
      'Test Candidate',
    role: apiData.executiveSummary?.positionApplied || 'Lead Developer',
    overallScore: overallScore,
    stageProgress: stageProgress,
    initials: getInitials(
      apiData.name || apiData.executiveSummary?.candidateName || 'TC'
    ),
    interviewDate: formattedInterviewDate,
    assessmentScores: [
      {
        label: 'Coding Assessment',
        score: `${codingScore}%`,
        description: getScoreDescription(codingScore, 'coding'),
        status: codingScore >= 75 ? 'excellent' : 'good',
        percentage: codingScore,
      },
      {
        label: 'Technical MCQ',
        score: `${mcqScore}%`,
        description: getScoreDescription(mcqScore, 'mcq'),
        status: mcqScore >= 75 ? 'excellent' : 'good',
        percentage: mcqScore,
      },
      {
        label: 'Resume Analysis',
        score: `${resumeScore}%`,
        description: 'Comprehensive profile evaluation',
        status: getScoreStatus(resumeScore),
        percentage: resumeScore,
      },
      {
        label: 'Panel Interview',
        score: 'Pending',
        description: 'Scheduled for technical evaluation',
        status: 'pending',
      },
    ],
    strengths: uniqueStrengths,
    growthAreas: uniqueGrowthAreas,
    interviewStructure: [
      {
        duration: '40 min',
        title: 'Technical Deep Dive',
        description:
          'System design, backend architecture, and cloud technologies',
        type: 'technical',
        emoji: '🔧',
      },
      {
        duration: '20 min',
        title: 'Leadership & Problem Solving',
        description:
          'Team management, technical decision making, and troubleshooting',
        type: 'problem',
        emoji: '🧩',
      },
      {
        duration: '10 min',
        title: 'Culture & Communication',
        description:
          'Communication skills, team collaboration, and growth mindset',
        type: 'soft-skills',
        emoji: '👥',
      },
    ],
    evaluationCriteria: (() => {
      const criteria: EvaluationCriteria[] = [];

      // Add capability data to evaluation criteria
      if (apiData.capability?.coreCompetencies) {
        apiData.capability.coreCompetencies.forEach(competency => {
          const percentage = (competency.score / 10) * 100;
          criteria.push({
            percentage: `${Math.round(percentage)}%`,
            title: competency.name,
            details: `Core competency assessment based on experience and demonstrated capabilities`,
          });
        });
      }

      if (apiData.capability?.roleSpecificSkills) {
        apiData.capability.roleSpecificSkills.forEach(competency => {
          const percentage = (competency.score / 10) * 100;
          criteria.push({
            percentage: `${Math.round(percentage)}%`,
            title: competency.name,
            details: `Core competency assessment based on experience and demonstrated capabilities`,
          });
        });
      }

      if (apiData.capability?.softSkills) {
        apiData.capability.softSkills.forEach(competency => {
          const percentage = (competency.score / 10) * 100;
          criteria.push({
            percentage: `${Math.round(percentage)}%`,
            title: competency.name,
            details: `Core competency assessment based on experience and demonstrated capabilities`,
          });
        });
      }

      if (apiData.capability?.domainKnowledge) {
        apiData.capability.domainKnowledge.forEach(competency => {
          const percentage = (competency.score / 10) * 100;
          criteria.push({
            percentage: `${Math.round(percentage)}%`,
            title: competency.name,
            details: `Core competency assessment based on experience and demonstrated capabilities`,
          });
        });
      }

      // Add role-specific skills if available
      if (apiData.capability?.roleSpecificSkills && criteria.length < 6) {
        apiData.capability.roleSpecificSkills.slice(0, 2).forEach(roleSkill => {
          const percentage = (roleSkill.score / 10) * 100;
          criteria.push({
            percentage: `${Math.round(percentage)}%`,
            title: roleSkill.name,
            details: `Role-specific skill evaluation with ${roleSkill.weight} weightage`,
          });
        });
      }

      // Return criteria or default fallback
      return criteria.length > 0
        ? criteria
        : [
            {
              percentage: '30%',
              title: 'Technical Leadership',
              details:
                'Architecture decisions, system design, and technical mentoring',
            },
            {
              percentage: '25%',
              title: 'Problem Solving',
              details:
                'Analytical thinking, debugging skills, and solution approach',
            },
            {
              percentage: '25%',
              title: 'Code Quality',
              details:
                'Best practices, clean code, and maintainability standards',
            },
            {
              percentage: '20%',
              title: 'Team Collaboration',
              details: 'Communication, leadership, and cultural alignment',
            },
          ];
    })(),
    developmentPhases: [
      {
        period: '0-2 Months',
        skills: [
          'Team onboarding and integration',
          'System architecture review',
          'Code quality improvement',
          'Company processes and tools',
        ],
      },
      {
        period: '2-6 Months',
        skills: [
          'Lead technical initiatives',
          'Mentor junior developers',
          'Optimize existing systems',
          'Cross-team collaboration',
        ],
      },
      {
        period: '6-12 Months',
        skills: [
          'Strategic technical planning',
          'Architecture ownership',
          'Process improvements',
          'Technical innovation leadership',
        ],
      },
    ],
  };
};

// Notification component
const Notification: React.FC<{ message: string; show: boolean }> = ({
  message,
  show,
}) => {
  if (!show) return null;

  return (
    <div className="fixed top-5 right-5 bg-gradient-to-r from-green-600 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 font-semibold text-sm max-w-sm">
      ✅ {message}
    </div>
  );
};

// Loading component
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
  </div>
);

// Error component
const ErrorDisplay: React.FC<{ error: string; onRetry?: () => void }> = ({
  error,
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-8">
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
      <h3 className="text-lg font-semibold text-red-800 mb-2">
        Error Loading Report
      </h3>
      <p className="text-red-600 mb-4">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
);

const VettingReport: React.FC<InfographicReportProps> = ({ candidateData }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiCandidateData, setApiCandidateData] =
    useState<CandidateData | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const reportRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const candidateId = params?.id as string;
  const [isOpen, setIsOpen] = useState(false);

  // Use provided candidateData or API data
  const displayData = candidateData || apiCandidateData;

  useEffect(() => {
    const fetchVettingReport = async () => {
      if (candidateData) {
        // Don't fetch if candidateData is already provided
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response: CandidateReportResponse =
          await getReportApi(candidateId);
        const mappedData = mapApiDataToCandidate(response);
        setApiCandidateData(mappedData);
      } catch (err) {
        console.error('Error fetching vetting report:', err);
        setError('Failed to load vetting report. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchVettingReport();
  }, [candidateId, candidateData]);

  useEffect(() => {
    // Animate skill progress bars only when we have data
    if (displayData) {
      const timer = setTimeout(() => {
        const skillBars = document.querySelectorAll(
          '.skill-fill'
        ) as NodeListOf<HTMLElement>;
        skillBars.forEach(bar => {
          const targetWidth = bar.getAttribute('data-width');
          if (targetWidth) {
            bar.style.width = targetWidth + '%';
          }
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [displayData]);

  // Add print styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        .no-print {
          display: none !important;
        }
        
       @page {
          margin: 0.4in 0.5in;
          size: A4;
          /* Remove headers and footers */
          @top-left { content: none; }
          @top-center { content: none; }
          @top-right { content: none; }
          @bottom-left { content: none; }
          @bottom-center { content: none; }
          @bottom-right { content: none; }
        }
        
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .print-container {
          background: white !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          max-width: none !important;
          width: 100% !important;
        }
        
        .skill-fill {
          width: var(--skill-width) !important;
          transition: none !important;
        }
        
        /* Page break control */
        .print-page {
          page-break-after: always !important;
          break-after: page !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          min-height: 90vh;
        }
        
      
        
        /* Keep sections together */
        .print-section,
        .assessment-grid > div,
        .skills-grid > div {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        
        /* Interview Strategy specific */
        .interview-strategy-container {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        
        /* Grid layouts */
        .assessment-grid,
        .skills-grid {
          display: grid !important;
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 12px !important;
        }
        
        /* Compact spacing */
        h1 { font-size: 20pt !important; margin: 0 0 6px 0 !important; }
        h2 { font-size: 16pt !important; margin: 0 0 6px 0 !important; }
        h3 { font-size: 13pt !important; margin: 0 0 4px 0 !important; }
        p { font-size: 9pt !important; line-height: 1.3 !important; }
        
        .hero-section {
          padding: 20px 15px !important;
          min-height: 30vh !important;
        }
        
        .content-section {
          padding: 12px !important;
        }
        
        .mb-10, .mb-12 {
          margin-bottom: 8px !important;
        }
        
        .p-8, .p-10 {
          padding: 10px !important;
        }
        
        .gap-8, .gap-10 {
          gap: 8px !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const showNotificationMessage = (message: string): void => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  const downloadInfographicPDF = async (): Promise<void> => {
    if (!displayData) return;

    try {
      setIsDownloading(true);

      // Set skill widths immediately
      const skillBars = document.querySelectorAll(
        '.skill-fill'
      ) as NodeListOf<HTMLElement>;
      skillBars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-width');
        if (targetWidth) {
          bar.style.setProperty('--skill-width', targetWidth + '%');
          bar.style.width = targetWidth + '%';
        }
      });

      setTimeout(() => {
        window.print();
        showNotificationMessage('PDF generation initiated');
      }, 100);
    } catch (error) {
      console.error('Error generating PDF:', error);
      showNotificationMessage('Error generating PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const retryFetch = () => {
    setError(null);
    setLoading(true);
    getReportApi(candidateId)
      .then(response => {
        const mappedData = mapApiDataToCandidate(response);
        setApiCandidateData(mappedData);
      })
      .catch(err => {
        console.error('Error fetching vetting report:', err);
        setError('Failed to load vetting report. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  // Show loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Show error state if no data is available
  if (error && !displayData) {
    return <ErrorDisplay error={error} onRetry={retryFetch} />;
  }

  // Show error if no data is available at all
  if (!displayData) {
    return (
      <ErrorDisplay error="No candidate data available" onRetry={retryFetch} />
    );
  }

  return (
    <>
      <div
        className="font-inter bg-gray-50 leading-normal max-w-4xl mx-auto my-5 bg-white rounded-3xl shadow-2xl overflow-hidden print-container"
        ref={reportRef}
      >
        {/* PAGE 1: Hero + Assessment */}
        <div className="print-page">
          <div
            className="text-white py-16 px-10 relative overflow-hidden hero-section"
            style={{
              background:
                'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            }}
          >
            <div
              className="absolute opacity-20 rounded-full"
              style={{
                top: '-50%',
                right: '-25%',
                width: '400px',
                height: '400px',
                background: 'rgba(255, 255, 255, 0.08)',
              }}
            ></div>
            <div
              className="absolute opacity-15 rounded-full"
              style={{
                bottom: '-30%',
                left: '-20%',
                width: '300px',
                height: '300px',
                background: 'rgba(255, 255, 255, 0.05)',
              }}
            ></div>

            <div className="relative z-10 text-center">
              <div
                style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                className="w-32 h-32 rounded-full flex items-center justify-center text-5xl font-black mx-auto mb-5 border-4 border-white border-opacity-30"
              >
                <span>{displayData?.initials}</span>
              </div>
              <h1 className="text-4xl font-black mb-2 drop-shadow-sm">
                {displayData.name}
              </h1>
              <p className="text-xl opacity-90 mb-5">{displayData.role}</p>

              <div className="flex justify-center gap-10 mt-8 flex-wrap">
                <div className="text-center">
                  <span className="text-4xl font-black block mb-1">
                    {displayData.overallScore}
                  </span>
                  <span className="text-sm opacity-80 uppercase tracking-wider">
                    Overall Score
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-4xl font-black block mb-1">
                    {displayData.stageProgress}
                  </span>
                  <span className="text-sm opacity-80 uppercase tracking-wider">
                    Stages Passed
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-4xl font-black block mb-1">2-3</span>
                  <span className="text-sm opacity-80 uppercase tracking-wider">
                    Months to Independence
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-12 content-section">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Assessment Performance
              </h2>
              <p className="text-gray-600">
                Comprehensive evaluation across all key areas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 assessment-grid">
              {displayData.assessmentScores.map((score, index) => (
                <div key={index} className="print-section">
                  <ScoreVisual {...score} delay={index * 0.2} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PAGE 2: Skills Analysis */}
        <div className="print-page">
          <div className="p-12 content-section">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Skills Analysis
              </h2>
              <p className="text-gray-600">
                Current proficiency levels and growth opportunities
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12 skills-grid">
              <div className="print-section">
                <SkillsColumn
                  type="strengths"
                  title="Core Strengths"
                  skills={displayData.strengths}
                />
              </div>
              <div className="print-section">
                <SkillsColumn
                  type="growth"
                  title="Growth Areas"
                  skills={displayData.growthAreas}
                />
              </div>
            </div>
          </div>
        </div>

        {/* PAGE 3: Interview Strategy */}
        <div className="print-page">
          <div className="p-8 content-section">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Panel Interview Strategy
              </h2>
              <p className="text-gray-600 text-sm">
                Comprehensive evaluation plan and focus areas
              </p>
            </div>

            <div className="">
              <InterviewStrategySection candidateData={displayData} />
            </div>
          </div>
        </div>

        {/* PAGE 4: Development Journey + Final Recommendation */}
        <div className="print-page">
          <div className="p-12 content-section">
            <div className="print-section">
              <TimelineInfographic phases={displayData.developmentPhases} />
            </div>

            <div className="print-section">
              <div className="bg-gradient-to-r from-green-600 to-green-600 text-white rounded-2xl p-10 text-center relative overflow-hidden mb-10">
                <div className="absolute top-5 left-8 text-5xl opacity-30">
                  🌟
                </div>
                <div className="absolute bottom-5 right-8 text-5xl opacity-30">
                  🚀
                </div>

                <h2 className="text-3xl font-black mb-4 relative z-10">
                  Strong Hire Recommended
                </h2>
                <p className="text-lg opacity-95 max-w-2xl mx-auto relative z-10">
                  {displayData.name} demonstrates exceptional technical skills
                  with a clear growth mindset. Strong foundation in modern
                  frontend practices, combined with excellent accessibility
                  awareness, makes them an ideal candidate for immediate
                  contribution and long-term team growth.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div className="py-8 px-10 bg-gray-50 text-center no-print">
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              className="px-7 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50"
              onClick={downloadInfographicPDF}
              disabled={isDownloading}
            >
              {isDownloading ? '⏳ Generating PDF...' : '📄 Download PDF'}
            </button>
            <div className="relative inline-block">
              <button
                className="px-7 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
                onClick={() => setIsOpen(true)}
              >
                📤 Share Report
              </button>
              <ShareModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                link={window.location.href}
              />
            </div>
          </div>
        </div>
      </div>

      <Notification message={notificationMessage} show={showNotification} />
    </>
  );
};

// Score Visual Component
const ScoreVisual: React.FC<AssessmentScore & { delay?: number }> = ({
  label,
  score,
  description,
  status,
  percentage,
}) => {
  const getStatusClasses = (): string => {
    const baseClasses =
      'bg-gradient-to-br rounded-2xl p-8 text-center relative border-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1';

    switch (status) {
      case 'excellent':
        return `${baseClasses} border-green-500 from-green-50 to-green-100`;
      case 'good':
        return `${baseClasses} border-orange-400 from-orange-50 to-yellow-50`;
      case 'pending':
        return `${baseClasses} border-blue-400 from-blue-50 to-cyan-50`;
      default:
        return `${baseClasses} border-gray-300 from-gray-50 to-gray-100`;
    }
  };

  const getCircleClasses = (): string => {
    if (status === 'pending') {
      return 'w-24 h-24 rounded-full mx-auto mb-5 flex items-center justify-center text-2xl font-black relative bg-gray-200 text-gray-600';
    }
    return 'w-24 h-24 rounded-full mx-auto mb-5 flex items-center justify-center text-2xl font-black relative';
  };

  const getCircleStyle = (): React.CSSProperties => {
    if (status === 'pending') {
      return {};
    }
    const percent = percentage || parseInt(score.replace('%', ''));
    const color = status === 'excellent' ? '#48bb78' : '#ed8936';
    return {
      background: `conic-gradient(from 0deg, ${color} 0%, ${color} ${percent}%, #e2e8f0 ${percent}%)`,
    };
  };

  return (
    <div className={getStatusClasses()}>
      <div className={getCircleClasses()} style={getCircleStyle()}>
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-800">
          {status === 'pending' ? '⏳' : score}
        </div>
      </div>
      <div className="text-lg font-semibold text-gray-700 mb-2">{label}</div>
      <div className="text-sm text-gray-600">{description}</div>
    </div>
  );
};

// Skills Column Component
const SkillsColumn: React.FC<{
  type: 'strengths' | 'growth';
  title: string;
  skills: Skill[];
}> = ({ type, title, skills }) => {
  const isStrengths = type === 'strengths';
  const borderColor = isStrengths
    ? 'border-l-green-500'
    : 'border-l-orange-400';

  return (
    <div className={`bg-gray-50 rounded-2xl p-8 border-l-8 ${borderColor}`}>
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg text-white ${
            isStrengths
              ? 'bg-gradient-to-br from-green-500 to-green-600'
              : 'bg-gradient-to-br from-orange-400 to-orange-500'
          }`}
        >
          {isStrengths ? '💪' : '📈'}
        </div>
        <div className="text-xl font-bold text-gray-800">{title}</div>
      </div>

      {skills.map((skill, index) => (
        <SkillBar key={index} {...skill} isStrengths={isStrengths} />
      ))}
    </div>
  );
};

// Skill Bar Component
const SkillBar: React.FC<Skill & { isStrengths: boolean }> = ({
  name,
  level,
  percentage,
  isStrengths,
}) => {
  const gradientClass = isStrengths
    ? 'bg-gradient-to-r from-green-500 to-green-600'
    : 'bg-gradient-to-r from-orange-400 to-orange-500';

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2 text-sm font-medium text-gray-700">
        <span>{name}</span>
        <span className="text-xs font-semibold text-gray-500">{level}</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`skill-fill h-full rounded-full transition-all duration-1000 ease-out ${gradientClass}`}
          data-width={percentage}
          style={
            {
              width: '0%',
              '--skill-width': `${percentage}%`,
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
};

// Interview Strategy Section
const InterviewStrategySection: React.FC<{ candidateData: CandidateData }> = ({
  candidateData,
}) => {
  return (
    <div
      className="rounded-2xl p-6 mb-6"
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      }}
    >
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 border-l-8 border-blue-400 print-section">
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 text-white"
            style={{ background: 'linear-gradient(135deg, #4299e1, #3182ce)' }}
          >
            📅
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              Technical Deep Dive Interview
            </h3>
            <p className="text-gray-600 mb-1 text-sm">
              <strong>Date:</strong> {candidateData.interviewDate}
            </p>
            <p className="text-gray-600 mb-2 text-sm">
              <strong>Format:</strong> Virtual • 60 minutes • 1 Interviewer
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 print-section">
        <h3 className="text-lg font-bold mb-4 text-gray-800">
          Interview Structure & Timeline
        </h3>
        <div className="flex flex-col gap-3 mb-6">
          {candidateData.interviewStructure.map((block, index) => (
            <TimeBlock key={index} {...block} />
          ))}
        </div>
      </div>

      <div className="mb-4 print-section">
        <h3 className="text-lg font-bold mb-4 text-gray-800">
          Key Evaluation Areas
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {candidateData.evaluationCriteria.map((criteria, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 text-center shadow-md hover:-translate-y-1 transition-transform duration-300 print-section"
            >
              <div className="text-2xl font-black text-blue-500 mb-2">
                {criteria.percentage}
              </div>
              <div className="text-center">
                <h4 className="text-sm font-semibold mb-1 text-gray-700 whitespace-normal break-words w-full max-w-full">
                  {criteria.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Time Block Component
const TimeBlock: React.FC<InterviewStructureBlock> = ({
  duration,
  title,
  description,
  type,
  emoji,
}) => {
  const getBorderColor = (): string => {
    switch (type) {
      case 'technical':
        return 'border-l-blue-400';
      case 'problem':
        return 'border-l-orange-400';
      case 'soft-skills':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-300';
    }
  };

  return (
    <div
      className={`flex items-center bg-white rounded-xl p-4 shadow-md border-l-8 ${getBorderColor()} print-section`}
    >
      <div className="text-sm font-bold text-gray-700 min-w-16 flex-shrink-0">
        {duration}
      </div>
      <div className="ml-4">
        <h4 className="text-sm font-semibold mb-1 text-gray-700">
          {emoji} {title}
        </h4>
        <p className="text-gray-600 text-xs">{description}</p>
      </div>
    </div>
  );
};

// Timeline Infographic Component
const TimelineInfographic: React.FC<{ phases: DevelopmentPhase[] }> = ({
  phases,
}) => {
  return (
    <div
      className="text-white mb-8 relative overflow-hidden p-8"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '25px',
      }}
    >
      <div
        className="absolute rounded-full"
        style={{
          top: '-30%',
          right: '-15%',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
        }}
      ></div>

      <div className="text-center mb-8 relative z-10">
        <h2 className="text-2xl font-bold mb-2">Development Journey</h2>
        <p className="opacity-90">
          Roadmap to mastery with realistic timelines
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {phases.map((phase, index) => (
          <div
            key={index}
            className="rounded-2xl p-6 text-center border border-white border-opacity-20 print-section"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-black mx-auto mb-4"
              style={{ background: 'rgba(255, 255, 255, 0.2)' }}
            >
              {index + 1}
            </div>
            <div className="text-lg font-semibold mb-3">{phase.period}</div>
            <div className="text-sm opacity-90 leading-relaxed">
              {phase.skills.map((skill, skillIndex) => (
                <div key={skillIndex} className="mb-1">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VettingReport;
