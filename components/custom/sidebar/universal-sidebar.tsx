"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubItem,
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

import { Users2, Shield, GraduationCap, UserCheck } from "lucide-react";

import { SidebarUserFooter } from "./sidebaruserfooter";
import { ProfileAvatar } from "../utils/ProfileAvtar";
import { AppData } from "@/config/appConfig";
import { can, MENUS } from "./menus";
import { useAppSelector } from "@/store";
import { Skeleton } from "@/components/ui/skeleton";
import { LogoutButton } from "../utils/logOutButton";
import { errorToast } from "../utils/Toast";
import { useEffect, useMemo } from "react";
import { roleIcons } from "../utils/RoleBadge";
// ----------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------

export default function ReadySidebar() {
  const pathname = usePathname();
  // const menus = MENUS["institute"];
  const institute = useAppSelector((state) => state.institute);
  const roleKey =
    institute.status === "active"
      ? "verified"
      : institute.status || institute.role || "user";

  const PROFILE = useMemo(() => {
    if (institute.loading || institute.error) {
      return {
        name: "User",
        avatar: AppData.default.institute.logo,
        email: "user@institute.com",
        role: "user",
      };
    }

    return {
      name: institute.username ?? `${AppData.app.name} User`,
      avatar:
        institute.information?.profile_url || AppData.default.institute.logo,
      email: institute.information?.email ?? "",
      role: institute.role ?? "user",
    };
  }, [institute]);

  console.log({ institute }); //remove
  useEffect(() => {
    if (!institute.status) return;

    const messages = {
      pending: "Institute verification is pending",
      inactive: "Institute account is inactive",
      blocked: "Institute has been blocked by admin",
    };

    if (institute.status !== "active" && messages[institute.status]) {
      errorToast(messages[institute.status]);
    }
  }, [institute.status]);

  // ==============================================
  const menus = useMemo(() => {
    return MENUS.institute
      .map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          can(institute.permissions, item.id)
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [institute.permissions]);

  // console.log("filteredMenus", filteredMenus);
  // ==============================================
  if (institute.loading) {
    return (
      <Sidebar side="left" variant="floating" id="sidebar-skeleton">
        <SidebarHeader className="">
          <div className="size-full flex justify-center items-center flex-col gap-2">
            <Skeleton className="size-14 rounded-full" />
            <Skeleton className="h-6 w-32" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          {" "}
          <SidebarGroup>
            <SidebarMenuSkeleton />
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSkeleton showIcon />
                <SidebarMenuSkeleton showIcon />
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarMenuSkeleton />
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSkeleton showIcon />
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarMenuSkeleton />
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSkeleton showIcon />
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t">
          <SidebarMenu>
            <SidebarMenuItem className="flex  gap-2 justify-between">
              <Skeleton className="size-10 rounded-full" />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    );
  }
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
          icon={roleIcons[roleKey]}
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
          {menus.map((group) => (
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
