// menus/teacher.menu.ts
import { BookOpen, LucideHome, Inbox, User2 } from "lucide-react";

export const TEACHER_MENU = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LucideHome,
    items: [
      {
        id: "overview",
        title: "Overview",
        url: "/teacher/dashboard",
        icon: LucideHome,
      },
      { id: "inbox", title: "Inbox", url: "/teacher/inbox", icon: Inbox },
      { id: "profile", title: "Profile", url: "/teacher/profile", icon: User2 },
    ],
  },

  {
    id: "academics",
    label: "Academics",
    icon: BookOpen,
    items: [
      {
        id: "my_classes",
        title: "My Classes",
        url: "/teacher/classes",
        icon: BookOpen,
      },
      {
        id: "attendance",
        title: "Attendance",
        url: "/teacher/attendance",
        icon: BookOpen,
      },
      {
        id: "results",
        title: "Results",
        url: "/teacher/results",
        icon: BookOpen,
      },
    ],
  },
];
