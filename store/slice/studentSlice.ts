// store/slice/studentSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchStudent } from "../thunks/student.thunks";
import { status } from "@/types/models/institute.model";
import { StudentProfile, StudentSlice } from "@/types/models/studnet.slice";

// ----------------------------------
// INITIAL STATE
// ----------------------------------
const initialState: StudentSlice = {
  profile: {
    student_id: null,
    name: null,
    email: null,
    mobile: null,
    classId: null,
    sectionId: null,
    roll_no: null,
    profile_url: null,
    status: "pending",
  },

  attendance: [],
  results: [],

  fees: {
    due: 0,
    paid: 0,
    history: [],
  },

  loading: true,
  error: null,
  status: "pending",
};

// ----------------------------------
// SLICE
// ----------------------------------
export const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    setStudentProfile(state, action: PayloadAction<Partial<StudentProfile>>) {
      state.profile = { ...state.profile, ...action.payload };
    },

    setStudentAttendance(state, action: PayloadAction<any[]>) {
      state.attendance = action.payload;
    },

    setStudentResults(state, action: PayloadAction<any[]>) {
      state.results = action.payload;
    },

    resetStudentState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudent.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(fetchStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setStudentProfile,
  setStudentAttendance,
  setStudentResults,
  resetStudentState,
} = studentSlice.actions;

export default studentSlice.reducer;
