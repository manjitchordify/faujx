import React from 'react';
import { useRouter } from 'next/navigation';
interface CodeSandboxInstructionsProps {
  showCancel?: boolean;
  onCancel?: () => void;
}

const CodeSandboxInstructions: React.FC<CodeSandboxInstructionsProps> = ({
  showCancel = false,
  onCancel,
}) => {
  const router = useRouter();
  const startCoding = () => {
    router.push('/engineer/coding');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <div className="bg-white rounded-3xl shadow-2xl p-16 max-w-4xl w-full text-center relative overflow-hidden">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-8 bg-[#1F514C] rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M2 6L12 1L22 6V18L12 23L2 18V6Z" />
            <path d="M2 6L12 12L22 6" />
            <path d="M12 12L12 23" />
          </svg>
        </div>

        <h1 className="text-xl font-bold text-gray-800 mb-5 leading-tight">
          CodeSandbox Instructions
        </h1>
        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
          Follow these steps to complete your coding assessment in our
          integrated environment
        </p>

        {/* Instructions List */}
        <div className="space-y-5 mb-10 text-left">
          <div className="flex items-start bg-gray-50 p-6 rounded-xl border-l-4 border-blue-500 hover:translate-x-1 transition-transform duration-200">
            <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-4 mt-0.5 flex-shrink-0">
              1
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-800 mb-1 text-lg">
                Review the Problem Statement
              </div>
              <div className="text-gray-600 leading-relaxed">
                Read the task description carefully. You need to create a React
                component for a simple to-do list with the ability to add and
                display tasks.
              </div>
            </div>
          </div>

          <div className="flex items-start bg-gray-50 p-6 rounded-xl border-l-4 border-blue-500 hover:translate-x-1 transition-transform duration-200">
            <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-4 mt-0.5 flex-shrink-0">
              2
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-800 mb-1 text-lg">
                Use the File Explorer
              </div>
              <div className="text-gray-600 leading-relaxed">
                Navigate through files using the left panel. Click on App.js to
                start coding. Use &quot;New File&quot; button to create
                additional components if needed.
              </div>
            </div>
          </div>

          <div className="flex items-start bg-gray-50 p-6 rounded-xl border-l-4 border-blue-500 hover:translate-x-1 transition-transform duration-200">
            <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-4 mt-0.5 flex-shrink-0">
              3
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-800 mb-1 text-lg">
                Code in the Editor
              </div>
              <div className="text-gray-600 leading-relaxed">
                Write your React component code in the main editor. The platform
                auto-saves your progress. Use React hooks for state management.
              </div>
            </div>
          </div>

          <div className="flex items-start bg-gray-50 p-6 rounded-xl border-l-4 border-blue-500 hover:translate-x-1 transition-transform duration-200">
            <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-4 mt-0.5 flex-shrink-0">
              4
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-800 mb-1 text-lg">
                Monitor Live Preview
              </div>
              <div className="text-gray-600 leading-relaxed">
                Your code runs automatically in the right panel. Test your
                component functionality and watch for any errors in the browser
                console.
              </div>
            </div>
          </div>

          <div className="flex items-start bg-gray-50 p-6 rounded-xl border-l-4 border-blue-500 hover:translate-x-1 transition-transform duration-200">
            <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-4 mt-0.5 flex-shrink-0">
              5
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-800 mb-1 text-lg">
                Submit Your Solution
              </div>
              <div className="text-gray-600 leading-relaxed">
                Click the &quot;Submit Code&quot; button when you are satisfied
                with your solution. Make sure your to-do list works correctly
                before submitting.
              </div>
            </div>
          </div>
        </div>

        {/* Warning Box */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-10 text-left">
          <div className="font-semibold text-red-700 mb-3 flex items-center">
            <span className="mr-2">⚠️</span>
            Platform Features & Tips
          </div>
          <div className="text-red-800 leading-relaxed">
            • Your work is auto-saved, but click &quot;Submit Code&quot; to
            finalize your submission
            <br />
            • Use the live preview on the right to test your component as you
            code
            <br />
            • If you encounter errors, check the browser console in the preview
            panel
            <br />
            • Use &quot;New File&quot; to add files or to add files or
            &quot;Delete Current&quot; button to remove files
            <br />• The refresh button helps reload the preview if needed
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-5 justify-center flex-wrap">
          {showCancel ? (
            <button
              onClick={onCancel}
              className="bg-[#1F514C] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              Close
            </button>
          ) : (
            <button
              onClick={startCoding}
              className="bg-[#1F514C] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M2 6L12 1L22 6V18L12 23L2 18V6Z" />
                <path d="M2 6L12 12L22 6" />
                <path d="M12 12L12 23" />
              </svg>
              Start Coding
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeSandboxInstructions;
