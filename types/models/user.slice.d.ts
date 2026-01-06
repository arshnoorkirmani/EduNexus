import { User } from "./user.model";

export interface UserProfile {
  _id: string | null;
  auth: User["auth"] | null;
  institute: {
    instituteId?: string;
    institute_code: string;
    institute_name: string;
    owner_name: string;
    owner_mobile: string;
    owner_email: string;
    owner_profile_url: string;
    owner_logo: string;
  } | null;
  personal: User["personal"] | null;
  documents: User["documents"] | null;
  permissions: Record<string, boolean> | null;
  metadata: {
    createdBy?: string;
    updatedBy?: string;
  } | null;
}

export interface UserSlice {
  profile: UserProfile;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  role: "institute" | "student" | "teacher" | "user" | null;
  status: "active" | "pending" | "blocked" | null;
}
