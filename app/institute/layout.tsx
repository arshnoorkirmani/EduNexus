"use client";

import UniversalSidebar from "@/components/custom/sidebar/universal-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function SidebarClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      {/* Permanent sidebar */}
      <UniversalSidebar />
      {/* The wrapper that pushes content correctly */}
      <SidebarInset className="min-h-screen bg-background">
        {/* You can keep the trigger here or remove */}
        <header className="p-2 border-b">
          <SidebarTrigger />
        </header>

        <main className="p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
