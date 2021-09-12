export interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
}
/* authSlice.tsx */
export interface JWT {
  refresh: string;
  access: string;
}
export interface AUTHENTIC {
  email: string;
  password: string;
}
export interface POST_PROFILE {
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
/* mealSlice.tsx */
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
export interface POST_MULTIPLE_UPDATE {
  id: number;
  company: number;
  price: number;
  calorie: number;
  protein: number;
  sugar: number;
}
export interface MEAL_STATE {
  openDeleteDialog: boolean;
  openUpdateDialog: boolean;
  selectedRowIds: number[],
  meals: MEAL[];
}
