import React from 'react';
import { MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { CandidateReportResponse } from '@/services/reportService';
// import {
//   getRecommendationColor,
//   getRecommendationIcon,
// } from '../vettingReport';

interface EvaluationInterviewTabsProps {
  candidateData: CandidateReportResponse;
  activeTab: string;
}

const EvaluationInterviewTabs: React.FC<EvaluationInterviewTabsProps> = ({
  candidateData,
  activeTab,
}) => {
  if (activeTab === 'Evaluation') {
    return (
      <div className="space-y-8">
        <h3 className="text-2xl font-bold text-gray-900">Final Evaluation</h3>

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
              <div className="text-lg text-gray-600 mb-4">out of 10</div>
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
              {/* <div
                className={`inline-flex items-center space-x-3 px-8 py-4 rounded-full text-2xl font-bold border-2 ${getRecommendationColor(candidateData?.evaluation?.recommendation || 'Review')}`}
              >
                {getRecommendationIcon(
                  candidateData?.evaluation?.recommendation || 'Review'
                )}
                <span>
                  {candidateData?.evaluation?.recommendation || 'Under Review'}
                </span>
              </div> */}

              {candidateData?.evaluation?.nextSteps &&
                candidateData.evaluation.nextSteps.length > 0 && (
                  <div className="mt-8">
                    <h5 className="text-lg font-semibold text-gray-900 mb-4">
                      Next Steps
                    </h5>
                    <div className="space-y-2">
                      {candidateData.evaluation.nextSteps.map((step, index) => (
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
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Detailed Evaluation Breakdown */}
        {candidateData?.evaluation && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Technical Score */}
            {candidateData.evaluation.technicalScore && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-6 rounded-lg text-center">
                <h5 className="text-lg font-semibold text-gray-900 mb-4">
                  Technical Score
                </h5>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {candidateData.evaluation.technicalScore}/10
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                    style={{
                      width: `${(candidateData.evaluation.technicalScore / 10) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Cultural Fit Score */}
            {candidateData.evaluation.culturalFitScore && (
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 p-6 rounded-lg text-center">
                <h5 className="text-lg font-semibold text-gray-900 mb-4">
                  Cultural Fit
                </h5>
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {candidateData.evaluation.culturalFitScore}/10
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
                    style={{
                      width: `${(candidateData.evaluation.culturalFitScore / 10) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Communication Score */}
            {candidateData.evaluation.communicationScore && (
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-6 rounded-lg text-center">
                <h5 className="text-lg font-semibold text-gray-900 mb-4">
                  Communication
                </h5>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {candidateData.evaluation.communicationScore}/10
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                    style={{
                      width: `${(candidateData.evaluation.communicationScore / 10) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Evaluation Summary */}
        {candidateData?.evaluation?.summary && (
          <div className="bg-gray-50 border-2 border-gray-200 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Evaluation Summary
            </h4>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {candidateData.evaluation.summary}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Interview Notes Tab
  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-gray-900">Interview Notes</h3>

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

      {/* Interview Feedback Sections */}
      {candidateData?.interviewNotes && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Interviewer Feedback */}
          {candidateData.interviewNotes.interviewerFeedback && (
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Interviewer Feedback
              </h4>
              <div className="space-y-3">
                {candidateData.interviewNotes.interviewerFeedback.map(
                  (feedback: string, index: number) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg border border-blue-200"
                    >
                      <p className="text-gray-800">{feedback}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Key Highlights */}
          {candidateData.interviewNotes.keyHighlights && (
            <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                Key Highlights
              </h4>
              <div className="space-y-2">
                {candidateData.interviewNotes.keyHighlights.map(
                  (highlight: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 bg-white p-3 rounded-lg border border-green-200"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-800">{highlight}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Areas of Concern */}
          {candidateData.interviewNotes.concerns &&
            candidateData.interviewNotes.concerns.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 text-amber-600 mr-2" />
                  Areas of Concern
                </h4>
                <div className="space-y-2">
                  {candidateData.interviewNotes.concerns.map(
                    (concern: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 bg-white p-3 rounded-lg border border-amber-200"
                      >
                        <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-800">{concern}</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          {/* Overall Interview Rating */}
          {candidateData.interviewNotes.overallRating && (
            <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Overall Interview Rating
              </h4>
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  {candidateData.interviewNotes.overallRating}/10
                </div>
                <div className="w-full bg-indigo-200 rounded-full h-3">
                  <div
                    className="bg-indigo-600 h-3 rounded-full transition-all duration-1000"
                    style={{
                      width: `${(candidateData.interviewNotes.overallRating / 10) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EvaluationInterviewTabs;
