import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { StudentSlice } from "@/types/models/studnet.slice";

// ======================================================
// FETCH STUDENT (GET)
// ======================================================
export const fetchStudent = createAsyncThunk<
  StudentSlice, // ✅ Returned data type
  string, // ✅ studentId
  { state: RootState }
>("student/fetch", async (studentId, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/student/${studentId}`);

    if (!res.ok) {
      const error = await res.json();
      return rejectWithValue(error.message || "Failed to fetch student");
    }

    const data = await res.json();
    return data as StudentSlice;
  } catch (error: any) {
    return rejectWithValue(error.message || "Network error");
  }
});

// ======================================================
// UPDATE STUDENT PROFILE (PATCH)
// ======================================================
export const updateStudentProfile = createAsyncThunk<
  Partial<StudentSlice>,
  { studentId: string; payload: any },
  { state: RootState }
>(
  "student/updateProfile",
  async ({ studentId, payload }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/student/${studentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error.message || "Update failed");
      }

      return (await res.json()) as Partial<StudentSlice>;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);
