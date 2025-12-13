import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { InstituteSlice } from "@/types/models/institute.slice";
import { InstituteConf } from "@/config/InstituteClient";
import { AppData } from "@/config/appConfig";

// ------------------------------------------------------
// TEMPLATE: FETCH INSTITUTE (API GET)
// ------------------------------------------------------
export const fetchInstitute = createAsyncThunk<
  InstituteSlice,
  string,
  { state: RootState }
>("institute/fetch", async (identifier, { rejectWithValue }) => {
  try {
    const res = await InstituteConf.fetchInstitute(identifier, ["all"]);

    if (!res.success) {
      return rejectWithValue(
        res.message || res.error || "Something went wrong"
      );
    }

    const data = res.data as InstituteSlice;
    console.log("fetchInstitute", data);
    // --------------------------------------
    // STATUS HANDLING (Business Rules)
    // --------------------------------------
    switch (data.status) {
      case "active":
        // ✅ fully allowed
        return data;

      case "pending":
        // ⏳ institute exists but setup not completed
        return rejectWithValue({
          code: "INSTITUTE_PENDING",
          message: "Institute verification is pending",
          status: "pending",
        });

      case "inactive":
        // ⚠️ disabled by owner or system
        return rejectWithValue({
          code: "INSTITUTE_INACTIVE",
          message: "Institute account is inactive",
          status: "inactive",
        });

      case "blocked":
        // ⛔ blocked by admin
        return rejectWithValue({
          code: "INSTITUTE_BLOCKED",
          message: `Institute has been blocked by ${AppData.app.name}`,
          status: "blocked",
        });

      default:
        return rejectWithValue("Unknown institute status");
    }
  } catch (error: any) {
    return rejectWithValue(error.message || "Network error");
  }
});

// ------------------------------------------------------
// TEMPLATE: UPDATE INSTITUTE (API PATCH)
// ------------------------------------------------------
// export const updateInstituteAPI = createAsyncThunk<
//   InstituteSlice, // response type
//   Partial<InstituteSlice>, // payload type sent
//   { state: RootState } // thunk API
// >("institute/update", async (payload, { getState, rejectWithValue }) => {
//   try {
//     const id = getState().institute._id; // if needed
//     const res = await fetch(`/api/institute/${id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) {
//       const error = await res.json();
//       return rejectWithValue(error.message);
//     }

//     return (await res.json()) as InstituteSlice;
//   } catch (error: any) {
//     return rejectWithValue(error.message);
//   }
// });

// ------------------------------------------------------
// TEMPLATE: DELETE INSTITUTE
// ------------------------------------------------------
// export const deleteInstitute = createAsyncThunk<
//   { success: boolean }, // returned type
//   string, // instituteId
//   { state: RootState }
// >("institute/delete", async (id, { rejectWithValue }) => {
//   try {
//     const res = await fetch(`/api/institute/${id}`, {
//       method: "DELETE",
//     });

//     if (!res.ok) {
//       const error = await res.json();
//       return rejectWithValue(error.message);
//     }

//     return { success: true };
//   } catch (error: any) {
//     return rejectWithValue(error.message);
//   }
// });
