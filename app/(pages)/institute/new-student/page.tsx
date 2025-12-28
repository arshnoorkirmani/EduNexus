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
        studentId: "SCC0019-0070",
        password: "12345678",
        role: "student",
        // Ensure verify booleans are present and typed correctly
        verify: {
          isVerified: false,
          isLoginEnabled: false,
        },
      },
      institute: {
        instituteId: "SCC0019-0070",
        instituteCode: "SCC0019-0070",
        instituteName: "S.K. Jansewa Kendra",
      },
      personal: {
        firstName: "Arshnoor",
        lastName: "Singh",
        fullName: "Arshnoor Singh",
        gender: "male",
        dob: new Date(),
        mobile: "+919876543210",
        email: "arshnoor.singh@example.com",
        fatherName: "John Doe",
        motherName: "Jane Doe",
        address: {
          fullAddress: "123 Main St, Anytown, USA",
          line: "123 Main St",
          city: "Anytown",
          state: "Anytown",
          pincode: "123456",
          country: "USA",
        },
      },
      academic: {
        registrationNo: "SCC0019-0070",
        rollNo: "SCC0019-0070",
        timing: "09:00",
        admissionDate: new Date(),
        course: { name: "B.Sc Physics", course_code: "BSC_PHY" },
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
