import { Student, StudentDocument } from "./student.model";
import { status } from "./institute.model";

export interface StudentProfile {
  _id: string | null;
  auth: Student["auth"] | null;
  institute: {
    instituteId: string;
    institute_code: string;
    institute_logo: string;
    institute_name: string;
    owner_name?: string;
    owner_mobile?: string;
    owner_email?: string;
  } | null;
  personal: Student["personal"] | null;
  academic: Student["academic"] | null;
  permissions: Student["permissions"] | null;
  currentStatus: Student["currentStatus"] | null;
  statusHistory:
    | {
        status: string;
        date: Date | string;
        reason?: string;
        updatedBy: string;
      }[]
    | null;
  documents: StudentDocument[];
}

export interface StudentSlice {
  profile: StudentProfile;
  attendance: any[];
  results: any[];

  fees: {
    totalFees: number;
    paid: number;
    remainingFees: number;
    due: number; // calculated or alias for remaining? Keeping for backward compat if needed, or mapping to remaining.
    status: Student["fees"]["status"];
    history: Student["fees"]["detail"];
  };

  loading: boolean;
  error: string | null;

  // This status refers to the slice data loading state or the student status?
  // In slice implementation it was used for loading state, but typed as 'status' ("active" | "pending" etc).
  // Ideally this should be `RequestStatus` ("idle" | "loading" | "succeeded" | "failed").
  // But strictly adhering to the file's existing import:
  status: status;
}
