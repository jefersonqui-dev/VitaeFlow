import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cvReducer from '../features/cv/cvSlice';
import themeReducer from '../features/theme/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cv: cvReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
