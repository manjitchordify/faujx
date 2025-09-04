// src/components/SandpackIDE.tsx
'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
  useSandpack,
} from '@codesandbox/sandpack-react';
import { useRouter } from 'next/navigation';
import {
  submitCodingTestToAI,
  submitCodingTestApi,
} from '@/services/codingTestService';
import { useDispatch } from 'react-redux';
import { setEvaluationResult } from '@/store/slices/persistSlice';
import { CodingAssignmentsResponse } from '@/services/codingAssignmentsTypes';
import { useAppSelector } from '@/store/store';

const LS_KEY = 'playground:sandpack:files';

interface SandpackFile {
  code: string;
  active?: boolean;
  hidden?: boolean;
}

interface SandpackFiles {
  [path: string]: SandpackFile;
}

interface SandpackIDEProps {
  assignments: CodingAssignmentsResponse;
}

function useDebouncedSave<T>(value: T, key: string, delay = 400) {
  const timer = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {}
    }, delay);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value, key, delay]);
}

function EditorWithPersistence() {
  const { sandpack } = useSandpack();
  useDebouncedSave(sandpack.files, LS_KEY, 400);
  return <SandpackCodeEditor showTabs showLineNumbers />;
}

// ✅ now receives assignments properly
async function submitToBackend(
  files: SandpackFiles,
  assignments: CodingAssignmentsResponse,
  enginnerRole: string,
  sandboxUrl?: string
) {
  try {
    const submissionData = {
      files: Object.fromEntries(
        Object.entries(files).map(([path, file]: [string, SandpackFile]) => [
          path,
          file.code,
        ])
      ),
      assessment_type: enginnerRole,
      max_score: 100,
      problem_statement: assignments.assignments[0]?.problem_statement ?? '',
    };

    console.log('submission data', submissionData);

    const response = await submitCodingTestToAI(submissionData);
    const codingParams = {
      question: submissionData?.problem_statement,
      answerFiles: submissionData?.files,
      url: sandboxUrl || '',
      evaluationResult: response,
      totalScore: response?.overall_score,
    };
    if (response) {
      await submitCodingTestApi(codingParams);
    }

    return response;
  } catch (error) {
    console.error('Submission error:', error);
    throw error;
  }
}

export default function SandpackIDE({ assignments }: SandpackIDEProps) {
  const [mounted, setMounted] = useState(false);

  const defaultFiles = {
    '/index.js': {
      code: [
        `import React from "react";`,
        `import { createRoot } from "react-dom/client";`,
        `import App from "./App";`,
        `createRoot(document.getElementById("root")).render(<App />);`,
      ].join('\n'),
    },
    '/App.js': {
      code: `export default function App(){ return <h1>Hello from Faujx!</h1> }`,
      active: true,
    },
  };

  const [initialFiles, setInitialFiles] = useState(defaultFiles);

  // Load from localStorage only after mounting
  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        setInitialFiles(JSON.parse(raw));
      }
    } catch {}
  }, []);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <SandpackProvider
      template="react"
      files={initialFiles}
      customSetup={{ dependencies: { react: 'latest', 'react-dom': 'latest' } }}
    >
      {/* ✅ pass assignments down */}
      <Toolbar assignments={assignments} />
      <SandpackLayout>
        <EditorWithPersistence />
        <SandpackPreview />
      </SandpackLayout>
      <SandpackConsole style={{ height: 160 }} />
    </SandpackProvider>
  );
}

