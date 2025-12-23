"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { UserType } from "@/types/api/helper/next-auth";
import {
  PublicBaseUser,
  PublicInstituteUser,
  PublicStudentUser,
  PublicTeacherUser,
} from "@/types/api/helper/public-user";

export interface AuthUser {
  id: string;
  name: string;
  role: UserType;
  identifier: string;
  avatar?: string;
  email?: string;
}

export function useAuth() {
  const { data: session, status } = useSession();

  const loading = status === "loading";
  const isAuthenticated = status === "authenticated";

  const user: AuthUser | null = useMemo(() => {
    if (!isAuthenticated || !session?.user) return null;

    const base = session.user;
    let identifier = "unknown";

    if (base.role === "student") {
      identifier = (base as PublicStudentUser).student_id;
    } else if (base.role === "teacher") {
      identifier = (base as PublicTeacherUser).teacher_id;
    } else {
      identifier = (base as PublicInstituteUser | PublicBaseUser).email;
    }

    return {
      id: base.id,
      name: base.name,
      role: base.role,
      identifier,
      avatar: base.profile_url ?? undefined,
      email:
        base.role === "institute" || base.role === "user"
          ? (base as PublicInstituteUser | PublicBaseUser).email
          : undefined,
    };
  }, [session, isAuthenticated]);

  const role = user?.role ?? null;

  // Role helpers
  const isStudent = role === "student";
  const isTeacher = role === "teacher";
  const isInstitute = role === "institute";
  const isUser = role === "user";

  /**
   * STRICT role checker (for guards)
   */
  const hasRole = (allowed: UserType[]) => {
    if (!isAuthenticated || !role) return false;
    return allowed.includes(role);
  };

  return {
    user,
    role,

    loading,
    isAuthenticated,

    isStudent,
    isTeacher,
    isInstitute,
    isUser,

    hasRole,
  };
}
