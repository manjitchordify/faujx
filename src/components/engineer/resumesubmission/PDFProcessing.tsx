import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Upload } from 'lucide-react';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import {
  uploadResumeApi,
  submitProfileApi,
  matchCapabilitiesApi,
  submitCapabilitiesInBackground,
  ProfileSubmissionData,
  ResumeDataForMatching,
} from '@/services/resumeService';
import { get_jd_s3_key_role } from '@/utils/helper/Helper';
import {
  ResumeData,
  PDFProcessingProps,
  ProcessingError,
  ApiError,
} from '@/types/resume.types';
import { ClipLoader } from 'react-spinners';
import { useAppSelector } from '@/store/store';
import {
  setCapabilityResponse,
  setUserResumeData,
} from '@/store/slices/persistSlice';
import { PASS_SCORE } from '@/constants/pass_score';
import {
  completeResumeUploadStage,
  updateProfileStage,
} from '@/services/engineerService';

const BorderLinearProgress = styled(LinearProgress)(() => ({
  height: 8,
  borderRadius: 4,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#E5E7EB',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 4,
    backgroundImage: 'linear-gradient(to right, #1BCC9D, #0D664E)',
    backgroundSize: '200% 100%',
    transition: 'background-position 0.3s ease',
  },
}));

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  location: string;
  currentDesignation: string;
  currentCompany: string;
  expectedSalary: string;
  skills: string;
  experienceYears: string;
  preferredLocations: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  summary: string;
  category: string;
  experience: string;
  education: string;
  projects: string;
  websiteUrl: string;
}

// Constants moved outside component to prevent recreation
const PROCESSING_STEPS = [
  { label: 'Uploading your resume', duration: 1000 },
  { label: 'Analyzing document structure...', duration: 1500 },
  { label: 'Extracting personal information...', duration: 2000 },
  { label: 'Processing experience and skills...', duration: 1800 },
  { label: 'Finalizing analysis...', duration: 1200 },
] as const;

// Updated field mapping to handle the actual missing fields from your API
const FIELD_MAPPING: Record<string, string> = {
  // Direct field mappings (from root missingFields) - handle both camelCase and lowercase
  linkedinUrl: 'linkedinUrl',
  linkedinurl: 'linkedinUrl', // Handle lowercase variant
  githubUrl: 'githubUrl',
  githuburl: 'githubUrl', // Handle lowercase variant
  websiteUrl: 'websiteUrl',
  websiteurl: 'websiteUrl', // Handle lowercase variant
  skills: 'skills',
  experienceYears: 'experienceYears',
  experienceyears: 'experienceYears', // Handle lowercase variant
  currentDesignation: 'currentDesignation',
  currentdesignation: 'currentDesignation', // Handle lowercase variant
  currentCompany: 'currentCompany',
  currentcompany: 'currentCompany', // Handle lowercase variant

  // Nested field mappings (from data.missingFields)
  'contact.name': 'firstName',
  'contact.email': 'email',
  'contact.phone': 'phone',
  'contact.location': 'location',
  experience: 'experience',
  education: 'education',
  'skills.technical': 'skills',
  'optional.contact.linkedin': 'linkedinUrl',
  'optional.contact.github': 'githubUrl',
  'optional.contact.website': 'websiteUrl',
  'optional.skills.tools': 'skills',
  'optional.skills.frameworks': 'skills',
  'optional.skills.languages': 'skills',
};

// Define which fields are actually required (only name, email, phone are mandatory)
const REQUIRED_FIELDS = new Set(['firstName', 'lastName', 'email', 'phone']);

const FIELD_LABELS: Record<string, string> = {
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'Email Address',
  phone: 'Phone Number',
  dateOfBirth: 'Date of Birth',
  location: 'Current Location',
  currentDesignation: 'Current Designation',
  currentCompany: 'Current Company',
  expectedSalary: 'Expected Salary (INR)',
  skills: 'Skills',
  experienceYears: 'Years of Experience',
  preferredLocations: 'Preferred Locations',
  linkedinUrl: 'LinkedIn Profile URL',
  githubUrl: 'GitHub Profile URL',
  portfolioUrl: 'Portfolio URL',
  websiteUrl: 'Website URL/ Porfolio Url',
  summary: 'Professional Summary',
  category: 'Category/Role',
  experience: 'Work Experience',
  education: 'Education',
  projects: 'Projects',
};

