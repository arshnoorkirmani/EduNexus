import { status } from "./institute.model";

export interface TeacherProfile {
  teacher_id: string | null;
  name: string | null;
  email: string | null;
  mobile: string | null;
  departmentId: string | null;
  designation: string | null;
  profile_url: string | null;
  status: "active" | "pending" | "blocked";
}

export interface TeacherSlice {
  profile: TeacherProfile;
  attendance: any[];
  salary: {
    current: number;
    history: any[];
  };
  subjects: any[];
  loading: boolean;
  error: string | null;
  status: status;
}
