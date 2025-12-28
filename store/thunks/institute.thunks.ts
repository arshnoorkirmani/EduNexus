import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { InstituteSlice } from "@/types/models/institute.slice";
import { InstituteConf } from "@/config/InstituteClient";
import { AppData } from "@/config/appConfig";
// import { ApiError } from "next/dist/server/api-utils";

export interface ThunkError {
  code: string;
  message: string;
  status?: string;
}
import { CourseDocument } from "@/types/models/course.model";

// ------------------------------------------------------
// TEMPLATE: FETCH INSTITUTE (API GET)
// ------------------------------------------------------
export const fetchInstitute = createAsyncThunk<
  InstituteSlice,
  string,
  {
    state: RootState;
    rejectValue: ThunkError;
  }
>("institute/fetch", async (identifier, { rejectWithValue }) => {
  try {
    const res = await InstituteConf.fetchInstitute(identifier, ["all"]);

    if (!res.success) {
      return rejectWithValue({
        code: "API_ERROR",
        message: res.message || res.error || "Something went wrong",
      });
    }

    const data = res.data as InstituteSlice;

    switch (data.status) {
      case "active":
        return data;

      case "pending":
        return rejectWithValue({
          code: "INSTITUTE_PENDING",
          message: "Institute verification is pending",
          status: "pending",
        });

      case "inactive":
        return rejectWithValue({
          code: "INSTITUTE_INACTIVE",
          message: "Institute account is inactive",
          status: "inactive",
        });

      case "blocked":
        return rejectWithValue({
          code: "INSTITUTE_BLOCKED",
          message: `Institute has been blocked by ${AppData.app.name}`,
          status: "blocked",
        });

      default:
        return rejectWithValue({
          code: "UNKNOWN_STATUS",
          message: "Unknown institute status",
        });
    }
  } catch (error: any) {
    return rejectWithValue({
      code: "NETWORK_ERROR",
      message: error.message || "Network error",
    });
  }
});

// ------------------------------------------------------
// FETCH COURSES
// ------------------------------------------------------
export const fetchInstituteCourses = createAsyncThunk<
  CourseDocument[],
  { params: { institute_code: string } },
  {
    state: RootState;
    rejectValue: ThunkError;
  }
>("institute/courses/fetch", async (payload, { rejectWithValue }) => {
  try {
    console.log("payload", payload);
    const res = await InstituteConf.fetchInstituteCourses<CourseDocument[]>(
      payload?.params
    );

    if (!res.success) {
      return rejectWithValue({
        code: "API_ERROR",
        message: res.error || "Failed to fetch courses",
      });
    }

    return res.data;
  } catch (error: any) {
    return rejectWithValue({
      code: "NETWORK_ERROR",
      message: error.message || "Network error",
    });
  }
});
