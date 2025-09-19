import React from 'react';
import {
  Target,
  Code,
  MessageCircle,
  Award,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { CandidateReportResponse } from '@/services/reportService';

interface CapabilityTabProps {
  candidateData: CandidateReportResponse;
}

const CapabilityTab: React.FC<CapabilityTabProps> = ({ candidateData }) => {
  // Prepare capability radar data
  const capabilityRadarData = [
    ...(candidateData?.capability?.coreCompetencies || []),
    ...(candidateData?.capability?.softSkills || []),
    ...(candidateData?.capability?.domainKnowledge || []),
  ].map(item => ({
    subject: item?.name || 'Unknown Skill',
    score: item?.score || 0,
    fullMark: 10,
  }));

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

  return (
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
                    candidateData.capability.coreCompetencies.length) *
                    10
                )
              : 0}
            %
          </div>
          <div className="text-sm text-gray-600">Core Competencies</div>
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
                    candidateData.capability.roleSpecificSkills.length) *
                    10
                )
              : 0}
            %
          </div>
          <div className="text-sm text-gray-600">Technical Skills</div>
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
          <div className="text-sm text-gray-600">Domain Knowledge</div>
        </div>
      </div>

      {/* Enhanced Skills Overview */}
      {capabilityRadarData.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Skills Proficiency Matrix */}
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
                            style={{ width: `${(skill.score / 10) * 100}%` }}
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
                            style={{ width: `${(skill.score / 10) * 100}%` }}
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
                  <span className="text-sm text-indigo-700">Average Score</span>
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
              candidateData.capability.coreCompetencies.map((comp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">
                      {comp?.name || 'Unknown Competency'}
                    </span>
                  </div>
                  {renderScoreBar(comp?.score || 0, 10, '#2563EB')}
                </div>
              ))
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
              candidateData.capability.softSkills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">
                      {skill?.name || 'Unknown Skill'}
                    </span>
                  </div>
                  {renderScoreBar(skill?.score || 0, 10, '#059669')}
                </div>
              ))
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
              candidateData.capability.domainKnowledge.map((domain, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">
                      {domain?.name || 'Unknown Domain'}
                    </span>
                  </div>
                  {renderScoreBar(domain?.score || 0, 10, '#EA580C')}
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">
                No domain knowledge data available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapabilityTab;
