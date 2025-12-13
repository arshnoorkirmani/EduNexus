export interface PublicInstituteUser {
  id: string;
  role: "institute";
  name: string;
  profile_url: string | null;
  logo: string | null;
  isVerified: boolean;
  isNew: boolean;
  email: string; // email login
}

export interface PublicStudentUser {
  id: string;
  role: "student";
  name: string;
  profile_url: string | null;
  logo: string | null;
  isVerified: boolean;
  isNew: boolean;
  student_id: string;
}

export interface PublicTeacherUser {
  id: string;
  role: "teacher";
  name: string;
  profile_url: string | null;
  logo: string | null;
  isVerified: boolean;
  isNew: boolean;
  teacher_id: string;
}

export interface PublicBaseUser {
  id: string;
  role: "user";
  name: string;
  profile_url: string | null;
  logo: string | null;
  isVerified: boolean;
  isNew: boolean;
  email: string;
}

export type PublicUser =
  | PublicInstituteUser
  | PublicStudentUser
  | PublicTeacherUser
  | PublicBaseUser;
