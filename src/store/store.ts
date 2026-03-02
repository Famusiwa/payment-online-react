import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./features/auth/authSlice";
import menuReducer from "./features/auth/menuSlice";
import { combineReducers } from "@reduxjs/toolkit";
import { decrypt, encrypt } from "@/lib/encryption";

const PERSIST_KEY = "reduxState";
// Load persisted state from localStorage and decrypt
function loadState() {
  try {
    const serializedState = localStorage.getItem(PERSIST_KEY);
    if (!serializedState) return undefined;
    const decrypted = decrypt(serializedState);
    if (!decrypted) return undefined;
    return JSON.parse(decrypted);
  } catch {
    return undefined;
  }
}

// Save state to localStorage with encryption
function saveState(state: any) {
  try {
    const serializedState = JSON.stringify(state);
    const encrypted = encrypt(serializedState);
    localStorage.setItem(PERSIST_KEY, encrypted);
  } catch {
    // Ignore write errors
  }
}

const rootReducer = combineReducers({
  auth: authReducer,
  menu: menuReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Subscribe to store changes and persist encrypted state
store.subscribe(() => {
  saveState({
    auth: store.getState().auth,
    menu: store.getState().menu,
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
