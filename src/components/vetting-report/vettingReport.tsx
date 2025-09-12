'use client';
import React, { useEffect, useState } from 'react';
import {
  User,
  Calendar,
  MapPin,
  Briefcase,
  Award,
  Clock,
  Target,
  Code,
  MessageCircle,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
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
    { id: 'Resume Analysis', icon: User },
    { id: 'Capability', icon: Target },
    { id: 'MCQ', icon: Award },
    { id: 'Coding', icon: Code },
    { id: 'Evaluation', icon: TrendingUp },
    { id: 'Interview Notes', icon: MessageCircle },
  ];

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

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Hire':
      case 'HIRE':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Reject':
      case 'REJECT':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'Review':
      case 'REVIEW':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'Hire':
      case 'HIRE':
        return <CheckCircle className="w-5 h-5" />;
      case 'Reject':
      case 'REJECT':
        return <XCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const renderScoreBar = (
    score: number,
    maxScore: number = 10,
    color: string = '#059669'
  ) => (
    <div className="flex items-center space-x-3">
      <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-2.5 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${(score / maxScore) * 100}%`,
            backgroundColor: color,
          }}
        ></div>
      </div>
      <span className="text-sm font-semibold text-gray-700 min-w-[40px]">
        {score}/{maxScore}
      </span>
    </div>
  );

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

  // Safe chart data preparation with fallbacks
  const mcqCategoryData =
    candidateData?.mcq?.categoryWisePerformance?.map(item => ({
      category: item.category || 'Unknown',
      accuracy: parseInt(item.accuracy?.split('%')[0] || '0'),
    })) || [];

  const difficultyData = [
    {
      difficulty: 'Easy',
      percentage: parseInt(
        candidateData?.mcq?.difficultyAnalysis?.easy?.split('%')[0] || '0'
      ),
    },
    {
      difficulty: 'Medium',
      percentage: parseInt(
        candidateData?.mcq?.difficultyAnalysis?.medium?.split('%')[0] || '0'
      ),
    },
    {
      difficulty: 'Hard',
      percentage: parseInt(
        candidateData?.mcq?.difficultyAnalysis?.hard?.split('%')[0] || '0'
      ),
    },
  ];

  const capabilityRadarData = [
    ...(candidateData?.capability?.coreCompetencies || []),
    ...(candidateData?.capability?.softSkills || []),
    ...(candidateData?.capability?.domainKnowledge || []),
  ].map(item => ({
    subject: item?.name || 'Unknown Skill',
    score: item?.score || 0,
    fullMark: 10,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6 pt-8">
        {/* Enhanced Executive Summary */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Candidate Vetting Report
            </h1>
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${getRecommendationColor(candidateData?.executiveSummary?.overallRecommendation || 'Review')}`}
            >
              {getRecommendationIcon(
                candidateData?.executiveSummary?.overallRecommendation ||
                  'Review'
              )}
              <span className="font-semibold">
                {candidateData?.executiveSummary?.overallRecommendation ||
                  'Under Review'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Candidate Name</p>
                      <p className="font-semibold text-gray-900">
                        {candidateData?.executiveSummary?.candidateName?.trim() ||
                          'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Position Applied</p>
                      <p className="font-semibold text-gray-900">
                        {candidateData?.executiveSummary?.positionApplied ||
                          'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-semibold text-gray-900">
                        {candidateData?.executiveSummary?.department || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Report Date</p>
                      <p className="font-semibold text-gray-900">
                        {candidateData?.executiveSummary?.reportDate || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Score Visualization */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Overall Score
              </h3>
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg
                    className="w-24 h-24 transform -rotate-90"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="#E5E7EB"
                      strokeWidth="2"
                      fill="none"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="#059669"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray={`${((candidateData?.evaluation?.totalWeightedScore || 0) / 10) * 62.83} 62.83`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-emerald-700">
                      {candidateData?.evaluation?.totalWeightedScore || '0'}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">out of 10</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.id}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Enhanced Tab Content */}
          <div className="p-8">
            {activeTab === 'Resume Analysis' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-gray-900">
                  Resume Analysis & Profile Overview
                </h3>

                {/* Personal Information Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                    <User className="w-8 h-8 text-blue-600 mb-3" />
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-semibold text-gray-900">
                      {candidateData?.resumeAnalysis?.personalInfo?.fullName?.trim() ||
                        'N/A'}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                    <MapPin className="w-8 h-8 text-purple-600 mb-3" />
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">
                      {candidateData?.resumeAnalysis?.personalInfo?.location ||
                        'Not specified'}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                    <Clock className="w-8 h-8 text-green-600 mb-3" />
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-semibold text-gray-900">
                      {candidateData?.resumeAnalysis?.personalInfo
                        ?.experience || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg">
                    <Briefcase className="w-8 h-8 text-orange-600 mb-3" />
                    <p className="text-sm text-gray-600">Current Role</p>
                    <p className="font-semibold text-gray-900">
                      {candidateData?.resumeAnalysis?.personalInfo
                        ?.currentRole || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Skills Section */}
                {candidateData?.resumeAnalysis?.skills &&
                candidateData.resumeAnalysis.skills.length > 0 ? (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Code className="w-5 h-5 text-indigo-600 mr-2" />
                      Technical Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {candidateData.resumeAnalysis.skills.map(
                        (skill, index) => (
                          <span
                            key={index}
                            className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full border border-indigo-200"
                          >
                            {skill || 'Unknown Skill'}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Code className="w-5 h-5 text-indigo-600 mr-2" />
                      Technical Skills
                    </h4>
                    <p className="text-gray-500 italic">
                      No technical skills information available.
                    </p>
                  </div>
                )}

                {/* Education Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Award className="w-5 h-5 text-blue-600 mr-2" />
                    Education
                  </h4>
                  <div className="space-y-4">
                    {candidateData?.resumeAnalysis?.education &&
                    candidateData.resumeAnalysis.education.length > 0 ? (
                      candidateData.resumeAnalysis.education.map(
                        (edu, index) => (
                          <div
                            key={index}
                            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h5 className="font-semibold text-gray-900 text-lg">
                                  {edu?.degree || 'Degree not specified'}
                                </h5>
                                {edu?.field && (
                                  <p className="text-blue-600 font-medium">
                                    {edu.field}
                                  </p>
                                )}
                              </div>
                              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {edu?.year || 'Year not specified'}
                              </span>
                            </div>
                            {edu?.institution && (
                              <p className="text-gray-700 mb-2">
                                {edu.institution}
                              </p>
                            )}
                            {edu?.location && (
                              <p className="text-gray-600 text-sm mb-2">
                                📍 {edu.location}
                              </p>
                            )}
                            {edu?.gpa && (
                              <p className="text-gray-600 text-sm">
                                <span className="font-medium">GPA:</span>{' '}
                                {edu.gpa}
                              </p>
                            )}
                            {edu?.honors && edu.honors.length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-gray-700 mb-1">
                                  Honors & Awards:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {edu.honors.map((honor, honorIndex) => (
                                    <span
                                      key={honorIndex}
                                      className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full"
                                    >
                                      {honor || 'Honor not specified'}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      )
                    ) : (
                      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                        <p className="text-gray-500 italic">
                          No education information available.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Experience Timeline */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6">
                    Work Experience
                  </h4>
                  <div className="space-y-6">
                    {candidateData?.resumeAnalysis?.experience &&
                    candidateData.resumeAnalysis.experience.length > 0 ? (
                      candidateData.resumeAnalysis.experience.map(
                        (exp, index) => (
                          <div
                            key={index}
                            className="relative pl-8 pb-6 border-l-2 border-emerald-200 last:border-l-0"
                          >
                            <div className="absolute w-4 h-4 bg-emerald-500 rounded-full -left-2 top-0"></div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-semibold text-gray-900">
                                  {exp?.title || 'Position not specified'}
                                </h5>
                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {exp?.start_date || 'N/A'} -{' '}
                                  {exp?.end_date || 'N/A'}
                                </span>
                              </div>
                              <p className="text-emerald-600 font-medium mb-2">
                                {exp?.company || 'Company not specified'}
                              </p>
                              <p className="text-gray-600">
                                {exp?.description || 'No description available'}
                              </p>
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                        <p className="text-gray-500 italic">
                          No work experience information available.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Resume Quality with Visual */}
                <div className="bg-white border-2 border-gray-200 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Resume Quality Score
                  </h4>
                  <div className="flex items-center space-x-6">
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          Quality Score
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {candidateData?.resumeAnalysis?.resumeQuality || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 h-4 rounded-full transition-all duration-1000"
                          style={{
                            width: `${candidateData?.resumeAnalysis?.resumeQuality || 0}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {candidateData?.resumeAnalysis?.resumeQuality || 0}/100
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'MCQ' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-gray-900">
                  MCQ Test Results
                </h3>

                {/* Test Overview Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {candidateData?.mcq?.testOverview?.totalQuestions || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Questions</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {candidateData?.mcq?.testOverview?.attempted || 0}
                    </div>
                    <div className="text-sm text-gray-600">Attempted</div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold text-emerald-600">
                      {candidateData?.mcq?.testOverview?.correct || 0}
                    </div>
                    <div className="text-sm text-gray-600">Correct Answers</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {candidateData?.mcq?.testOverview?.score?.split(' ')[0] ||
                        '0%'}
                    </div>
                    <div className="text-sm text-gray-600">Overall Score</div>
                  </div>
                </div>

                {/* Charts Section - CSS Based */}
                {mcqCategoryData.length > 0 ||
                difficultyData.some(d => d.percentage > 0) ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Category Performance Chart */}
                    <div className="bg-white border-2 border-gray-200 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Category Performance
                      </h4>
                      {mcqCategoryData.length > 0 ? (
                        <div className="space-y-4">
                          {mcqCategoryData.map((item, index) => (
                            <div key={index} className="relative">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-gray-700">
                                  {item.category}
                                </span>
                                <span className="font-bold text-emerald-600">
                                  {item.accuracy}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                  className="bg-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out"
                                  style={{ width: `${item.accuracy}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic text-center py-8">
                          No category performance data available.
                        </p>
                      )}
                    </div>

                    {/* Difficulty Analysis Donut Chart */}
                    <div className="bg-white border-2 border-gray-200 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Difficulty Analysis
                      </h4>
                      {difficultyData.some(d => d.percentage > 0) ? (
                        <>
                          <div className="flex items-center justify-center">
                            <div className="relative w-48 h-48">
                              {/* CSS Donut Chart */}
                              <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                  background: `conic-gradient(
                                       #059669 0% ${difficultyData[0].percentage}%,
                                       #DC2626 ${difficultyData[0].percentage}% ${difficultyData[0].percentage + difficultyData[1].percentage}%,
                                       #D97706 ${difficultyData[0].percentage + difficultyData[1].percentage}% 100%
                                     )`,
                                }}
                              >
                                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-800">
                                      100%
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      Complete
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 space-y-2">
                            {difficultyData.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center space-x-2">
                                  <div
                                    className={`w-3 h-3 rounded-full ${
                                      index === 0
                                        ? 'bg-emerald-500'
                                        : index === 1
                                          ? 'bg-red-600'
                                          : 'bg-orange-600'
                                    }`}
                                  ></div>
                                  <span className="text-sm font-medium text-gray-700">
                                    {item.difficulty}
                                  </span>
                                </div>
                                <span className="font-bold text-gray-800">
                                  {item.percentage}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-500 italic text-center py-8">
                          No difficulty analysis data available.
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border-2 border-gray-200 p-8 rounded-lg text-center">
                    <p className="text-gray-500 italic">
                      No MCQ performance charts data available.
                    </p>
                  </div>
                )}

                {/* Time Management and Additional Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Clock className="w-5 h-5 text-blue-600 mr-2" />
                      Time Management
                    </h4>
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border border-blue-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-700">
                            Average Time per Question
                          </span>
                          <span className="text-xl font-bold text-blue-600">
                            {candidateData?.mcq?.timeManagement
                              ?.avgTimePerQuestion || 'N/A'}
                          </span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: '60%' }}
                          ></div>
                        </div>
                      </div>
                      <div className="bg-blue-100 p-4 rounded-lg border border-blue-200">
                        <h5 className="font-medium text-gray-900 mb-2">
                          Key Observations:
                        </h5>
                        <p className="text-gray-700 text-sm">
                          {candidateData?.mcq?.timeManagement?.observations ||
                            'No observations available.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Difficulty Analysis
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-purple-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">
                            Easy Questions
                          </span>
                        </div>
                        <span className="text-green-600 font-bold">
                          {candidateData?.mcq?.difficultyAnalysis?.easy || '0%'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-purple-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">
                            Medium Questions
                          </span>
                        </div>
                        <span className="text-yellow-600 font-bold">
                          {candidateData?.mcq?.difficultyAnalysis?.medium ||
                            '0%'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-purple-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">
                            Hard Questions
                          </span>
                        </div>
                        <span className="text-red-600 font-bold">
                          {candidateData?.mcq?.difficultyAnalysis?.hard || '0%'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strengths and Weaknesses */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Strengths
                    </h4>
                    <div className="space-y-2">
                      {candidateData?.mcq?.strengthsAndWeaknesses?.strengths &&
                      candidateData.mcq.strengthsAndWeaknesses.strengths
                        .length > 0 ? (
                        candidateData.mcq.strengthsAndWeaknesses.strengths.map(
                          (strength, index) => (
                            <span
                              key={index}
                              className="inline-block bg-green-200 text-green-800 text-sm px-4 py-2 rounded-full mr-2 mb-2"
                            >
                              {strength || 'Strength not specified'}
                            </span>
                          )
                        )
                      ) : (
                        <p className="text-gray-500 italic">
                          No strengths information available.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="bg-red-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                      Areas for Improvement
                    </h4>
                    <div className="space-y-2">
                      {candidateData?.mcq?.strengthsAndWeaknesses?.weaknesses &&
                      candidateData.mcq.strengthsAndWeaknesses.weaknesses
                        .length > 0 ? (
                        candidateData.mcq.strengthsAndWeaknesses.weaknesses.map(
                          (weakness, index) => (
                            <span
                              key={index}
                              className="inline-block bg-red-200 text-red-800 text-sm px-4 py-2 rounded-full mr-2 mb-2"
                            >
                              {weakness || 'Weakness not specified'}
                            </span>
                          )
                        )
                      ) : (
                        <p className="text-gray-500 italic">
                          No weaknesses information available.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Capability' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-gray-900">
                  Capability Assessment
                </h3>

                {/* Skills Overview Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg text-center">
                    <Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-blue-600">
                      {candidateData?.capability?.coreCompetencies &&
                      candidateData.capability.coreCompetencies.length > 0
                        ? Math.round(
                            (candidateData.capability.coreCompetencies.reduce(
                              (sum, item) => sum + (item?.score || 0),
                              0
                            ) /
                              candidateData.capability.coreCompetencies
                                .length) *
                              10
                          )
                        : 0}
                      %
                    </div>
                    <div className="text-sm text-gray-600">
                      Core Competencies
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg text-center">
                    <Code className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-purple-600">
                      {candidateData?.capability?.roleSpecificSkills &&
                      candidateData.capability.roleSpecificSkills.length > 0
                        ? Math.round(
                            (candidateData.capability.roleSpecificSkills.reduce(
                              (sum, item) => sum + (item?.score || 0),
                              0
                            ) /
                              candidateData.capability.roleSpecificSkills
                                .length) *
                              10
                          )
                        : 0}
                      %
                    </div>
                    <div className="text-sm text-gray-600">
                      Technical Skills
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg text-center">
                    <MessageCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-green-600">
                      {candidateData?.capability?.softSkills &&
                      candidateData.capability.softSkills.length > 0
                        ? Math.round(
                            (candidateData.capability.softSkills.reduce(
                              (sum, item) => sum + (item?.score || 0),
                              0
                            ) /
                              candidateData.capability.softSkills.length) *
                              10
                          )
                        : 0}
                      %
                    </div>
                    <div className="text-sm text-gray-600">Soft Skills</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg text-center">
                    <Award className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-orange-600">
                      {candidateData?.capability?.domainKnowledge &&
                      candidateData.capability.domainKnowledge.length > 0
                        ? Math.round(
                            (candidateData.capability.domainKnowledge.reduce(
                              (sum, item) => sum + (item?.score || 0),
                              0
                            ) /
                              candidateData.capability.domainKnowledge.length) *
                              10
                          )
                        : 0}
                      %
                    </div>
                    <div className="text-sm text-gray-600">
                      Domain Knowledge
                    </div>
                  </div>
                </div>

                {/* Enhanced Skills Overview with Multiple Visualizations */}
                {capabilityRadarData.length > 0 ? (
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Horizontal Bar Chart with Skill Categories */}
                    <div className="xl:col-span-2 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 p-8 rounded-xl shadow-lg">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xl font-bold text-gray-900 flex items-center">
                          <Target className="w-6 h-6 text-emerald-600 mr-3" />
                          Skills Proficiency Matrix
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                            <span>0-4</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                            <span>5-6</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                            <span>7-8</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                            <span>9-10</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {capabilityRadarData.map((skill, index) => {
                          const getSkillColor = (score: number) => {
                            if (score >= 9)
                              return {
                                bg: 'bg-emerald-500',
                                text: 'text-emerald-700',
                                light: 'bg-emerald-100',
                              };
                            if (score >= 7)
                              return {
                                bg: 'bg-green-400',
                                text: 'text-green-700',
                                light: 'bg-green-100',
                              };
                            if (score >= 5)
                              return {
                                bg: 'bg-yellow-400',
                                text: 'text-yellow-700',
                                light: 'bg-yellow-100',
                              };
                            return {
                              bg: 'bg-red-400',
                              text: 'text-red-700',
                              light: 'bg-red-100',
                            };
                          };

                          const colors = getSkillColor(skill.score);
                          const percentage = (skill.score / 10) * 100;

                          return (
                            <div
                              key={index}
                              className="group hover:bg-white hover:shadow-md rounded-lg p-4 transition-all duration-200"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                  <div
                                    className={`w-3 h-3 rounded-full ${colors.bg}`}
                                  ></div>
                                  <span className="font-medium text-gray-800 text-sm">
                                    {skill.subject}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full font-medium ${colors.light} ${colors.text}`}
                                  >
                                    {skill.score >= 9
                                      ? 'Expert'
                                      : skill.score >= 7
                                        ? 'Advanced'
                                        : skill.score >= 5
                                          ? 'Intermediate'
                                          : 'Basic'}
                                  </span>
                                  <span className="font-bold text-gray-700 min-w-[32px] text-right">
                                    {skill.score}/10
                                  </span>
                                </div>
                              </div>
                              <div className="relative">
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-700 ease-out ${colors.bg}`}
                                    style={{
                                      width: `${percentage}%`,
                                      boxShadow: `0 0 10px ${colors.bg.includes('emerald') ? '#10b981' : colors.bg.includes('green') ? '#22c55e' : colors.bg.includes('yellow') ? '#eab308' : '#ef4444'}40`,
                                    }}
                                  ></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                  <span>Beginner</span>
                                  <span>Intermediate</span>
                                  <span>Advanced</span>
                                  <span>Expert</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Skills Distribution Chart - CSS Based */}
                      <div className="mt-8 pt-6 border-t border-gray-300">
                        <h5 className="text-lg font-semibold text-gray-800 mb-4">
                          Skills Distribution
                        </h5>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {capabilityRadarData.map((skill, index) => (
                            <div key={index} className="text-center">
                              <div className="relative w-16 h-16 mx-auto mb-2">
                                <svg
                                  className="w-16 h-16 transform -rotate-90"
                                  viewBox="0 0 36 36"
                                >
                                  <path
                                    d="M18 2.0845
                                      a 15.9155 15.9155 0 0 1 0 31.831
                                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#E5E7EB"
                                    strokeWidth="3"
                                  />
                                  <path
                                    d="M18 2.0845
                                      a 15.9155 15.9155 0 0 1 0 31.831
                                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#059669"
                                    strokeWidth="3"
                                    strokeDasharray={`${(skill.score / 10) * 100}, 100`}
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-xs font-bold text-gray-700">
                                    {skill.score}
                                  </span>
                                </div>
                              </div>
                              <div className="text-xs text-gray-600 truncate">
                                {skill.subject}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Skills Summary Cards */}
                    <div className="space-y-6">
                      <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4">
                          <h5 className="text-white font-semibold flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Top Performing Skills
                          </h5>
                        </div>
                        <div className="p-4 space-y-3">
                          {capabilityRadarData
                            .sort((a, b) => b.score - a.score)
                            .slice(0, 5)
                            .map((skill, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center space-x-2">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      index === 0
                                        ? 'bg-yellow-400'
                                        : index === 1
                                          ? 'bg-gray-400'
                                          : index === 2
                                            ? 'bg-orange-400'
                                            : 'bg-emerald-400'
                                    }`}
                                  ></div>
                                  <span className="text-sm font-medium text-gray-700 truncate">
                                    {skill.subject}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                                      style={{
                                        width: `${(skill.score / 10) * 100}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-xs font-bold text-gray-600 min-w-[24px]">
                                    {skill.score}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4">
                          <h5 className="text-white font-semibold flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Development Areas
                          </h5>
                        </div>
                        <div className="p-4 space-y-3">
                          {capabilityRadarData
                            .sort((a, b) => a.score - b.score)
                            .slice(0, 3)
                            .map((skill, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                  <span className="text-sm font-medium text-gray-700 truncate">
                                    {skill.subject}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                                      style={{
                                        width: `${(skill.score / 10) * 100}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-xs font-bold text-gray-600 min-w-[24px]">
                                    {skill.score}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl p-4">
                        <h5 className="text-indigo-800 font-semibold mb-3 flex items-center">
                          <Award className="w-4 h-4 mr-2" />
                          Overall Assessment
                        </h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-indigo-700">
                              Average Score
                            </span>
                            <span className="font-bold text-indigo-800">
                              {capabilityRadarData.length > 0
                                ? (
                                    capabilityRadarData.reduce(
                                      (sum, item) => sum + item.score,
                                      0
                                    ) / capabilityRadarData.length
                                  ).toFixed(1)
                                : '0'}
                              /10
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-indigo-700">
                              Skills Evaluated
                            </span>
                            <span className="font-bold text-indigo-800">
                              {capabilityRadarData.length}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-indigo-700">
                              Proficiency Level
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${
                                capabilityRadarData.length > 0 &&
                                capabilityRadarData.reduce(
                                  (sum, item) => sum + item.score,
                                  0
                                ) /
                                  capabilityRadarData.length >=
                                  8
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : capabilityRadarData.length > 0 &&
                                      capabilityRadarData.reduce(
                                        (sum, item) => sum + item.score,
                                        0
                                      ) /
                                        capabilityRadarData.length >=
                                        6
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {capabilityRadarData.length > 0
                                ? capabilityRadarData.reduce(
                                    (sum, item) => sum + item.score,
                                    0
                                  ) /
                                    capabilityRadarData.length >=
                                  8
                                  ? 'Expert'
                                  : capabilityRadarData.reduce(
                                        (sum, item) => sum + item.score,
                                        0
                                      ) /
                                        capabilityRadarData.length >=
                                      6
                                    ? 'Intermediate'
                                    : 'Beginner'
                                : 'No Data'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border-2 border-gray-200 p-8 rounded-lg text-center">
                    <p className="text-gray-500 italic">
                      No capability assessment data available.
                    </p>
                  </div>
                )}

                {/* Detailed Scores */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-6">
                      Core Competencies
                    </h4>
                    <div className="space-y-4">
                      {candidateData?.capability?.coreCompetencies &&
                      candidateData.capability.coreCompetencies.length > 0 ? (
                        candidateData.capability.coreCompetencies.map(
                          (comp, index) => (
                            <div key={index}>
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-gray-900">
                                  {comp?.name || 'Unknown Competency'}
                                </span>
                              </div>
                              {renderScoreBar(comp?.score || 0, 10, '#2563EB')}
                            </div>
                          )
                        )
                      ) : (
                        <p className="text-gray-500 italic">
                          No core competencies data available.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-6">
                      Role-Specific Skills
                    </h4>
                    <div className="space-y-4">
                      {candidateData?.capability?.roleSpecificSkills &&
                      candidateData.capability.roleSpecificSkills.length > 0 ? (
                        candidateData.capability.roleSpecificSkills.map(
                          (skill, index) => (
                            <div key={index}>
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-gray-900">
                                  {skill?.name || 'Unknown Skill'}
                                </span>
                                <span className="text-sm text-gray-500">
                                  Weight: {skill?.weight || 'N/A'}
                                </span>
                              </div>
                              {renderScoreBar(skill?.score || 0, 10, '#7C3AED')}
                            </div>
                          )
                        )
                      ) : (
                        <p className="text-gray-500 italic">
                          No role-specific skills data available.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-6">
                      Soft Skills
                    </h4>
                    <div className="space-y-4">
                      {candidateData?.capability?.softSkills &&
                      candidateData.capability.softSkills.length > 0 ? (
                        candidateData.capability.softSkills.map(
                          (skill, index) => (
                            <div key={index}>
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-gray-900">
                                  {skill?.name || 'Unknown Skill'}
                                </span>
                              </div>
                              {renderScoreBar(skill?.score || 0, 10, '#059669')}
                            </div>
                          )
                        )
                      ) : (
                        <p className="text-gray-500 italic">
                          No soft skills data available.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-6">
                      Domain Knowledge
                    </h4>
                    <div className="space-y-4">
                      {candidateData?.capability?.domainKnowledge &&
                      candidateData.capability.domainKnowledge.length > 0 ? (
                        candidateData.capability.domainKnowledge.map(
                          (domain, index) => (
                            <div key={index}>
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-gray-900">
                                  {domain?.name || 'Unknown Domain'}
                                </span>
                              </div>
                              {renderScoreBar(
                                domain?.score || 0,
                                10,
                                '#EA580C'
                              )}
                            </div>
                          )
                        )
                      ) : (
                        <p className="text-gray-500 italic">
                          No domain knowledge data available.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Coding' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-gray-900">
                  Coding Assessment
                </h3>

                {/* Overall Score with Circular Progress */}
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-lg">
                  <h4 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                    Overall Coding Score
                  </h4>
                  <div className="flex justify-center">
                    <div className="relative w-40 h-40">
                      <svg
                        className="w-40 h-40 transform -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="#E5E7EB"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="#4F46E5"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${((candidateData?.coding?.overallScore || 0) / 100) * 283} 283`}
                          className="transition-all duration-1000"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-indigo-600">
                          {candidateData?.coding?.overallScore || 0}
                        </span>
                        <span className="text-lg text-gray-600">
                          out of 100
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strengths and Weaknesses */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-emerald-50 border-2 border-emerald-200 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="w-6 h-6 text-emerald-600 mr-2" />
                      Coding Strengths
                    </h4>
                    <div className="space-y-3">
                      {candidateData?.coding?.strengths &&
                      candidateData.coding.strengths.length > 0 ? (
                        candidateData.coding.strengths.map(
                          (strength, index) => (
                            <div
                              key={index}
                              className="bg-emerald-100 p-4 rounded-lg border border-emerald-200"
                            >
                              <span className="text-emerald-800 font-medium">
                                {strength || 'Strength not specified'}
                              </span>
                            </div>
                          )
                        )
                      ) : (
                        <p className="text-gray-500 italic">
                          No coding strengths information available.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <AlertCircle className="w-6 h-6 text-amber-600 mr-2" />
                      Areas for Improvement
                    </h4>
                    <div className="space-y-3">
                      {candidateData?.coding?.weaknesses &&
                      candidateData.coding.weaknesses.length > 0 ? (
                        candidateData.coding.weaknesses.map(
                          (weakness, index) => (
                            <div
                              key={index}
                              className="bg-amber-100 p-4 rounded-lg border border-amber-200"
                            >
                              <span className="text-amber-800 font-medium">
                                {weakness || 'Weakness not specified'}
                              </span>
                            </div>
                          )
                        )
                      ) : (
                        <p className="text-gray-500 italic">
                          No coding weaknesses information available.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Evaluation' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-gray-900">
                  Final Evaluation
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Overall Score */}
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 p-8 rounded-lg">
                    <h4 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                      Total Weighted Score
                    </h4>
                    <div className="text-center">
                      <div className="text-6xl font-bold text-emerald-600 mb-2">
                        {candidateData?.evaluation?.totalWeightedScore || 0}
                      </div>
                      <div className="text-lg text-gray-600 mb-4">
                        out of 10
                      </div>
                      <div className="w-full bg-emerald-200 rounded-full h-4">
                        <div
                          className="bg-emerald-600 h-4 rounded-full transition-all duration-1000"
                          style={{
                            width: `${((candidateData?.evaluation?.totalWeightedScore || 0) / 10) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-white border-2 border-gray-200 p-8 rounded-lg">
                    <h4 className="text-xl font-semibold text-gray-900 mb-6">
                      Final Recommendation
                    </h4>
                    <div className="text-center">
                      <div
                        className={`inline-flex items-center space-x-3 px-8 py-4 rounded-full text-2xl font-bold border-2 ${getRecommendationColor(candidateData?.evaluation?.recommendation || 'Review')}`}
                      >
                        {getRecommendationIcon(
                          candidateData?.evaluation?.recommendation || 'Review'
                        )}
                        <span>
                          {candidateData?.evaluation?.recommendation ||
                            'Under Review'}
                        </span>
                      </div>

                      {candidateData?.evaluation?.nextSteps &&
                        candidateData.evaluation.nextSteps.length > 0 && (
                          <div className="mt-8">
                            <h5 className="text-lg font-semibold text-gray-900 mb-4">
                              Next Steps
                            </h5>
                            <div className="space-y-2">
                              {candidateData.evaluation.nextSteps.map(
                                (step, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg"
                                  >
                                    <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                      {index + 1}
                                    </div>
                                    <span className="text-gray-900">
                                      {step || 'Step not specified'}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Interview Notes' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-gray-900">
                  Interview Notes
                </h3>

                <div className="bg-gray-50 border-2 border-gray-200 p-8 rounded-lg">
                  {candidateData?.interviewNotes?.notes &&
                  candidateData.interviewNotes.notes.length > 0 &&
                  candidateData.interviewNotes.notes[0] !==
                    'No interview notes available.' ? (
                    <div className="space-y-4">
                      {candidateData.interviewNotes.notes.map((note, index) => (
                        <div
                          key={index}
                          className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-emerald-500"
                        >
                          <div className="flex items-start space-x-3">
                            <MessageCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                            <p className="text-gray-800 leading-relaxed">
                              {note || 'Note not available'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">
                          No interview notes available.
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                          Interview notes will appear here once the interview is
                          completed.
                        </p>
                      </div>
                    </div>
                  )}
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
