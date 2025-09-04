import React, { useState } from 'react';
import SandpackIDE from '@/components/sandbox/sandboxIDE';
import { Clock, Code, Zap } from 'lucide-react';
import {
  CodingAssignmentsResponse,
  Assignment,
} from '@/services/codingAssignmentsTypes';
import CodeSandboxInstructions from './codesandoxInstruction';

interface SandboxTestProps {
  onSubmit?: (githubUrl: string) => void;
  onBack?: () => void;
  assignmentsData: CodingAssignmentsResponse;
}

const SandboxTest: React.FC<SandboxTestProps> = ({
  onBack,
  assignmentsData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-semibold mb-4 text-center">Coding Test</h1>
        {assignmentsData && (
          <>
            <div className="flex justify-center gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <Code className="w-4 h-4" />
                {assignmentsData.total_assignments} Assignments
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {assignmentsData.total_estimated_time_minutes} mins
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                {assignmentsData.job_title}
              </span>
            </div>

            <div className="mb-8">
              <div className="md:grid-cols-1 lg:grid-cols-2">
                {assignmentsData.assignments.map((assignment: Assignment) => (
                  <div
                    key={assignment.assignment_id}
                    className="bg-white rounded-3xl shadow-lg p-6 sm:p-8"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h2 className="text-xl font-medium text-gray-900 pr-4">
                        {assignment.title}
                      </h2>
                    </div>
                    <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                      {assignment.problem_statement}
                    </p>
                    <button
                      onClick={() => setIsOpen(true)}
                      className="cursor-pointer font-semibold text-emerald-900 hover:text-emerald-700 underline transition-colors duration-200"
                    >
                      Coding Instructions
                    </button>
                  </div>
                ))}
                <div className="text-center mt-8"></div>
              </div>
            </div>
          </>
        )}
        <SandpackIDE assignments={assignmentsData} />
        {onBack && <></>}
      </div>
      {isOpen && (
        <div className="text-center mt-8">
          {/* Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="cursor-pointer font-semibold text-emerald-900 hover:text-emerald-700 underline transition-colors duration-200"
          >
            Coding Instructions
          </button>

          {/* Modal */}
          {isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/30 bg-opacity-50 z-50">
              <div className="relative max-h-[80vh]  overflow-y-auto rounded-md">
                <CodeSandboxInstructions
                  showCancel
                  onCancel={() => setIsOpen(false)}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SandboxTest;
