"use client";
import UniversalSidebar from "@/components/custom/sidebar/universal-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import InitUserClient from "./InitUserClient";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <UniversalSidebar />

      {/* Must not scroll */}
      <SidebarInset>
        <InitUserClient />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
