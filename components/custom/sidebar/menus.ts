// store/sidebarSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Role, RoleMenuMap } from "@/types/navigation";
import {
  Home,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  Calendar,
  Settings,
  Notebook,
  User,
  Building2,
} from "lucide-react"; // adjust path if necessary

// initial menus (keeps shape but simple)
const initialMenus: RoleMenuMap = {
  institute: [
    {
      label: "Main",
      navs_item: [
        {
          id: "dashboard",
          title: "Dashboard",
          url: "/institute/dashboard",
          icon: Home,
        },
        {
          id: "teachers",
          title: "Teachers",
          url: "/institute/teachers",
          icon: Users,
        },
        {
          id: "students",
          title: "Students",
          url: "/institute/students",
          icon: GraduationCap,
        },
        {
          id: "courses",
          title: "Courses",
          url: "/institute/courses",
          icon: BookOpen,
        },
        {
          id: "batches",
          title: "Batches",
          url: "/institute/batches",
          icon: ClipboardList,
        },
        {
          id: "attendance",
          title: "Attendance",
          url: "/institute/attendance",
          icon: Calendar,
        },
      ],
    },
    {
      label: "Settings",
      navs_item: [
        {
          id: "settings",
          title: "Settings",
          url: "/institute/settings",
          icon: Settings,
        },
      ],
    },
  ],
  teacher: [
    {
      label: "Main",
      navs_item: [
        {
          id: "dashboard",
          title: "Dashboard",
          url: "/teacher/dashboard",
          icon: Home,
        },
        {
          id: "classes",
          title: "My Classes",
          url: "/teacher/classes",
          icon: BookOpen,
        },
        {
          id: "students",
          title: "Students",
          url: "/teacher/students",
          icon: GraduationCap,
        },
        {
          id: "attendance",
          title: "Attendance",
          url: "/teacher/attendance",
          icon: ClipboardList,
        },
        {
          id: "assignments",
          title: "Assignments",
          url: "/teacher/assignments",
          icon: Notebook,
        },
      ],
    },
    {
      label: "Account",
      navs_item: [
        {
          id: "profile",
          title: "Profile",
          url: "/teacher/profile",
          icon: User,
        },
      ],
    },
  ],
  student: [
    {
      label: "Main",
      navs_item: [
        {
          id: "dashboard",
          title: "Dashboard",
          url: "/student/dashboard",
          icon: Home,
        },
        {
          id: "courses",
          title: "My Courses",
          url: "/student/courses",
          icon: BookOpen,
        },
        {
          id: "schedule",
          title: "Class Schedule",
          url: "/student/schedule",
          icon: Calendar,
        },
        {
          id: "assignments",
          title: "Assignments",
          url: "/student/assignments",
          icon: Notebook,
        },
      ],
    },
    {
      label: "Account",
      navs_item: [
        {
          id: "profile",
          title: "Profile",
          url: "/student/profile",
          icon: User,
        },
      ],
    },
  ],
  user: [
    {
      label: "Main",
      navs_item: [
        { id: "home", title: "Home", url: "/user/home", icon: Home },
        {
          id: "courses",
          title: "Courses",
          url: "/user/courses",
          icon: BookOpen,
        },
        {
          id: "institutes",
          title: "Institutes",
          url: "/user/institutes",
          icon: Building2,
        },
      ],
    },
    {
      label: "Account",
      navs_item: [
        { id: "profile", title: "Profile", url: "/user/profile", icon: User },
      ],
    },
  ],
};

type SidebarState = {
  menus: RoleMenuMap;
  activeRole: Role | null;
};

const initialState: SidebarState = {
  menus: initialMenus,
  activeRole: null,
};

const slice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setActiveRole(state, action: PayloadAction<Role>) {
      state.activeRole = action.payload;
    },
    resetActiveRole(state) {
      state.activeRole = null;
    },
    setMenusForRole(
      state,
      action: PayloadAction<{
        role: Role;
        sections: typeof initialMenus.institute;
      }>
    ) {
      state.menus[action.payload.role] = action.payload.sections;
    },
  },
});

export const { setActiveRole, resetActiveRole, setMenusForRole } =
  slice.actions;
export default slice.reducer;
