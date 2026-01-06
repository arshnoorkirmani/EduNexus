// menus/user.menu.ts
import { LucideHome, User2, Inbox } from "lucide-react";

export const USER_MENU = [
  {
    id: "main",
    label: "Menu",
    icon: LucideHome,
    items: [
      { id: "home", title: "Home", url: "/user/home", icon: LucideHome },
      { id: "profile", title: "My Profile", url: "/user/profile", icon: User2 },
      { id: "messages", title: "Messages", url: "/user/messages", icon: Inbox },
    ],
  },
];
