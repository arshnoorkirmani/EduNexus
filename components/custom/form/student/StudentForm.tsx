"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { apiClient } from "@/helper/ApiClient";

import { useAppForm } from "../FormContext";
import { useAuth } from "@/hooks/useAuth";
import { FormActions } from "./StudentFormActions";

import { Form } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
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

import { StudentFormData } from "@/lib/validators/institute/add-student.validator";
import { DocumentUploadCard } from "@/components/custom/form/student/DoucmentUploadCard";
import { cn } from "@/lib/utils";
import { studentService } from "@/config/Student.service";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchInstituteCourses } from "@/store/thunks/institute.thunks";
import { promiseToast } from "../../utils/Toast";
import PrintandImagePopup from "../../utils/printandImagePopup";
const dobToPassword = (dob: string | Date) => {
  const date = new Date(dob);
  if (isNaN(date.getTime())) return "";

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${dd}${mm}${yyyy}`;
};

export default function AddStudentPage() {
  const [isStudentIdLoading, setIsStudentIdLoading] = useState(true);
  const [isRegistrationNoLoading, setIsRegistrationNoLoading] = useState(true);
  const [isRollNoLoading, setIsRollNoLoading] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [courseLoading, setCourseLoading] = useState(true);
  const { form, formId, setIsLoading, isLoading } =
    useAppForm<StudentFormData>();
  const hasGeneratedRef = useRef(false);
  const dispatch = useAppDispatch();
  const institute = useAppSelector((state) => state.institute);
  const { user } = useAuth();
  /* ================================================= */
  /* ================= DERIVED STATE ================= */
  /* ================================================= */
  const DOB = useWatch({
    control: form.control,
    name: "personal.dob",
  });

  //First Name and Last Name Watch
  const [firstName, lastName] = useWatch({
    control: form.control,
    name: ["personal.firstName", "personal.lastName"],
  });

  //Address Watch
  const [
    addressLine,
    addressCity,
    addressState,
    addressPincode,
    addressCountry,
  ] = useWatch({
    control: form.control,
    name: [
      "personal.address.line",
      "personal.address.city",
      "personal.address.state",
      "personal.address.pincode",
      "personal.address.country",
    ],
  });

  //Fees Watch
  const [totalFees, paidFees] = useWatch({
    control: form.control,
    name: ["fees.totalFees", "fees.paidFees"],
  });
  //Course Watch
  const course = useWatch({
    control: form.control,
    name: "academic.course",
  });
  //FullName Memo
  const fullName = useMemo(
    () => [firstName, lastName].filter(Boolean).join(" "),
    [firstName, lastName]
  );

  /* ================= EFFECTS ================= */
  // Password accoding to DOB
  useEffect(() => {
    if (!DOB) return;
    const password = dobToPassword(DOB);
    form.setValue("auth.password", password, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [DOB, form]);

  useEffect(() => {
    if (institute.loading) return;
    const code = institute.information.institute_code;

    if (!code) return;

    setCourseLoading(true);
    dispatch(fetchInstituteCourses({ params: { institute_code: code } }))
      .unwrap()
      .then((res) => {
        // Transform and Group Courses
        const grouped = res.reduce((acc: any[], item: any) => {
          let group = acc.find((g) => g.title === item.category);

          const option = {
            label: `${item.course_name} (${item.course_code})`,
            value: item.course_code.toLowerCase(), // This acts as the selection ID

            // Extra data for form population
            duration: {
              unit: item.duration?.unit,
              value: item.duration?.value,
            },
            courseName: item.course_name,
            course_code: item.course_code,
            groupTitle: item.category,
            baseFee: item.fees?.total || 0,
            level: item.duration?.unit === "year" ? "degree" : "skill",
          };

          if (group) {
            group.options.push(option);
          } else {
            acc.push({
              title: item.category,
              options: [option],
            });
          }

          return acc;
        }, []);

        setCourses(grouped);
      })
      .catch((err) => {
        console.error("Failed to fetch courses:", err);
        promiseToast(Promise.reject(err), {
          loading: "Fetching courses...",
          success: "Courses loaded",
          error: "Failed to load courses",
        });
      })
      .finally(() => {
        setCourseLoading(false);
      });
  }, [institute.loading, institute.information.institute_code, dispatch]);

  // Watch for Course Selection Changes
  const selectedCourseValue = useWatch({
    control: form.control,
    name: "academic.course.name",
  });

  useEffect(() => {
    if (institute.academics.loading) return;
    if (!selectedCourseValue || courses.length === 0) return;

    // Flatten options to find the selected one
    const allOptions = courses.flatMap((g) => g.options);
    const selectedOption = allOptions.find(
      (opt) => opt.value === selectedCourseValue
    );
    (async () => {
      if (!institute.information.institute_code) return;
      setIsRollNoLoading(true);
      const rollNo = await studentService
        .generateRollNo(
          institute.information.institute_code,
          selectedOption.course_code
        )
        .finally(() => {
          setIsRollNoLoading(false);
        });
      form.setValue("academic.rollNo", rollNo ? rollNo : "");
    })();
    if (selectedOption) {
      // 1. Populate full course details
      form.setValue("academic.course.course_code", selectedOption.course_code);
      form.setValue("academic.course.groupTitle", selectedOption.groupTitle);
      // Duration
      form.setValue("academic.course.duration", selectedOption.duration);
      // Fees
      form.setValue("academic.course.baseFee", selectedOption.baseFee);
      form.setValue("fees.totalFees", selectedOption.baseFee);
      form.setValue("fees.remainingFees", selectedOption.baseFee);
      form.setValue("fees.paidFees", 0);
      form.setValue("fees.status", "pending");
    }
  }, [selectedCourseValue, courses, form]);

  //FullName Effect
  useEffect(() => {
    form.setValue("personal.fullName", fullName, { shouldDirty: false });
  }, [fullName, form]);
  //Auto Generate Student ID and Registration No
  useEffect(() => {
    if (institute.loading) return;

    if (!user?.institute_code) return;
    if (hasGeneratedRef.current) return;

    const generate = async () => {
      try {
        setIsStudentIdLoading(true);
        setIsRegistrationNoLoading(true);
        const [studentId, registrationNo] = await Promise.all([
          studentService.generateStudentId(user.institute_code).finally(() => {
            setIsStudentIdLoading(false);
          }),
          studentService
            .generateRegistrationNo(user.institute_code)
            .finally(() => {
              setIsRegistrationNoLoading(false);
            }),
        ]);
        console.log("studentId", studentId);
        console.log("registrationNo", registrationNo);
        if (studentId) {
          console.log("studentId", studentId);
          form.setValue("auth.studentId", studentId, { shouldDirty: false });
        }

        if (registrationNo) {
          console.log("registrationNo", registrationNo);
          form.setValue("academic.registrationNo", registrationNo, {
            shouldDirty: false,
          });
        }

        form.setValue(
          "institute.instituteCode",
          institute?.information?.institute_code ?? "",
          {
            shouldDirty: false,
          }
        );
        form.setValue("institute.instituteName", institute?.username ?? "", {
          shouldDirty: false,
        });
        form.setValue(
          "institute.address",
          institute?.information.address ?? "",
          {
            shouldDirty: false,
          }
        );
        form.setValue(
          "institute.instituteName",
          institute?.information.institute_name ?? "",
          {
            shouldDirty: false,
          }
        );

        hasGeneratedRef.current = true;
      } catch (error) {
        console.error("Auto-generate failed:", error);
      }
    };

    generate();
  }, [institute.loading]);
  // Full Address
  useEffect(() => {
    const fullAddress = [
      addressLine,
      addressCity,
      addressState,
      addressPincode,
      addressCountry,
    ]
      .filter(Boolean)
      .join(", ");

    form.setValue("personal.address.fullAddress", fullAddress, {
      shouldDirty: false,
    });
  }, [
    addressLine,
    addressCity,
    addressState,
    addressPincode,
    addressCountry,
    form,
  ]);

  // Fees Calculation
  useEffect(() => {
    const total = Number(totalFees) || 0;
    const paid = Math.min(Number(paidFees) || 0, total);
    const remaining = total - paid;

    form.setValue("fees.remainingFees", remaining, { shouldDirty: false });
    form.setValue(
      "fees.status",
      remaining === 0 ? "paid" : paid > 0 ? "partial" : "pending",
      { shouldDirty: false }
    );
  }, [totalFees, paidFees, form]);

  const onSubmit = async (data: StudentFormData) => {
    const documents = data.documents || [];

    const payload = {
      ...data,
      documents,
    };

    const code = institute.information.institute_code;
    if (!code) return;

    setIsLoading(true);
    console.log("Student Payload", payload);
    // Call service
    const request = await studentService.createStudent(code, payload);
    console.log("Student Request", request);
    try {
      // Optional: Redirect or reset form here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error("Form Validation Errors:", errors);
          promiseToast(Promise.reject("Validation Failed"), {
            loading: "Validating...",
            success: "",
            error: "Please check the form for errors",
          });
        })}
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
            disabled
            loading={isStudentIdLoading}
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
            disabled
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
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoading}
                >
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
          cols={5}
          description="Residential address details used for correspondence, verification, and institutional records."
        >
          {" "}
          <Field
            form={form}
            name="personal.address.line"
            label="Line"
            placeholder="Line"
            parentClassName="col-span-4 sm:col-span-2 lg:col-span-1"
          />
          <Field
            form={form}
            name="personal.address.city"
            label="City"
            placeholder="City"
            parentClassName="col-span-4 sm:col-span-2 lg:col-span-1"
          />{" "}
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
            parentClassName="col-span-5"
            disabled
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
            disabled
            loading={isRegistrationNoLoading}
          />
          <Field
            form={form}
            name="academic.rollNo"
            label="Roll No"
            placeholder="Auto-generated roll number (according to course)"
            disabled
            loading={isRollNoLoading}
          />

          <SearchableSelectField
            form={form}
            name="academic.course.name"
            label="Course"
            placeholder="Select course"
            groups={courses}
            loading={courseLoading}
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
          title="Account Verification"
          cols={2}
          description="Manage student verification status and portal access permissions."
        >
          <PermissionItem
            form={form}
            label="Verified Student"
            name="auth.verify.isVerified"
            description="Mark this student as verified by the institute."
          />

          <PermissionItem
            form={form}
            label="Login Access"
            name="auth.verify.isLoginEnabled"
            description="Allow the student to log in to the portal."
          />
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
    5: "sm:grid-cols-2 md:grid-cols-5",
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
        {/* <PrintandImagePopup
          title="Student Id Card"
          description="Print and Downlode Student Id Card"
          open={true}
        /> */}
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
type StudentPermissionPath =
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
export const StudentPermission = [
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
  description?: string;
};

function PermissionItem({
  form,
  name,
  label,
  description,
}: PermissionItemProps) {
  const { isLoading } = useAppForm<StudentFormData>();
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
                {description || `Allow student to ${label.toLowerCase()}`}
              </p>
            </FormLabel>

            {/* Switch */}
            <FormControl>
              <Switch
                id={switchId}
                disabled={isLoading}
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
          {StudentPermission.map((group) => (
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
