import { StudentFormValues } from "@/lib/validators/student.schema";

export const studentDefaultValues: StudentFormValues = {
  auth: {
    studentId: "",
    password: "",
  },
  personal: {
    firstName: "",
    lastName: "",
    gender: "male",
    dob: new Date(),
    mobile: "",
    email: "",
    fatherName: "",
  },
  academic: {
    registrationNo: "",
    rollNo: "",
    admissionDate: new Date(),
  },
  fees: {
    totalFees: 0,
    paidFees: 0,
  },
  status: "active",
};
