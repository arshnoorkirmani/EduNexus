// menus/student.menu.ts
import { LucideHome, Inbox, Book, User2 } from "lucide-react";

export const STUDENT_MENU = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LucideHome,
    items: [
      {
        id: "overview",
        title: "Overview",
        url: "/student/dashboard",
        icon: LucideHome,
      },
      { id: "inbox", title: "Inbox", url: "/student/inbox", icon: Inbox },
      { id: "profile", title: "Profile", url: "/student/profile", icon: User2 },
    ],
  },

  {
    id: "academics",
    label: "Academics",
    icon: Book,
    items: [
      { id: "courses", title: "Courses", url: "/student/courses", icon: Book },
      { id: "results", title: "Results", url: "/student/results", icon: Book },
      {
        id: "attendance",
        title: "Attendance",
        url: "/student/attendance",
        icon: Book,
      },
    ],
  },
];
