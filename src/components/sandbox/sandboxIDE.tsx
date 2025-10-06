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
  type SandpackPredefinedTemplate,
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
import { completeCodingTestStage } from '@/services/engineerService';
import usePreventBackNavigation from '@/app/hooks/usePreventBackNavigation';

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
  assignments: CodingAssignmentsResponse | null;
  disabled?: boolean;
  readOnly?: boolean;
}

// Template configuration based on engineer role
interface TemplateConfig {
  template: string;
  files: SandpackFiles;
  customSetup: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    entry?: string;
  };
}

function useDebouncedSave<T>(
  value: T,
  key: string,
  delay = 400,
  disabled = false
) {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (disabled) {
      return;
    }

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        console.log('💾 Auto-saved files to localStorage');
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    }, delay);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value, key, delay, disabled]);
}

function EditorWithPersistence({
  readOnly = false,
  disabled = false,
}: {
  readOnly?: boolean;
  disabled?: boolean;
}) {
  const { sandpack } = useSandpack();

  useDebouncedSave(sandpack.files, LS_KEY, 400, disabled || readOnly);

  return (
    <SandpackCodeEditor
      showTabs
      showLineNumbers
      readOnly={disabled || readOnly}
      style={{
        opacity: disabled ? 0.6 : 1,
      }}
    />
  );
}

// Submit function
async function submitToBackend(
  files: SandpackFiles,
  assignments: CodingAssignmentsResponse | null,
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
      problem_statement: assignments?.assignments[0]?.problem_statement ?? '',
    };

    console.log('submission data', submissionData);

    const response = await submitCodingTestToAI(submissionData);
    const codingParams = {
      question: submissionData?.problem_statement,
      files: submissionData?.files,
      link: sandboxUrl || '',
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

// Template configurations for different roles
function getTemplateConfig(enginnerRole: string): TemplateConfig {
  const frontendConfig: TemplateConfig = {
    template: 'react',
    files: {
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
    },
    customSetup: {
      dependencies: {
        react: 'latest',
        'react-dom': 'latest',
      },
    },
  };

  const backendConfig: TemplateConfig = {
    template: 'node',
    files: {
      '/package.json': {
        code: JSON.stringify(
          {
            name: 'faujx-backend-assessment',
            version: '1.0.0',
            description: 'Backend coding assessment',
            main: 'index.js',
            type: 'module',
            scripts: {
              start: 'node index.js',
              dev: 'node index.js',
            },
            dependencies: {}, // no express, no cors
          },
          null,
          2
        ),
      },
      '/index.js': {
        code: [
          `import http from "http";`,
          ``,
          `const PORT = process.env.PORT || 3000;`,
          ``,
          `const server = http.createServer((req, res) => {`,
          `  res.writeHead(200, { "Content-Type": "application/json" });`,
          ``,
          `  if (req.url === "/" && req.method === "GET") {`,
          `    res.end(JSON.stringify({ message: "Hello from FaujX Backend!" }));`,
          `  } else if (req.url === "/about" && req.method === "GET") {`,
          `    res.end(JSON.stringify({ message: "This is the about page" }));`,
          `  } else if (req.url === "/echo" && req.method === "POST") {`,
          `    let body = "";`,
          `    req.on("data", chunk => { body += chunk.toString(); });`,
          `    req.on("end", () => {`,
          `      res.end(JSON.stringify({ you_sent: body }));`,
          `    });`,
          `  } else {`,
          `    res.writeHead(404, { "Content-Type": "application/json" });`,
          `    res.end(JSON.stringify({ error: "Not Found" }));`,
          `  }`,
          `});`,
          ``,
          `server.listen(PORT, () => {`,
          `  console.log(\`🚀 Server running at http://localhost:\${PORT}\`);`,
          `});`,
        ].join('\n'),
        active: true,
      },
    },
    customSetup: {
      entry: '/index.js',
    },
  };
  const fullstackConfig: TemplateConfig = {
    template: 'react',
    files: {
      '/package.json': {
        code: JSON.stringify(
          {
            name: 'faujx-fullstack-assessment',
            version: '1.0.0',
            description: 'Fullstack coding assessment',
            main: 'index.js',
            scripts: {
              start: 'concurrently "npm run server" "npm run client"',
              server: 'node server.js',
              client: 'parcel index.html',
              dev: 'npm start',
            },
            dependencies: {
              react: '^18.2.0',
              'react-dom': '^18.2.0',
              express: '^4.18.2',
              cors: '^2.8.5',
              concurrently: '^7.6.0',
            },
          },
          null,
          2
        ),
      },
      '/index.js': {
        code: [
          `import React from "react";`,
          `import { createRoot } from "react-dom/client";`,
          `import App from "./App";`,
          ``,
          `createRoot(document.getElementById("root")).render(<App />);`,
        ].join('\n'),
      },
      '/App.js': {
        code: [
          ``,
          `export default function App(){ return <h1>Hello from Faujx!</h1> }`,
        ].join('\n'),
        active: true,
      },
    },
    customSetup: {
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        express: '^4.18.2',
        cors: '^2.8.5',
      },
    },
  };

  switch (enginnerRole) {
    case 'backend':
      return backendConfig;
    case 'fullstack':
      return fullstackConfig;
    case 'frontend':
    default:
      return frontendConfig;
  }
}