// ✅ Toolbar now accepts assignments
function Toolbar({ assignments }: { assignments: CodingAssignmentsResponse }) {
  const { sandpack } = useSandpack();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sandboxUrl, setSandboxUrl] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();
  const { enginnerRole } = useAppSelector(state => state.persist);

  const addFile = async () => {
    const name = prompt('New file (e.g. "/New.jsx")');
    if (!name) return;
    const path = name.startsWith('/') ? name : `/${name}`;
    const starter =
      path.endsWith('.jsx') || path.endsWith('.tsx')
        ? `export default function New(){ return <div>${path}</div> }`
        : path.endsWith('.css')
          ? `/* ${path} */`
          : `// ${path}\n`;
    sandpack.addFile(path, starter);
    sandpack.openFile(path);
  };

  const deleteActive = () => {
    const activePath = sandpack.activeFile;
    if (!activePath) return;
    if (!confirm(`Delete ${activePath}?`)) return;
    sandpack.deleteFile(activePath);
    // Sandpack will automatically switch to another file
  };

  const generateSandboxUrl = async (): Promise<string> => {
    try {
      const res = await fetch(
        'https://codesandbox.io/api/v1/sandboxes/define?json=1',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            files: Object.fromEntries(
              Object.entries(sandpack.files).map(([p, f]) => [
                p.replace(/^\//, ''), // remove leading slash
                { content: f.code },
              ])
            ),
            template: 'react',
          }),
        }
      );

      const data = await res.json();
      const url = `https://codesandbox.io/s/${data.sandbox_id}`;

      // Save to localStorage
      localStorage.setItem('sandbox:url', url);
      return url;
    } catch (error) {
      console.error('Failed to generate sandbox URL:', error);
      throw new Error('Failed to create CodeSandbox URL');
    }
  };

  const handleSubmit = async () => {
    // Validate that there are files to submit
    if (!sandpack.files || Object.keys(sandpack.files).length === 0) {
      setSubmitStatus('❌ No files to submit');
      return;
    }

    // Check if there's actual code content (not just default/empty)
    const hasCode = Object.values(sandpack.files).some((file: SandpackFile) => {
      const code = file.code.trim();
      return (
        code.length > 0 &&
        !code.includes('Hello from Faujx!') &&
        code !== '// Your code here'
      );
    });

    if (!hasCode) {
      setSubmitStatus('❌ Please write some code before submitting');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('🔄 Creating URL...');

    try {
      const generatedSandboxUrl = await generateSandboxUrl();
      setSandboxUrl(generatedSandboxUrl);

      setSubmitStatus('🔄 Submitting code...');

      const result = await submitToBackend(
        sandpack.files,
        assignments,
        enginnerRole!,
        generatedSandboxUrl
      );

      if (result?.passed) {
        setSubmitStatus(`✅ Submitted successfully!`);
        router.push('/engineer/interview/select-slot');
      } else {
        dispatch(setEvaluationResult(result));
        setSubmitStatus(`✅ Submitted successfully!`);
        router.replace(
          `/engineer/feedback?score=${result?.overall_score}&type=coding`
        );
      }
    } catch (error: unknown) {
      console.error('Submission failed:', error);
      setSubmitStatus(`❌ Submission failed: ${error}`);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(''), 8000);
    }
  };

  return (
    <div className="border-b bg-white">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="text-sm text-gray-600">Sandpack (auto-saved)</div>
        <div className="flex gap-2">
          <button
            onClick={addFile}
            className="cursor-pointer px-3 py-1.5 rounded-lg text-white bg-[#1F514C] hover:opacity-90"
          >
            New File
          </button>
          <button
            onClick={deleteActive}
            className="cursor-pointer rounded-lg text-white px-3 py-1.5 border border-gray-300 bg-[#9c2828] hover:bg-[#9c2828]"
          >
            Delete Current
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-4 py-1.5 rounded-lg text-white font-medium transition-all ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'cursor-pointer bg-[#1F514C] hover:opacity-90'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </span>
            ) : (
              'Submit Code'
            )}
          </button>
        </div>
      </div>

      {/* Status Message */}
      {submitStatus && (
        <div
          className={`px-3 py-2 text-sm border-t ${
            submitStatus.includes('✅')
              ? 'bg-green-50 text-green-700'
              : submitStatus.includes('❌')
                ? 'bg-red-50 text-red-700'
                : 'bg-blue-50 text-blue-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span>{submitStatus}</span>
            {sandboxUrl && submitStatus.includes('✅') && (
              <div className="flex gap-2">
                <button
                  onClick={() => window.open(sandboxUrl, '_blank')}
                  className="text-xs px-3 py-1 bg-blue-200 text-blue-800 rounded hover:bg-blue-300"
                >
                  View Sandbox
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(sandboxUrl);
                    alert('Sandbox URL copied to clipboard!');
                  }}
                  className="text-xs px-3 py-1 bg-green-200 text-green-800 rounded hover:bg-green-300"
                >
                  Copy URL
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
