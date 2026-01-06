"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { UserType } from "@/types/api/helper/next-auth";
import { PublicUser } from "@/types/api/helper/public-user";

export interface AuthUser {
  id: string;
  name: string;
  role: UserType;
  identifier: string;
  avatar?: string;
  email?: string;
  isVerified: boolean;
  institute_name: string;
  institute_code: string;
  isNew: boolean;
}

function getIdentifier(user: PublicUser): string {
  switch (user.role) {
    case "student":
      return user.student_id;
    case "teacher":
      return user.teacher_id;
    case "institute":
      return user.email;
    case "user":
      return user.userId;
    default:
      return "unknown";
  }
}

export function useAuth() {
  const { data: session, status } = useSession();

  const loading = status === "loading";
  const isAuthenticated = status === "authenticated";

  const user = useMemo<AuthUser | null>(() => {
    if (!isAuthenticated || !session?.user) return null;

    const base = session.user;
    return {
      id: base.id,
      name: base.name,
      role: base.role,
      identifier: getIdentifier(base),
      avatar: base.profile_url ?? undefined,
      institute_name: base.institute_name,
      institute_code: base.institute_code,
      email: base.role === "institute" ? base.email : undefined,
      isVerified: base.isVerified,
      isNew: base.isNew,
    };
  }, [isAuthenticated, session]);

  const role = user?.role ?? null;

  const hasRole = (allowed: readonly UserType[]) =>
    !!role && allowed.includes(role);
  return {
    user,
    role,

    loading,
    isAuthenticated,

    isStudent: role === "student",
    isTeacher: role === "teacher",
    isInstitute: role === "institute",
    isUser: role === "user",

    hasRole,
  };
}
