// store/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Role } from "@/types/navigation";

type AuthState = {
  role?: Role;
  userId?: string;
  token?: string;
};

const initialState: AuthState = {
  role: undefined,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthRole(state, action: PayloadAction<Role>) {
      state.role = action.payload;
    },
    clearAuth(state) {
      state.role = undefined;
      state.token = undefined;
      state.userId = undefined;
    },
  },
});

export const { setAuthRole, clearAuth } = slice.actions;
export default slice.reducer;
