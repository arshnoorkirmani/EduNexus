"use client";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export function AppFooter() {
  const { user } = useAuth();
  return (
    <footer className="border-t bg-background px-6 py-3 text-sm text-muted-foreground">
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <span className="text-xs">
          © {new Date().getFullYear()}
          {"  "}
          <Link href={`/${user?.role}/dashboard`}>
            <span className="font-semibold hover:text-primary">
              {user?.institute_name ?? "Institute Management System"}
            </span>
          </Link>
        </span>

        <span className="text-xs">Powered by EduNexus • Secure • Scalable</span>
      </div>
    </footer>
  );
}
