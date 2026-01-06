import type { ReactNode } from "react";
import { MetadataBuilder } from "@/lib/MetadataBuilder";

export const metadata = MetadataBuilder.page({
  title: "Students",
  description: "Manage student admissions, profiles, attendance, and records.",
  index: false, // dashboards should not be indexed
});
export default function StudentLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
