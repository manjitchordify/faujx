'use client';
import React, { useEffect, useState } from 'react';
import {
  getReportApi,
  CandidateReportResponse,
} from '@/services/reportService';
import { useParams } from 'next/navigation';

const VettingReport: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Resume Analysis');
  const [candidateData, setCandidateData] =
    useState<CandidateReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const candidateId = params?.id as string;

  const tabs = [
    'Resume Analysis',
    'Capability',
    'MCQ',
    'Coding',
    'Evaluation',
    'Interview Notes',
  ];

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Hire':
      case 'HIRE':
        return 'text-green-600 bg-green-50';
      case 'Reject':
      case 'REJECT':
        return 'text-red-600 bg-red-50';
      case 'Review':
      case 'REVIEW':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Fetch vetting report data
  useEffect(() => {
    const fetchVettingReport = async () => {
      if (!candidateId) {
        setError('No candidate ID available');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getReportApi(candidateId);
        setCandidateData(response);
      } catch (err) {
        console.error('Error fetching vetting report:', err);
        setError('Failed to load vetting report. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchVettingReport();
  }, [candidateId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F514C] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vetting report...</p>
        </div>
      </div>
    );
  }

  if (error || !candidateData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'No data available'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#1F514C] text-white rounded hover:bg-[#1a453f]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const renderScoreBar = (score: number, maxScore: number = 10) => (
    <div className="flex items-center space-x-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className="bg-[#1F514C] h-2 rounded-full"
          style={{ width: `${(score / maxScore) * 100}%` }}
        ></div>
      </div>
      <span className="text-sm font-medium text-gray-700">
        {score}/{maxScore}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 pt-8">
        {/* Executive Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Executive Summary
          </h2>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <span className="font-semibold text-gray-700">
                  Candidate Name:{' '}
                </span>
                <span className="text-gray-900">
                  {candidateData.executiveSummary.candidateName.trim()}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  Department:{' '}
                </span>
                <span className="text-gray-900">
                  {candidateData.executiveSummary.department}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  Evaluated By:{' '}
                </span>
                <span className="text-gray-900">
                  {candidateData.executiveSummary.evaluatedBy}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="font-semibold text-gray-700">
                  Position Applied:{' '}
                </span>
                <span className="text-gray-900">
                  {candidateData.executiveSummary.positionApplied}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  Report Date:{' '}
                </span>
                <span className="text-gray-900">
                  {candidateData.executiveSummary.reportDate}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  Overall Recommendation:{' '}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getRecommendationColor(candidateData.executiveSummary.overallRecommendation)}`}
                >
                  {candidateData.executiveSummary.overallRecommendation}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-[#1F514C] text-[#1F514C] bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'Resume Analysis' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Resume Analysis & Profile Overview
                </h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Personal Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <span className="font-semibold text-gray-700">
                          Full Name:{' '}
                        </span>
                        <span className="text-gray-900">
                          {candidateData.resumeAnalysis.personalInfo.fullName.trim()}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">
                          Location:{' '}
                        </span>
                        <span className="text-gray-900">
                          {candidateData.resumeAnalysis.personalInfo.location ||
                            'Not specified'}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">
                          Experience:{' '}
                        </span>
                        <span className="text-gray-900">
                          {candidateData.resumeAnalysis.personalInfo.experience}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">
                          Current Role:{' '}
                        </span>
                        <span className="text-gray-900">
                          {
                            candidateData.resumeAnalysis.personalInfo
                              .currentRole
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Education
                    </h4>
                    <div className="space-y-3">
                      {candidateData.resumeAnalysis.education.map(
                        (edu, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-4 rounded-lg"
                          >
                            <p className="text-gray-900 font-medium">
                              {edu.degree}
                            </p>
                            {edu.institution && (
                              <p className="text-gray-700">{edu.institution}</p>
                            )}
                            <p className="text-gray-600 text-sm">{edu.year}</p>
                            {edu.field && (
                              <p className="text-gray-600 text-sm">
                                Field: {edu.field}
                              </p>
                            )}
                            {edu.gpa && (
                              <p className="text-gray-600 text-sm">
                                GPA: {edu.gpa}
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Work Experience
                    </h4>
                    <div className="space-y-4">
                      {candidateData.resumeAnalysis.experience.map(
                        (exp, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-4 rounded-lg"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-semibold text-gray-900">
                                {exp.title}
                              </h5>
                              <span className="text-sm text-gray-500">
                                {exp.start_date} - {exp.end_date}
                              </span>
                            </div>
                            <p className="text-gray-700 font-medium mb-2">
                              {exp.company}
                            </p>
                            <p className="text-gray-600">{exp.description}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {candidateData.resumeAnalysis.skills &&
                    candidateData.resumeAnalysis.skills.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          Skills
                        </h4>
                        <p className="text-gray-900">
                          {candidateData.resumeAnalysis.skills.join(', ')}
                        </p>
                      </div>
                    )}

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Resume Quality
                    </h4>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-[#1F514C] h-3 rounded-full"
                          style={{
                            width: `${candidateData.resumeAnalysis.resumeQuality}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        {candidateData.resumeAnalysis.resumeQuality}/100
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'MCQ' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  MCQ Test Results
                </h3>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Test Overview
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-semibold text-gray-700">
                          Total Questions:{' '}
                        </span>
                        <span className="text-gray-900">
                          {candidateData.mcq.testOverview.totalQuestions}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">
                          Attempted:{' '}
                        </span>
                        <span className="text-gray-900">
                          {candidateData.mcq.testOverview.attempted}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">
                          Correct:{' '}
                        </span>
                        <span className="text-gray-900">
                          {candidateData.mcq.testOverview.correct}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">
                          Score:{' '}
                        </span>
                        <span className="text-green-600 font-medium">
                          {candidateData.mcq.testOverview.score}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Category-wise Performance
                    </h4>
                    <div className="space-y-2">
                      {candidateData.mcq.categoryWisePerformance.map(
                        (category, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center bg-gray-50 p-3 rounded"
                          >
                            <span className="font-medium text-gray-900">
                              {category.category}
                            </span>
                            <span className="text-gray-700">
                              {category.accuracy}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        Strengths
                      </h4>
                      <div className="space-y-1">
                        {candidateData.mcq.strengthsAndWeaknesses.strengths.map(
                          (strength, index) => (
                            <span
                              key={index}
                              className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full mr-2"
                            >
                              {strength}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        Weaknesses
                      </h4>
                      <div className="space-y-1">
                        {candidateData.mcq.strengthsAndWeaknesses.weaknesses.map(
                          (weakness, index) => (
                            <span
                              key={index}
                              className="inline-block bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full mr-2"
                            >
                              {weakness}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        Time Management
                      </h4>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-900 mb-1">
                          <span className="font-semibold">
                            Avg Time per Question:{' '}
                          </span>
                          {candidateData.mcq.timeManagement.avgTimePerQuestion}
                        </p>
                        <p className="text-gray-700 text-sm">
                          {candidateData.mcq.timeManagement.observations}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        Difficulty Analysis
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between bg-gray-50 p-2 rounded">
                          <span className="font-medium text-gray-900">
                            Easy:
                          </span>
                          <span className="text-green-600">
                            {candidateData.mcq.difficultyAnalysis.easy}
                          </span>
                        </div>
                        <div className="flex justify-between bg-gray-50 p-2 rounded">
                          <span className="font-medium text-gray-900">
                            Medium:
                          </span>
                          <span className="text-yellow-600">
                            {candidateData.mcq.difficultyAnalysis.medium}
                          </span>
                        </div>
                        <div className="flex justify-between bg-gray-50 p-2 rounded">
                          <span className="font-medium text-gray-900">
                            Hard:
                          </span>
                          <span className="text-red-600">
                            {candidateData.mcq.difficultyAnalysis.hard}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Capability' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Capability Assessment
                </h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Core Competencies
                    </h4>
                    <div className="space-y-3">
                      {candidateData.capability.coreCompetencies.map(
                        (comp, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-gray-900">
                                {comp.name}
                              </span>
                            </div>
                            {renderScoreBar(comp.score)}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Role-Specific Skills
                    </h4>
                    <div className="space-y-3">
                      {candidateData.capability.roleSpecificSkills.map(
                        (skill, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-gray-900">
                                {skill.name}
                              </span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">
                                  ({skill.weight})
                                </span>
                              </div>
                            </div>
                            {renderScoreBar(skill.score)}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Soft Skills
                      </h4>
                      <div className="space-y-3">
                        {candidateData.capability.softSkills.map(
                          (skill, index) => (
                            <div key={index}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-gray-900">
                                  {skill.name}
                                </span>
                              </div>
                              {renderScoreBar(skill.score)}
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Domain Knowledge
                      </h4>
                      <div className="space-y-3">
                        {candidateData.capability.domainKnowledge.map(
                          (domain, index) => (
                            <div key={index}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-gray-900">
                                  {domain.name}
                                </span>
                              </div>
                              {renderScoreBar(domain.score)}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Coding' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Coding Assessment
                </h3>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Overall Score
                    </h4>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-[#1F514C] h-4 rounded-full"
                          style={{
                            width: `${candidateData.coding.overallScore}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-2xl font-bold text-gray-900">
                        {candidateData.coding.overallScore}/100
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        Strengths
                      </h4>
                      <div className="space-y-2">
                        {candidateData.coding.strengths.map(
                          (strength, index) => (
                            <span
                              key={index}
                              className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full mr-2"
                            >
                              {strength}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        Areas for Improvement
                      </h4>
                      <div className="space-y-2">
                        {candidateData.coding.weaknesses.map(
                          (weakness, index) => (
                            <span
                              key={index}
                              className="inline-block bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full mr-2"
                            >
                              {weakness}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Evaluation' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Final Evaluation
                </h3>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Overall Score
                        </h4>
                        <div className="text-3xl font-bold text-[#1F514C] mb-2">
                          {candidateData.evaluation.totalWeightedScore}/10
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-[#1F514C] h-3 rounded-full"
                            style={{
                              width: `${(candidateData.evaluation.totalWeightedScore / 10) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Recommendation
                        </h4>
                        <span
                          className={`px-4 py-2 rounded-full text-lg font-medium ${getRecommendationColor(candidateData.evaluation.recommendation)}`}
                        >
                          {candidateData.evaluation.recommendation}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div></div>
                </div>
              </div>
            )}

            {activeTab === 'Interview Notes' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Interview Notes
                </h3>

                <div className="bg-gray-50 p-6 rounded-lg">
                  {candidateData.interviewNotes.notes.map((note, index) => (
                    <p key={index} className="text-gray-900 mb-2">
                      {note}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VettingReport;
