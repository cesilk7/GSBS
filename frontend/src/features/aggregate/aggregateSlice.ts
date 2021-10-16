import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const apiUrl = process.env.REACT_APP_DEV_API_URL;

export const initialState = {

};

export const aggregateSlice = createSlice({
  name: 'aggregate',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {

  }
});

export default aggregateSlice.reducer;
