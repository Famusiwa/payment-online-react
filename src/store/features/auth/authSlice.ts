import { convertToTimestamp } from "@/lib/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string | null;
  email: string | null;
  name: string | null;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  status: string | null;
  profileImage: string | null;
  token: string | null;
  permissions: string[];
  userName: string | null;
  expiredTime: string;
  payerUtin: string;
  taxPayerReferenceNo: string;
  taxAgentReferenceNo: string;
  roleName: string;
  jtbTin?: string; // Added jtbTin field
  organizationName?: string; // Added organizationName field
}

interface AuthState {
  isAuthenticated: boolean;
  user: User;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: {
    id: null,
    email: null,
    name: null,
    firstName: null,
    middleName: null,
    lastName: null,
    phoneNumber: null,
    status: null,
    profileImage: null,
    token: null,
    permissions: [],
    userName: null,
    expiredTime: "",
    payerUtin: "",
    taxPayerReferenceNo: "",
    taxAgentReferenceNo: "",
    roleName: "",
    jtbTin: "",
    organizationName: "",
  },
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      localStorage.setItem("token", action.payload?.token || "");
      localStorage.setItem(
        "expiredTime",
        convertToTimestamp(action.payload?.expiredTime).toString()
      );
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = initialState.user;
      localStorage.removeItem("token");
      localStorage.removeItem("expiredTime");
    },
  },
});

export const { loginSuccess, loginFailure, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
