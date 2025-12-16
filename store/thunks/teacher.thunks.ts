import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { TeacherSlice } from "@/types/models/teacher.slice";

// ======================================================
// FETCH TEACHER (GET)
// ======================================================
export const fetchTeacher = createAsyncThunk<
  TeacherSlice, // ✅ Returned data type
  string, // ✅ teacherId
  { state: RootState }
>("teacher/fetch", async (teacherId, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/teacher/${teacherId}`);

    if (!res.ok) {
      const error = await res.json();
      return rejectWithValue(error.message || "Failed to fetch teacher");
    }

    const data = await res.json();
    return data as TeacherSlice;
  } catch (error: any) {
    return rejectWithValue(error.message || "Network error");
  }
});

// ======================================================
// UPDATE TEACHER PROFILE (PATCH)
// ======================================================
export const updateTeacherProfile = createAsyncThunk<
  Partial<TeacherSlice>,
  { teacherId: string; payload: any },
  { state: RootState }
>(
  "teacher/updateProfile",
  async ({ teacherId, payload }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/teacher/${teacherId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error.message || "Update failed");
      }

      return (await res.json()) as Partial<TeacherSlice>;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);
