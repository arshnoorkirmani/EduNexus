"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AutoBreadcrumb from "./autoBreadcrumb";
import { ProfileDropdown } from "./ProfileMenu";
import { ThemeToggle } from "../../utils/theme-toggle";
import { UserType } from "@/types/api/helper/next-auth";

interface User {
  name: string;
  role: UserType;
  organization?: string;
}

export function AppHeader() {
  // 🔐 Replace with session/auth later
  const user: User = {
    name: "Arshnoor",
    role: "institute",
    organization: "Hope Group of Institutes",
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-4">
          <SidebarTrigger />

          {/* Brand & Context */}
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              {user.organization ?? "Dashboard"}
            </span>
            <AutoBreadcrumb />
          </div>
        </div>

        {/* CENTER SECTION */}
        <div className="hidden lg:flex flex-1 justify-center px-6">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search students, teachers, courses…"
              className="pl-9"
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mobile Search */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle variant="ghost" />

          {/* Profile */}
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
