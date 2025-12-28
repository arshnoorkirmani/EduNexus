/* ------------------------------------------------------------------ */
/* TYPES                                                              */
/* ------------------------------------------------------------------ */
export type CourseType = "university" | "computer" | "skill";
export type CourseStatus = "active" | "inactive" | "archived";

/* ------------------------------------------------------------------ */
/* COURSE INTERFACE                                                    */
/* ------------------------------------------------------------------ */
export interface CourseDocument {
  _id: string;
  course_code: string;
  course_name: string;
  category: string;
  type: CourseType;
  duration: {
    value: number;
    unit: "year" | "month";
  };
  eligibility?: string;
  fees: {
    total: number;
    currency: "INR";
  };
  status: CourseStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
