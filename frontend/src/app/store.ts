import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import mealReducer from '../features/meal/mealSlice';
import diaryReducer from '../features/diary/diarySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    meal: mealReducer,
    diary: diaryReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
