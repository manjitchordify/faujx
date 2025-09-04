import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userType: string;
  isVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  companyName?: string;
  companyWebsite?: string;
  isPreliminaryVideoCompleted?: boolean;
  accessToken?: string;
  profilePic?: string | null;
  profileVideo?: string | null;
  profileSetup?: boolean;
  phase1Completed?: boolean | null;
}

interface userState {
  loggedInUser: UserData | null;
}

const initialState: userState = {
  loggedInUser: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoggedInUser: (state, action: PayloadAction<UserData | null>) => {
      state.loggedInUser = action.payload;
    },

    updateProfileSetup: (state, action: PayloadAction<boolean>) => {
      if (state.loggedInUser) {
        state.loggedInUser.profileSetup = action.payload;
      }
    },
  },
});

export const { setLoggedInUser, updateProfileSetup } = userSlice.actions;
export default userSlice.reducer;
