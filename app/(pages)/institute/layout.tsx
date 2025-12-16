"use client";

import { AppHeader } from "@/components/custom/user-pages/header/Header";
import { AppFooter } from "@/components/custom/user-pages/footer/Footer";

export default function InstituteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Fixed Header */}
      <AppHeader />

      {/* ✅ ONLY THIS SCROLLS */}
      <main className="mx-auto w-full max-w-7xl p-6 space-y-8 min-h-auto">
        {children}
      </main>

      {/* Fixed Footer */}
      <AppFooter />
    </div>
  );
}
