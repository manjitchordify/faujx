import React from 'react';

// Define the step interface
interface CheckpointStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

// Define the props interface
interface CheckpointsProps {
  onBegin: () => void;
  steps: CheckpointStep[];
}

const Checkpoints: React.FC<CheckpointsProps> = ({ onBegin, steps }) => {
  // Calculate completed count and progress percentage
  const completedCount = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;
  const progressPercentage =
    totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Setup Progress Section */}
      <div className="mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-2">
          Setup Progress
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {completedCount} of {totalSteps} Completed
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[#1BCC9D] to-[#0D664E] h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.max(15, progressPercentage)}%` }}
          ></div>
        </div>
      </div>

      {/* Checkpoint Items */}
      <div className="space-y-4 mb-8">
        {steps.map(step => (
          <div
            key={step.id}
            className="border border-gray-200 rounded-lg p-6 relative"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {step.completed ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h3
                  className={`text-lg font-medium mb-2 ${
                    step.completed ? 'text-green-900' : 'text-gray-900'
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-sm ${
                    step.completed ? 'text-green-600' : 'text-gray-600'
                  }`}
                >
                  {step.description}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  step.completed
                    ? 'text-green-700 bg-green-50'
                    : 'text-gray-400 bg-gray-50'
                }`}
              >
                {step.completed ? 'completed' : 'pending'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Ready to Begin Section */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Ready to Begin?
            </h3>
            <p className="text-sm text-gray-600">
              Start the guided setup process to complete your profile
              activation.
            </p>
          </div>
          <button
            onClick={onBegin}
            className="bg-[#54A044] hover:bg-[#54A044]/75 text-white font-medium px-6 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Begin
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkpoints;
