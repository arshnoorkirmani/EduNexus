"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  LucideHome,
  User2,
  UserCircle,
  UserPlus2Icon,
  UserPlus,
  Receipt,
  Sheet,
  Book,
  BookOpen,
  Settings,
  Monitor,
  Inbox,
  LogOut,
  Users2,
  Shield,
  GraduationCap,
  UserCheck,
} from "lucide-react";

import { SidebarUserFooter } from "./sidebaruserfooter";
import { ProfileAvatar } from "../utils/ProfileAvtar";
import { AppData } from "@/config/appConfig";
// ----------------------------------------------------------
// MENU CONFIG
// ----------------------------------------------------------

export const MENU = [
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
        id: "inbox",
        title: "Inbox / Messages",
        url: "/institute/inbox",
        icon: Inbox,
      },
      {
        id: "profile",
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
        id: "users",
        title: "All Users",
        url: "/institute/manage-users",
        icon: UserCircle,
      },
      {
        id: "add_user",
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
        id: "students",
        title: "Student List",
        url: "/institute/students",
        icon: User2,
      },
      {
        id: "add_student",
        title: "Add Student",
        url: "/institute/new-student",
        icon: UserPlus2Icon,
      },
      {
        id: "attendance",
        title: "Attendance",
        url: "/institute/attendance",
        icon: Book,
      },
      {
        id: "results",
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
        id: "teacher_list",
        title: "Teacher List",
        url: "/institute/teachers",
        icon: UserCircle,
      },
      {
        id: "add_teacher",
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
        id: "courses",
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
        id: "fees",
        title: "Fees Management",
        url: "/institute/fees-management",
        icon: Receipt,
      },
      {
        id: "salary",
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
        id: "institute_settings",
        title: "Institute Settings",
        url: "/institute/settings",
        icon: Settings,
      },
      {
        id: "website_settings",
        title: "Website Settings",
        url: "/institute/website-settings",
        icon: Monitor,
      },
    ],
  },
];

// ----------------------------------------------------------
// PROFILE DATA
// ----------------------------------------------------------
const PROFILE = {
  name: "Institute Admin",
  avatar: AppData.default.institute.logo,
  email: "admin@institute.com",
  role: "Administrator", // corrected: must match icon keys
};

export const roleIcons: Record<string, any> = {
  Administrator: Shield,
  Teacher: GraduationCap,
  Student: UserCheck,
  User: Users2,
};

// ----------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------

export default function ReadySidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      side="left"
      collapsible="icon"
      className="border-r bg-background transition-all duration-300 ease-in-out"
    >
      {/* HEADER */}
      <SidebarHeader className="border-b py-4 flex flex-col items-center">
        <ProfileAvatar
          name={PROFILE.name}
          profileUrl={PROFILE.avatar}
          icon={roleIcons[PROFILE.role]}
          size="lg" // open sidebar
          collapsed="md" // collapsed sidebar
        />

        <div className="text-center mt-1 group-data-[state=collapsed]:hidden">
          <h2 className="text-sm font-semibold truncate">{PROFILE.name}</h2>
          <p className="text-xs text-muted-foreground truncate">
            {PROFILE.email}
          </p>
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="flex-1 py-4 overflow-hidden">
        <ScrollArea className="h-full">
          {MENU.map((group) => (
            <SidebarGroup key={group.label} className="relative group">
              {/* Expanded mode label */}
              <div className="flex items-center gap-2 mb-2 group-data-[collapsible=icon]:hidden">
                <group.icon className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold text-xs text-muted-foreground">
                  {group.label}
                </span>
              </div>

              {/* Collapsed Mode */}
              <div className="hidden group-data-[collapsible=icon]:block">
                <Popover>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <div className="py-2 rounded-md hover:bg-accent cursor-pointer flex items-center justify-center">
                          <group.icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </PopoverTrigger>
                    </TooltipTrigger>

                    <TooltipContent side="right" className="text-sm">
                      {group.label}
                    </TooltipContent>
                  </Tooltip>

                  <PopoverContent
                    side="right"
                    align="start"
                    className="w-48 p-1"
                    sideOffset={16}
                  >
                    <div className="py-2">
                      {group.items.map((item) => (
                        <Link
                          key={item.title}
                          href={item.url}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-accent transition-colors rounded-sm"
                        >
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{item.title}</span>
                        </Link>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Expanded mode items */}
              <SidebarMenuSub className="group-data-[collapsible=icon]:hidden">
                {group.items.map((item) => {
                  const active = pathname.startsWith(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={active}>
                        <Link
                          href={item.url}
                          className="flex items-center gap-3 pl-4 py-2"
                        >
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenuSub>
            </SidebarGroup>
          ))}
        </ScrollArea>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarUserFooter />
    </Sidebar>
  );
}