// Main SandpackIDE component
const SandpackIDE: React.FC<SandpackIDEProps> = React.memo(
  ({ assignments, disabled = false, readOnly = false }) => {
    const [mounted, setMounted] = useState(false);
    const { enginnerRole } = useAppSelector(state => state.persist);
    usePreventBackNavigation();
    const [templateConfig, setTemplateConfig] = useState<TemplateConfig>(() =>
      getTemplateConfig(enginnerRole || 'frontend')
    );

    // Load from localStorage only after mounting
    useEffect(() => {
      setMounted(true);

      const config = getTemplateConfig(enginnerRole || 'frontend');

      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) {
          const parsedFiles = JSON.parse(raw);
          console.log('📁 Loaded saved files from localStorage');
          setTemplateConfig({
            ...config,
            files: parsedFiles,
          });
        } else {
          setTemplateConfig(config);
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
        setTemplateConfig(config);
      }
    }, [enginnerRole]);

    // Don't render until mounted to avoid hydration mismatch
    if (!mounted) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading IDE...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full">
        <SandpackProvider
          template={templateConfig.template as SandpackPredefinedTemplate}
          files={templateConfig.files}
          customSetup={templateConfig.customSetup}
        >
          {/* Toolbar */}
          <Toolbar assignments={assignments} disabled={disabled || readOnly} />

          <SandpackLayout>
            <EditorWithPersistence readOnly={readOnly} disabled={disabled} />
            <SandpackPreview
              style={{
                opacity: disabled ? 0.5 : 1,
              }}
            />
          </SandpackLayout>

          <SandpackConsole
            style={{
              height: 160,
              opacity: disabled ? 0.5 : 1,
            }}
          />
        </SandpackProvider>
      </div>
    );
  }
);

SandpackIDE.displayName = 'SandpackIDE';

function Toolbar({
  assignments,
  disabled = false,
}: {
  assignments: CodingAssignmentsResponse | null;
  disabled?: boolean;
}) {
  const { sandpack } = useSandpack();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sandboxUrl, setSandboxUrl] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();
  const { enginnerRole } = useAppSelector(state => state.persist);

  const addFile = async () => {
    if (disabled) return;

    const name = prompt('New file (e.g. "/New.js")');
    if (name === '') {
      alert('Please enter a file name to create a new file.');
      return;
    }
    if (!name) return;
    const path = name.startsWith('/') ? name : `/${name}`;
    sandpack.openFile(path);
  };

  const deleteActive = () => {
    if (disabled) return;

    const activePath = sandpack.activeFile;
    if (!activePath) return;
    if (!confirm(`Delete ${activePath}?`)) return;
    sandpack.deleteFile(activePath);
  };

  const generateSandboxUrl = async (): Promise<string> => {
    try {
      const template = enginnerRole === 'backend' ? 'node' : 'react';

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
            template,
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
        code !== '// Your code here' &&
        !code.includes('TODO: Add your')
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

      // Update stage tracking after successful API call
      const passed = result?.passed || false;
      await completeCodingTestStage(result, passed);

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

      // Mark coding test as failed on error
      try {
        await completeCodingTestStage(null, false);
      } catch (stageError) {
        console.warn(
          'Failed to update coding test stage on error:',
          stageError
        );
      }
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(''), 8000);
    }
  };

  return (
    <div className="border-b bg-white">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <span>Sandpack ({enginnerRole || 'frontend'})</span>
          {disabled ? '(Time Up - Read Only)' : '(auto-saved)'}
        </div>
        <div className="flex gap-2">
          <button
            onClick={addFile}
            disabled={disabled}
            className={`px-3 py-1.5 rounded-lg text-white ${
              disabled
                ? 'bg-gray-400 cursor-not-allowed'
                : 'cursor-pointer bg-[#1F514C] hover:opacity-90'
            }`}
          >
            New File
          </button>
          <button
            onClick={deleteActive}
            disabled={disabled}
            className={`rounded-lg text-white px-3 py-1.5 border border-gray-300 ${
              disabled
                ? 'bg-gray-400 cursor-not-allowed'
                : 'cursor-pointer bg-[#9c2828] hover:bg-[#9c2828]'
            }`}
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

export default SandpackIDE;
