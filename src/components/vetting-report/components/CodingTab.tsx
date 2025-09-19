import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { CandidateReportResponse } from '@/services/reportService';

interface CodingTabProps {
  candidateData: CandidateReportResponse;
}

const CodingTab: React.FC<CodingTabProps> = ({ candidateData }) => {
  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-gray-900">Coding Assessment</h3>

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
              <span className="text-lg text-gray-600">out of 100</span>
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
              candidateData.coding.strengths.map((strength, index) => (
                <div
                  key={index}
                  className="bg-emerald-100 p-4 rounded-lg border border-emerald-200"
                >
                  <span className="text-emerald-800 font-medium">
                    {strength || 'Strength not specified'}
                  </span>
                </div>
              ))
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
              candidateData.coding.weaknesses.map((weakness, index) => (
                <div
                  key={index}
                  className="bg-amber-100 p-4 rounded-lg border border-amber-200"
                >
                  <span className="text-amber-800 font-medium">
                    {weakness || 'Weakness not specified'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">
                No coding weaknesses information available.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Programming Languages & Technologies */}
      {candidateData?.coding?.languages &&
        candidateData.coding.languages.length > 0 && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Programming Languages Assessed
            </h4>
            <div className="flex flex-wrap gap-3">
              {candidateData.coding.languages.map((language, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-800 text-sm font-medium px-4 py-2 rounded-full border border-indigo-200"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>
        )}

      {/* Test Cases Performance */}
      {candidateData?.coding?.testCasesPerformance && (
        <div className="bg-white border-2 border-gray-200 p-6 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Test Cases Performance
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {candidateData.coding.testCasesPerformance.passed || 0}
              </div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {candidateData.coding.testCasesPerformance.failed || 0}
              </div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {candidateData.coding.testCasesPerformance.total || 0}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Success Rate</span>
              <span className="text-sm font-medium text-gray-900">
                {candidateData.coding.testCasesPerformance.successRate || '0%'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-1000"
                style={{
                  width:
                    candidateData.coding.testCasesPerformance.successRate ||
                    '0%',
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Notes */}
      {candidateData?.coding?.additionalNotes && (
        <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Additional Assessment Notes
          </h4>
          <div className="prose prose-blue max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {String(candidateData.coding.additionalNotes)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodingTab;
