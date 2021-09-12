export interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
}
/* authSlice.tsx */
export interface AUTHENTIC {
  email: string;
  password: string;
}
export interface PROFILE {
  id: number;
  username: string;
  img: File | null;
}
export interface USERNAME {
  username: string;
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
export interface MEAL_STATE {
  openDeleteDialog: boolean;
  openUpdateDialog: boolean;
  selectedRowIds: number[],
  meals: MEAL[];
}
