import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState} from '../../app/store';
import axios from 'axios';
import { AUTHENTIC } from '../types';

const apiUrl = process.env.REACT_APP_DEV_API_URL;

export const fetchAsyncRegister = createAsyncThunk(
  'auth/register',
  async (authentic: AUTHENTIC) => {
    const res = await axios.post(`${apiUrl}api/register/`, authentic, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  }
);

export const fetchAsyncLogin = createAsyncThunk(
  'auth/post',
  async (authentic: AUTHENTIC) => {
    const res = await axios.post(`${apiUrl}authen/jwt/create`, authentic, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    openSignIn: true,
    openSignUp: false,
    openProfile: false,
    isLoadingAuth: false,
  },
  reducers: {
    fetchCredStart(state) {
      state.isLoadingAuth = true;
    },
    fetchCredEnd(state) {
      state.isLoadingAuth = false;
    },
    setOpenSignIn(state) {
      state.openSignIn = true;
    },
    resetOpenSignIn(state) {
      state.openSignIn = false;
    },
    setOpenSignUp(state) {
      state.openSignUp = true;
    },
    resetOpenSignUp(state) {
      state.openSignUp = false;
    },
    setOpenProfile(state) {
      state.openProfile = true;
    },
    resetOpenProfile(state) {
      state.openProfile = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
      localStorage.setItem('localJWT', action.payload.access);
    });
  },
});

export const {
  fetchCredStart,
  fetchCredEnd,
  setOpenSignIn,
  resetOpenSignIn,
  setOpenSignUp,
  resetOpenSignUp,
  setOpenProfile,
  resetOpenProfile,
} = authSlice.actions;

export const selectOpenSignIn = (state: RootState) => state.auth.openSignIn;
export const selectOpenSingUp = (state: RootState) => state.auth.openSignUp;
export const selectOpenProfile = (state: RootState) => state.auth.openProfile;
export const selectIsLoadingAuth = (state: RootState) => state.auth.isLoadingAuth;

export default authSlice.reducer;