const MULTILINE_FIELDS = new Set([
  'skills',
  'preferredLocations',
  'summary',
  'experience',
  'education',
  'projects',
]);

// Helper function to transform ResumeData to ResumeDataForMatching
const transformResumeDataForMatching = (
  resumeData: ResumeData
): ResumeDataForMatching => {
  return {
    personal_info: {
      name:
        `${resumeData.firstName || ''} ${resumeData.lastName || ''}`.trim() ||
        resumeData.user?.fullName ||
        undefined,
      email: resumeData.email || resumeData.user?.email || undefined,
      phone: resumeData.phone || resumeData.user?.phone || undefined,
      location: resumeData.location || resumeData.user?.location || undefined,
    },
    experience: resumeData.parsedExperience?.map(exp => ({
      title: exp.title,
      company: exp.company,
      duration: exp.duration,
      start_date: exp.start_date,
      end_date: exp.end_date,
      description: exp.description || undefined,
      responsibilities: exp.responsibilities,
      key_roles: exp.key_roles,
    })),
    education: resumeData.parsedEducation?.map(edu => ({
      degree: edu.degree,
      institution: edu.institution,
      field: edu.field || undefined,
      year: edu.year,
      gpa: edu.gpa,
    })),
    skills: {
      technical: resumeData.parsedSkills?.technical || resumeData.skills || [],
      soft: resumeData.parsedSkills?.soft || [],
      tools: resumeData.parsedSkills?.tools || [],
      frameworks: resumeData.parsedSkills?.frameworks || [],
      languages: resumeData.parsedSkills?.languages || [],
      certifications: resumeData.parsedSkills?.certifications || [],
    },
    projects: resumeData.parsedProjects?.map(proj => ({
      name: proj.name,
      description: proj.description,
      technologies: proj.technologies,
      url: proj.url || undefined,
      repository: proj.repository || undefined,
      role: proj.role || undefined,
    })),
    summary: resumeData.summary || undefined,
    total_experience_years: resumeData.experienceYears || undefined,
    current_role: resumeData.currentDesignation || undefined,
  };
};

// Create initial state objects outside component to prevent recreation
const INITIAL_PROCESSING_STATE = {
  progress: 0,
  currentStep: 'Processing your resume',
  isProcessing: true,
  hasErrors: false,
  isSubmittingProfile: false,
  isMatchingCapabilities: false,
  showMissingFieldsForm: false,
  // NEW: Add a state to track if any action is in progress
  isAnyActionInProgress: false,
};

const INITIAL_FORM_DATA: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  location: '',
  currentDesignation: '',
  currentCompany: '',
  expectedSalary: '',
  skills: '',
  experienceYears: '',
  preferredLocations: '',
  linkedinUrl: '',
  githubUrl: '',
  portfolioUrl: '',
  websiteUrl: '',
  summary: '',
  category: '',
  experience: '',
  education: '',
  projects: '',
};

// Function to check validation and determine messaging
const getValidationStatus = (
  resumeData: ResumeData,
  missingFields: string[]
) => {
  const requiredFieldsFromData = ['firstName', 'email', 'phone'];
  const missingRequired: string[] = [];

  requiredFieldsFromData.forEach(field => {
    let value;
    if (field === 'email') {
      // Email can come from either resumeData.email or resumeData.user.email
      value = resumeData.email || resumeData.user?.email;
    } else if (field === 'phone') {
      // Phone can come from either resumeData.phone or resumeData.user.phone
      value = resumeData.phone || resumeData.user?.phone;
    } else {
      // For other fields like firstName, check both locations
      value =
        resumeData[field as keyof ResumeData] ||
        resumeData.user?.[field as keyof typeof resumeData.user];
    }

    if (!value || value.toString().trim() === '') {
      missingRequired.push(field);
    }
  });

  // Check if there are any missing required fields from API response
  const apiRequiredMissing = missingFields.some(field => {
    const mappedField = FIELD_MAPPING[field] || field;
    return REQUIRED_FIELDS.has(mappedField);
  });

  const hasRequiredFieldsComplete =
    missingRequired.length === 0 && !apiRequiredMissing;
  const hasOptionalFieldsMissing = missingFields.length > 0;

  return {
    hasRequiredFieldsComplete,
    hasOptionalFieldsMissing,
    missingRequired,
  };
};

