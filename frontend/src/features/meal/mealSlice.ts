import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import axios from 'axios';

import { MEAL, MEAL_STATE, PROPS_MEAL, PROPS_MULTIPLE_MEALS, COMPANY } from '../types';

const apiUrl = process.env.REACT_APP_DEV_API_URL;

export const fetchAsyncGetMeals = createAsyncThunk(
  'meal/getMeal',
  async () => {
    const res = await axios.get<MEAL[]>(`${apiUrl}api/meal/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

export const fetchAsyncCreateMeal = createAsyncThunk(
  'meal/createMeal',
  async (meal: PROPS_MEAL) => {
    const res = await axios.post<MEAL>(`${apiUrl}api/meal/`,
      meal,
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

export const fetchAsyncUpdateMeal = createAsyncThunk(
  'meal/updateMeal',
  async (meal: PROPS_MEAL) => {
    const res = await axios.put<MEAL>(`${apiUrl}api/meal/${meal.id}/`,
      meal,
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

export const fetchAsyncUpdateMeals = createAsyncThunk(
  'meal/updateMeals',
  async (meals: PROPS_MULTIPLE_MEALS[]) => {
    const res = await axios.put<MEAL[]>(`${apiUrl}api/meal/multiple_update/`,
      meals,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncDeleteMeals = createAsyncThunk(
  'meal/deleteMeals',
  async (ids: number[]) => {
    const res = await axios.put<number[]>(`${apiUrl}api/meal/multiple_delete/`,
      ids,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncGetCompanies = createAsyncThunk(
  'company/getCompanies',
  async () => {
    const res = await axios.get<COMPANY[]>(`${apiUrl}api/company/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

export const initialState: MEAL_STATE = {
  openDeleteDialog: false,
  openUpdateDialog: false,
  openMealForm: false,
  isLoadingMeal: false,
  selectedRowIds: [],
  meals: [
    {
      id: 0,
      company: 0,
      company_name: '',
      name: '',
      price: 0,
      calorie: 0,
      protein: 0,
      carbohydrate: 0,
      sugar: 0,
      lipid: 0,
      dietary_fiber: 0,
      salt: 0,
      is_bad: false,
      url: '',
      img: null,
    },
  ],
  editedMeal: {
    id: 0,
    company: 0,
    name: '',
    price: 0,
    calorie: 0,
    protein: 0,
    carbohydrate: 0,
    sugar: 0,
    lipid: 0,
    dietary_fiber: 0,
    salt: 0,
    is_bad: false,
  },
  companies: [],
};

export const mealSlice = createSlice({
  name: 'meal',
  initialState,
  reducers: {
    fetchCredStart(state) {
      state.isLoadingMeal = true;
    },
    fetchCredEnd(state) {
      state.isLoadingMeal = false;
    },
    setOpenDeleteDialog(state) {
      state.openDeleteDialog = true;
    },
    resetOpenDeleteDialog(state) {
      state.openDeleteDialog = false;
    },
    setOpenUpdateDialog(state) {
      state.openUpdateDialog = true;
    },
    resetOpenUpdateDialog(state) {
      state.openUpdateDialog = false;
    },
    setOpenMealForm(state) {
      state.openMealForm = true;
    },
    resetOpenMealForm(state) {
      state.openMealForm = false;
    },
    setSelectedRowIds(state, action) {
      state.selectedRowIds = action.payload;
    },
    resetSelectedRowIds(state) {
      state.selectedRowIds = [];
    },
    setMeals(state, action) {
      state.meals = action.payload;
    },
    setEditedMeal(state, action) {
      state.editedMeal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetMeals.fulfilled,
      (state, action: PayloadAction<MEAL[]>) => {
        state.meals = action.payload;
      }
    );
    builder.addCase(fetchAsyncDeleteMeals.fulfilled,
      (state, action: PayloadAction<number[]>) => {
        state.meals = state.meals.filter((m) => !action.payload.includes(m.id))
      }
    );
    builder.addCase(fetchAsyncGetCompanies.fulfilled,
      (state, action: PayloadAction<COMPANY[]>) => {
        state.companies = action.payload;
      }
    );
    builder.addCase(fetchAsyncCreateMeal.fulfilled,
      (state, action: PayloadAction<MEAL>) => {
        state.meals = [action.payload, ...state.meals];
        state.editedMeal = initialState.editedMeal;
      }
    );
    builder.addCase(fetchAsyncUpdateMeal.fulfilled,
      (state, action: PayloadAction<MEAL>) => {
        state.meals = state.meals.map((m) => m.id === action.payload.id ? action.payload : m)
        state.editedMeal = initialState.editedMeal;
      }
    );
  }
});

export const {
  fetchCredStart,
  fetchCredEnd,
  setOpenDeleteDialog,
  resetOpenDeleteDialog,
  setOpenUpdateDialog,
  resetOpenUpdateDialog,
  setOpenMealForm,
  resetOpenMealForm,
  setSelectedRowIds,
  resetSelectedRowIds,
  setMeals,
  setEditedMeal,
} = mealSlice.actions;

export const selectIsLoadingMeal = (state: RootState) => state.meal.isLoadingMeal;
export const selectOpenDeleteDialog = (state: RootState) => state.meal.openDeleteDialog;
export const selectOpenUpdateDialog = (state: RootState) => state.meal.openUpdateDialog;
export const selectOpenMealForm = (state: RootState) => state.meal.openMealForm;
export const selectSelectedRowIds = (state: RootState) => state.meal.selectedRowIds;
export const selectMeals = (state: RootState) => state.meal.meals;
export const selectEditedMeal = (state: RootState) => state.meal.editedMeal;
export const selectCompanies = (state: RootState) => state.meal.companies;

export default mealSlice.reducer;
