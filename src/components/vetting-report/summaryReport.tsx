'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Check, AlertTriangle } from 'lucide-react';
import {
  getReportApi,
  CandidateReportResponse,
} from '@/services/reportService';

const CircularProgress: React.FC<{
  percentage: number;
  size: number;
  strokeWidth: number;
}> = ({ percentage, size, strokeWidth }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#00d97e"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{percentage}</div>
          <div className="text-xs text-gray-500 font-medium">SCORE</div>
        </div>
      </div>
    </div>
  );
};

const CandidateSummary: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>(); // 👈 read from URL
  const [reportData, setReportData] = useState<CandidateReportResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const response = await getReportApi(candidateId);
        setReportData(response);
        setError(null);
      } catch (err) {
        setError('Failed to load candidate report');
        console.error('Error fetching report:', err);
      } finally {
        setLoading(false);
      }
    };

    if (candidateId) {
      fetchReportData();
    }
  }, [candidateId]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg overflow-hidden p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg overflow-hidden p-8">
        <div className="text-center text-red-600">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <p>{error || 'No data available'}</p>
        </div>
      </div>
    );
  }

  const { executiveSummary, mcq, coding, capability, resumeAnalysis } =
    reportData;

  const resumeScore = resumeAnalysis?.resumeQuality || 0;
  const mcqScore = parseInt(mcq?.finalScore?.split('/')[0] || '0') || 0;
  const codingScore = coding?.overallScore || 0;
  const overallScore = Math.round((resumeScore + mcqScore + codingScore) / 3);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);

  const strengths = capability?.coreCompetencies?.map(comp => comp.name) || [];
  const validationAreas =
    mcq?.categoryWisePerformance.map(c => c.category) || [];

  const confidence = Math.min(85, Math.max(50, overallScore + 10));

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
      {/* Header */}
      <div
        className="px-6 py-8 text-center text-white relative"
        style={{
          background:
            'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        }}
      >
        <div className="w-20 h-20 mx-auto mb-4 bg-white/25 rounded-full flex items-center justify-center text-3xl font-bold">
          {getInitials(executiveSummary.candidateName)}
        </div>
        <p className="text-xl font-semibold mb-1">
          {executiveSummary.positionApplied}
        </p>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="w-4 h-4 bg-white transform rotate-45"></div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Score + Status */}
        <div className="flex items-center justify-between">
          <CircularProgress
            percentage={overallScore}
            size={100}
            strokeWidth={8}
          />
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border bg-green-50 text-green-600 border-green-200">
            <Check className="w-4 h-4" />
            <span className="font-medium text-sm">Interview Ready</span>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-emerald-50 py-3 px-2 rounded-lg">
            <div className="text-2xl font-bold text-emerald-500">
              {resumeScore}%
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Resume
            </div>
          </div>
          <div className="bg-blue-50 py-3 px-2 rounded-lg">
            <div className="text-2xl font-bold text-blue-500">{mcqScore}%</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              MCQ
            </div>
          </div>
          <div className="bg-purple-50 py-3 px-2 rounded-lg">
            <div className="text-2xl font-bold text-purple-500">
              {codingScore}%
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Coding
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            ⭐ Key Insights
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <h4 className="text-md font-bold text-emerald-700 mb-2">
                Strengths
              </h4>
              <ul className="text-xs text-emerald-700 space-y-1 font-semibold">
                {strengths.length > 0 ? (
                  strengths.map((s, i) => <li key={i}>• {s}</li>)
                ) : (
                  <li>• Assessment pending</li>
                )}
              </ul>
            </div>
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
              <h4 className="text-md font-bold text-yellow-700 mb-2">
                Validate
              </h4>
              <ul className="text-xs text-yellow-700 space-y-1 font-semibold">
                {validationAreas.length > 0 ? (
                  validationAreas.map((v, i) => <li key={i}>• {v}</li>)
                ) : (
                  <li>• All areas performing well</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div
          className={`rounded-2xl p-4 text-white text-center ${
            executiveSummary.overallRecommendation === 'Hire'
              ? 'bg-emerald-500'
              : executiveSummary.overallRecommendation === 'No Hire'
                ? 'bg-red-500'
                : 'bg-yellow-500'
          }`}
        >
          <div className="text-2xl font-bold mb-2">
            {executiveSummary.overallRecommendation === 'Hire'
              ? 'Strong Hire'
              : executiveSummary.overallRecommendation === 'No Hire'
                ? 'Not Recommended'
                : 'Conditional Hire'}
          </div>
          <div className="text-sm text-white/90 mb-4">
            {confidence}% Confidence • {Math.round(confidence * 0.95)}%
            Interview Success Rate
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateSummary;
