// menus/institute.menu.ts
import {
  Book,
  BookOpen,
  Inbox,
  LucideHome,
  Monitor,
  Receipt,
  Settings,
  Sheet,
  User2,
  UserCircle,
  UserPlus,
  UserPlus2Icon,
} from "lucide-react";

export const INSTITUTE_MENU = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LucideHome,
    items: [
      {
        id: "overview",
        title: "Overview",
        url: "/institute/dashboard",
        icon: LucideHome,
      },
      {
        id: "communication.inbox_message",
        title: "Inbox / Messages",
        url: "/institute/inbox",
        icon: Inbox,
      },
      {
        id: "profile.show",
        title: "My Profile",
        url: "/institute/profile",
        icon: User2,
      },
    ],
  },

  {
    id: "user_management",
    label: "User Management",
    icon: UserCircle,
    items: [
      {
        id: "user_management.show",
        title: "All Users",
        url: "/institute/manage-users",
        icon: UserCircle,
      },
      {
        id: "user_management.add",
        title: "Add User",
        url: "/institute/add-user",
        icon: UserPlus2Icon,
      },
    ],
  },

  {
    id: "student_management",
    label: "Student Management",
    icon: Book,
    items: [
      {
        id: "student_management.show",
        title: "Student List",
        url: "/institute/students",
        icon: User2,
      },
      {
        id: "student_management.add",
        title: "Add Student",
        url: "/institute/new-student",
        icon: UserPlus2Icon,
      },
      {
        id: "student_management.attendance",
        title: "Attendance",
        url: "/institute/attendance",
        icon: Book,
      },
      {
        id: "student_management.results",
        title: "Results",
        url: "/institute/results",
        icon: Sheet,
      },
    ],
  },

  {
    id: "teacher_management",
    label: "Teacher Management",
    icon: UserCircle,
    items: [
      {
        id: "teacher_management.show",
        title: "Teacher List",
        url: "/institute/teachers",
        icon: UserCircle,
      },
      {
        id: "teacher_management.add",
        title: "Add Teacher",
        url: "/institute/new-teacher",
        icon: UserPlus,
      },
    ],
  },

  {
    id: "academics",
    label: "Academics",
    icon: BookOpen,
    items: [
      {
        id: "academics.show_courses",
        title: "Courses",
        url: "/institute/courses",
        icon: BookOpen,
      },
    ],
  },

  {
    id: "finance",
    label: "Finance",
    icon: Receipt,
    items: [
      {
        id: "finance.fees_management",
        title: "Fees Management",
        url: "/institute/fees-management",
        icon: Receipt,
      },
      {
        id: "finance.salary_management",
        title: "Salary Management",
        url: "/institute/salary-management",
        icon: Receipt,
      },
    ],
  },

  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    items: [
      {
        id: "settings.institute_settings",
        title: "Institute Settings",
        url: "/institute/settings",
        icon: Settings,
      },
      {
        id: "settings.website_settings",
        title: "Website Settings",
        url: "/institute/website-settings",
        icon: Monitor,
      },
    ],
  },
];
