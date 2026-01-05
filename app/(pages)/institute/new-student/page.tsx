"use client";

import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import HeaderContainer from "@/components/custom/user-pages/header/HeaderContainer";
import {
  StudentFormData,
  studentFormSchema,
} from "@/lib/validators/institute/add-student.validator";
import { AppFormProvider } from "@/components/custom/form/FormContext";
import { FormActions } from "@/components/custom/form/student/StudentFormActions";
import StudentForm from "@/components/custom/form/student/StudentForm";

export default function AddStudentPage() {
  const form = useForm<StudentFormData>({
    // Cast resolver to the form data type to avoid the optional/required boolean mismatch
    resolver: zodResolver(
      studentFormSchema
    ) as unknown as Resolver<StudentFormData>,
    defaultValues: {
      auth: {
        studentId: "",
        password: "",
        role: "student",
        // Ensure verify booleans are present and typed correctly
        verify: {
          isVerified: true,
          isLoginEnabled: true,
        },
      },
      institute: {
        instituteCode: "",
        instituteName: "",
        address: "",
        ownerName: "",
      },
      personal: {
        firstName: "",
        lastName: "",
        fullName: "",
        gender: "male",
        dob: new Date(),
        mobile: "",
        email: "",
        fatherName: "",
        motherName: "",
        address: {
          fullAddress: "",
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
        timing: "",
        admissionDate: new Date(),
        course: {
          name: "",
          groupTitle: "",
          course_code: "",
          baseFee: 0,
        },
      },
      permissions: {
        superAccess: true,
        profile: { show: true, edit: true },
        communication: { sendMessage: true, inboxMessage: true },
        fees: { view: true, pay: true },
        document: { upload: true, download: true },
        result: { view: true },
        attendance: { view: true },
        assignments: { view: true },
        timetable: { view: true },
      },
      fees: {
        totalFees: 0,
        paidFees: 0,
        remainingFees: 0,
        status: "pending",
      },
      // Optional: include documents default to avoid undefined checks elsewhere
      documents: [],
    },
  });
  return (
    <AppFormProvider<StudentFormData> form={form} formId="add-student-form">
      <HeaderContainer
        title="Add New Student"
        description="Create and configure a new student profile."
        actions={
          <FormActions<StudentFormData>
            submitLabel="Create Student"
            resetTitle="Discard changes?"
            resetDescription="All unsaved changes will be lost."
          />
        }
      >
        <StudentForm />
      </HeaderContainer>
    </AppFormProvider>
  );
}
