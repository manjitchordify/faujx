'use client';
import React, { useState, useMemo } from 'react';
import Checkpoints from './Checkpoints';
import CorporateTraining from './CorporateTraining';
import ProfilePic from './ProfilePic';
import CaptureVideo from './CaptureVideo';
import { useAppSelector } from '@/store/store';

const ProfileSetup = () => {
  const [currentStep, setCurrentStep] = useState('checkpoints'); // 'checkpoints', 'training', 'profilepic', or 'capturevideo'
  const { loggedInUser } = useAppSelector(state => state.user);

  const steps = useMemo(
    () => [
      {
        id: 1,
        title: 'Watch Company Culture Video',
        description:
          'View our 5-minute introduction video covering company values, policies, and workplace culture expectations.',
        completed: loggedInUser?.isPreliminaryVideoCompleted === true,
      },
      {
        id: 2,
        title: 'Upload Professional Profile Picture',
        description:
          'Upload a high-resolution professional headshot that meets company guidelines for directory and communication platforms.',
        completed: Boolean(loggedInUser?.profilePic),
      },
      {
        id: 3,
        title: 'Record Introduction Video',
        description:
          'Create a brief 30-second video introduction including your name, role, and professional background for team integration.',
        completed: Boolean(loggedInUser?.profileVideo),
      },
    ],
    [loggedInUser]
  );

  // Function to find the first incomplete step
  const getFirstIncompleteStep = () => {
    const incompleteStep = steps.find(step => !step.completed);

    if (!incompleteStep) {
      return null; // All steps are completed
    }

    // Map step IDs to component names
    const stepMapping: { [key: number]: string } = {
      1: 'training',
      2: 'profilepic',
      3: 'capturevideo',
    };

    return stepMapping[incompleteStep.id];
  };

  const handleBegin = () => {
    const firstIncompleteStep = getFirstIncompleteStep();

    if (firstIncompleteStep) {
      setCurrentStep(firstIncompleteStep);
    } else {
      // All steps completed - could redirect to a completion page or show success message
      console.log('All steps completed!');
      // You might want to handle this case differently
    }
  };

  const handleProceed = () => {
    if (currentStep === 'training') {
      setCurrentStep('profilepic');
    } else if (currentStep === 'profilepic') {
      setCurrentStep('capturevideo');
    }
  };

  const handleBack = () => {
    if (currentStep === 'training') {
      setCurrentStep('checkpoints');
    } else if (currentStep === 'profilepic') {
      setCurrentStep('training');
    } else if (currentStep === 'capturevideo') {
      setCurrentStep('profilepic');
    }
  };

  // Dynamic heading content based on current step
  const getHeadingContent = () => {
    if (currentStep === 'checkpoints') {
      return {
        title: 'Complete Your Profile Setup',
        subtitle:
          'Complete these required steps to activate your employee account and gain access to company resources.',
      };
    } else if (currentStep === 'training') {
      return {
        title: 'Corporate Culture Training',
        subtitle: 'Build a stronger, more inclusive workplace culture',
      };
    } else if (currentStep === 'profilepic') {
      return {
        title: 'Upload profile pic',
        subtitle: 'Add a professional photo to complete your employee profile',
      };
    } else {
      return {
        title: 'Capture Video',
        subtitle: 'Record a brief introduction video to complete your profile',
      };
    }
  };

  const headingContent = getHeadingContent();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-light text-gray-900 mb-4">
          {headingContent.title}
        </h1>
        <p className="text-lg font-light text-gray-600">
          {headingContent.subtitle}
        </p>
      </div>

      {currentStep === 'checkpoints' ? (
        <Checkpoints onBegin={handleBegin} steps={steps} />
      ) : currentStep === 'training' ? (
        <CorporateTraining onBack={handleBack} onProceed={handleProceed} />
      ) : currentStep === 'profilepic' ? (
        <ProfilePic onBack={handleBack} onProceed={handleProceed} />
      ) : (
        <CaptureVideo />
      )}
    </div>
  );
};

export default ProfileSetup;
