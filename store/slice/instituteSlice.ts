import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  InstituteSlice,
  InstituteInformation,
} from "@/types/models/institute.slice";
import { fetchInstitute } from "../thunks/institute.thunks";
import { InstitutePermissions } from "@/types/models/institute.model";
// ======================================================
// INITIAL INSTITUTE INFORMATION
// ======================================================
const initialInformation: InstituteInformation = {
  institute_name: null,
  short_name: null,
  institute_code: null,

  address: null,
  city: null,
  state: null,
  pincode: null,
  country: null,

  mobile: null,
  email: null,
  website: null,

  currency: "INR",
  timezone: "Asia/Kolkata",
  working_hours: "09:00 - 17:00",

  institute_type: null,
  affiliation: null,
  established_year: 0,

  logo: null,
  profile_url: null,

  // Optional improvements
  principal_name: null,
  contact_person: null,
  contact_person_mobile: null,
  facebook: null,
  instagram: null,
  youtube: null,
  banner_images: [],
  theme_color: "#2563eb",
};

// ======================================================
// INITIAL PERMISSIONS
// ======================================================
const initialPermissions: InstitutePermissions = {
  super: false,

  profile: {
    show: false,
    edit: false,
  },

  communication: {
    send_message: false,
    inbox_message: false,
  },

  user_management: {
    show: false,
    add: false,
    edit: false,
    delete: false,
  },

  student_management: {
    show: false,
    add: false,
    edit: false,
    delete: false,
    attendance: false,
    result: false,
  },

  teacher_management: {
    show: false,
    add: false,
    edit: false,
    delete: false,
  },

  academics: {
    show_courses: false,
    add_courses: false,
    edit_courses: false,
    delete_courses: false,
  },

  finance: {
    salary_management: false,
    fees_management: false,
  },

  settings: {
    settings: false,
    website_settings: false,
  },
};

// ======================================================
// MAIN INSTITUTE SLICE STATE
// ======================================================
const initialState: InstituteSlice = {
  information: initialInformation,
  id: null,
  username: null,
  email: null,
  role: "institute",
  isVerified: false,
  isOnboarded: false,

  status: "pending",
  lastLogin: null,

  permissions: initialPermissions,

  createdAt: null,
  updatedAt: null,

  // ----------------------------------------------------
  // DASHBOARD
  // ----------------------------------------------------
  dashboard: {
    stats: {
      totalStudents: 0,
      totalTeachers: 0,
      totalCourses: 0,
      unreadMessages: 0,
      feesDue: 0,
    },
    loading: false,
  },

  // ----------------------------------------------------
  // USER MANAGEMENT
  // ----------------------------------------------------
  users: {
    list: [],
    selectedUser: null,
    filters: {
      role: null,
      status: null,
      search: "",
    },
    loading: false,
    error: null,
  },

  // ----------------------------------------------------
  // STUDENTS
  // ----------------------------------------------------
  students: {
    list: [],
    selectedStudent: null,
    attendance: [],
    results: [],
    filters: {
      classId: null,
      sectionId: null,
      search: "",
    },
    loading: false,
    error: null,
  },

  // ----------------------------------------------------
  // TEACHERS
  // ----------------------------------------------------
  teachers: {
    list: [],
    selectedTeacher: null,
    salaryHistory: [],
    filters: {
      departmentId: null,
      search: "",
    },
    loading: false,
    error: null,
  },

  // ----------------------------------------------------
  // ACADEMICS
  // ----------------------------------------------------
  academics: {
    courses: [],
    batches: [],
    subjects: [],
    timetable: [],
    loading: false,
    error: null,
  },

  // ----------------------------------------------------
  // ATTENDANCE
  // ----------------------------------------------------
  attendance: {
    studentAttendance: [],
    teacherAttendance: [],
    date: null,
    loading: false,
    error: null,
  },

  // ----------------------------------------------------
  // RESULTS
  // ----------------------------------------------------
  results: {
    exams: [],
    marks: [],
    loading: false,
    error: null,
  },

  // ----------------------------------------------------
  // FINANCE
  // ----------------------------------------------------
  finance: {
    fees: {
      structure: [],
      payments: [],
    },
    salary: {
      payouts: [],
    },
    loading: false,
    error: null,
  },

  // ----------------------------------------------------
  // MESSAGING / INBOX
  // ----------------------------------------------------
  messaging: {
    inbox: [],
    sent: [],
    unreadCount: 0,
    loading: false,
  },

  // ----------------------------------------------------
  // WEBSITE SETTINGS
  // ----------------------------------------------------
  website: {
    theme: "light",
    homePageContent: {},
    gallery: [],
    seo: {
      title: "",
      description: "",
      keywords: [],
    },
    loading: false,
  },

  // ----------------------------------------------------
  // GLOBAL STATE
  // ----------------------------------------------------
  loading: true,
  error: null,
};

// ======================================================
// SLICE
// ======================================================
export const instituteSlice = createSlice({
  name: "institute",
  initialState,
  reducers: {
    // 🔹 Update basic info
    setInformation(
      state,
      action: PayloadAction<Partial<InstituteInformation>>
    ) {
      state.information = { ...state.information, ...action.payload };
    },

    // 🔹 Update permissions
    setPermissions(
      state,
      action: PayloadAction<Partial<InstitutePermissions>>
    ) {
      state.permissions = { ...state.permissions, ...action.payload };
    },

    // 🔹 Update dashboard stats
    setDashboardStats(
      state,
      action: PayloadAction<Partial<typeof initialState.dashboard.stats>>
    ) {
      state.dashboard.stats = { ...state.dashboard.stats, ...action.payload };
    },

    // 🔹 Generic loading + error
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    // 🔹 Reset slice to default
    resetInstituteState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // -----------------------------
    // PENDING
    // -----------------------------
    builder.addCase(fetchInstitute.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    // -----------------------------
    // FULFILLED
    // -----------------------------
    builder.addCase(fetchInstitute.fulfilled, (state, action) => {
      state.loading = false;
      console.log("action.payload", action.payload);
      // merge returned data into Redux state
      Object.assign(state, action.payload);

      console.log("→ Institute value set!", action.payload); //remove
    });

    // -----------------------------
    // REJECTED
    // -----------------------------
    builder.addCase(fetchInstitute.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  setInformation,
  setPermissions,
  setDashboardStats,
  setLoading,
  setError,
  resetInstituteState,
} = instituteSlice.actions;

export default instituteSlice.reducer;
