// lib/slices/counterSlice.ts
import { Candidate } from '@/types/customer';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface customerState {
  CustomerFavourites: Candidate[];
  CustomerShortlisted: Candidate[];
  CustomerMyInterviews: [];
  isCandidateInfoSeen: boolean;
  isFavouriteInfoSeen: boolean;
}

const initialState: customerState = {
  CustomerFavourites: [],
  CustomerShortlisted: [],
  CustomerMyInterviews: [],
  isCandidateInfoSeen: false,
  isFavouriteInfoSeen: false,
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomerFavourites: (state, action: PayloadAction<Candidate[]>) => {
      state.CustomerFavourites = action.payload;
    },
    setCustomerShortlisted: (state, action: PayloadAction<Candidate[]>) => {
      state.CustomerShortlisted = action.payload;
    },
    setCustomerMyInterview: (state, action: PayloadAction<[]>) => {
      state.CustomerMyInterviews = action.payload;
    },
    setIsCandidateInfoSeen: (state, action: PayloadAction<boolean>) => {
      state.isCandidateInfoSeen = action.payload;
    },
    setIsFavouriteInfoSeen: (state, action: PayloadAction<boolean>) => {
      state.isFavouriteInfoSeen = action.payload;
    },
  },
});

export const {
  setCustomerFavourites,
  setCustomerShortlisted,
  setCustomerMyInterview,
  setIsCandidateInfoSeen,
  setIsFavouriteInfoSeen,
} = customerSlice.actions;
export default customerSlice.reducer;
