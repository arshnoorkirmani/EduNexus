// store/slice/studentSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchStudent, updateStudentProfile } from "../thunks/student.thunks";
import { StudentProfile, StudentSlice } from "@/types/models/studnet.slice";

// ----------------------------------
// INITIAL STATE
// ----------------------------------
const initialState: StudentSlice = {
  profile: {
    _id: null,
    auth: null,
    institute: null,
    personal: null,
    academic: null,
    permissions: null,
    currentStatus: null,
    statusHistory: null,
    documents: [],
  },

  attendance: [],
  results: [],

  fees: {
    totalFees: 0,
    paid: 0,
    remainingFees: 0,
    due: 0,
    status: "pending",
    history: [],
  },

  loading: true, // Start loading by default or use a specific init action
  error: null,
  status: "pending", // Default student status
};

// ----------------------------------
// SLICE
// ----------------------------------
export const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    setStudentProfile(state, action: PayloadAction<Partial<StudentProfile>>) {
      // Shallow merge of profile fields
      state.profile = { ...state.profile, ...action.payload };
    },

    setStudentAttendance(state, action: PayloadAction<any[]>) {
      state.attendance = action.payload;
    },

    setStudentResults(state, action: PayloadAction<any[]>) {
      state.results = action.payload;
    },

    setStudentFees(state, action: PayloadAction<StudentSlice["fees"]>) {
      state.fees = action.payload;
    },

    resetStudentState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // ------------------------------------------------------
    // FETCH STUDENT
    // ------------------------------------------------------
    builder
      .addCase(fetchStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudent.fulfilled, (state, action) => {
        state.loading = false;
        // Full state replacement/hydration from payload
        // ensuring we map provided fields to the state structure
        if (action.payload.profile) state.profile = action.payload.profile;
        if (action.payload.attendance)
          state.attendance = action.payload.attendance;
        if (action.payload.results) state.results = action.payload.results;
        if (action.payload.fees) state.fees = action.payload.fees;

        // Sync root status if provided, otherwise fallback to profile status or keep existing
        if (action.payload.status) {
          state.status = action.payload.status;
        } else if (action.payload.profile?.currentStatus) {
          // Fallback mapping if root status isn't explicit but profile has it
          // Casting might be needed if types don't perfectly align, but generally safe
          state.status = action.payload.profile.currentStatus as any;
        }
      })
      .addCase(fetchStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ------------------------------------------------------
    // UPDATE STUDENT PROFILE
    // ------------------------------------------------------
    builder
      .addCase(updateStudentProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudentProfile.fulfilled, (state, action) => {
        state.loading = false;

        // Handle partial profile updates
        if (action.payload.profile) {
          state.profile = { ...state.profile, ...action.payload.profile };
        }

        // Update other sections if they were included in the response (e.g., re-calculated fees)
        if (action.payload.fees) {
          state.fees = { ...state.fees, ...action.payload.fees };
        }

        // Update root status if changed
        if (action.payload.status) {
          state.status = action.payload.status;
        }
      })
      .addCase(updateStudentProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setStudentProfile,
  setStudentAttendance,
  setStudentResults,
  setStudentFees,
  resetStudentState,
} = studentSlice.actions;

export default studentSlice.reducer;
