'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { X, Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateExpertProfile } from '@/services/expert/profileService';
import { showToast } from '@/utils/toast/Toast';

interface Skill {
  id: string;
  name: string;
}

interface FormData {
  role: string;
  experience: string;
  skills: Skill[];
}

const MAX_ROLE_LENGTH = 50;
const MAX_SKILL_LENGTH = 50;
const MAX_SKILLS = 10;
const TOTAL_STEPS = 2;

const SpecializationCard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    role: '',
    experience: '',
    skills: [],
  });
  const [inputValue, setInputValue] = useState<string>('');
  const [isCompleting, setIsCompleting] = useState<boolean>(false);
  const [isProcessingNext, setIsProcessingNext] = useState<boolean>(false);
  const router = useRouter();

  // Memoized validation for step 0
  const canProceedFromStep0 = useMemo(
    () => formData.role.trim() && formData.experience.trim(),
    [formData.role, formData.experience]
  );

  // Memoized validation for step 1 (can complete)
  const canComplete = useMemo(
    () => formData.skills.length > 0,
    [formData.skills.length]
  );

  // Memoized skill exists check
  const skillExists = useMemo(
    () => (name: string) =>
      formData.skills.some(s => s.name.toLowerCase() === name.toLowerCase()),
    [formData.skills]
  );

  // Optimized input handlers with useCallback
  const handleRoleChange = useCallback((value: string) => {
    if (value.length <= MAX_ROLE_LENGTH) {
      setFormData(prev => ({ ...prev, role: value }));
    }
  }, []);

  const handleExperienceChange = useCallback((value: string) => {
    if (value === '' || /^\d+$/.test(value)) {
      setFormData(prev => ({ ...prev, experience: value }));
    }
  }, []);

  const handleInputChange = useCallback(
    (field: 'role' | 'experience', value: string) => {
      if (field === 'role') {
        handleRoleChange(value);
      } else {
        handleExperienceChange(value);
      }
    },
    [handleRoleChange, handleExperienceChange]
  );

  const handleAddSkill = useCallback(() => {
    const trimmedValue = inputValue.trim();
    if (
      trimmedValue &&
      trimmedValue.length <= MAX_SKILL_LENGTH &&
      !skillExists(trimmedValue) &&
      formData.skills.length < MAX_SKILLS
    ) {
      const newSkill: Skill = {
        id: Date.now().toString(),
        name: trimmedValue,
      };
      setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
      setInputValue('');
    }
  }, [inputValue, skillExists, formData.skills.length]);

  const handleSkillRemove = useCallback((skillId: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== skillId),
    }));
  }, []);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (currentStep === 1) {
          handleAddSkill();
        }
      }
    },
    [currentStep, handleAddSkill]
  );

  // API call function
  const updateProfile = useCallback(
    async (step: number) => {
      try {
        if (step === 0) {
          // Step 0: Update role and experience
          await updateExpertProfile({
            role: formData.role.trim(),
            experience: formData.experience.trim(),
          });
        } else if (step === 1) {
          // Step 1: Update skills
          const skillsArray = formData.skills.map(skill => skill.name);
          await updateExpertProfile({
            skills: skillsArray,
          });
        }

        return true;
      } catch (error: unknown) {
        const errorMessage =
          (error as Error)?.message ||
          'An error occurred while updating your profile';
        showToast(errorMessage, 'error');
        return false;
      }
    },
    [formData.role, formData.experience, formData.skills]
  );

  const handleNext = useCallback(async () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setIsProcessingNext(true);

      try {
        const success = await updateProfile(currentStep);
        if (success) {
          setCurrentStep(prev => prev + 1);
        }
      } finally {
        setIsProcessingNext(false);
      }
    }
  }, [currentStep, updateProfile]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleComplete = useCallback(async () => {
    if (canComplete && !isCompleting) {
      setIsCompleting(true);

      try {
        const success = await updateProfile(currentStep);
        if (success) {
          showToast('Profile updated successfully!', 'success');
          setTimeout(() => {
            router.push('/expert/upload-resume');
          }, 500);
        } else {
          setIsCompleting(false);
        }
      } catch (error) {
        console.error('Complete error:', error);
        setIsCompleting(false);
      }
    }
  }, [canComplete, isCompleting, currentStep, updateProfile, router]);

  // Memoized step components
  const Step0Component = useMemo(
    () => (
      <div className="text-center">
        <label className="block text-base sm:text-lg font-light text-black mb-6 sm:mb-8">
          Tell us about your professional background
        </label>

        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2 text-left">
              Current Role
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange('role', e.target.value)
              }
              placeholder="e.g., Software Developer, DevOps Engineer"
              maxLength={MAX_ROLE_LENGTH}
              className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-lg bg-white outline-none text-sm sm:text-base focus:border-[#1F514C] focus:ring-1 focus:ring-[#1F514C]"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2 text-left">
              Years of Experience
            </label>
            <input
              type="text"
              value={formData.experience}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange('experience', e.target.value)
              }
              placeholder="e.g., 3, 5, 10"
              className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-lg bg-white outline-none text-sm sm:text-base focus:border-[#1F514C] focus:ring-1 focus:ring-[#1F514C]"
            />
          </div>
        </div>
      </div>
    ),
    [formData.role, formData.experience, handleInputChange]
  );

  const SkillTags = useMemo(
    () =>
      formData.skills.length > 0 ? (
        <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
          {formData.skills.map(skill => (
            <div
              key={skill.id}
              className="inline-flex items-center bg-green-100 text-green-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium"
            >
              {skill.name}
              <button
                onClick={() => handleSkillRemove(skill.id)}
                className="ml-1 sm:ml-2 hover:bg-green-200 rounded-full p-0.5"
                aria-label={`Remove ${skill.name}`}
              >
                <X size={12} className="sm:size-[14px]" />
              </button>
            </div>
          ))}
        </div>
      ) : null,
    [formData.skills, handleSkillRemove]
  );

  const Step1Component = useMemo(
    () => (
      <div className="text-center">
        <label className="block text-base sm:text-lg font-light text-black mb-3 sm:mb-4">
          Area of Specialization
        </label>

        {SkillTags}

        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
              onKeyDown={handleKeyPress}
              placeholder="Type your specialization"
              maxLength={MAX_SKILL_LENGTH}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-white outline-none text-sm sm:text-base focus:border-[#1F514C] focus:ring-1 focus:ring-[#1F514C]"
            />
          </div>
          {inputValue.trim() && formData.skills.length < MAX_SKILLS ? (
            <button
              onClick={handleAddSkill}
              className="bg-[#1F514C] hover:bg-teal-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors flex items-center justify-center"
              aria-label="Add skill"
            >
              <Plus size={16} className="sm:size-[18px]" />
            </button>
          ) : formData.skills.length >= MAX_SKILLS ? (
            <div className="px-3 sm:px-4 py-2 sm:py-3 text-gray-500 text-xs sm:text-sm">
              Maximum {MAX_SKILLS} skills
            </div>
          ) : null}
        </div>

        {formData.skills.length === 0 && (
          <p className="text-sm text-gray-500 mt-3">
            Please add at least one area of specialization to continue.
          </p>
        )}
      </div>
    ),
    [
      inputValue,
      formData.skills.length,
      SkillTags,
      handleKeyPress,
      handleAddSkill,
    ]
  );

  // Memoized progress indicators
  const ProgressIndicators = useMemo(
    () => (
      <div className="flex justify-center items-center space-x-2 mb-4">
        {Array.from({ length: TOTAL_STEPS }, (_, index) => (
          <div
            key={index}
            className={`w-8 h-2 rounded-full ${currentStep >= index ? 'bg-[#1F514C]' : 'bg-gray-200'}`}
          />
        ))}
      </div>
    ),
    [currentStep]
  );

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="text-center mb-6 sm:mb-8 md:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-4 sm:mb-6">
          Let&apos;s Get to Know You Better
        </h1>

        {ProgressIndicators}

        <p className="text-sm sm:text-base text-gray-600">
          Step {currentStep + 1} of {TOTAL_STEPS}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-xs sm:max-w-md md:max-w-lg">
        <div className="mb-6 sm:mb-8">
          {currentStep === 0 ? Step0Component : Step1Component}
        </div>

        <div className="flex justify-between">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              disabled={isCompleting || isProcessingNext}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back
            </button>
          )}

          <div className={currentStep === 0 ? 'ml-auto' : ''}>
            {currentStep < TOTAL_STEPS - 1 ? (
              <button
                onClick={handleNext}
                disabled={!canProceedFromStep0 || isProcessingNext}
                className={`font-medium px-6 sm:px-8 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base flex items-center ${
                  canProceedFromStep0 && !isProcessingNext
                    ? 'bg-[#1F514C] hover:bg-teal-700 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isProcessingNext ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight size={16} className="ml-1" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={!canComplete || isCompleting}
                className={`font-medium px-6 sm:px-8 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base flex items-center ${
                  canComplete && !isCompleting
                    ? 'bg-[#1F514C] hover:bg-teal-700 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isCompleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Completing...
                  </>
                ) : (
                  'Complete'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecializationCard;
