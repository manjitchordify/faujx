'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/store/store';
import FeedbackComponent from '@/components/engineer/shared/FeedbackComponent';

interface CapabilityResponse {
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

interface EvaluationResult {
  overall_score: number;
  max_score: number;
  score_breakdown: {
    functionality: number;
    code_quality: number;
    best_practices: number;
    completeness: number;
    performance: number;
  };
  passed: boolean;
  summary: string;
  strengths: string[];
  improvements: string[];
  code_issues: string[];
  processing_time: number;
  confidence_level: number;
}

interface ReportItem {
  text: string;
  isPassed: boolean;
}

const FeedbackContent: React.FC = () => {
  const searchParams = useSearchParams();
  const [reportItems, setReportItems] = useState<ReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userName = searchParams.get('userName');
  const type = searchParams.get('type');
  const score = searchParams.get('score');
  const router = useRouter();

  // Get capability data from Redux instead of localStorage
  const capabilityData = useAppSelector(
    state => state.persist.capabilityResponse
  );
  const resumeData = useAppSelector(state => state.persist.resumeData);
  const evaluationResult = useAppSelector(
    state => state.persist.evaluationResult
  );

  // Debug Redux store state
  useEffect(() => {
    console.log('=== REDUX DEBUG INFO ===');
    console.log('Has Capability Data:', !!capabilityData);
    console.log('Has Resume Data:', !!resumeData);
    console.log('Has Evaluation Result:', !!evaluationResult);

    if (evaluationResult) {
      console.log(
        'Evaluation Data:',
        JSON.stringify(evaluationResult, null, 2)
      );
    }
    console.log('=== END DEBUG INFO ===');
  }, [capabilityData, resumeData, evaluationResult, type, score]);

  useEffect(() => {
    const loadFeedbackData = () => {
      try {
        let items: ReportItem[] = [];

        if (type === 'coding') {
          if (evaluationResult) {
            items = generateCodingReportItems(evaluationResult);
          } else {
            const overallScore = parseFloat(score || '0');
            items = [
              {
                text: `Coding Assessment Score: ${overallScore} (Required: 60)`,
                isPassed: overallScore >= 60,
              },
            ];
          }
        } else if (type === 'mcq') {
          const overallScore = parseFloat(score || '0');
          items = [
            {
              text: `MCQ Assessment Score: ${overallScore} (Required: 60)`,
              isPassed: overallScore >= 60,
            },
          ];
        } else {
          if (capabilityData) {
            items = generateResumeReportItems(capabilityData);
          } else {
            const storedData = localStorage.getItem('capabilityResponse');
            if (storedData) {
              const parsedData: CapabilityResponse = JSON.parse(storedData);
              items = generateResumeReportItems(parsedData);
            } else {
              items = [
                { text: 'No assessment data available', isPassed: false },
              ];
            }
          }
        }

        setReportItems(items);
      } catch {
        setReportItems([{ text: 'Data Loading Error', isPassed: false }]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeedbackData();
  }, [capabilityData, evaluationResult, type, score]);

  const generateCodingReportItems = (data: EvaluationResult): ReportItem[] => {
    const items: ReportItem[] = [];
    const passingScore = 60;

    items.push({
      text: `Overall Score: ${data.overall_score} (Required: ${passingScore})`,
      isPassed: data.overall_score >= passingScore,
    });

    items.push({
      text: `Functionality: ${data.score_breakdown.functionality}%`,
      isPassed: data.score_breakdown.functionality >= 50,
    });

    items.push({
      text: `Code Quality: ${data.score_breakdown.code_quality}%`,
      isPassed: data.score_breakdown.code_quality >= 50,
    });

    items.push({
      text: `Best Practices: ${data.score_breakdown.best_practices}%`,
      isPassed: data.score_breakdown.best_practices >= 50,
    });

    items.push({
      text: `Completeness: ${data.score_breakdown.completeness}%`,
      isPassed: data.score_breakdown.completeness >= 50,
    });

    items.push({
      text: `Performance: ${data.score_breakdown.performance}%`,
      isPassed: data.score_breakdown.performance >= 50,
    });

    return items;
  };

  const generateResumeReportItems = (
    data: CapabilityResponse
  ): ReportItem[] => {
    const items: ReportItem[] = [];
    const passed = data.score >= 60;

    items.push({
      text: `Resume Analysis Score: ${data.score}% (Required: 60%)`,
      isPassed: passed,
    });
    return items;
  };

  const handleUpskillClick = () => {
    // window.open('https://chordifyed.com', '_blank');
    router.push('/faujx-lms');
  };

  const getTitle = () => {
    if (type === 'mcq') {
      return 'Assessment Feedback';
    }
    if (type === 'coding') {
      return 'Coding Assessment Feedback';
    }
    return 'Feedback on Your Resume';
  };

  const getSubtitle = () => {
    if (type === 'mcq') {
      return 'Thank you for participating in the recent assessment. Unfortunately, you did not achieve the required cutoff mark this time.';
    }

    if (type === 'coding') {
      const overallScore =
        evaluationResult?.overall_score || parseFloat(score || '0');
      const passed = overallScore >= 60;

      if (passed) {
        return `Congratulations! Your coding assessment shows a score of ${overallScore}, which meets our requirements.`;
      } else {
        return `Thank you for participating in the coding assessment. Your score of ${overallScore} did not meet the required threshold of 60.`;
      }
    }

    if (!capabilityData) {
      return 'Thank you for participating in the recent assessment.';
    }

    const passed = capabilityData.score >= 60;
    if (passed) {
      return `Congratulations! Your resume analysis shows a score of ${capabilityData.score}%, which meets our requirements.`;
    } else {
      return `Thank you for submitting your resume. Your analysis shows a score of ${capabilityData.score}, which did not meet the required threshold of 60.`;
    }
  };

  const getDescription = () => {
    if (type === 'mcq') {
      return 'After reviewing your performance, it appears you could benefit from further development';
    }

    if (type === 'coding') {
      const overallScore =
        evaluationResult?.overall_score || parseFloat(score || '0');
      const passed = overallScore >= 60;

      if (passed) {
        return `Excellent work! Your coding submission demonstrates strong technical skills and understanding of best practices.`;
      } else {
        return `After reviewing your coding submission, we've identified several areas where you can improve your programming skills and code quality.`;
      }
    }

    if (!capabilityData) return 'We are analyzing your performance...';

    const passed = capabilityData.score >= 60;
    if (passed) {
      return `Great work! Your resume demonstrates strong alignment with our requirements. You successfully matched ${capabilityData.matched_capabilities.length} key capabilities.`;
    } else {
      return `After reviewing your performance, we've identified areas where you could strengthen your profile to better match our requirements.`;
    }
  };

  const getSupportText = () => {
    if (type === 'mcq') {
      return 'To support your learning, I recommend exploring Faujx LMS, a platform with resources and exercises specifically tailored to building and improving skills. Engaging with their guided tutorials and real-world projects can help bridge these skill gaps.';
    }

    if (type === 'coding') {
      const overallScore =
        evaluationResult?.overall_score || parseFloat(score || '0');
      const passed = overallScore >= 60;

      if (passed) {
        return 'Keep up the excellent work! Continue practicing coding challenges and stay updated with the latest development practices.';
      } else {
        let supportText =
          'To improve your coding skills, I recommend exploring Faujx LMS, a platform with resources and exercises specifically tailored to building programming expertise.';

        if (evaluationResult) {
          supportText += ' Focus on areas like:';
          if (evaluationResult.score_breakdown.functionality < 50) {
            supportText += ' implementing core functionality,';
          }
          if (evaluationResult.score_breakdown.code_quality < 50) {
            supportText += ' improving code quality and readability,';
          }
          if (evaluationResult.score_breakdown.best_practices < 50) {
            supportText += ' following best practices,';
          }
          if (evaluationResult.score_breakdown.completeness < 50) {
            supportText += ' completing all requirements,';
          }
          if (evaluationResult.score_breakdown.performance < 50) {
            supportText += ' optimizing performance.';
          }
          supportText = supportText.replace(/,$/, '.'); // Remove trailing comma
        }

        return supportText;
      }
    }

    if (!capabilityData) return '';

    const passed = capabilityData.score >= 60;
    if (passed) {
      return 'Keep up the excellent work! Continue developing your skills and stay updated with the latest technologies in your field.';
    } else {
      return `To support your learning journey, I recommend exploring Chordify Ed, a platform with resources and exercises specifically tailored to building and improving the skills you need. Focus on strengthening your profile in the key areas we've identified.`;
    }
  };
  // Get candidate name from multiple sources
  const getCandidateName = () => {
    return (
      userName ||
      capabilityData?.candidate_name ||
      capabilityData?.metadata?.candidate_email?.split('@')[0] ||
      resumeData?.firstName ||
      `${resumeData?.user?.firstName || ''} ${resumeData?.user?.lastName || ''}`.trim() ||
      'Candidate'
    );
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[calc(100vh-130px)] flex items-center justify-center">
        <div className="text-lg">Loading your feedback...</div>
      </div>
    );
  }

  return (
    <FeedbackComponent
      userName={getCandidateName()}
      title={getTitle()}
      subtitle={getSubtitle()}
      description={getDescription()}
      reportItems={reportItems}
      supportText={getSupportText()}
      buttonText="Upskill with FaujX LMS"
      onButtonClick={handleUpskillClick}
      type={type || null}
      score={score || 0}
    />
  );
};

const FeedbackPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[calc(100vh-130px)] flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      }
    >
      <FeedbackContent />
    </Suspense>
  );
};

export default FeedbackPage;
