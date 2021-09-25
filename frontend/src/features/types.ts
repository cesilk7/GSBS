export interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
}
/* authSlice.ts */
export interface JWT {
  refresh: string;
  access: string;
}
export interface AUTHENTIC {
  email: string;
  password: string;
}
export interface PROPS_PROFILE {
  id: number;
  username: string;
  img: File | null;
}
export interface MY_PROFILE {
  id: number;
  username: string;
  user: number;
  created_on: string;
  img: string;
}
export interface USER {
  id: number;
  email: string;
}
export interface USERNAME {
  username: string;
}
export interface AUTH_STATE {
  openSignIn: boolean;
  openSignUp: boolean;
  openProfile: boolean;
  isLoadingAuth: boolean;
  myProfile: MY_PROFILE;
}
/* mealSlice.ts */
export interface MEAL {
  id: number;
  company: number;
  company_name: string;
  name: string;
  price: number;
  calorie: number;
  protein: number;
  carbohydrate: number;
  sugar: number;
  lipid: number;
  dietary_fiber: number;
  salt: number;
  is_bad: boolean;
  url: string;
  img: File | null;
}
export interface PROPS_MEAL {
  id: number;
  company: number;
  name: string;
  price: number;
  calorie: number;
  protein: number;
  carbohydrate: number;
  sugar: number;
  lipid: number;
  dietary_fiber: number;
  salt: number;
  is_bad: boolean;
}
export interface PROPS_MULTIPLE_MEALS {
  id: number;
  name: string;
  price: number;
  calorie: number;
  protein: number;
  sugar: number;
}
export interface COMPANY {
  id: number;
  name: string;
}
export interface MEAL_STATE {
  openDeleteDialog: boolean;
  openUpdateDialog: boolean;
  openMealForm: boolean;
  isLoadingMeal: boolean;
  selectedRowIds: number[];
  meals: MEAL[];
  editedMeal: PROPS_MEAL;
  companies: COMPANY[];
}
/* diarySlice.ts */
export interface DIARY {
  id: number;
  date: string;
  wake_up_time: string;
  bedtime: string;
  morning_weight: number;
  night_weight: number;
  ate_meal: number[];
  comment: string;
}
export interface OPTION_MEAL {
  value: number;
  label: string;
}
export interface DIARY_STATE {
  openDiaryForm: boolean;
  isLoadingDiary: boolean;
  diaries: DIARY[];
  editedDiary: DIARY;
  optionMeals: OPTION_MEAL[];
}