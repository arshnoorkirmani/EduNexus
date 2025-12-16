"use client";
import { toast } from "sonner";
import { StudentForm } from "@/components/custom/form/student/StudentForm";
import { useState } from "react";
import { StudentFormValues } from "@/lib/validators/student.schema";

export default function CreateStudentPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: StudentFormValues) => {
    try {
      setLoading(true);

      // const res = await fetch("/api/students", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(values),
      // });

      // if (!res.ok) {
      //   const error = await res.json();
      //   throw new Error(error.message || "Failed to create student");
      // }
      const timer = setTimeout(() => {}, 1000);
      console.log(data);
      toast.success("Student created successfully");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentForm
      onSubmit={handleSubmit}
      // loading={loading}
    />
  );
}
