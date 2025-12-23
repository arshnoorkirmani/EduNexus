"use client";

import { useEffect, useMemo } from "react";
import { useForm, UseFormReturn } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Field } from "@/components/custom/form/input/FormField";
import { SearchableSelectField } from "@/components/ui/curstom-program-selecter";

import {
  StudentFormData,
  studentFormSchema,
} from "@/lib/validators/institute/add-student.validator";
import { DocumentUploadCard } from "@/components/custom/form/student/DoucmentUploadCard";
import { cn } from "@/lib/utils";

const generateStudentId = () =>
  `STU${Math.floor(100000 + Math.random() * 900000)}`;

const COURSE_GROUPS = [
  {
    title: "Science",
    courses: [
      { label: "B.Sc Physics", value: "bsc-physics" },
      { label: "B.Sc Chemistry", value: "bsc-chemistry" },
    ],
  },
  {
    title: "Computer",
    courses: [
      { label: "BCA", value: "bca" },
      { label: "MCA", value: "mca" },
    ],
  },
];

export default function AddStudentPage() {
  const { form } = useAppForm<StudentFormData>();

  /* ================= DERIVED STATE ================= */

  const firstName = form.watch("personal.firstName");
  const lastName = form.watch("personal.lastName");
  const address = form.watch("personal.address");
  const totalFees = form.watch("fees.totalFees");
  const paidFees = form.watch("fees.paidFees");
  const fullName = useMemo(() => {
    const name = [firstName, lastName].filter(Boolean).join(" ");
    form.setValue("personal.fullName", name, { shouldDirty: false });
    return name;
  }, [firstName, lastName, form]);

  /* ================= EFFECTS ================= */

  // Auto Student ID
  useEffect(() => {
    if (!form.getValues("auth.studentId")) {
      form.setValue("auth.studentId", generateStudentId());
    }
  }, [form]);
  // Full Address
  useEffect(() => {
    const fullAddress = [
      address.line,
      address.city,
      address.state,
      address.pincode,
      address.country,
    ]
      .filter(Boolean)
      .join(", ");

    form.setValue("personal.address.fullAddress", fullAddress, {
      shouldDirty: false,
    });
  }, [address, form]);

  // Fees Calculation
  useEffect(() => {
    const total = Number(totalFees) || 0;
    const paid = Math.min(Number(paidFees) || 0, total);
    const remaining = Math.max(total - paid, 0);

    form.setValue("fees.remainingFees", remaining, { shouldDirty: false });
    form.setValue(
      "fees.status",
      remaining === 0 ? "paid" : paid > 0 ? "partial" : "pending",
      { shouldDirty: false }
    );
  }, [totalFees, paidFees, form]);

  const onSubmit = (data: StudentFormData) => {
    const documents = (data.documents || []).map((doc: any) => ({
      type: doc.documentType || doc.type,
      name: doc.name || doc.file?.name,
      url: doc.url || "", // ImageKit URL later (blob URL present while uploading)
      size: doc.size || doc.file?.size,
      mimeType: doc.mimeType || doc.file?.type,
      status: doc.status || "uploaded",
    }));

    const payload = {
      ...data,
      documents,
    };

    console.log("STUDENT_PAYLOAD", payload);
  };

  return (
    <Form {...form}>
      <form
        id="add-student-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {/* ================= AUTH ================= */}
        <Section
          title="Authentication Information"
          description="System-generated and login-related details used to uniquely identify the student and manage secure access to the student portal."
        >
          <Field
            form={form}
            name="auth.studentId"
            label="Student ID"
            placeholder="Auto-generated student ID"
            required
          />
          <Field
            form={form}
            name="auth.password"
            label="Password"
            type="password"
            placeholder="Enter a secure password"
            required
          />
          <Field
            form={form}
            name="institute.instituteCode"
            label="Institute Code"
            placeholder="Institute code"
            disabled
            required
          />
        </Section>

        {/* ================= PERSONAL ================= */}
        <Section
          title="Personal Information"
          description="Basic personal details of the student used for identification, communication, and official records."
        >
          <Field
            form={form}
            name="personal.firstName"
            label="First Name"
            placeholder="Enter first name"
            required
          />
          <Field
            form={form}
            name="personal.lastName"
            label="Last Name"
            placeholder="Enter last name"
          />
          <Field
            form={form}
            name="personal.fullName"
            label="Full Name"
            placeholder="Auto-filled full name"
          />

          <Field
            form={form}
            name="personal.mobile"
            label="Mobile"
            placeholder="10-digit mobile number"
          />
          <Field
            form={form}
            name="personal.email"
            label="Email"
            placeholder="student@email.com"
          />

          <Field
            form={form}
            name="personal.fatherName"
            label="Father Name"
            placeholder="Father's full name"
          />
          <Field
            form={form}
            name="personal.motherName"
            label="Mother Name"
            placeholder="Mother's full name"
          />

          <Field
            form={form}
            type="date"
            name="personal.dob"
            placeholder="Select date of birth"
            label="Date of Birth"
          />

          <FormField
            control={form.control}
            name="personal.gender"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel>Gender</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl className="py-0 my-0">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </Section>

        {/* ================= ADDRESS ================= */}
        <Section
          title="Address Information"
          cols={4}
          description="Residential address details used for correspondence, verification, and institutional records."
        >
          <Field
            form={form}
            name="personal.address.city"
            label="City"
            placeholder="City"
            parentClassName="col-span-4 sm:col-span-2 lg:col-span-1"
          />

          <Field
            form={form}
            name="personal.address.state"
            label="State"
            placeholder="State"
            parentClassName="col-span-4 sm:col-span-2 lg:col-span-1"
          />

          <Field
            form={form}
            name="personal.address.pincode"
            label="Pincode"
            placeholder="6-digit pincode"
            parentClassName="col-span-4 sm:col-span-2 lg:col-span-1"
          />

          <Field
            form={form}
            name="personal.address.country"
            label="Country"
            placeholder="Country"
            parentClassName="col-span-4 sm:col-span-2 lg:col-span-1"
          />

          <Field
            form={form}
            type="textarea"
            name="personal.address.fullAddress"
            label="Full Address"
            placeholder="House no, street, area, city, state, pincode"
            parentClassName="col-span-4"
          />
        </Section>

        {/* ================= ACADEMIC ================= */}
        <Section
          title="Academic Information"
          description="Academic and admission-related data including course selection, registration details, and batch timing."
        >
          <Field
            form={form}
            name="academic.registrationNo"
            label="Registration No"
            placeholder="Registration number"
          />
          <Field
            form={form}
            name="academic.rollNo"
            label="Roll No"
            placeholder="Roll number"
          />

          <SearchableSelectField
            form={form}
            name="academic.course.name"
            label="Course"
            placeholder="Select course"
            groups={COURSE_GROUPS}
          />

          <Field
            form={form}
            type="date"
            name="academic.admissionDate"
            label="Admission Date"
            placeholder="Select admission date"
          />
          <Field
            form={form}
            type="time"
            name="academic.timing"
            label="Batch Timing"
            placeholder="HH:MM"
          />
        </Section>

        {/* ================= FEES ================= */}
        <Section
          title="Fees Information"
          description="Fee structure and payment status used for billing, receipts, and financial tracking."
        >
          <Field
            form={form}
            name="fees.totalFees"
            label="Total Fees"
            type="number"
            placeholder="Total fees amount"
          />
          <Field
            form={form}
            name="fees.paidFees"
            label="Paid Fees"
            type="number"
            placeholder="Paid amount"
          />
          <Field
            form={form}
            name="fees.remainingFees"
            label="Remaining Fees"
            placeholder="Auto-calculated remaining fees"
            disabled
          />
        </Section>
        <Section
          cols={1}
          contentClass="space-y-0 md:px-6 px-2"
          title="Student Documents"
          description="Upload and manage student documents such as Aadhaar, marksheets, certificates, and profile photos."
        >
          <DocumentUploadCard form={form} />
        </Section>
        <Section
          cols={1}
          contentClass="space-y-0 md:px-6 px-2"
          title="Permissions"
          description="Manage student permissions for accessing features and functionalities."
        >
          <StudentPermissionSection form={form} />
        </Section>
        <FormActions<StudentFormData>
          submitLabel="Create Student"
          resetLabel="Reset"
          resetTitle="Discard changes?"
          resetDescription="All unsaved changes will be lost."
        />
      </form>
    </Form>
  );
}
/* ================= SECTION WRAPPER ================= */
export function Section({
  title,
  description,
  cols = 3,
  children,
  contentClass,
}: {
  title: string;
  description?: string;
  cols?: number;
  children: React.ReactNode;
  contentClass?: string;
}) {
  const colClass = {
    1: "sm:grid-cols-1 md:grid-cols-1",
    2: "sm:grid-cols-2 md:grid-cols-2",
    3: "sm:grid-cols-2 md:grid-cols-3",
    4: "sm:grid-cols-2 md:grid-cols-4",
  }[cols];

  return (
    <Card className="rounded-2xl border border-border/60 shadow-sm">
      <CardHeader className="pb-3 space-y-1">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>

        {description && (
          <p className="text-sm text-muted-foreground/80 leading-relaxed">
            {description}
          </p>
        )}
      </CardHeader>

      <CardContent
        className={cn(
          "grid grid-cols-1 gap-x-4 gap-y-6",
          colClass,
          contentClass
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
}
type PermissionPath =
  | "superAccess"
  | "profile.show"
  | "profile.edit"
  | "fees.view"
  | "fees.pay"
  | "document.upload"
  | "document.download"
  | "attendance.view"
  | "result.view"
  | "assignments.view"
  | "timetable.view"
  | "communication.sendMessage"
  | "communication.inboxMessage";

type Props = {
  form: UseFormReturn<StudentFormData>;
};
export const PERMISSIONS = [
  {
    title: "Profile",
    items: [
      { id: "profile.show", label: "View profile" },
      { id: "profile.edit", label: "Edit profile" },
    ],
  },
  {
    title: "Documents",
    items: [
      { id: "document.upload", label: "Upload documents" },
      { id: "document.download", label: "Download documents" },
    ],
  },
  {
    title: "Fees",
    items: [
      { id: "fees.view", label: "View fees" },
      { id: "fees.pay", label: "Pay fees" },
    ],
  },
  {
    title: "Communication",
    items: [
      { id: "communication.sendMessage", label: "Send messages" },
      { id: "communication.inboxMessage", label: "Inbox access" },
    ],
  },
  {
    title: "Academic",
    items: [
      { id: "attendance.view", label: "View attendance" },
      { id: "result.view", label: "View results" },
      { id: "assignments.view", label: "View assignments" },
    ],
  },
  {
    title: "Timetable",
    items: [{ id: "timetable.view", label: "View timetable" }],
  },
];
type PermissionItemProps = {
  form: UseFormReturn<any>;
  name: string;
  label: string;
};

function PermissionItem({ form, name, label }: PermissionItemProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const switchId = `switch-${name}`;

        return (
          <FormItem
            className={cn(
              "flex items-center justify-between gap-4",
              "rounded-lg border px-4 py-3",
              "bg-muted/40",
              "hover:border-primary/40 hover:bg-muted/40",
              "transition-all duration-200"
            )}
          >
            {/* Clickable Text */}
            <FormLabel
              htmlFor={switchId}
              className="grid cursor-pointer space-y-0.5"
            >
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">
                Allow student to {label.toLowerCase()}
              </p>
            </FormLabel>

            {/* Switch */}
            <FormControl>
              <Switch
                id={switchId}
                checked={Boolean(field.value)}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
}

// type Props = {
//   form: UseFormReturn<any>;
// };

import { useWatch } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAppForm } from "../FormContext";
import { FormActions } from "./StudentFormActions";

export function StudentPermissionSection({ form }: Props) {
  const superAccess = useWatch({
    control: form.control,
    name: "permissions.superAccess",
  });

  return (
    <>
      {/* 🔐 Full Access */}
      <div
        className="
            flex items-center justify-between
            rounded-xl border
            bg-muted/40
            px-5 py-4
          "
      >
        <div className="space-y-1">
          <p className="text-sm font-medium">Full Access</p>
          <p className="text-xs text-muted-foreground">
            Grants all permissions automatically
          </p>
        </div>

        <PermissionItem form={form} name="permissions.superAccess" label="" />
      </div>

      {/* Divider */}
      {!superAccess && <div className="h-px bg-border" />}

      {/* 🧩 Permission Groups */}
      {!superAccess && (
        // <Card>
        //   <CardContent>
        <div className="space-y-8">
          {PERMISSIONS.map((group) => (
            <section
              key={group.title}
              className="
    rounded-xl border
    bg-muted/30
    p-5
    space-y-4
  "
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold tracking-wide">
                  {group.title}
                </h4>
                <span className="text-xs text-muted-foreground">
                  {group.items.length} permissions
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                {group.items.map((item) => (
                  <PermissionItem
                    key={item.id}
                    form={form}
                    name={`permissions.${item.id}`}
                    label={item.label}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
        //   </CardContent>{" "}
        // </Card>
      )}

      {/* ℹ️ Info message */}
      {superAccess && (
        <div className="rounded-md bg-muted/40 px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Individual permissions are disabled because full access is enabled.
          </p>
        </div>
      )}
    </>
  );
}
