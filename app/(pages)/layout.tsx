"use client";
import UniversalSidebar from "@/components/custom/sidebar/universal-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import InitUserClient from "./InitUserClient";
import Loader from "@/components/custom/utils/loader/Loader";
import TopLoader from "@/components/custom/utils/loader/TopLoader";

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
        <TopLoader />
        <InitUserClient />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
