// lib/slices/counterSlice.ts
import { Candidate } from '@/types/customer';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface customerState {
  CustomerFavourites: Candidate[];
  CustomerShortlisted: Candidate[];
  CustomerMyInterviews: [];
}

const initialState: customerState = {
  CustomerFavourites: [],
  CustomerShortlisted: [],
  CustomerMyInterviews: [],
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
  },
});

export const {
  setCustomerFavourites,
  setCustomerShortlisted,
  setCustomerMyInterview,
} = customerSlice.actions;
export default customerSlice.reducer;
