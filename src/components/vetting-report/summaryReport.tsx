'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Check,
  AlertTriangle,
  Star,
  TrendingUp,
  Award,
  Target,
} from 'lucide-react';
import {
  getReportApi,
  CandidateReportResponse,
} from '@/services/reportService';

const CircularProgress: React.FC<{
  percentage: number;
  size: number;
  strokeWidth: number;
  color?: string;
}> = ({ percentage, size, strokeWidth, color = '#10b981' }) => {
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
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900 tracking-tight">
            {percentage}
          </div>
          <div className="text-sm text-gray-500 font-semibold tracking-widest mt-1">
            OVERALL SCORE
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{
  value: number;
  label: string;
  color: string;
  bgColor: string;
  icon?: React.ReactNode;
  description?: string;
}> = ({ value, label, color, bgColor, icon, description }) => (
  <div
    className={`${bgColor} relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl group border border-white/50`}
  >
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className={`text-5xl font-bold ${color} tracking-tight mb-2`}>
            {value}%
          </div>
          <div className="text-sm text-gray-600 uppercase tracking-wide font-bold">
            {label}
          </div>
          {description && (
            <div className="text-xs text-gray-500 mt-2 leading-relaxed">
              {description}
            </div>
          )}
        </div>
        {icon && (
          <div
            className={`${color} opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8"></div>
  </div>
);

const InsightCard: React.FC<{
  title: string;
  items: string[];
  bgColor: string;
  borderColor: string;
  textColor: string;
  icon: React.ReactNode;
  emptyMessage: string;
}> = ({
  title,
  items,
  bgColor,
  borderColor,
  textColor,
  icon,
  emptyMessage,
}) => (
  <div
    className={`${bgColor} ${borderColor} border-2 rounded-2xl p-8 transition-all duration-300 hover:shadow-lg group`}
  >
    <div className="flex items-center gap-3 mb-6">
      <div
        className={`${textColor} group-hover:scale-110 transition-transform duration-300 p-2 bg-white/20 rounded-lg`}
      >
        {icon}
      </div>
      <h4 className={`text-xl font-bold ${textColor} tracking-wide`}>
        {title}
      </h4>
    </div>
    <ul className={`text-sm ${textColor} space-y-3 font-medium`}>
      {items.length > 0 ? (
        items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="w-2 h-2 bg-current rounded-full mt-2 flex-shrink-0"></span>
            <span className="leading-relaxed">{item}</span>
          </li>
        ))
      ) : (
        <li className="flex items-start gap-3 opacity-75">
          <span className="w-2 h-2 bg-current rounded-full mt-2 flex-shrink-0"></span>
          <span className="leading-relaxed">{emptyMessage}</span>
        </li>
      )}
    </ul>
  </div>
);

const StatusBadge: React.FC<{
  status: string;
  confidence: number;
}> = ({ status, confidence }) => {
  const getStatusColor = () => {
    if (confidence >= 80)
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (confidence >= 60) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  return (
    <div
      className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl border-2 shadow-sm ${getStatusColor()}`}
    >
      <div className="w-3 h-3 bg-current rounded-full animate-pulse" />
      <Check className="w-6 h-6" />
      <span className="font-bold text-lg">{status}</span>
    </div>
  );
};

const CandidateSummary: React.FC = () => {
  const params = useParams();
  const candidateId = params?.id as string;

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
      <div className="max-w-6xl w-full mx-auto bg-white rounded-3xl overflow-hidden p-12 h-full">
        <div className="flex items-center justify-center h-screen">
          <div className="relative text-black">Loading Summary...</div>
        </div>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="max-w-6xl w-full mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden p-12">
        <div className="text-center text-red-600">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-semibold mb-4">
            Oops! Something went wrong
          </h3>
          <p className="text-lg text-gray-600">
            {error || 'No data available'}
          </p>
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

  const getInitials = (name?: string) =>
    name
      ? name
          .split(' ')
          .map(word => word.charAt(0).toUpperCase())
          .join('')
          .slice(0, 2)
      : 'NA';

  const strengths = capability?.coreCompetencies?.map(comp => comp.name) || [];
  const validationAreas =
    mcq?.categoryWisePerformance.map(c => c.category) || [];

  const confidence = Math.min(90, Math.max(55, overallScore + 10));
  // const successRate = Math.round(confidence * 0.95);

  const getRecommendationConfig = (recommendation: string) => {
    switch (recommendation) {
      case 'Hire':
        return {
          title: 'Strong Hire Recommendation',
          bgClass:
            'bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700',
          icon: <Award className="w-8 h-8" />,
        };
      case 'No Hire':
        return {
          title: 'Not Recommended for Hire',
          bgClass: 'bg-gradient-to-br from-red-500 via-red-600 to-red-700',
          icon: <AlertTriangle className="w-8 h-8" />,
        };
      default:
        return {
          title: 'Conditional Hire Recommended',
          bgClass:
            'bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600',
          icon: <Target className="w-8 h-8" />,
        };
    }
  };

  const recommendationConfig = getRecommendationConfig(
    executiveSummary.overallRecommendation
  );

  return (
    <div className="max-w-6xl w-full mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Enhanced Header */}
      <div className="relative px-12 py-16 text-center text-white overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #6366f1 0%, #8b5cf6 20%, #a855f7 40%, #c084fc 60%, #e879f9 80%, #f0abfc 100%)',
          }}
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mt-24" />
        <div className="absolute bottom-0 right-0 w-36 h-36 bg-white/10 rounded-full -mr-18 -mb-18" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full transform -translate-y-1/2" />

        <div className="relative z-10">
          <div className="w-32 h-32 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white/30 shadow-2xl">
            {getInitials(executiveSummary?.candidateName)}
          </div>
          {/* <h1 className="text-4xl font-bold mb-4 tracking-tight">
            {executiveSummary?.candidateName || 'Candidate Assessment'}
          </h1> */}
          <p className="text-2xl font-medium opacity-90 mb-3">
            {executiveSummary.positionApplied}
          </p>
          <div className="flex items-center justify-center gap-6 text-white/80 mb-4">
            {/* <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="text-sm">Assessed Today</span>
            </div> */}
            {/* <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="text-sm">Full Stack Developer</span>
            </div> */}
          </div>
          <div className="w-24 h-2 bg-white/40 rounded-full mx-auto" />
        </div>

        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="w-8 h-8 bg-white transform rotate-45 shadow-xl" />
        </div>
      </div>

      <div className="p-12 px- space-y-12">
        {/* Score + Status Section */}
        <div className="flex items-center justify-between">
          <div className="flex px-36 flex-col items-center">
            <CircularProgress
              percentage={overallScore}
              size={180}
              strokeWidth={14}
              color="#10b981"
            />
            <p className="text-lg text-gray-600 mt-4 font-semibold">Score</p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <StatusBadge status="Interview Ready" confidence={confidence} />
            {/* <div className="text-center">
              <div className="text-3xl font-bold text-gray-800 mb-2">
                Ready for Next Round
              </div>
              <p className="text-gray-600 max-w-xs leading-relaxed">
                Candidate shows strong potential for technical interview and
                culture fit assessment.
              </p>
            </div> */}
          </div>
        </div>

        {/* Enhanced Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <MetricCard
            value={resumeScore}
            label="Resume Analysis"
            color="text-emerald-600"
            bgColor="bg-emerald-50"
            icon={<Award className="w-8 h-8" />}
            description="Professional experience and skills match assessment"
          />
          <MetricCard
            value={mcqScore}
            label="Knowledge Assessment"
            color="text-blue-600"
            bgColor="bg-blue-50"
            icon={<Star className="w-8 h-8" />}
            description="Technical concepts and theoretical understanding"
          />
          <MetricCard
            value={codingScore}
            label="Coding Proficiency"
            color="text-purple-600"
            bgColor="bg-purple-50"
            icon={<TrendingUp className="w-8 h-8" />}
            description="Practical programming and problem-solving skills"
          />
        </div>

        {/* Enhanced Key Insights */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Star className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 tracking-tight">
              Key Assessment Insights
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InsightCard
              title="Core Strengths"
              items={strengths}
              bgColor="bg-emerald-50"
              borderColor="border-emerald-300"
              textColor="text-emerald-700"
              icon={<TrendingUp className="w-6 h-6" />}
              emptyMessage="Comprehensive assessment in progress"
            />
            <InsightCard
              title="Areas for Interview Validation"
              items={validationAreas}
              bgColor="bg-amber-50"
              borderColor="border-amber-300"
              textColor="text-amber-700"
              icon={<Target className="w-6 h-6" />}
              emptyMessage="All competency areas demonstrate strong performance"
            />
          </div>
        </div>

        {/* Additional Statistics Section */}
        {/* <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Assessment Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {confidence}%
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Confidence Level
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {successRate}%
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Success Prediction
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
              <div className="text-sm text-gray-600 font-medium">
                Assessment Areas
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">A+</div>
              <div className="text-sm text-gray-600 font-medium">
                Overall Grade
              </div>
            </div>
          </div>
        </div> */}

        {/* Enhanced Recommendation Card */}
        <div
          className={`${recommendationConfig.bgClass} rounded-3xl p-12 text-white text-center shadow-2xl relative overflow-hidden`}
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mt-16" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mb-12" />
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-full transform -translate-y-1/2" />

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-3 bg-white/20 rounded-xl">
                {recommendationConfig.icon}
              </div>
              <h2 className="text-4xl font-bold tracking-tight">
                {recommendationConfig.title}
              </h2>
            </div>

            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Based on comprehensive technical and professional assessment
              across multiple evaluation criteria.
            </p>

            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">{confidence}%</div>
                <div className="text-sm opacity-90">Assessment Confidence</div>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">{successRate}%</div>
                <div className="text-sm opacity-90">Interview Success Rate</div>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">85%</div>
                <div className="text-sm opacity-90">Role Match Score</div>
              </div>
            </div> */}

            <div className="w-32 h-2 bg-white/40 rounded-full mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateSummary;
