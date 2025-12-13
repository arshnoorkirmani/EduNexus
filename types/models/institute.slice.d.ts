// ==========================================================
// INSTITUTE INFORMATION

import { Student } from "./student.model";
import { Teacher } from "./teacher.model";
import { User } from "./user.model";

// ==========================================================
export interface InstituteInformation {
  institute_name: string | null;
  short_name: string | null;
  institute_code: string | null;

  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  country: string | null;

  mobile: string | null;
  email: string | null;
  website: string | null;

  currency: string;
  timezone: string;
  working_hours: string;

  institute_type: string | null;
  affiliation: string | null;

  established_year: number;

  logo: string | null;
  profile_url: string | null;

  // Optional but included in initialState
  principal_name: string | null;
  contact_person: string | null;
  contact_person_mobile: string | null;

  facebook: string | null;
  instagram: string | null;
  youtube: string | null;

  banner_images: string[];
  theme_color: string | null;
}
// ==========================================================
// DASHBOARD STATE
// ==========================================================
export interface DashboardState {
  stats: {
    totalStudents: number;
    totalTeachers: number;
    totalCourses: number;
    unreadMessages: number;
    feesDue: number;
  };
  loading: boolean;
}

// ==========================================================
// USER MANAGEMENT
// ==========================================================
export interface UserManagementState {
  list: User[];
  selectedUser: any | null;
  filters: {
    role: string | null;
    status: string | null;
    search: string;
  };
  loading: boolean;
  error: string | null;
}

// ==========================================================
// STUDENT MODULE
// ==========================================================
export interface StudentModuleState {
  list: Student[];
  selectedStudent: any | null;
  attendance: any[];
  results: any[];
  filters: {
    classId: string | null;
    sectionId: string | null;
    search: string;
  };
  loading: boolean;
  error: string | null;
}

// ==========================================================
// TEACHER MODULE
// ==========================================================
export interface TeacherModuleState {
  list: Teacher[];
  selectedTeacher: any | null;
  salaryHistory: any[];
  filters: {
    departmentId: string | null;
    search: string;
  };
  loading: boolean;
  error: string | null;
}

// ==========================================================
// ACADEMICS MODULE
// ==========================================================
export interface AcademicsModuleState {
  courses: any[];
  batches: any[];
  subjects: any[];
  timetable: any[];
  loading: boolean;
  error: string | null;
}

// ==========================================================
// ATTENDANCE MODULE
// ==========================================================
export interface AttendanceModuleState {
  studentAttendance: any[];
  teacherAttendance: any[];
  date: string | null;
  loading: boolean;
  error: string | null;
}

// ==========================================================
// RESULTS MODULE
// ==========================================================
export interface ResultsModuleState {
  exams: any[];
  marks: any[];
  loading: boolean;
  error: string | null;
}

// ==========================================================
// FINANCE MODULE
// ==========================================================
export interface FinanceModuleState {
  fees: {
    structure: any[];
    payments: any[];
  };
  salary: {
    payouts: any[];
  };
  loading: boolean;
  error: string | null;
}

// ==========================================================
// MESSAGING MODULE
// ==========================================================
export interface MessagingModuleState {
  inbox: any[];
  sent: any[];
  unreadCount: number;
  loading: boolean;
}

// ==========================================================
// WEBSITE SETTINGS MODULE
// ==========================================================
export interface WebsiteSettingsState {
  theme: string;
  homePageContent: Record<string, any>;
  gallery: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  loading: boolean;
}

// ==========================================================
// MAIN INSTITUTE SLICE
// ==========================================================
export interface InstituteSlice {
  information: InstituteInformation;
  id: string | null;
  username: string | null;
  email: string | null;
  role: "institute";

  isVerified: boolean;
  isOnboarded: boolean;

  permissions: InstitutePermissions;

  lastLogin: string | null | Date;
  status: "active" | "inactive" | "blocked" | "pending";

  createdAt: string | null | Date;
  updatedAt: string | null | Date;

  // -----------------------------
  // MODULE STATES
  // -----------------------------
  dashboard: DashboardState;
  users: UserManagementState;
  students: StudentModuleState;
  teachers: TeacherModuleState;
  academics: AcademicsModuleState;
  attendance: AttendanceModuleState;
  results: ResultsModuleState;
  finance: FinanceModuleState;
  messaging: MessagingModuleState;
  website: WebsiteSettingsState;

  // -----------------------------
  // GLOBAL UI STATE
  // -----------------------------
  loading: boolean;
  error: boolean | string | null;
}
