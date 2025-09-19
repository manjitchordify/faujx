import React from 'react';
import { User, MapPin, Briefcase, Clock, Code } from 'lucide-react';
import { CandidateReportResponse } from '@/services/reportService';

interface ResumeAnalysisTabProps {
  candidateData: CandidateReportResponse;
}

const ResumeAnalysisTab: React.FC<ResumeAnalysisTabProps> = ({
  candidateData,
}) => {
  return (
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
            {candidateData?.resumeAnalysis?.personalInfo?.experience || 'N/A'}
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg">
          <Briefcase className="w-8 h-8 text-orange-600 mb-3" />
          <p className="text-sm text-gray-600">Current Role</p>
          <p className="font-semibold text-gray-900">
            {candidateData?.resumeAnalysis?.personalInfo?.currentRole || 'N/A'}
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
            {candidateData.resumeAnalysis.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full border border-indigo-200"
              >
                {skill || 'Unknown Skill'}
              </span>
            ))}
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
      {/* <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Award className="w-5 h-5 text-blue-600 mr-2" />
          Education
        </h4>
        <div className="space-y-4">
          {candidateData?.resumeAnalysis?.education &&
          candidateData.resumeAnalysis.education.length > 0 ? (
            candidateData.resumeAnalysis.education.map((edu, index) => (
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
                      <p className="text-blue-600 font-medium">{edu.field}</p>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {edu?.year || 'Year not specified'}
                  </span>
                </div>
                {edu?.institution && (
                  <p className="text-gray-700 mb-2">{edu.institution}</p>
                )}
                {edu?.location && (
                  <p className="text-gray-600 text-sm mb-2">
                    📍 {edu.location}
                  </p>
                )}
                {edu?.gpa && (
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">GPA:</span> {edu.gpa}
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
            ))
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
              <p className="text-gray-500 italic">
                No education information available.
              </p>
            </div>
          )}
        </div>
      </div> */}

      {/* Experience Timeline */}
      {/* <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">
          Work Experience
        </h4>
        <div className="space-y-6">
          {candidateData?.resumeAnalysis?.experience &&
          candidateData.resumeAnalysis.experience.length > 0 ? (
            candidateData.resumeAnalysis.experience.map((exp, index) => (
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
                      {exp?.start_date || 'N/A'} - {exp?.end_date || 'N/A'}
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
            ))
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-gray-500 italic">
                No work experience information available.
              </p>
            </div>
          )}
        </div>
      </div> */}

      {/* Resume Quality */}
      <div className="bg-white border-2 border-gray-200 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Resume Quality Score
        </h4>
        <div className="flex items-center space-x-6">
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Quality Score</span>
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
  );
};

export default ResumeAnalysisTab;
