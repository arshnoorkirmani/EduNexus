import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// Reducers
import instituteReducer from "./slice/instituteSlice";

// ------------------------------------
// STORE
// ------------------------------------
export const store = configureStore({
  reducer: {
    institute: instituteReducer, // ✅ FIXED
  },
});

// ------------------------------------
// TYPES
// ------------------------------------
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ------------------------------------
// TYPED HOOKS
// ------------------------------------
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
