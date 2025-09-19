import React from 'react';
import { ProfileGetResponse } from '@/services/profileSettingsService';

interface SkillsTabProps {
  profile: ProfileGetResponse;
}

const SkillsTab: React.FC<SkillsTabProps> = ({ profile }) => {
  // Extract parsed skills from the profile data
  const parsedSkills = profile?.data?.candidate?.parsedSkills || {};

  // Define skill categories with display names and colors
  const skillCategories = [
    {
      key: 'technical',
      label: 'Technical Skills',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
    },
    {
      key: 'frameworks',
      label: 'Frameworks',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
    },
    {
      key: 'languages',
      label: 'Languages',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
    },
    {
      key: 'tools',
      label: 'Tools',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
    },
    {
      key: 'project_management',
      label: 'Project Management',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-700',
    },
    {
      key: 'soft',
      label: 'Soft Skills',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      textColor: 'text-pink-700',
    },
    {
      key: 'certifications',
      label: 'Certifications',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700',
    },
    {
      key: 'specializations',
      label: 'Specializations',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      textColor: 'text-cyan-700',
    },
    {
      key: 'area_of_expertise',
      label: 'Areas of Expertise',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-700',
    },
  ] as const;

  // Filter out categories that have skills
  const activeCategories = skillCategories.filter(category => {
    const skills = parsedSkills[category.key];
    return skills && Array.isArray(skills) && skills.length > 0;
  });

  // If no parsed skills are available, show regular skills from candidate
  const fallbackSkills = profile?.data?.candidate?.skills || [];

  if (activeCategories.length === 0 && fallbackSkills.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No skills information available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800">Skills & Expertise</h3>

      {/* Display categorized skills if available */}
      {activeCategories.length > 0 ? (
        <div className="space-y-6">
          {activeCategories.map(category => {
            const skills = parsedSkills[category.key];
            if (!skills || !Array.isArray(skills)) return null;

            return (
              <div key={category.key} className="space-y-3">
                <h4 className={`text-lg font-semibold ${category.textColor}`}>
                  {category.label}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1.5 ${category.bgColor} ${category.textColor} border ${category.borderColor} rounded-full text-sm font-medium transition-all hover:shadow-md hover:scale-105`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Fallback to regular skills if parsedSkills not available */
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-700">All Skills</h4>
          <div className="flex flex-wrap gap-2">
            {fallbackSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm font-medium transition-all hover:shadow-md hover:scale-105"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsTab;
