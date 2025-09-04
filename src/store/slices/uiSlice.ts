import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type MainContentType = 'main' | 'advisor';

interface UIState {
  mainContent: MainContentType;
}

const initialState: UIState = {
  mainContent: 'main',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMainContent: (state, action: PayloadAction<MainContentType>) => {
      state.mainContent = action.payload;
    },
    resetMainContent: state => {
      state.mainContent = 'main';
    },
  },
});

export const { setMainContent, resetMainContent } = uiSlice.actions;
export default uiSlice.reducer;
