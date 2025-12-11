"use client";

import { useEffect, useState } from "react";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { ProfileAvatar } from "../utils/ProfileAvtar";
import { LogoutButton } from "../utils/logOutButton";
import { RoleBadge } from "../utils/RoleBadge"; // ⭐ NEW IMPORT
import { AppData } from "@/config/appConfig";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: "Administrator" | "Teacher" | "Student" | "User";
}

export const DemoUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@institute.com",
    role: "Administrator",
    avatar: AppData.default.institute.logo,
  },
];

export function SidebarUserFooter() {
  const [users, setUsers] = useState<User[]>([]);
  const [activeUser, setActiveUser] = useState<User | null>(null);

  /* ----------------- INITIAL LOAD ----------------- */
  useEffect(() => {
    const storedUsers = localStorage.getItem("app_users");
    const storedActive = localStorage.getItem("active_user");

    if (!storedUsers) {
      localStorage.setItem("app_users", JSON.stringify(DemoUsers));
      localStorage.setItem("active_user", JSON.stringify(DemoUsers[0]));

      setUsers(DemoUsers);
      setActiveUser(DemoUsers[0]);
      return;
    }

    const parsedUsers: User[] = JSON.parse(storedUsers);
    const parsedActive: User = storedActive
      ? JSON.parse(storedActive)
      : parsedUsers[0];

    setUsers(parsedUsers);
    setActiveUser(parsedActive);
  }, []);

  /* ----------------- SWITCH USER ----------------- */
  const handleSwitchUser = (u: User) => {
    setActiveUser(u);
    localStorage.setItem("active_user", JSON.stringify(u));
  };

  /* ----------------- LOGOUT ----------------- */
  const handleLogout = () => {
    // localStorage.removeItem("active_user");
    // window.location.href = "/auth/institute-login";
    console.log("==========Logout=============");
  };

  if (!activeUser) return null;

  return (
    <SidebarFooter className="border-t backdrop-blur-xl">
      {/* ------------------ COLLAPSED ------------------ */}
      <div className="hidden group-data-[state=collapsed]:flex justify-center">
        <Popover>
          <PopoverTrigger asChild>
            <div className="p-1 rounded-xl cursor-pointer hover:bg-accent/70 transition">
              <ProfileAvatar
                profileUrl={activeUser.avatar || ""}
                name={activeUser.name}
              />
            </div>
          </PopoverTrigger>

          <PopoverContent
            align="center"
            className="w-72 ml-1 mb-1.5 p-4 rounded-2xl border border-white/10 shadow-2xl
              bg-black/60 backdrop-blur-xl animate-in fade-in-0 zoom-in-90"
          >
            <UserSwitcherList
              users={users}
              activeUser={activeUser}
              onSwitch={handleSwitchUser}
              onLogout={handleLogout}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* ------------------ EXPANDED ------------------ */}
      <SidebarMenu className="group-data-[state=collapsed]:hidden">
        <SidebarMenuItem>
          <Popover>
            <PopoverTrigger asChild className="py-5">
              <SidebarMenuButton
                className="flex items-center gap-3 px-3 py-8 rounded-xl bg-sidebar/60
                  hover:bg-accent/50 border cursor-pointer hover:border-white/10
                  transition shadow"
              >
                <ProfileAvatar
                  profileUrl={activeUser.avatar || ""}
                  name={activeUser.name}
                />

                <div className="flex flex-col flex-1">
                  <span className="text-sm font-semibold text-white">
                    {activeUser.name}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {activeUser.email}
                  </span>
                </div>

                {/* ⭐ NEW BADGE */}
                <RoleBadge
                  role={activeUser.role}
                  size={18}
                  className="opacity-70"
                />
              </SidebarMenuButton>
            </PopoverTrigger>

            <PopoverContent
              align="center"
              alignOffset={8}
              className="w-80 ml-1 mb-1 p-5 rounded-2xl border border-white/10 shadow-2xl
                bg-black/60 backdrop-blur-xl animate-in fade-in-0 zoom-in-95"
            >
              <UserSwitcherList
                users={users}
                activeUser={activeUser}
                onSwitch={handleSwitchUser}
                onLogout={handleLogout}
              />

              <LogoutButton
                onLogout={handleLogout}
                loading={false}
                label="Sign out"
                className="mt-4"
              />
            </PopoverContent>
          </Popover>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}

// ============================================================================================
// ============================================================================================

export function UserSwitcherList({
  users,
  activeUser,
  onSwitch,
}: {
  users: User[];
  activeUser: User;
  onSwitch: (u: User) => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-white/80">Switch Account</p>

      <div className="flex flex-col gap-3">
        {users.map((u) => {
          const isActive = u.id === activeUser.id;

          return (
            <button
              key={u.id}
              onClick={() => onSwitch(u)}
              className={`flex items-center justify-between w-full rounded-xl px-3 py-2.5 transition
                ${isActive ? "bg-white/10" : "hover:bg-white/5"}`}
            >
              <div className="flex items-center gap-3">
                <ProfileAvatar
                  profileUrl={u.avatar || ""}
                  name={u.name}
                  icon={undefined}
                />

                <div className="flex flex-col text-left">
                  <span className="text-sm font-semibold text-white">
                    {u.name}
                  </span>
                  <span className="text-xs text-neutral-400">{u.email}</span>
                </div>
              </div>

              {/* ⭐ NEW ROLE BADGE */}
              <RoleBadge role={u.role} size={16} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
