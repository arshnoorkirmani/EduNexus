import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { MetadataBuilder } from "@/lib/MetadataBuilder";
import Providers from "./providers";
import { useInitUser } from "@/hooks/use-initUser";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// 🧭 --- Site Metadata ---
export const metadata = MetadataBuilder.page({
  title: "Welcome",
  description:
    "EduNecus – A complete Institute Management System that simplifies student management, admissions, staff operations, attendance, courses, finances, analytics, and more.",
  keywords: [
    "Institute Management System",
    "EduNecus",
    "Student Management",
    "School Software",
    "College Management",
    "Fees Management",
    "Admin Dashboard",
    "Admission System",
    "Education ERP",
  ],
});

// 🧩 --- Root Layout ---

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const isUserLogined = useInitUser();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
