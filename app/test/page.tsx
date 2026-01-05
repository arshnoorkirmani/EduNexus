// "use client";

// import { useMemo, useState } from "react";
// import { Button } from "@/components/ui/button";
// import StudentIdDialog from "@/components/custom/id-card/StudentIdDialog";
// import { User2, CreditCard } from "lucide-react";
// import { DEMO_STUDENT as Student } from "@/components/custom/id-card/StudentIdCard";

// export default function TestPage() {
//   const [isOpen, setIsOpen] = useState(false);
//   const currentYear = new Date(
//     Student.academic.admissionDate.$date
//   ).getFullYear();
//   const duration = new Date(
//     currentYear +
//       (Student.academic.course.duration.unit == "year"
//         ? Student.academic.course.duration.value
//         : 1)
//   ).getFullYear();
//   const Dob = new Date(Student.personal.dob.$date).toLocaleDateString();
//   const validity = `${currentYear}-${duration}`;
//   const DEMO_STUDENT = useMemo(() => {
//     const studentData = {
//       name: Student.personal.fullName,
//       rollNO: Student.academic.rollNo,
//       registrationNo: Student.academic.registrationNo,
//       program: Student.academic.course.name,
//       validity: validity,
//       studentId: Student.auth.studentId,
//       dob: Dob,
//       contact: Student.personal.mobile,
//       fatherName: Student.personal.fatherName,
//       address: Student.personal.address.fullAddress,
//       photoUrl:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTfr-VGQmG3nOKJGZ9rviTPOJ4RZb1L3qUGQ&s",
//       institute: {
//         name: Student.institute.instituteName,
//         institute_code: Student.institute.instituteCode,
//         address: Student.institute?.address || "",
//         logoUrl: Student.institute?.logoUrl || "",
//         phone: Student.institute?.phone || "",
//         website: Student.institute?.website || "",
//         signatureLabel: Student.institute?.signatureLabel || "",
//         owner: Student.institute?.owner || "",
//         signature: Student.institute?.signature || "",
//       },
//       verification: {
//         website: Student.institute?.website || "",
//         institute_code: Student.institute?.instituteCode || "",
//         studentId: Student.auth?.studentId || "",
//       },
//     };
//     return studentData;
//   }, []);
//   return (
//     <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 sm:p-10 font-sans">
//       <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center space-y-6">
//         <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
//           <CreditCard className="w-10 h-10 text-blue-600" />
//         </div>

//         <div>
//           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
//             ID Card Generator
//           </h1>
//           <p className="text-slate-500 mt-2 text-sm leading-relaxed">
//             Preview and export student ID cards in multiple professional
//             layouts.
//           </p>
//         </div>

//         <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-left">
//           <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
//             Current Student
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full bg-white border border-slate-200 overflow-hidden shrink-0">
//               {DEMO_STUDENT.photoUrl ? (
//                 <img
//                   src={DEMO_STUDENT.photoUrl}
//                   alt={DEMO_STUDENT.name}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center text-slate-300">
//                   <User2 className="w-5 h-5" />
//                 </div>
//               )}
//             </div>
//             <div className="min-w-0">
//               <div className="font-semibold text-slate-900 truncate">
//                 {DEMO_STUDENT.name}
//               </div>
//               <div className="text-xs text-slate-500 truncate">
//                 {DEMO_STUDENT.rollNO}
//               </div>
//             </div>
//           </div>
//         </div>

//         <Button
//           size="lg"
//           onClick={() => setIsOpen(true)}
//           className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 font-semibold h-12"
//         >
//           Open Generator
//         </Button>
//       </div>

//       <StudentIdDialog
//         open={isOpen}
//         onOpenChange={setIsOpen}
//         student={DEMO_STUDENT}
//         defaultDesign="modern"
//       />
//     </div>
//   );
// }
import React from "react";

function page() {
  return <div>page</div>;
}

export default page;
