"use client";

import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";

import { UserType } from "@/types/api/helper/next-auth";
import { PublicUser } from "@/types/api/helper/public-user";

export function useAuth() {
  const { data: session, status } = useSession();

  const user = session?.user as PublicUser | undefined;

  // Fix: UserType | null is the correct contract
  const role: UserType | null = user?.user_type ?? null;

  // State helpers
  const loading = status === "loading";
  const isLoggedIn = Boolean(user);

  // Role helpers
  const isStudent = role === "student";
  const isTeacher = role === "teacher";
  const isInstitute = role === "institute";
  const isUser = role === "user";

  // Protected role checker
  const requireRole = useMemo(
    () => (allowed: UserType[]) => {
      if (loading) return true; // Don't block until session resolves
      if (!role) return false; // If no role, not allowed
      return allowed.includes(role);
    },
    [role, loading]
  );

  return {
    user,
    role,

    loading,
    isLoggedIn,

    isStudent,
    isTeacher,
    isInstitute,
    isUser,

    requireRole,
  };
}
