// lib/slices/customerSlice.ts
import { Candidate } from '@/types/customer';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface customerState {
  CustomerFavourites: Candidate[];
  CustomerShortlisted: Candidate[];
  CustomerMyInterviews: [];

  // ADD THESE NEW PROPERTIES:
  CustomerPendingInterviews: Candidate[];
  CustomerInterviewed: Candidate[];
  CustomerHired: Candidate[];

  isCandidateInfoSeen: boolean;
  isFavouriteInfoSeen: boolean;
}

const initialState: customerState = {
  CustomerFavourites: [],
  CustomerShortlisted: [],
  CustomerMyInterviews: [],

  // ADD THESE NEW INITIAL VALUES:
  CustomerPendingInterviews: [],
  CustomerInterviewed: [],
  CustomerHired: [],

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

    // ADD THESE NEW REDUCER ACTIONS:
    setCustomerPendingInterviews: (
      state,
      action: PayloadAction<Candidate[]>
    ) => {
      state.CustomerPendingInterviews = action.payload;
    },
    setCustomerInterviewed: (state, action: PayloadAction<Candidate[]>) => {
      state.CustomerInterviewed = action.payload;
    },
    setCustomerHired: (state, action: PayloadAction<Candidate[]>) => {
      state.CustomerHired = action.payload;
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

  // ADD THESE NEW EXPORTS:
  setCustomerPendingInterviews,
  setCustomerInterviewed,
  setCustomerHired,

  setIsCandidateInfoSeen,
  setIsFavouriteInfoSeen,
} = customerSlice.actions;

export default customerSlice.reducer;
