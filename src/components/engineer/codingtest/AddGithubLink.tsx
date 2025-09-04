import React, { useState } from 'react';
import { ApiError } from '@/types/codingTestTypes';

interface AddGithubLinkProps {
  onSubmit?: (githubUrl: string) => void;
  onBack?: () => void;
}

const AddGithubLink: React.FC<AddGithubLinkProps> = ({ onSubmit, onBack }) => {
  const [githubUrl, setGithubUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async () => {
    if (!githubUrl.trim()) {
      setError('Please enter a GitHub URL');
      return;
    }

    // Basic URL validation
    if (!githubUrl.includes('github.com')) {
      setError('Please enter a valid GitHub URL');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Call the API service
      // await submitCodingTestApi({
      //   link: githubUrl,
      // });

      console.log('GitHub URL submitted successfully:', githubUrl);

      // Call onSubmit callback if provided
      if (onSubmit) {
        onSubmit(githubUrl);
      }

      // The redirect to /engineer/interview/select-slot happens automatically in the service
    } catch (err: unknown) {
      console.error('Error submitting GitHub URL:', err);

      // Handle API errors
      if (err && typeof err === 'object' && 'message' in err) {
        const apiError = err as ApiError;
        setError(
          apiError.message || 'Failed to submit GitHub URL. Please try again.'
        );
      } else if (err instanceof Error) {
        setError(
          err.message || 'Failed to submit GitHub URL. Please try again.'
        );
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError('Failed to submit GitHub URL. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGithubUrl(e.target.value);
    if (error) {
      setError(''); // Clear error when user starts typing
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mb-4">
            Add your github Link
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm text-center">{error}</p>
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="mb-8 sm:mb-12">
          <div className="px-4 sm:px-0">
            <textarea
              value={githubUrl}
              onChange={handleInputChange}
              placeholder="https://github.com/yourusername/repository"
              disabled={isLoading}
              className="w-full h-32 px-6 py-4 border-2 border-gray-300 rounded-2xl focus:border-[#1F514C] focus:outline-none transition-colors duration-200 text-base resize-none bg-white"
              autoFocus
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center px-6">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`
              px-16 md:px-12 py-3 rounded-[20px] font-medium text-white transition-all duration-200 relative
              ${
                !isLoading
                  ? 'bg-[#1F514C] hover:bg-emerald-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-[#1F514C] opacity-50 cursor-not-allowed'
              }
            `}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </div>
            ) : (
              'Submit'
            )}
          </button>
        </div>

        {/* Back Button (optional) */}
        {onBack && !isLoading && (
          <div className="text-center mt-8">
            <button
              onClick={onBack}
              className="text-[#1F514C] hover:text-emerald-800 font-medium transition-colors duration-200"
            >
              ← Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddGithubLink;
