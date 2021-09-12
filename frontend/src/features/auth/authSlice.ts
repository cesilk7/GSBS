import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import axios from 'axios';
import {
  JWT,
  AUTHENTIC,
  POST_PROFILE,
  USER,
  USERNAME,
  MY_PROFILE,
  AUTH_STATE,
} from '../types';

const apiUrl = process.env.REACT_APP_DEV_API_URL;

export const fetchAsyncRegister = createAsyncThunk(
  'auth/register',
  async (authentic: AUTHENTIC) => {
    const res = await axios.post<USER>(`${apiUrl}api/register/`, authentic, {
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
    const res = await axios.post<JWT>(`${apiUrl}authen/jwt/create`, authentic, {
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
    const res = await axios.get<MY_PROFILE[]>(`${apiUrl}api/myprofile/`, {
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
    const res = await axios.post<MY_PROFILE>(`${apiUrl}api/profile/`, username, {
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
  async (profile: POST_PROFILE) => {
    const uploadData = new FormData();
    uploadData.append('username', profile.username);
    profile.img && uploadData.append('img', profile.img, profile.img.name);
    const res = await axios.put<MY_PROFILE>(`${apiUrl}api/profile/${profile.id}/`, uploadData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

export const initialState: AUTH_STATE = {
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
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
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
    editUsername(state, action: PayloadAction<string>) {
      state.myProfile.username = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncLogin.fulfilled,
      (state, action: PayloadAction<JWT>) => {
        localStorage.setItem('localJWT', action.payload.access);
      }
    );
    builder.addCase(fetchAsyncGetMyProf.fulfilled,
      (state, action: PayloadAction<MY_PROFILE>) => {
        state.myProfile = action.payload;
      }
    );
    builder.addCase(fetchAsyncUpdateProf.fulfilled,
      (state, action: PayloadAction<MY_PROFILE>) => {
        state.myProfile = action.payload;
      }
    );
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
