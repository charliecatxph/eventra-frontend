import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface AppState {
  fn: string;
  ln: string;
  email: string;
  org_name: string;
  country: string;
  website: string;
  logo: string;
  acsTok: string;
  id: string;
}

const initialState: AppState = {
  fn: "",
  ln: "",
  email: "",
  org_name: "",
  country: "",
  website: "",
  logo: "",
  acsTok: "",
  id: "",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    appUpdate: (state, action: PayloadAction<Partial<AppState>>) => {
      console.log("call", action.payload);
      return { ...state, ...action.payload }; // Merge updated fields
    },
    resetApp: () => {
      return { ...initialState };
    },
  },
});

export const { appUpdate, resetApp } = appSlice.actions;
export const selectApp = (state: RootState) => state.app;
export default appSlice.reducer;
