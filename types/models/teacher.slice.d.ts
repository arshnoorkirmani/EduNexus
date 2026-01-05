import { Teacher } from "./teacher.model";
import { status } from "./institute.model";

export interface TeacherProfile {
  _id: string | null;
  auth: Teacher["auth"] | null;
  institute: {
    instituteId: string;
    institute_name: string;
    institute_code: string;
  } | null;
  personal: Teacher["personal"] | null;
  professional: Teacher["professional"] | null;
  documents: Teacher["documents"] | null;
  permissions: Teacher["permissions"] | null;
  status: Teacher["status"] | null;
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
