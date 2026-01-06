import { z } from "zod";

export const studentFormSchema = z.object({
  auth: z.object({
    studentId: z.string().min(3),
    password: z.string().min(6),
  }),

  personal: z.object({
    firstName: z.string().min(2),
    lastName: z.string().optional(),
    gender: z.enum(["male", "female", "other"]),
    dob: z.date(),
    mobile: z.string().min(10),
    email: z.string().email().optional(),
    fatherName: z.string().optional(),
  }),

  academic: z.object({
    registrationNo: z.string(),
    rollNo: z.string(),
    admissionDate: z.date(),
  }),

  fees: z.object({
    totalFees: z.number().min(0),
    paidFees: z.number().min(0),
  }),

  status: z.enum([
    "active",
    "inactive",
    "passed",
    "failed",
    "suspended",
    "dropout",
  ]),
});

export type StudentFormValues = z.infer<typeof studentFormSchema>;