const PDFProcessing: React.FC<PDFProcessingProps> = ({
  uploadedFile,
  onComplete,
  onReupload,
}) => {
  // Create a unique key for the uploaded file to ensure useEffect triggers on reupload
  const fileKey = useMemo(() => {
    if (!uploadedFile) return null;
    // Create a unique identifier including file details and timestamp
    return `${uploadedFile.name}_${uploadedFile.size}_${uploadedFile.lastModified}_${Date.now()}`;
  }, [uploadedFile]);

  // State consolidation for better performance
  const [processingState, setProcessingState] = useState(
    INITIAL_PROCESSING_STATE
  );
  const [errors, setErrors] = useState<ProcessingError[]>([]);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  const router = useRouter();
  const dispatch = useDispatch();
  const { enginnerRole } = useAppSelector(state => state.persist);

  // Reset all states when a new file is uploaded
  const resetComponentState = useCallback(() => {
    setProcessingState(INITIAL_PROCESSING_STATE);
    setErrors([]);
    setResumeData(null);
    setMissingFields([]);
    setFormData(INITIAL_FORM_DATA);
  }, []);

  // Process missing fields to map API field names to form field names
  const processedMissingFields = useMemo(() => {
    const processed = missingFields
      .map(field => {
        if (FIELD_MAPPING[field]) {
          return FIELD_MAPPING[field];
        }
        if (field in FIELD_LABELS) {
          return field;
        }
        return null;
      })
      .filter(Boolean)
      .filter((field, index, self) => self.indexOf(field) === index)
      .filter(field => field && field in FIELD_LABELS);
    return processed;
  }, [missingFields]);

  const getInputType = useCallback((fieldName: string): string => {
    if (fieldName === 'expectedSalary' || fieldName === 'experienceYears')
      return 'number';
    if (fieldName === 'dateOfBirth') return 'date';
    if (fieldName === 'email') return 'email';
    if (fieldName === 'phone') return 'tel';
    return 'text';
  }, []);

  // Main useEffect - now uses fileKey instead of uploadedFile directly
  useEffect(() => {
    // Only run when uploadedFile exists and fileKey changes
    if (!uploadedFile || !fileKey) return;

    // Reset state for new file
    resetComponentState();

    let isCancelled = false;

    const processResume = async () => {
      try {
        // Simulate progress function inline
        const simulateProgressInline = (): Promise<void> => {
          return new Promise(resolve => {
            let currentStepIndex = 0;
            let totalProgress = 0;
            const intervals: NodeJS.Timeout[] = [];

            const processSteps = () => {
              if (currentStepIndex < PROCESSING_STEPS.length) {
                const step = PROCESSING_STEPS[currentStepIndex];
                setProcessingState(prev => ({
                  ...prev,
                  currentStep: step.label,
                }));

                const stepDuration = step.duration;
                const stepProgressIncrement =
                  100 / PROCESSING_STEPS.length / (stepDuration / 100);

                const stepInterval = setInterval(() => {
                  totalProgress += stepProgressIncrement;
                  setProcessingState(prev => ({
                    ...prev,
                    progress: Math.min(
                      totalProgress,
                      (currentStepIndex + 1) * (100 / PROCESSING_STEPS.length)
                    ),
                  }));
                }, 100);

                intervals.push(stepInterval);

                const stepTimeout = setTimeout(() => {
                  clearInterval(stepInterval);
                  currentStepIndex++;
                  if (currentStepIndex < PROCESSING_STEPS.length) {
                    processSteps();
                  } else {
                    setProcessingState(prev => ({
                      ...prev,
                      progress: 100,
                      currentStep: 'Resume Processing Completed!',
                    }));
                    resolve();
                  }
                }, stepDuration);

                intervals.push(stepTimeout);
              }
            };

            processSteps();

            // Cleanup function
            return () => {
              intervals.forEach(interval => clearInterval(interval));
            };
          });
        };

        const [apiResponse] = await Promise.all([
          uploadResumeApi(uploadedFile),
          simulateProgressInline(),
        ]);
        if (isCancelled) return;

        // Extract the actual response data
        const response = apiResponse.data || apiResponse;
        const rootMissingFields = apiResponse.missingFields || [];
        if (response?.id && response?.userId) {
          setResumeData(response);
          dispatch(setUserResumeData(response));
          const missingFieldsArray =
            rootMissingFields.length > 0
              ? rootMissingFields
              : response.missingFields || [];

          // Get validation status
          const validation = getValidationStatus(response, missingFieldsArray);

          // Check if there are missing fields that need to be filled
          if (missingFieldsArray && missingFieldsArray.length > 0) {
            setMissingFields(missingFieldsArray);
            setProcessingState(prev => ({
              ...prev,
              showMissingFieldsForm: true,
            }));

            // Populate form data inline
            populateFormDataInline(response);
          } else if (!validation.hasRequiredFieldsComplete) {
            // No API missing fields but still missing required data
            setProcessingState(prev => ({
              ...prev,
              showMissingFieldsForm: true,
            }));
            populateFormDataInline(response);
          } else {
            // No missing fields, proceed directly
            console.log('No missing fields, proceeding...');
          }

          const apiErrors =
            response.resumeParseErrors?.map((err: string) => ({
              field: 'Parsing',
              message: err,
            })) || [];

          // Only treat as blocking errors if there are critical issues
          // Resume parsing warnings should not prevent progression
          const hasCriticalErrors = apiErrors.some(
            error =>
              error.message.toLowerCase().includes('critical') ||
              error.message.toLowerCase().includes('failed to process') ||
              error.message.toLowerCase().includes('invalid format')
          );

          setErrors(apiErrors);
          setProcessingState(prev => ({
            ...prev,
            hasErrors: hasCriticalErrors, // Only block on critical errors
          }));
        } else {
          setErrors([
            {
              field: 'Processing',
              message: 'Invalid response from server',
            },
          ]);
          setProcessingState(prev => ({ ...prev, hasErrors: true }));
        }
      } catch (error: unknown) {
        if (isCancelled) return;

        const processedError = handleApiErrorInline(error);
        setErrors([processedError]);
        setProcessingState(prev => ({ ...prev, hasErrors: true }));
      } finally {
        if (!isCancelled) {
          setProcessingState(prev => ({ ...prev, isProcessing: false }));
        }
      }
    };

    // Inline function to populate form data
    const populateFormDataInline = (response: ResumeData) => {
      setFormData({
        firstName: response.user?.firstName || response.firstName || '',
        lastName: response.user?.lastName || response.lastName || '',
        email: response.email || response.user?.email || '',
        phone: response.phone || response.user?.phone || '',
        dateOfBirth: response.user?.dateOfBirth || response.dateOfBirth || '',
        location: response.location || response.user?.location || '',
        currentDesignation: response.currentDesignation || '',
        currentCompany: response.currentCompany || '',
        expectedSalary: response.expectedSalary?.toString() || '',
        skills: Array.isArray(response.skills)
          ? response.skills.join(', ')
          : response.parsedSkills?.technical?.join(', ') || '',
        experienceYears: response.experienceYears?.toString() || '',
        preferredLocations: Array.isArray(response.preferredLocations)
          ? response.preferredLocations.join(', ')
          : '',
        linkedinUrl: response.linkedinUrl || '',
        githubUrl: response.githubUrl || '',
        portfolioUrl: response.portfolioUrl || '',
        websiteUrl: response.websiteUrl || '',
        summary: response.summary || '',
        category: response.category || '',
        experience:
          response.parsedExperience
            ?.map(
              exp =>
                `${exp.title} at ${exp.company} (${exp.start_date} - ${exp.end_date}): ${exp.description || 'No description provided'}`
            )
            .join('\n\n') || '',
        education:
          response.parsedEducation
            ?.map(
              edu =>
                `${edu.degree} from ${edu.institution} (${edu.year}) - Grade: ${edu.gpa}`
            )
            .join('\n\n') || '',
        projects:
          response.parsedProjects
            ?.map(
              proj =>
                `${proj.name}: ${proj.description || 'No description provided'}\nTechnologies: ${proj.technologies?.join(', ') || 'N/A'}\nURL: ${proj.url || 'N/A'}`
            )
            .join('\n\n') || '',
      });
    };

    // Inline function to handle API errors
    const handleApiErrorInline = (error: unknown): ProcessingError => {
      const apiError = error as ApiError;
      let errorMessage = 'Unable to process the resume. Please try again.';

      if (apiError.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (apiError.status === 404) {
        errorMessage = 'Candidate not found.';
      } else if (apiError.status === 413) {
        errorMessage = 'File size too large. Please upload a smaller file.';
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }

      return {
        field: 'Connection',
        message: errorMessage,
      };
    };

    processResume();

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileKey, resetComponentState, dispatch]);

  // Capability matching logic
  const performCapabilityMatching = useCallback(
    async (dataToMatch: ResumeData) => {
      setProcessingState(prev => ({
        ...prev,
        isMatchingCapabilities: true,
        isAnyActionInProgress: true, // NEW: Set global action state
        currentStep: 'Analyzing your capabilities...',
      }));

      try {
        const jdKey = get_jd_s3_key_role(enginnerRole ?? '');
        const transformedData = transformResumeDataForMatching(dataToMatch);
        const matchingResponse = await matchCapabilitiesApi(
          jdKey,
          transformedData
        );
        dispatch(setCapabilityResponse(matchingResponse));
        submitCapabilitiesInBackground(matchingResponse);
        if (matchingResponse.score < PASS_SCORE) {
          await updateProfileStage('resumeUpload', 'failed');
          router.push(`/engineer/feedback`);
        } else {
          await completeResumeUploadStage();
          onComplete(dataToMatch);
        }
      } catch (error: unknown) {
        const apiError = error as ApiError;
        setErrors([
          {
            field: 'Capability Analysis',
            message:
              apiError.message ||
              'Failed to analyze capabilities. Please try again.',
          },
        ]);
        setProcessingState(prev => ({
          ...prev,
          hasErrors: true,
          isAnyActionInProgress: false, // NEW: Reset on error
        }));
      } finally {
        setProcessingState(prev => ({
          ...prev,
          isMatchingCapabilities: false,
          isAnyActionInProgress: false, // NEW: Reset when done
        }));
      }
    },
    [enginnerRole, router, onComplete, dispatch]
  );

  const handleContinue = useCallback(async () => {
    if (!resumeData) return;

    // NEW: Set action in progress
    setProcessingState(prev => ({
      ...prev,
      isAnyActionInProgress: true,
    }));

    await performCapabilityMatching(resumeData);
  }, [resumeData, performCapabilityMatching]);

  const handleReupload = useCallback(() => {
    // NEW: Set action in progress
    setProcessingState(prev => ({
      ...prev,
      isAnyActionInProgress: true,
    }));

    resetComponentState();
    if (onReupload) {
      onReupload();
    }
  }, [onReupload, resetComponentState]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  // Parser functions (optimized)
  const parseExperienceText = useCallback((text: string) => {
    return text
      .split('\n\n')
      .map(exp => {
        const lines = exp.split('\n');
        const titleMatch = lines[0]?.match(
          /^(.+?) at (.+?) \((.+?) - (.+?)\): (.+)$/
        );
        if (titleMatch) {
          return {
            title: titleMatch[1],
            company: titleMatch[2],
            start_date: titleMatch[3],
            end_date: titleMatch[4],
            description: titleMatch[5],
          };
        }
        return {
          title: '',
          company: '',
          start_date: '',
          end_date: '',
          description: exp,
        };
      })
      .filter(exp => exp.title || exp.description);
  }, []);

  const parseEducationText = useCallback((text: string) => {
    return text
      .split('\n\n')
      .map(edu => {
        const match = edu.match(
          /^(.+?) from (.+?) \((.+?) - (.+?)\) - Grade: (.+)$/
        );
        if (match) {
          return {
            degree: match[1],
            institution: match[2],
            start_date: match[3],
            end_date: match[4],
            grade: match[5],
          };
        }
        return {
          degree: '',
          institution: '',
          start_date: '',
          end_date: '',
          grade: edu,
        };
      })
      .filter(edu => edu.degree || edu.institution);
  }, []);

  const parseProjectsText = useCallback((text: string) => {
    return text
      .split('\n\n')
      .map(proj => {
        const lines = proj.split('\n');
        const titleDesc = lines[0]?.split(': ');
        const techMatch = lines[1]?.match(/Technologies: (.+)/);
        const urlMatch = lines[2]?.match(/URL: (.+)/);

        return {
          title: titleDesc?.[0] || '',
          description: titleDesc?.[1] || '',
          technologies: techMatch?.[1]?.split(', ') || [],
          url:
            urlMatch?.[1] !== 'N/A' && urlMatch?.[1] ? urlMatch[1] : undefined,
        };
      })
      .filter(proj => proj.title || proj.description);
  }, []);

  const handleSkipForNow = useCallback(async () => {
    // NEW: Set action in progress
    setProcessingState(prev => ({
      ...prev,
      isAnyActionInProgress: true,
    }));

    // Same functionality as save and continue but with minimal data
    if (!resumeData) return;
    await performCapabilityMatching(resumeData);
  }, [resumeData, performCapabilityMatching]);

  const handleProfileSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // NEW: Set both form submission and global action states
      setProcessingState(prev => ({
        ...prev,
        isSubmittingProfile: true,
        isAnyActionInProgress: true,
      }));

      try {
        // Create the submission data object with only non-empty values
        const submitData: Record<string, unknown> = {};

        // Add string fields only if they have values
        if (formData.firstName && formData.firstName.trim()) {
          submitData.firstName = formData.firstName.trim();
        }
        if (formData.lastName && formData.lastName.trim()) {
          submitData.lastName = formData.lastName.trim();
        }
        if (formData.email && formData.email.trim()) {
          submitData.email = formData.email.trim();
        }
        if (formData.phone && formData.phone.trim()) {
          submitData.phone = formData.phone.trim();
        }
        if (formData.dateOfBirth && formData.dateOfBirth.trim()) {
          submitData.dateOfBirth = formData.dateOfBirth.trim();
        }
        if (formData.location && formData.location.trim()) {
          submitData.location = formData.location.trim();
        }
        if (formData.currentDesignation && formData.currentDesignation.trim()) {
          submitData.currentDesignation = formData.currentDesignation.trim();
        }
        if (formData.currentCompany && formData.currentCompany.trim()) {
          submitData.currentCompany = formData.currentCompany.trim();
        }
        if (formData.linkedinUrl && formData.linkedinUrl.trim()) {
          submitData.linkedinUrl = formData.linkedinUrl.trim();
        }
        if (formData.githubUrl && formData.githubUrl.trim()) {
          submitData.githubUrl = formData.githubUrl.trim();
        }
        if (formData.portfolioUrl && formData.portfolioUrl.trim()) {
          submitData.portfolioUrl = formData.portfolioUrl.trim();
        }
        if (formData.websiteUrl && formData.websiteUrl.trim()) {
          submitData.websiteUrl = formData.websiteUrl.trim();
        }
        if (formData.summary && formData.summary.trim()) {
          submitData.summary = formData.summary.trim();
        }
        if (formData.category && formData.category.trim()) {
          submitData.category = formData.category.trim();
        }

        // Add number fields only if they have valid values
        if (formData.expectedSalary && formData.expectedSalary.trim()) {
          const salary = parseInt(formData.expectedSalary.trim());
          if (!isNaN(salary)) {
            submitData.expectedSalary = salary;
          }
        }
        if (formData.experienceYears && formData.experienceYears.trim()) {
          const years = parseInt(formData.experienceYears.trim());
          if (!isNaN(years)) {
            submitData.experienceYears = years;
          }
        }

        // Add array fields only if they have values
        if (formData.skills && formData.skills.trim()) {
          const skillsArray = formData.skills
            .split(',')
            .map(skill => skill.trim())
            .filter(skill => skill);
          if (skillsArray.length > 0) {
            submitData.skills = skillsArray;
          }
        }

        if (formData.preferredLocations && formData.preferredLocations.trim()) {
          const locationsArray = formData.preferredLocations
            .split(',')
            .map(location => location.trim())
            .filter(location => location);
          if (locationsArray.length > 0) {
            submitData.preferredLocations = locationsArray;
          }
        }

        // Add complex fields only if they have values
        if (formData.experience && formData.experience.trim()) {
          const experienceArray = parseExperienceText(formData.experience);
          if (experienceArray.length > 0) {
            submitData.experience = experienceArray;
          }
        }

        if (formData.education && formData.education.trim()) {
          const educationArray = parseEducationText(formData.education);
          if (educationArray.length > 0) {
            submitData.education = educationArray;
          }
        }

        if (formData.projects && formData.projects.trim()) {
          const projectsArray = parseProjectsText(formData.projects);
          if (projectsArray.length > 0) {
            submitData.projects = projectsArray;
          }
        }

        // Add backend-specific fields from existing resume data
        if (resumeData?.resumeUrl) {
          submitData.resumeUrl = resumeData.resumeUrl;
        }
        if (resumeData?.resumeKey) {
          submitData.resumeKey = resumeData.resumeKey;
        }
        if (resumeData?.resumeParseScore) {
          submitData.resumeParseScore = resumeData.resumeParseScore;
        }
        if (resumeData?.vettingScore) {
          submitData.vettingScore = resumeData.vettingScore;
        }
        if (resumeData?.resumeParsedAt) {
          submitData.resumeParsedAt = resumeData.resumeParsedAt;
        }
        if (
          resumeData?.resumeParseErrors &&
          resumeData.resumeParseErrors.length > 0
        ) {
          submitData.resumeParseErrors = resumeData.resumeParseErrors;
        }
        await submitProfileApi(submitData as ProfileSubmissionData);
        setProcessingState(prev => ({
          ...prev,
          isSubmittingProfile: false,
          showMissingFieldsForm: false,
          // Keep isAnyActionInProgress true as we'll proceed to capability matching
        }));
        const updatedResumeDataForMatching = resumeData
          ? { ...resumeData, ...submitData }
          : resumeData;

        // Proceed with capability matching (this will handle resetting isAnyActionInProgress)
        await performCapabilityMatching(
          updatedResumeDataForMatching || resumeData!
        );
      } catch (err: unknown) {
        const error = err as ApiError;
        let errorMessage = 'Failed to update profile. Please try again.';

        // Handle specific error cases
        if (error.status === 400) {
          errorMessage = 'Invalid data provided. Please check your inputs.';
        } else if (error.status === 422) {
          errorMessage = 'Validation failed. Please check required fields.';
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again or contact support.';
        } else if (error.message) {
          errorMessage = error.message;
        }

        setErrors([
          {
            field: 'Profile Update',
            message: errorMessage,
          },
        ]);
        setProcessingState(prev => ({
          ...prev,
          hasErrors: true,
          isSubmittingProfile: false,
          isAnyActionInProgress: false,
        }));
      }
    },
    [
      formData,
      parseExperienceText,
      parseEducationText,
      parseProjectsText,
      performCapabilityMatching,
      resumeData,
    ]
  );

  // Memoized form field renderer
  const renderMissingField = useCallback(
    (fieldName: string) => {
      const value = formData[fieldName as keyof FormData];
      const isMultiline = MULTILINE_FIELDS.has(fieldName);
      const label = FIELD_LABELS[fieldName] || fieldName;
      const isRequired = REQUIRED_FIELDS.has(fieldName);

      return (
        <div key={fieldName} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
          {isMultiline ? (
            <textarea
              name={fieldName}
              value={value}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1F514C] focus:border-transparent resize-none ${
                isRequired ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              rows={
                fieldName === 'experience' ||
                fieldName === 'education' ||
                fieldName === 'projects'
                  ? 6
                  : 3
              }
              required={isRequired}
            />
          ) : (
            <input
              type={getInputType(fieldName)}
              name={fieldName}
              value={value}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1F514C] focus:border-transparent ${
                isRequired ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              required={isRequired}
            />
          )}
        </div>
      );
    },
    [formData, getInputType, handleInputChange]
  );

  const {
    progress,
    currentStep,
    isProcessing,
    hasErrors,
    isSubmittingProfile,
    isMatchingCapabilities,
    showMissingFieldsForm,
    isAnyActionInProgress, // NEW: Extract the new state
  } = processingState;

  // Check if we're actually showing any required fields in the form
  const hasRequiredFieldsInForm = processedMissingFields.some(
    field => field && REQUIRED_FIELDS.has(field)
  );

  // Determine messaging based on validation
  const getProfileMessage = () => {
    if (hasRequiredFieldsInForm) {
      // Only show "required" message if we actually have required fields in the form
      return {
        title: 'Complete Your Profile',
        subtitle:
          'Please fill in the information below. Fields marked with * are required.',
        showSkipButton: true,
        buttonText: 'Save and Continue',
        skipButtonText: 'Skip for Now',
        isRequired: true,
      };
    } else {
      return {
        title: 'Add additional information',
        subtitle:
          'You can add additional information to enhance your profile, or skip this step to continue.',
        showSkipButton: true,
        buttonText: 'Save and Continue',
        skipButtonText: 'Skip for Now',
        isRequired: false,
      };
    }
  };

  const profileMessage = getProfileMessage();

  return (
    <div className="p-">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full p-18">
        <div className="flex text-center items-center mb-8 gap-4">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center">
              <svg
                width="59"
                height="59"
                viewBox="0 0 59 59"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.14551 29.5007C6.14551 18.4922 6.14551 12.9856 9.56505 9.56603C12.9846 6.14648 18.4888 6.14648 29.4997 6.14648C40.5081 6.14648 46.0148 6.14648 49.4343 9.56603C52.8538 12.9856 52.8538 18.4898 52.8538 29.5007C52.8538 40.5091 52.8538 46.0157 49.4343 49.4353C46.0148 52.8548 40.5105 52.8548 29.4997 52.8548C18.4913 52.8548 12.9846 52.8548 9.56505 49.4353C6.14551 46.0157 6.14551 40.5115 6.14551 29.5007Z"
                  stroke="#6C63FF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M29.5195 25.8328C28.5415 25.8328 27.6036 26.2213 26.9121 26.9129C26.2205 27.6044 25.832 28.5423 25.832 29.5203C25.832 30.4983 26.2205 31.4362 26.9121 32.1278C27.6036 32.8193 28.5415 33.2078 29.5195 33.2078C30.4975 33.2078 31.4354 32.8193 32.127 32.1278C32.8185 31.4362 33.207 30.4983 33.207 29.5203C33.207 28.5423 32.8185 27.6044 32.127 26.9129C31.4354 26.2213 30.4975 25.8328 29.5195 25.8328ZM29.5195 25.8328V17.209M36.9117 36.9248L32.1204 32.136"
                  stroke="#6C63FF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-xl font-medium text-gray-900 mb-2">
            {progress === 100 && !isProcessing
              ? 'Resume Processing Completed!'
              : 'Hang on — we are working on your resume'}
          </h1>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">{currentStep}</span>
            <span className="text-sm text-black font-medium">
              {Math.round(progress)}%
            </span>
          </div>
          <BorderLinearProgress variant="determinate" value={progress} />
        </div>

        {!isProcessing && hasErrors && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 mb-2">
                  Critical Processing Issues
                </h3>
                <p className="text-sm text-red-700 mb-3">
                  We encountered critical issues while processing your
                  resume&#39;s. Please try uploading it again with a clearer
                  format.
                </p>
                <div className="text-xs text-red-600">
                  <strong>Issues found:</strong>{' '}
                  {errors.map(e => e.message).join(', ')}
                </div>
              </div>
            </div>
          </div>
        )}

        {!isProcessing && !hasErrors && errors.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">
                  Processing Warnings
                </h3>
                <p className="text-sm text-yellow-700 mb-3">
                  Your resume was processed successfully with some minor
                  warnings. You can continue or reupload if needed.
                </p>
                <div className="text-xs text-yellow-600">
                  <strong>Warnings:</strong>{' '}
                  {errors.map(e => e.message).join(', ')}
                </div>
              </div>
            </div>
          </div>
        )}

        {!isProcessing &&
          showMissingFieldsForm &&
          processedMissingFields.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {profileMessage.title}
                </h3>
                <p className="text-sm text-black">{profileMessage.subtitle}</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {processedMissingFields.map(field =>
                    renderMissingField(field ?? '')
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  {profileMessage.showSkipButton && (
                    <button
                      type="button"
                      onClick={handleSkipForNow}
                      disabled={isAnyActionInProgress}
                      className="flex-1 py-3 px-6 border border-black text-black rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    >
                      {profileMessage.skipButtonText}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleReupload}
                    disabled={isAnyActionInProgress}
                    className="flex-1 py-3 px-6 border border-black text-black rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  >
                    Upload Different File
                  </button>
                  <button
                    type="submit"
                    disabled={isAnyActionInProgress}
                    className="flex-1 py-3 px-6 bg-[#1F514C] hover:bg-[#164138] text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmittingProfile ? (
                      <>
                        <ClipLoader
                          color="#ffffff"
                          size={16}
                          loading={true}
                          aria-label="Loading Spinner"
                        />
                        Saving...
                      </>
                    ) : (
                      profileMessage.buttonText
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

        {!isProcessing && !showMissingFieldsForm && !isMatchingCapabilities && (
          <div className="text-center space-y-3">
            {hasErrors ? (
              <button
                onClick={handleReupload}
                disabled={isAnyActionInProgress}
                className="w-full font-medium py-3 px-6 rounded-xl transition-colors duration-200 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
              >
                <Upload className="w-4 h-4" />
                Upload Different File
              </button>
            ) : (
              <button
                onClick={handleContinue}
                disabled={isAnyActionInProgress}
                className="w-full font-medium py-3 px-6 rounded-xl transition-colors duration-200 bg-[#1F514C] hover:bg-[#164138] text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#1F514C]"
              >
                Next
              </button>
            )}
          </div>
        )}

        {isMatchingCapabilities && (
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <ClipLoader
                color="#1F514C"
                size={24}
                loading={true}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              <span className="text-gray-600">
                Analyzing your capabilities...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFProcessing;
