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
