import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SubMenuState {
  label: string;
  path: string;
}

export interface MenuState {
  icon: string;
  label: string;
  section: string;
  submenu?: SubMenuState[];
  path: string;
}

const initialState: MenuState[] = [
  {
    icon: "home",
    label: "Dashboard",
    section: "dashboard",
    path: "/dashboard",
  },
];

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    updateMenu: (state, action: PayloadAction<MenuState[]>) => {
      return [...initialState, ...action.payload];
    },
  },
});

export const { updateMenu } = menuSlice.actions;
export default menuSlice.reducer;
