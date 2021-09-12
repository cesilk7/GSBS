import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import axios from 'axios';
import { AUTHENTIC, PROFILE, USERNAME } from '../types';

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
    return res.data;
  }
);

export const fetchAsyncGetMyProf = createAsyncThunk(
  'profile/get',
  async () => {
    const res = await axios.get(`${apiUrl}api/myprofile/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data[0];
  }
);

export const fetchAsyncCreateProf = createAsyncThunk(
  'profile/post',
  async (username: USERNAME) => {
    const res = await axios.post(`${apiUrl}api/profile/`, username, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

export const fetchAsyncUpdateProf = createAsyncThunk(
  'profile/put',
  async (profile: PROFILE) => {
    const uploadData = new FormData();
    uploadData.append('username', profile.username);
    profile.img && uploadData.append('img', profile.img, profile.img.name);
    const res = await axios.put(`${apiUrl}api/profile/${profile.id}/`, uploadData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    openSignIn: true,
    openSignUp: false,
    openProfile: false,
    isLoadingAuth: false,
    myProfile: {
      id: 0,
      username: '',
      user: 0,
      created_on: '',
      img: '',
    },
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
    editUsername(state, action) {
      state.myProfile.username = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
      localStorage.setItem('localJWT', action.payload.access);
    });
    builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action) => {
      state.myProfile = action.payload;
    });
    builder.addCase(fetchAsyncUpdateProf.fulfilled, (state, action) => {
      state.myProfile = action.payload;
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
  editUsername,
} = authSlice.actions;

export const selectOpenSignIn = (state: RootState) => state.auth.openSignIn;
export const selectOpenSingUp = (state: RootState) => state.auth.openSignUp;
export const selectOpenProfile = (state: RootState) => state.auth.openProfile;
export const selectMyProfile = (state: RootState) => state.auth.myProfile;
export const selectIsLoadingAuth = (state: RootState) => state.auth.isLoadingAuth;

export default authSlice.reducer;
