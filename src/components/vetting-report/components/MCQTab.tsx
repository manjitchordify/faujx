import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { CandidateReportResponse } from '@/services/reportService';

interface MCQTabProps {
  candidateData: CandidateReportResponse;
}

const MCQTab: React.FC<MCQTabProps> = ({ candidateData }) => {
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

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-gray-900">MCQ Test Results</h3>

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
            {candidateData?.mcq?.testOverview?.score?.split(' ')[0] || '0%'}
          </div>
          <div className="text-sm text-gray-600">Overall Score</div>
        </div>
      </div>

      {/* Charts Section */}
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
                          <div className="text-sm text-gray-600">Complete</div>
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
                  {candidateData?.mcq?.timeManagement?.avgTimePerQuestion ||
                    'N/A'}
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
                {candidateData?.mcq?.difficultyAnalysis?.medium || '0%'}
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
            candidateData.mcq.strengthsAndWeaknesses.strengths.length > 0 ? (
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
            candidateData.mcq.strengthsAndWeaknesses.weaknesses.length > 0 ? (
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
  );
};

export default MCQTab;
