import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

// Example slice
import userReducer from './slices/userSlice';
import interviewReducer from './slices/interviewSlice';
import persistSlice from './slices/persistSlice';
import engineerProfileReducer from './slices/engineerProfileSlice';
import uiReducer from './slices/uiSlice';
import customerReducer from './slices/customerSlice';
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['persist', 'user'],
};

const rootReducer = combineReducers({
  user: userReducer,
  interview: interviewReducer,
  persist: persistSlice,
  engineerProfile: engineerProfileReducer,
  ui: uiReducer,
  customer: customerReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
