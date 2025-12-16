// store/slice/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ----------------------------------
// TYPES
// ----------------------------------
export type UserRole = "institute" | "student" | "teacher" | "user";

export interface UserState {
  id: string | null;
  name: string | null;
  identifier: string | null; // email / student_id / teacher_id
  avatar: string | null;
  role: UserRole | null;
  status: "active" | "pending" | "blocked" | null;
  isAuthenticated: boolean;
}

// ----------------------------------
// INITIAL STATE
// ----------------------------------
const initialState: UserState = {
  id: null,
  name: null,
  identifier: null,
  avatar: null,
  role: null,
  status: null,
  isAuthenticated: false,
};

// ----------------------------------
// SLICE
// ----------------------------------
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Partial<UserState>>) {
      Object.assign(state, action.payload);
      state.isAuthenticated = true;
    },

    clearUser() {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
