// lib/slices/counterSlice.ts
import { fake_slotBookingResponse } from '@/constants/fake_data';
import { SuccessInterviewScheduleResponse } from '@/types/interview';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface interviewState {
  interviewSlots: SuccessInterviewScheduleResponse | null;
}

const initialState: interviewState = {
  // interviewSlots: null,
  interviewSlots: fake_slotBookingResponse,
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    setInterviewSlots: (
      state,
      action: PayloadAction<SuccessInterviewScheduleResponse>
    ) => {
      state.interviewSlots = action.payload;
    },
  },
});

export const { setInterviewSlots } = interviewSlice.actions;
export default interviewSlice.reducer;
