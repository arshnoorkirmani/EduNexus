"use client";

import { useEffect, useMemo, useState } from "react";
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
import { useSession } from "next-auth/react";
import { UserType } from "@/types/api/helper/next-auth";
import {
  PublicBaseUser,
  PublicInstituteUser,
  PublicStudentUser,
  PublicTeacherUser,
  PublicUser,
} from "@/types/api/helper/public-user";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface User {
  id: string;
  name: string;
  identifier: string;
  avatar?: string;
  role?: UserType;
}

export function SidebarUserFooter() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);

  // ---------------- ACTIVE USER (DERIVED) ----------------
  const activeUser: User | null = useMemo(() => {
    if (status !== "authenticated" || !session?.user) return null;

    return {
      id: session.user.id,
      name: session.user.name,
      identifier:
        session.user.role === "institute" || session.user.role === "user"
          ? (session.user as PublicInstituteUser | PublicBaseUser).email
          : session.user.role === "student"
          ? (session.user as PublicStudentUser).student_id
          : session.user.role === "teacher"
          ? (session.user as PublicTeacherUser).teacher_id
          : "unknown",

      avatar: session.user.profile_url ?? undefined,
      role: session.user.role,
    };
  }, [status, session]);
  // ---------------- SYNC USERS LIST ----------------
  useEffect(() => {
    if (!activeUser) return;
    console.log("activeUser", activeUser, session); //remove
    setUsers([activeUser]);
  }, [activeUser]);

  if (!activeUser) return null;

  // ---------------- HANDLERS ----------------
  const handleSwitchUser = (u: User) => {
    // localStorage.setItem("active_user", JSON.stringify(u));
    console.log(u); //remove
  };

  const handleLogout = () => {
    console.log("==========Logout=============");
  };

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
                  <span className="text-[8px] text-neutral-400">
                    {activeUser.identifier}
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
                  <span className="text-[10px] text-neutral-400">
                    {u.identifier}
                  </span>
                </div>
              </div>

              {/* ⭐ NEW ROLE BADGE */}
              <Button variant={"ghost"} className="cursor-pointer">
                <Settings size={16} />
              </Button>
            </button>
          );
        })}
      </div>
    </div>
  );
}
