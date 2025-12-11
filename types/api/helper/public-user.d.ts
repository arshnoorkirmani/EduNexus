export interface PublicInstituteUser {
  id: string;
  user_type: "institute";
  name: string;
  profile_url: string | null;
  logo: string | null;
  isVerified: boolean;
  isNew: boolean;
  email: string; // email login
}

export interface PublicStudentUser {
  id: string;
  user_type: "student";
  name: string;
  profile_url: string | null;
  logo: null;
  isVerified: boolean;
  isNew: boolean;
  student_id: string;
}

export interface PublicTeacherUser {
  id: string;
  user_type: "teacher";
  name: string;
  profile_url: string | null;
  logo: null;
  isVerified: boolean;
  isNew: boolean;
  teacher_id: string;
}

export interface PublicBaseUser {
  id: string;
  user_type: "user";
  name: string;
  profile_url: string | null;
  logo: null;
  isVerified: boolean;
  isNew: boolean;
  email: string;
}

export type PublicUser =
  | PublicInstituteUser
  | PublicStudentUser
  | PublicTeacherUser
  | PublicBaseUser;
