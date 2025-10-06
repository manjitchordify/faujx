export type StageKey =
  | 'knowBetter'
  | 'resumeUpload'
  | 'mcq'
  | 'codingTest'
  | 'interview';
export type StageStatus = 'passed' | 'failed' | 'scheduled';

export interface ProfileStages {
  lastStage: StageKey;
  lastStatus: StageStatus;
}

/**
 * Determines the next route based on profile stage completion status
 * @param profileStages - The profile stages object from login response
 * @param roleTitle - The specific role title (e.g., 'Devops', 'Frontend', etc.)
 * @returns The route path to navigate to
 */
export const getNextRouteFromStages = (
  profileStages: ProfileStages | null | undefined,
  roleTitle?: string
): string => {
  if (!profileStages) {
    console.log('No profileStages, returning knowbetter');
    return '/engineer/knowbetter';
  }

  const { lastStage, lastStatus } = profileStages;

  // Stage to route mapping
  const stageRoutes: Record<StageKey, string> = {
    knowBetter: '/engineer/knowbetter',
    resumeUpload: '/engineer/upload-resume',
    mcq: '/engineer/mcq',
    codingTest: '/engineer/coding/coding-intro',
    interview: '/engineer/interview/select-slot',
  };

  // Get stage progression based on role title
  const getStageOrderForRole = (role?: string): StageKey[] => {
    const baseStages: StageKey[] = [
      'knowBetter',
      'resumeUpload',
      'mcq',
      'interview',
    ];

    // DevOps and similar roles skip coding test
    const rolesSkippingCoding = ['Devops', 'devops', 'DevOps'];

    if (role && rolesSkippingCoding.includes(role)) {
      console.log(`Role ${role} detected - skipping coding test`);
      return baseStages;
    }

    // Default progression includes coding test
    return ['knowBetter', 'resumeUpload', 'mcq', 'codingTest', 'interview'];
  };

  const stageOrder = getStageOrderForRole(roleTitle);
  const currentStageIndex = stageOrder.indexOf(lastStage);

  // If stage not found, start from beginning
  if (currentStageIndex === -1) {
    console.warn(`Unknown stage: ${lastStage}, redirecting to knowBetter`);
    return stageRoutes.knowBetter;
  }

  // Special case: If coding test failed, go to feedback instead of retrying
  if (lastStage === 'codingTest' && lastStatus === 'failed') {
    console.log('Coding test failed, redirecting to feedback');
    return '/engineer/feedback?type=coding';
  }

  // Special case: If interview is scheduled, go to /engineer/interview
  if (lastStage === 'interview' && lastStatus === 'scheduled') {
    console.log('Interview scheduled, redirecting to /engineer/interview');
    return '/engineer/interview';
  }

  // If last stage failed, retry the same stage (except coding test handled above)
  if (lastStatus === 'failed') {
    console.log(`Stage ${lastStage} failed, retrying same stage`);
    return stageRoutes[lastStage];
  }

  // If last stage passed, move to next stage
  if (lastStatus === 'passed') {
    const nextStageIndex = currentStageIndex + 1;

    // If all stages completed, go to dashboard
    if (nextStageIndex >= stageOrder.length) {
      console.log('All stages completed, redirecting to dashboard');
      return '/engineer/dashboard';
    }

    // Special case: If resumeUpload just passed, show success component first
    if (lastStage === 'resumeUpload') {
      console.log('Resume upload passed, showing success component first');
      return stageRoutes.resumeUpload;
    }

    // Return next stage route
    const nextStage = stageOrder[nextStageIndex];
    console.log(
      `Stage ${lastStage} passed, moving to next stage: ${nextStage}`
    );
    return stageRoutes[nextStage];
  }

  // Default fallback
  console.warn(
    `Invalid stage status: ${lastStatus}, redirecting to knowBetter`
  );
  return stageRoutes.knowBetter;
};

/**
 * Helper function to check if all stages are completed
 * @param profileStages - The profile stages object
 * @param roleTitle - The specific role title
 * @returns true if user has completed all stages
 */
export const isProfileCompleted = (
  profileStages: ProfileStages | null,
  roleTitle?: string
): boolean => {
  if (!profileStages) return false;

  // Get the final stage based on role
  const rolesSkippingCoding = ['Devops', 'devops', 'DevOps'];
  const finalStage =
    roleTitle && rolesSkippingCoding.includes(roleTitle)
      ? 'interview'
      : 'interview'; // Same final stage for all roles currently

  return (
    profileStages.lastStage === finalStage &&
    profileStages.lastStatus === 'passed'
  );
};

/**
 * Helper function to get current stage progress percentage
 * @param profileStages - The profile stages object
 * @param roleTitle - The specific role title
 * @returns Progress percentage (0-100)
 */
export const getStageProgress = (
  profileStages: ProfileStages | null | undefined,
  roleTitle?: string
): number => {
  if (!profileStages) return 0;

  // Get stage order based on role
  const rolesSkippingCoding = ['Devops', 'devops', 'DevOps'];
  const stageOrder: StageKey[] =
    roleTitle && rolesSkippingCoding.includes(roleTitle)
      ? ['knowBetter', 'resumeUpload', 'mcq', 'interview']
      : ['knowBetter', 'resumeUpload', 'mcq', 'codingTest', 'interview'];

  const currentStageIndex = stageOrder.indexOf(profileStages.lastStage);

  if (currentStageIndex === -1) return 0;

  // If current stage is passed, add 1 to index for progress calculation
  const completedStages =
    profileStages.lastStatus === 'passed'
      ? currentStageIndex + 1
      : currentStageIndex;

  return Math.round((completedStages / stageOrder.length) * 100);
};

/**
 * Helper function to get human-readable stage name
 * @param stage - The stage key
 * @returns Formatted stage name
 */
export const getStageDisplayName = (stage: StageKey): string => {
  const stageNames: Record<StageKey, string> = {
    knowBetter: 'Know Better',
    resumeUpload: 'Resume Upload',
    mcq: 'MCQ Test',
    codingTest: 'Coding Test',
    interview: 'Interview',
  };

  return stageNames[stage] || stage;
};
