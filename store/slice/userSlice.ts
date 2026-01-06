// store/slice/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile, UserSlice } from "@/types/models/user.slice";

// ----------------------------------
// INITIAL STATE
// ----------------------------------
const initialState: UserSlice = {
  profile: {
    _id: null,
    auth: null,
    institute: null,
    personal: null,
    documents: null,
    permissions: null,
    metadata: null,
  },

  loading: false,
  error: null,
  isAuthenticated: false,
  role: null,
  status: null,
};

// ----------------------------------
// SLICE
// ----------------------------------
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Partial<UserSlice>>) {
      // Merge top-level properties
      if (action.payload.profile) {
        state.profile = { ...state.profile, ...action.payload.profile };
      }

      // Update other top-level keys
      if (action.payload.isAuthenticated !== undefined)
        state.isAuthenticated = action.payload.isAuthenticated;
      if (action.payload.role !== undefined) state.role = action.payload.role;
      if (action.payload.status !== undefined)
        state.status = action.payload.status;
      if (action.payload.loading !== undefined)
        state.loading = action.payload.loading;
      if (action.payload.error !== undefined)
        state.error = action.payload.error;

      // Auto-set authenticated if ID is provided in profile
      if (action.payload.profile?._id) {
        state.isAuthenticated = true;
      }
    },

    setUserProfile(state, action: PayloadAction<Partial<UserProfile>>) {
      state.profile = { ...state.profile, ...action.payload };
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    clearUser() {
      return initialState;
    },
  },
});

export const { setUser, setUserProfile, setLoading, setError, clearUser } =
  userSlice.actions;

export default userSlice.reducer;
