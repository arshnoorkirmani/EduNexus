// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "@/store/sidebarSlice";
// import other reducers: auth, user etc.
import authReducer from "@/store/authSlice"; // assume you have an auth slice

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
