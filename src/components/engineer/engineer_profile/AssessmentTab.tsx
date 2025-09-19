import React from 'react';

const AssessmentTab = () => {
  const assessments = [
    {
      title: 'Full Stack Development Assessment',
      description: 'Comprehensive evaluation of frontend and backend skills',
      score: 92,
      completedDate: 'Jan 15, 2025',
      status: 'Completed',
    },
    {
      title: 'System Design Assessment',
      description: 'Evaluation of architecture and system design capabilities',
      score: 88,
      completedDate: 'Jan 10, 2025',
      status: 'Completed',
    },
    {
      title: 'Leadership & Communication',
      description: 'Assessment of team leadership and communication skills',
      score: 90,
      completedDate: 'Jan 5, 2025',
      status: 'Completed',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Technical Assessments
      </h3>
      <div className="space-y-4">
        {assessments.map((assessment, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-700">
                {assessment.title}
              </h4>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                {assessment.status}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-2">
              {assessment.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Score: {assessment.score}/100</span>
              <span>•</span>
              <span>Completed: {assessment.completedDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessmentTab;
