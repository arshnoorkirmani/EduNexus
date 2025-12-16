"use client";

import UniversalSidebar from "@/components/custom/sidebar/universal-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface SidebarClientWrapperProps {
  children: React.ReactNode;
  headerContent?: React.ReactNode; // optional slot for breadcrumbs, title, search bar, etc.
}

export default function SidebarClientWrapper({
  children,
  headerContent,
}: SidebarClientWrapperProps) {
  return (
    <SidebarProvider>
      {/* Main Sidebar */}
      <UniversalSidebar />

      {/* Content Wrapper */}
      <SidebarInset className="min-h-screen w-full bg-background flex flex-col">
        {/* =====================================================================
             TOPBAR (sticky on top)
        ===================================================================== */}
        <header
          className="
            sticky top-0 z-30 
            flex items-center gap-3 
            px-4 py-3 
            bg-background/80 backdrop-blur 
            border-b border-border
          "
        >
          <SidebarTrigger />
          {headerContent && <div className="flex-1">{headerContent}</div>}
        </header>

        {/* =====================================================================
             MAIN CONTENT
        ===================================================================== */}
        <main className="flex-1 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
