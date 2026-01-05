export interface PublicInstituteUser {
  id: string;
  role: "institute";
  name: string;
  logo: string | null;
  profile_url: string;
  isVerified: boolean;
  isNew: boolean;
  institute_name: string;
  institute_code: string;
  email: string; // email login
}

export interface PublicStudentUser {
  id: string;
  role: "student";
  name: string;
  logo: string | null;
  profile_url: string;
  isVerified: boolean;
  isNew: boolean;
  institute_name: string;
  institute_code: string;
  student_id: string;
}

export interface PublicTeacherUser {
  id: string;
  role: "teacher";
  name: string;
  logo: string | null;
  profile_url: string;
  isVerified: boolean;
  isNew: boolean;
  institute_name: string;
  institute_code: string;
  teacher_id: string;
}

export interface PublicBaseUser {
  id: string;
  role: "user";
  userId: string;
  name: string;
  logo: string | null;
  profile_url: string;
  isVerified: boolean;
  isNew: boolean;
  institute_name: string;
  institute_code: string;
}

export type PublicUser =
  | PublicInstituteUser
  | PublicStudentUser
  | PublicTeacherUser
  | PublicBaseUser;
