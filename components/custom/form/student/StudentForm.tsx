"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

/* ================= UI ================= */
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ================= SCHEMA ================= */
const studentFormSchema = z.object({
  auth: z.object({
    studentId: z.string().min(3),
    password: z.string().min(6),
  }),

  personal: z.object({
    firstName: z.string().min(2),
    lastName: z.string().optional(),
    gender: z.enum(["male", "female", "other"]),
    dob: z.string(),
    mobile: z.string().min(10),
    email: z.string().email().optional(),
    fatherName: z.string().optional(),
    address: z.object({
      line: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
      country: z.string().optional(),
    }),
  }),

  academic: z.object({
    registrationNo: z.string(),
    rollNo: z.string(),
    admissionDate: z.string(),
    course: z.object({
      name: z.string(),
      courseTitle: z.string().optional(),
      baseFee: z.number().optional(),
    }),
  }),

  fees: z.object({
    totalFees: z.number().min(0),
    paidFees: z.number().min(0),
    status: z.enum(["paid", "pending", "partial"]),
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

/* ================= DEFAULT VALUES ================= */
const defaultValues: StudentFormValues = {
  auth: { studentId: "", password: "" },

  personal: {
    firstName: "",
    lastName: "",
    gender: "male",
    dob: "",
    mobile: "",
    email: "",
    fatherName: "",
    address: {
      line: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    },
  },

  academic: {
    registrationNo: "",
    rollNo: "",
    admissionDate: "",
    course: { name: "", courseTitle: "", baseFee: 0 },
  },

  fees: { totalFees: 0, paidFees: 0, status: "pending" },
  status: "active",
};

/* ================= FORM ================= */
export function StudentForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-12 max-w-5xl"
      >
        {/* ================= AUTH ================= */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Authentication</h2>
          <Separator />

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="auth.studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID</FormLabel>
                  <FormControl>
                    <Input placeholder="STU-2025-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="auth.password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* ================= PERSONAL ================= */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Personal Information</h2>
          <Separator />

          <div className="grid md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="personal.firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Rahul" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personal.lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Sharma" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personal.gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="personal.dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personal.mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="9876543210" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personal.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="student@email.com" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="personal.fatherName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father / Guardian Name</FormLabel>
                <FormControl>
                  <Input placeholder="Mr. Sharma" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </section>

        {/* ================= ACADEMIC ================= */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Academic Information</h2>
          <Separator />

          <div className="grid md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="academic.registrationNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration No</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="academic.rollNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roll No</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="academic.admissionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admission Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="academic.course.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Name</FormLabel>
                <FormControl>
                  <Input placeholder="B.Sc Computer Science" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </section>

        {/* ================= FEES ================= */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Fees</h2>
          <Separator />

          <div className="grid md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="fees.totalFees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Fees</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fees.paidFees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paid Fees</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fees.status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fee Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* ================= STATUS ================= */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Student Status</h2>
          <Separator />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="passed">Passed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="dropout">Dropout</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </section>

        <Button size="lg" type="submit" className="w-full">
          Save Student
        </Button>
      </form>
    </Form>
  );
}
