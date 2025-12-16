import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// Reducers
import instituteReducer from "./slice/instituteSlice";
import studentReducer from "./slice/studentSlice";
import teacherReducer from "./slice/teacherSlice";
import userReducer from "./slice/userSlice";

// ------------------------------------
// STORE
// ------------------------------------
export const store = configureStore({
  reducer: {
    institute: instituteReducer,
    student: studentReducer,
    teacher: teacherReducer,
    user: userReducer,
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
