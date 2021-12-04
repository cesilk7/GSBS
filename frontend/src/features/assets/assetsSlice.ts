import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import axios from 'axios';

import { RAKUTEN_CARD_PAYMENT_HISTORY, ASSETS_STATE } from '../types';

const apiUrl = process.env.REACT_APP_DEV_API_URL

export const fetchAsyncGetRakutenHistories = createAsyncThunk(
  'assets/getRakutenHistories',
  async () => {
    const res = await axios.get<RAKUTEN_CARD_PAYMENT_HISTORY[]>(`${apiUrl}api/rakuten/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

export const initialState: ASSETS_STATE = {
  openRakutenTable: true,
  rakuten_histories: [],
}

export const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    setOpenRakutenTable(state) {
      state.openRakutenTable = true;
    },
    resetOpenRakutenTable(state) {
      state.openRakutenTable = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetRakutenHistories.fulfilled,
      (state, action: PayloadAction<RAKUTEN_CARD_PAYMENT_HISTORY[]>) => {
        state.rakuten_histories = action.payload;
      }
    );
  }
});

export const {
  setOpenRakutenTable,
  resetOpenRakutenTable
} = assetsSlice.actions;

export const selectOpenRakutenTable = (state: RootState) => state.assets.openRakutenTable;
export const selectRakutenHistories = (state: RootState) => state.assets.rakuten_histories;

export default assetsSlice.reducer;
