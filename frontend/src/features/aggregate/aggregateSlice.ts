import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import axios from 'axios';

import { AGGREGATE_DATA, AGGREGATE_STATE } from '../types';

const apiUrl = process.env.REACT_APP_DEV_API_URL;

export const fetchAsyncGetAggregateData = createAsyncThunk(
  'aggregate/get',
    async () => {
    const res = await axios.get<AGGREGATE_DATA>(`${apiUrl}api/diary/nutrition_per_day/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

export const initialState: AGGREGATE_STATE = {
  aggregate_data: {
    date: [],
    morning_weight: [],
    night_weight: [],
    sum_calorie: [],
    sum_dietary_fiber: [],
  }
};

export const aggregateSlice = createSlice({
  name: 'aggregate',
  initialState,
  reducers: {
    resetAggregateData(state) {
      state.aggregate_data = initialState.aggregate_data;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetAggregateData.fulfilled,
      (state, action: PayloadAction<AGGREGATE_DATA>) => {
        state.aggregate_data = action.payload;
      }
    );
  }
});

export const { resetAggregateData } = aggregateSlice.actions;

export const selectAggregateData = (state: RootState) => state.aggregate.aggregate_data;

export default aggregateSlice.reducer;
