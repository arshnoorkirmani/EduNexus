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
        password: "12345678",
        role: "student",
        // Ensure verify booleans are present and typed correctly
        verify: {
          isVerified: false,
          isLoginEnabled: false,
        },
      },
      institute: {
        instituteId: "INST001",
        instituteCode: "IMS",
        instituteName: "Institute Management System",
      },
      personal: {
        firstName: "Arshnoor ",
        lastName: "Kirmani",
        fullName: "",
        gender: "male",
        dob: new Date(),
        mobile: "7236044212",
        email: "try.arshnoorkirmani@gmail.com",
        fatherName: "Father Name",
        motherName: "Mother Name",
        address: {
          fullAddress: "",
          line: "12, XYZ Street",
          city: "Lakhimpur-Kheri",
          state: "Uttar Pradesh",
          pincode: "234567",
          country: "India",
        },
      },
      academic: {
        registrationNo: "12345678",
        rollNo: "HS-1234",
        timing: "09:30",
        admissionDate: new Date(),
        course: { name: "BCA", courseTitle: "bca" },
      },
      permissions: {
        superAccess: false,
        profile: { show: true, edit: true },
        communication: { sendMessage: false, inboxMessage: false },
        fees: { view: true, pay: false },
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
    <AppFormProvider<StudentFormData> form={form}>
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
