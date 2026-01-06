import { AppHeader } from "@/components/custom/user-pages/header/Header";
import { AppFooter } from "@/components/custom/user-pages/footer/Footer";
import { MetadataBuilder } from "@/lib/MetadataBuilder";
export const metadata = MetadataBuilder.page({
  title: "Institute Dashboard",
  description:
    "Manage students, teachers, attendance, fees, reports, and institute settings from a single dashboard.",
  // noIndex: true, // 👈 IMPORTANT for after-login pages
});
export default function InstituteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Global Header */}
      <AppHeader />

      {/* Scrollable Content */}
      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl p-6 space-y-8">{children}</div>
      </main>

      {/* Global Footer */}
      <AppFooter />
    </div>
  );
}
