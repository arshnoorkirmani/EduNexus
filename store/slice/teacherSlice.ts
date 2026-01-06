// store/slice/teacherSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchTeacher } from "../thunks/teacher.thunks";
import { TeacherProfile, TeacherSlice } from "@/types/models/teacher.slice";
// ----------------------------------
// INITIAL STATE
// ----------------------------------
const initialState: TeacherSlice = {
  profile: {
    _id: null,
    auth: null,
    institute: null,
    personal: null,
    professional: null,
    documents: null,
    permissions: null,
    status: null,
  },

  attendance: [],
  subjects: [],

  salary: {
    current: 0,
    history: [],
  },

  loading: true,
  error: null,
  status: "pending",
};

// ----------------------------------
// SLICE
// ----------------------------------
export const teacherSlice = createSlice({
  name: "teacher",
  initialState,
  reducers: {
    setTeacherProfile(state, action: PayloadAction<Partial<TeacherProfile>>) {
      state.profile = { ...state.profile, ...action.payload };
    },

    setTeacherAttendance(state, action: PayloadAction<any[]>) {
      state.attendance = action.payload;
    },

    resetTeacherState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacher.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(fetchTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setTeacherProfile, setTeacherAttendance, resetTeacherState } =
  teacherSlice.actions;

export default teacherSlice.reducer;
