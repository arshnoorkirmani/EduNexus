"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfileDropdown } from "./ProfileMenu";
import AutoBreadcrumb from "./autoBreadcrumb";
import { ThemeToggle } from "../../utils/theme-toggle";

export function AppHeader() {
  // 🔐 Later replace with session / redux
  const user = {
    name: "Arshnoor",
    role: "admin" as const,
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border/40 bg-background/80 px-4 backdrop-blur-md">
      {/* LEFT */}
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <div className="hidden md:block">
            <span>Hope Group of Institute</span>
            <AutoBreadcrumb />
          </div>
        </div>

        {/* CENTER */}
        <div className="hidden lg:flex ">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students, teachers..."
              className="pl-9"
            />
          </div>
        </div>
      </div>
      {/* RIGHT */}
      <div className="flex items-center gap-3 float-right">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <ThemeToggle variant="ghost" />

        <ProfileDropdown name={user.name} role={user.role} />
      </div>
    </header>
  );
}
