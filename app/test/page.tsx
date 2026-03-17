"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import StudentIdDialog from "@/components/custom/id-card/StudentIdDialog";
import { User2, CreditCard, CheckCircle } from "lucide-react";
import { DEMO_STUDENT as Student } from "@/components/custom/id-card/StudentIdCard";

export default function TestPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeenCard, setHasSeenCard] = useState(false);

  const DEMO_STUDENT = useMemo(() => {
    const currentYear = new Date(
      Student.academic.admissionDate.$date
    ).getFullYear();
    const duration =
      currentYear +
      (Student.academic.course.duration.unit === "year"
        ? Number(Student.academic.course.duration.value)
        : 1);
    const Dob = new Date(Student.personal.dob.$date).toLocaleDateString();
    const validity = `${currentYear}-${duration}`;

    return {
      name: Student.personal.fullName,
      rollNO: Student.academic.rollNo,
      registrationNo: Student.academic.registrationNo,
      program: Student.academic.course.name,
      validity: validity,
      studentId: Student.auth.studentId,
      dob: Dob,
      contact: Student.personal.mobile,
      fatherName: Student.personal.fatherName,
      address: Student.personal.address.fullAddress,
      photoUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTfr-VGQmG3nOKJGZ9rviTPOJ4RZb1L3qUGQ&s",
      institute: {
        name: Student.institute.instituteName,
        institute_code: Student.institute.instituteCode,
        logoUrl: (Student.institute.instituteLogo as string | null) || "",
      },
      verification: {
        institute_code: Student.institute.instituteCode,
        studentId: Student.auth?.studentId || "",
      },
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 sm:p-10 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-10 h-10 text-blue-600" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            ID Card Generator
          </h1>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            Preview and export student ID cards in multiple professional
            layouts.
          </p>
        </div>

        {hasSeenCard && !isOpen ? (
          <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100 text-center animate-in fade-in duration-300">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-emerald-900 mb-1">
              Student Selected
            </h3>
            <p className="text-sm text-emerald-600">
              The ID card was successfully previewed. You can open it again below.
            </p>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-left">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Current Student
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 overflow-hidden shrink-0">
                {DEMO_STUDENT.photoUrl ? (
                  <img
                    src={DEMO_STUDENT.photoUrl}
                    alt={DEMO_STUDENT.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <User2 className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 truncate">
                  {DEMO_STUDENT.name}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {DEMO_STUDENT.rollNO}
                </div>
              </div>
            </div>
          </div>
        )}

        <Button
          size="lg"
          onClick={() => setIsOpen(true)}
          className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 font-semibold h-12"
        >
          {hasSeenCard ? "Reopen ID Card" : "Generate ID Card"}
        </Button>
      </div>

      <StudentIdDialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setHasSeenCard(true);
        }}
        student={DEMO_STUDENT}
        defaultDesign="modern"
        onEdit={() => {
          alert(`Triggering external Edit flow for ${DEMO_STUDENT.name}`);
        }}
      />
    </div>
  );
}
