import { configureStore } from '@reduxjs/toolkit';
import regionaleSlice from './regionaleSlice';

export const store = configureStore({
  reducer: {
    regionale: regionaleSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;