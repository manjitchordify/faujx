import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EngineerProfileState {
  experienceYears: number;
  currentDesignation: string;
  currentCompany: string;
  expectedSalary: number;
  preferredMonthlySalary: string;
  currencyType: string;
  preferredLocations: string[];
  skills: string[];
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  roleId: string;
  roleTitle: string;
  workMode: string[];
  joiningPeriod: string;
  isWillingToRelocate: boolean;
  isOpenToOtherLocations: boolean;
  relocationConfirmed: boolean;
  interviewSlot: string[];
}

const initialState: EngineerProfileState = {
  experienceYears: 0,
  currentDesignation: '',
  currentCompany: '',
  expectedSalary: 0,
  preferredMonthlySalary: '',
  currencyType: 'CAD',
  preferredLocations: [],
  skills: [],
  linkedinUrl: '',
  githubUrl: '',
  portfolioUrl: '',
  roleId: '',
  roleTitle: '',
  workMode: [],
  joiningPeriod: '',
  isWillingToRelocate: false,
  isOpenToOtherLocations: false,
  relocationConfirmed: false,
  interviewSlot: [],
};

const engineerProfileSlice = createSlice({
  name: 'engineerProfile',
  initialState,
  reducers: {
    // Set the entire profile (useful for initial load)
    setEngineerProfile: (
      state,
      action: PayloadAction<Partial<EngineerProfileState>>
    ) => {
      return { ...state, ...action.payload };
    },

    // Set role information
    setRoleData: (
      state,
      action: PayloadAction<{ roleId: string; roleTitle: string }>
    ) => {
      state.roleId = action.payload.roleId;
      state.roleTitle = action.payload.roleTitle;
      state.currentDesignation = action.payload.roleId; // Also update currentDesignation
    },

    // Set location information
    setLocationData: (
      state,
      action: PayloadAction<{ preferredLocations: string[] }>
    ) => {
      state.preferredLocations = action.payload.preferredLocations;
    },

    // Set salary information
    setSalaryData: (
      state,
      action: PayloadAction<{
        preferredMonthlySalary: string;
        currencyType: string;
      }>
    ) => {
      state.preferredMonthlySalary = action.payload.preferredMonthlySalary;
      state.currencyType = action.payload.currencyType;
    },

    // Set work mode
    setWorkModeData: (state, action: PayloadAction<{ workMode: string[] }>) => {
      state.workMode = action.payload.workMode;
    },

    // Set relocation preferences
    setRelocationData: (
      state,
      action: PayloadAction<{
        isWillingToRelocate?: boolean;
        isOpenToOtherLocations?: boolean;
        relocationConfirmed?: boolean;
      }>
    ) => {
      if (action.payload.isWillingToRelocate !== undefined) {
        state.isWillingToRelocate = action.payload.isWillingToRelocate;
      }
      if (action.payload.isOpenToOtherLocations !== undefined) {
        state.isOpenToOtherLocations = action.payload.isOpenToOtherLocations;
      }
      if (action.payload.relocationConfirmed !== undefined) {
        state.relocationConfirmed = action.payload.relocationConfirmed;
      }
    },

    // Set joining period
    setJoiningPeriodData: (
      state,
      action: PayloadAction<{ joiningPeriod: string }>
    ) => {
      state.joiningPeriod = action.payload.joiningPeriod;
    },

    // Set interview slot
    setInterviewSlotData: (
      state,
      action: PayloadAction<{ interviewSlot: string[] }>
    ) => {
      state.interviewSlot = action.payload.interviewSlot;
    },

    // Reset profile (useful for logout)
    resetEngineerProfile: () => initialState,
  },
});

export const {
  setEngineerProfile,
  setRoleData,
  setLocationData,
  setSalaryData,
  setWorkModeData,
  setRelocationData,
  setJoiningPeriodData,
  setInterviewSlotData,
  resetEngineerProfile,
} = engineerProfileSlice.actions;

export default engineerProfileSlice.reducer;
