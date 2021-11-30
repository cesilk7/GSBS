import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import axios from 'axios'

import {
  DIARY_STATE,
  DIARY,
  OPTION_MEAL,
  PERIOD
} from '../types';

const apiUrl = process.env.REACT_APP_DEV_API_URL;

export const initialState: DIARY_STATE = {
  isLoadingDiary: false,
  openDiaryForm: false,
  diaries: [
    {
      id: 0,
      date: '',
      wake_up_time: '',
      bedtime: '',
      morning_weight: 0,
      night_weight: 0,
      ate_meal: [],
      comment: '',
    },
  ],
  editedDiary: {
    id: 0,
    date: '',
    wake_up_time: new Date(1970, 1, 1, 6, 0, 0).toString(),
    bedtime: new Date(1970, 1, 1, 23, 0, 0).toString(),
    morning_weight: 60.0,
    night_weight: 60.0,
    ate_meal: [],
    comment: '',
  },
  optionMeals: [],
};

export const fetchAsyncGetMealOptions = createAsyncThunk(
  'diary/getOptionMeals',
  async () => {
    const res = await axios.get<OPTION_MEAL[]>(`${apiUrl}api/meal/`,
      {
        params: {
          query_type: 'options',
        },
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncGetOneDiary = createAsyncThunk(
  'diary/getOneDiary',
  async (date: string) => {
    const res = await axios.get<DIARY>(`${apiUrl}api/diary/${date}/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncCreateDiary = createAsyncThunk(
  'diary/createDiary',
  async (diary: DIARY) => {
    const res = await axios.post<DIARY>(`${apiUrl}api/diary/`,
      diary,
      {
        headers: {
          'ConTent-Type': 'application/json',
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncUpdateDiary = createAsyncThunk(
  'diary/updateDiary',
  async (diary: DIARY) => {
    const res = await axios.put<DIARY>(`${apiUrl}api/diary/${diary.id}/`,
      diary,
      {
        headers: {
          'ConTent-Type': 'application/json',
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncGetCalendarEvents = createAsyncThunk(
  'diary/getCalendarEvents',
  async (period: PERIOD) => {
    const res = await axios({
      method: 'get',
      url: `${apiUrl}api/diary/calendar_events/`,
      params: period,
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

export const diarySlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {
    fetchCredStart(state) {
      state.isLoadingDiary = true;
    },
    fetchCredEnd(state) {
      state.isLoadingDiary = false;
    },
    setOpenDiaryForm(state) {
      state.openDiaryForm = true;
    },
    resetOpenDiaryForm(state) {
      state.openDiaryForm = false;
    },
    setEditedDiary(state, action) {
      state.editedDiary = action.payload;
    },
    setEditedDiaryDate(state, action) {
      state.editedDiary.date = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetMealOptions.fulfilled,
      (state, action: PayloadAction<OPTION_MEAL[]>) => {
        state.optionMeals = action.payload;
      }
    );
    builder.addCase(fetchAsyncGetOneDiary.fulfilled,
      (state, action: PayloadAction<DIARY>) => {
        if (action.payload) {
          state.editedDiary = action.payload;
        }
      }
    );
    builder.addCase(fetchAsyncCreateDiary.fulfilled,
     (state, action: PayloadAction<DIARY>) => {
        state.diaries = [...state.diaries, action.payload];
        state.editedDiary = action.payload;
      }
    );
    builder.addCase(fetchAsyncUpdateDiary.fulfilled,
      (state, action: PayloadAction<DIARY>) => {
        if (action.payload) {
          state.diaries = [...state.diaries, action.payload];
          state.editedDiary = action.payload;
        }
      }
    );
  }
});

export const {
  fetchCredStart,
  fetchCredEnd,
  setOpenDiaryForm,
  resetOpenDiaryForm,
  setEditedDiary,
  setEditedDiaryDate,
} = diarySlice.actions;

export const selectIsLoadingDiary = (state: RootState) => state.diary.isLoadingDiary;
export const selectOpenDiaryForm = (state: RootState) => state.diary.openDiaryForm;
export const selectEditedDiary = (state: RootState) => state.diary.editedDiary;
export const selectOptionMeals = (state: RootState) => state.diary.optionMeals;

export default diarySlice.reducer;
