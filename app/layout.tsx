import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { MetadataBuilder } from "@/lib/MetadataBuilder";
import Providers from "./providers";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GoToTopButton } from "@/components/custom/utils/GoToTopButton";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = MetadataBuilder.page({
  title: "Welcome",
  description:
    "EduNecus – A complete Institute Management System that simplifies student management, admissions, staff operations, attendance, courses, finances, analytics, and more.",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} w-screen h-screen overflow-hidden bg-background text-foreground relative`}
      >
        {/* 🌍 GLOBAL SHADCN SCROLL */}
        <ScrollArea id="app-scroll-area" className="h-full scroll-smooth">
          <Providers>{children}</Providers>
          <GoToTopButton />
        </ScrollArea>
      </body>
    </html>
  );
}
