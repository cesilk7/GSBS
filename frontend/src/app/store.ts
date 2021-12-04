import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import mealReducer from '../features/meal/mealSlice';
import diaryReducer from '../features/diary/diarySlice';
import aggregateReducer from '../features/aggregate/aggregateSlice';
import assetsReducer from '../features/assets/assetsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    meal: mealReducer,
    diary: diaryReducer,
    aggregate: aggregateReducer,
    assets: assetsReducer,
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
