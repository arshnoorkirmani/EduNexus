export interface StudentProfile {
  student_id: string | null;
  name: string | null;
  email: string | null;
  mobile: string | null;
  classId: string | null;
  sectionId: string | null;
  roll_no: string | null;
  profile_url: string | null;
  status: "active" | "pending" | "blocked";
}

export interface StudentSlice {
  profile: StudentProfile;
  attendance: any[];
  results: any[];
  fees: {
    due: number;
    paid: number;
    history: any[];
  };
  loading: boolean;
  error: string | null;
  status: status;
}
