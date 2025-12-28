import AddStudentPage from "@/components/custom/form/student/StudentForm";
import Image from "next/image";
import React from "react";

export default function page() {
  return (
    <div className="max-w-5xl mx-auto py-4">
      <Image
        src="https://ik.imagekit.io/edunexus/students/STU201759/10th_Marksheet_z3kYAwYPXf"
        alt="Placeholder"
        width={100}
        height={100}
        className="rounded-lg"
      />
    </div>
  );
}
