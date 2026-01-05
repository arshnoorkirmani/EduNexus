import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { User2 } from "lucide-react";

export interface InstituteDetails {
  name: string;
  institute_code: string;
  address?: string;
  logoUrl?: string;
  signatureLabel?: string;
  phone?: string;
  website?: string;
  idCardLabel?: string;
  owner?: string;
  signature?: string;
}

export interface VerificationDetails {
  website?: string;
  institute_code?: string;
  studentId?: string;
}

export interface StudentIdData {
  name: string;
  rollNO?: string;
  registrationNo?: string;
  program: string;
  validity: string;
  studentId: string;
  dob: string;
  bloodGroup?: string;
  contact: string;
  fatherName?: string;
  address?: string;
  photoUrl?: string;
  medicalInfo?: string;
  institute: InstituteDetails;
  verification?: VerificationDetails;
}
// ================================================================

// export const DEMO_STUDENT: StudentIdData = {
//   name: "Arshnoor Kirmani",
//   rollNO: "2026ADCA0001",
//   registrationNo: "SCC0019/2026/0001",
//   program: "ADCA",
//   validity: "2026-2027",
//   studentId: "SCC0019-0006",
//   dob: "29/05/2007",
//   contact: "9876543210",
//   fatherName: "Mr. Father",
//   address: "Hidayat Nagar, Lakhimpur, Uttar Pradesh, India",
//   photoUrl:
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTfr-VGQmG3nOKJGZ9rviTPOJ4RZb1L3qUGQ&s",
//   institute: {
//     name: "S.K. Computer Center",
//     institute_code: "SCC0019",
//     address: "Block A, Knowledge Park III, Greater Noida",
//     logoUrl: "https://edunexus-1.vercel.app/favicon.ico",
//     phone: "9873264646",
//     website: "www.edunexus.edu",
//     signatureLabel: "Dean of Academics",
//     owner: "Sanjay Kumar",
//     signature:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ35mZ7IoV5RWoVaw4evxl2D4sQxycmxZeC-g&s",
//   },
//   verification: {
//     website: "www.edunexus.edu",
//     institute_code: "SCC0019",
//     studentId: "SCC0019-0006",
//   },
// };
export const DEMO_STUDENT = {
  _id: {
    $oid: "6957480284154f45f40f7e39",
  },
  auth: {
    studentId: "SCC0019-0006",
    password: "$2b$12$jvQdB1C7vcH2V7kYMDyi5uun/EKBVUzZzJI/SxO5zqSpKtiDQK0Zm",
    role: "student",
    verify: {
      isVerified: true,
      isLoginEnabled: true,
    },
    lastLogin: null,
  },
  institute: {
    instituteId: {
      $oid: "69514ec9114a4b23ff136340",
    },
    instituteCode: "SCC0019",
    instituteName: "S.K. Computer Center",
    instituteLogo: null,
  },
  personal: {
    firstName: "Arshnoor",
    lastName: "Kirmani",
    fullName: "Arshnoor Kirmani",
    gender: "male",
    dob: {
      $date: "2007-05-29T18:30:00.000Z",
    },
    mobile: "9876543210",
    email: "try.arshnoorkirmani+student@gmail.com",
    fatherName: "Arshnoor Kirmani",
    motherName: "Arshnoor Kirmani",
    address: {
      fullAddress: "Hidayat nager, Lakhimpur, Uttar Pradesh, 262701, India",
      line: "Hidayat nager",
      city: "Lakhimpur",
      state: "Uttar Pradesh",
      pincode: "262701",
      country: "India",
    },
  },
  academic: {
    registrationNo: "SCC0019/2026/0001",
    rollNo: "2026ADCA0001",
    timing: "00:05",
    admissionDate: {
      $date: "2026-01-02T04:20:48.184Z",
    },
    course: {
      name: "adca",
      groupTitle: "Computer",
      course_code: "ADCA",
      duration: {
        unit: "year",
        value: 1,
      },
      baseFee: 55000,
    },
  },
  documents: [
    {
      type: "10th Marksheet",
      file: {
        name: "10th_Marksheet_3zYZCUiHG",
        url: "https://ik.imagekit.io/edunexus/SK-Computer-Center/students/SCC0019-0006/10th_Marksheet_3zYZCUiHG",
        mimeType: "image/png",
        size: 162027,
      },
      uploadedAt: {
        $date: "2026-01-02T04:22:03.989Z",
      },
      uploadedBy: {
        name: "Arshnoor Kirmani",
        email: "try.arshnoorkirmani+5@gmail.com",
      },
      visibility: "public",
      _id: {
        $oid: "6957480284154f45f40f7e3a",
      },
    },
  ],
  fees: {
    totalFees: 55000,
    paidFees: 20000,
    remainingFees: 35000,
    status: "partial",
    detail: [
      {
        date: {
          $date: "2026-01-02T04:22:23.647Z",
        },
        amount: 20000,
        method: "cash",
        _id: {
          $oid: "6957480284154f45f40f7e3b",
        },
      },
    ],
  },
  permissions: {
    superAccess: true,
    profile: {
      show: true,
      edit: true,
    },
    communication: {
      sendMessage: true,
      inboxMessage: true,
    },
    fees: {
      view: true,
      pay: true,
    },
    document: {
      upload: true,
      download: true,
    },
    result: {
      view: true,
    },
    attendance: {
      view: true,
    },
    assignments: {
      view: true,
    },
    timetable: {
      view: true,
    },
  },
  currentStatus: "active",
  statusHistory: [],
  createdAt: {
    $date: "2026-01-02T04:22:26.519Z",
  },
  updatedAt: {
    $date: "2026-01-02T04:22:26.519Z",
  },
};
// ================================================================
// Standard ID Card Dimensions (Approx CR80 ratio 1.58 - 1.6)
export const CARD_WIDTH = 360;
export const CARD_HEIGHT = 228;

interface StudentIdCardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: StudentIdData;
}

// Helper for consistent image handling
const StudentPhoto = ({
  url,
  uniqueId,
}: {
  url?: string;
  uniqueId?: string;
}) => {
  const finalUrl = url
    ? uniqueId
      ? `${url}?uid=${uniqueId}`
      : url
    : undefined;
  if (finalUrl) {
    return (
      <img
        src={finalUrl}
        alt="Student"
        className="w-full h-full object-cover"
        crossOrigin="anonymous"
      />
    );
  }
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
      <User2 className="w-12 h-12" />
    </div>
  );
};

// Helper for Institute Logo
const InstituteLogo = ({
  url,
  alt,
  uniqueId,
}: {
  url?: string;
  alt: string;
  uniqueId?: string;
}) => {
  const finalUrl = url
    ? uniqueId
      ? `${url}?uid=${uniqueId}`
      : url
    : undefined;
  if (finalUrl) {
    return (
      <img
        src={finalUrl}
        alt={alt}
        className="w-full h-full object-contain"
        crossOrigin="anonymous"
      />
    );
  }
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 font-bold text-xs">
      {alt.charAt(0)}
    </div>
  );
};

// Helper for Institute Signature
const SignatureImage = ({
  url,
  className,
  style,
  uniqueId,
}: {
  url?: string;
  className?: string;
  style?: React.CSSProperties;
  uniqueId?: string;
}) => {
  const finalUrl = url
    ? uniqueId
      ? `${url}?uid=${uniqueId}`
      : url
    : undefined;
  if (finalUrl) {
    return (
      <img
        src={finalUrl}
        alt="Signature"
        className={className}
        style={style}
        crossOrigin="anonymous"
      />
    );
  }
  return null;
};

/* CLASSIC DESIGN - Revised for Data Density                                   */
/* -------------------------------------------------------------------------- */

export const StudentIdClassic = forwardRef<
  HTMLDivElement,
  StudentIdCardProps & { uniqueId?: string }
>(({ data, className, style, uniqueId, ...props }, ref) => {
  return (
    <div
      id={`classic-student-id-card`}
      ref={ref}
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        aspectRatio: `${CARD_WIDTH}/${CARD_HEIGHT}`,
        backgroundColor: "white",
        ...style,
      }}
      className={cn(
        "relative shrink-0 bg-white rounded-xl overflow-hidden select-none border border-slate-300 shadow-sm print:shadow-none print:border-slate-300 text-slate-900 font-sans print:![print-color-adjust:exact] print:[-webkit-print-color-adjust:exact]",
        className
      )}
      role="group"
      aria-label="Student ID Card"
      {...props}
    >
      {/* Header Band */}
      <header className="relative h-[70px] bg-[#1e293b] text-white overflow-hidden print:bg-[#1e293b] print:text-white">
        <div className="absolute inset-0 bg-blue-600/10 print:bg-blue-600/10" />
        {/* Accent Strip */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500 print:bg-yellow-500" />

        <div className="relative z-10 flex items-center h-full px-3.5 pb-1">
          <div className="w-10 h-10 rounded bg-white p-1 shadow-sm shrink-0 mr-3 flex items-center justify-center print:bg-white">
            <InstituteLogo
              url={data.institute.logoUrl}
              alt={data.institute.name}
              uniqueId={uniqueId}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[13px] font-bold tracking-tight leading-none font-serif uppercase truncate">
              {data.institute.name}
            </h1>
            <p className="text-[8px] text-slate-400 mt-0.5 font-medium uppercase tracking-wide">
              Code: {data.institute.institute_code}
            </p>
            <p className="text-[7px] uppercase tracking-[0.1em] text-slate-300 mt-0.5 font-medium truncate w-[220px]">
              {data.institute.address}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative px-4 pt-2.5 pb-2 flex gap-3 h-[calc(100%-70px)] bg-white">
        {/* Left Column: Photo & ID */}
        <div className="flex flex-col w-[85px] shrink-0">
          <div className="w-[85px] h-[102px] bg-slate-200 border border-slate-300 shadow-sm relative overflow-hidden mb-1.5 rounded-[2px]">
            <StudentPhoto url={data.photoUrl} uniqueId={uniqueId} />
          </div>
          <div className="bg-slate-50 border border-slate-200 p-0.5 rounded-sm text-center">
            <span className="block text-[5px] uppercase font-bold text-slate-500 mb-px">
              Student ID
            </span>
            <span className="block text-[7px] font-mono font-bold text-slate-900 leading-none">
              {data.studentId || "N/A"}
            </span>
          </div>
        </div>

        {/* Right Column: Personal Details */}
        <div className="flex-1 flex flex-col min-w-0 pt-0.5">
          {/* Name & Title */}
          <div className="border-b border-slate-100 pb-1.5 mb-1.5">
            <h2 className="text-sm font-bold text-[#0f172a] uppercase leading-none font-serif tracking-tight truncate">
              {data.name}
            </h2>
            {data.fatherName && (
              <p className="text-[7px] text-slate-500 mt-0.5 uppercase font-medium">
                S/o {data.fatherName}
              </p>
            )}
            <div className="flex justify-between pt-1">
              <div className="flex flex-col">
                <span className="text-[6px] text-slate-400 uppercase font-bold">
                  Registration No.
                </span>
                <span className="text-[8px] font-mono font-semibold text-slate-700 leading-tight">
                  {data.registrationNo}
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[6px] text-slate-400 uppercase font-bold">
                  Roll No.
                </span>
                <span className="text-[8px] font-mono font-semibold text-slate-700 leading-tight">
                  {data.rollNO}
                </span>
              </div>
            </div>
          </div>

          {/* Data Grid */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[8px] flex-1">
            <div>
              <p className="text-[6px] uppercase font-bold text-slate-500 tracking-wider mb-px">
                Program
              </p>
              <p className="font-bold text-blue-900 text-[8px] leading-none">
                {data.program}
              </p>
            </div>
            <div>
              <p className="text-[6px] uppercase font-bold text-slate-500 tracking-wider mb-px">
                Valid Until
              </p>
              <p className="font-bold text-red-600 text-[8px] leading-none">
                {data.validity}
              </p>
            </div>
            <div>
              <p className="text-[6px] uppercase font-bold text-slate-500 tracking-wider mb-px">
                Date of Birth
              </p>
              <p className="font-semibold text-slate-700 leading-none">
                {data.dob}
              </p>
            </div>
            <div>
              <p className="text-[6px] uppercase font-bold text-slate-500 tracking-wider mb-px">
                Contact No.
              </p>
              <p className="font-semibold text-slate-700 leading-none">
                {data.contact}
              </p>
            </div>
            <div className="col-span-2 mt-auto">
              <p className="text-[6px] uppercase font-bold text-slate-500 tracking-wider mb-px">
                Address
              </p>
              <p className="text-[7px] font-medium text-slate-600 leading-tight truncate w-full">
                {data.address}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Signature Absolute */}
      <div className="absolute bottom-2 right-4 flex flex-col items-center">
        <div className="w-14 h-[1px] bg-slate-300 mt-0.5 mb-px" />
        <p className="text-[5px] uppercase font-bold text-slate-400 tracking-widest">
          {data.institute.signatureLabel || "Authority"}
        </p>
      </div>
    </div>
  );
});

StudentIdClassic.displayName = "StudentIdClassic";

/* -------------------------------------------------------------------------- */
/* MODERN DESIGN - Revised for Data Density                                    */
/* -------------------------------------------------------------------------- */
export const StudentIdModern = forwardRef<
  HTMLDivElement,
  StudentIdCardProps & { uniqueId?: string }
>(({ data, className, style, uniqueId, ...props }, ref) => {
  return (
    <div
      id={`modern-student-id-card`}
      ref={ref}
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        aspectRatio: `${CARD_WIDTH}/${CARD_HEIGHT}`,
        backgroundColor: "#0f172a", // slate-900
        ...style,
      }}
      className={cn(
        "relative shrink-0 bg-slate-900 rounded-2xl shadow-xl overflow-hidden select-none print:shadow-none text-white border border-slate-800 mx-auto print:![print-color-adjust:exact] print:[-webkit-print-color-adjust:exact]",
        className
      )}
      {...props}
    >
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-indigo-950 to-slate-900 print:bg-slate-900"></div>
      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent print:hidden"></div>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none print:hidden" />

      {/* Content Container */}
      <div className="absolute inset-0 z-10 flex flex-col p-4 print:p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center p-1.5 shadow-lg shrink-0 print:border-slate-600">
            <InstituteLogo
              url={data.institute.logoUrl}
              alt={data.institute.name}
              uniqueId={uniqueId}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-xs tracking-wide leading-tight text-white/95 uppercase truncate print:text-white">
              {data.institute.name}
            </h3>
            <p className="text-[7px] text-white/50 font-medium tracking-wider mt-0.5 print:text-slate-300">
              Code: {data.institute.institute_code}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="flex gap-2 gap-y-1 flex-1 min-h-0">
          {/* Photo */}
          <div className="flex flex-col gap-1.5 shrink-0">
            <div className="w-[84px] h-[100px] rounded-lg p-[2px] bg-gradient-to-br from-white/30 to-white/5 shadow-lg print:border print:border-slate-700">
              <div className="w-full h-full rounded-[6px] overflow-hidden bg-slate-800 print:bg-slate-800">
                <StudentPhoto url={data.photoUrl} uniqueId={uniqueId} />
              </div>
            </div>
            <div className="text-center w-[84px]">
              <p className="text-[6px] text-white/40 uppercase font-bold tracking-widest">
                Student ID
              </p>
              <p className="text-[8px] font-mono font-bold text-white tracking-widest mt-px drop-shadow-sm truncate">
                {data.studentId}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 pt-0.5">
            <h2 className="text-lg font-bold leading-none tracking-tight text-white mb-1 truncate drop-shadow-md">
              {data.name}
            </h2>
            <p className="text-[8px] text-indigo-200 font-medium uppercase tracking-wide mb-0 truncate">
              {data.program}
              {data.fatherName && (
                <span className="text-white/60 ml-1">
                  • S/o {data.fatherName}
                </span>
              )}
            </p>

            {/* Grid */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-2 mt-1">
              <div className="col-span-2 flex justify-between border-b border-white/10 pb-1 mb-0.5 mt-0.5">
                <div className=" flex flex-col gap-0.5">
                  <span className="text-[6px] text-white/40 uppercase font-bold">
                    Reg. No.
                  </span>
                  <span className="block font-mono text-[8px] text-white/90">
                    {data.registrationNo}
                  </span>
                </div>
                <div className="text-right flex flex-col gap-0.5">
                  <span className="text-[6px] text-white/40 uppercase font-bold">
                    Roll No.
                  </span>
                  <span className="block font-mono text-[8px] text-white/90">
                    {data.rollNO}
                  </span>
                </div>
              </div>

              <div>
                <span className="block text-[6px] text-white/40 uppercase font-bold">
                  Date of Birth
                </span>
                <span className="block text-[8px] text-white/90 font-medium">
                  {data.dob}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-[6px] text-white/40 uppercase font-bold">
                  Valid Until
                </span>
                <span className="block text-[8px] text-emerald-400 font-bold">
                  {data.validity}
                </span>
              </div>
              <div className="col-span-1">
                <span className="block text-[6px] text-white/40 uppercase font-bold">
                  Contact No.
                </span>
                <span className="block text-[8px] text-white/90 font-medium tracking-wide">
                  {data.contact}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Signature */}
        <div className="absolute bottom-2 right-4 flex flex-col items-end">
          <span className="text-[5px] text-white/40 uppercase font-bold mt-0.5 tracking-wider border-t border-white/10 pt-0.5 w-20 text-center">
            Authorized Signature
          </span>
        </div>
      </div>
    </div>
  );
});

StudentIdModern.displayName = "StudentIdModern";

/* -------------------------------------------------------------------------- */
/* MINIMAL DESIGN - Clean & Typography Focused                                */
/* -------------------------------------------------------------------------- */
export const StudentIdMinimal = forwardRef<
  HTMLDivElement,
  StudentIdCardProps & { uniqueId?: string }
>(({ data, className, style, uniqueId, ...props }, ref) => {
  return (
    <div
      id={`minimal-student-id-card`}
      ref={ref}
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        aspectRatio: `${CARD_WIDTH}/${CARD_HEIGHT}`,
        backgroundColor: "white",
        ...style,
      }}
      className={cn(
        "relative shrink-0 bg-white rounded-xl shadow-md overflow-hidden select-none print:shadow-none flex flex-col border border-slate-200 mx-auto",
        className
      )}
      {...props}
    >
      <div className="flex flex-1 p-5 gap-5 min-h-0 bg-white">
        {/* Left: Photo & ID */}
        <div className="flex flex-col gap-2.5 w-[90px] shrink-0">
          <div className="w-full h-[110px] bg-slate-50 relative overflow-hidden rounded-sm grayscale-[0.1] border border-slate-100">
            <StudentPhoto url={data.photoUrl} uniqueId={uniqueId} />
          </div>
          <div className="text-center border-1">
            <p className="text-[6px] uppercase font-bold text-slate-400 tracking-wider">
              Student ID
            </p>
            <p className="text-[9px] font-mono font-bold text-slate-900 mt-px">
              {data.studentId}
            </p>
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header Info */}
          <div className="border-b border-slate-100 pb-2.5 mb-2.5 flex justify-between items-start">
            <div className="flex-1 min-w-0 pr-2">
              <h2 className="text-lg font-bold text-slate-900 leading-tight truncate">
                {data.name}
              </h2>
              <p className="text-[9px] uppercase font-medium text-slate-500 mt-1 truncate">
                {data.program}
              </p>
            </div>
            <div className="w-7 h-7 opacity-80 shrink-0 grayscale hover:grayscale-0 transition-all">
              <InstituteLogo
                url={data.institute.logoUrl}
                alt={data.institute.name}
                uniqueId={uniqueId}
              />
            </div>
          </div>

          {/* Key Values */}
          <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 text-[9px] flex-1 content-start">
            <div>
              <span className="block text-[6px] uppercase font-bold text-slate-400 tracking-wide mb-px">
                Roll No.
              </span>
              <span className="font-mono font-medium text-slate-700 block truncate">
                {data.rollNO}
              </span>
            </div>
            <div>
              <span className="block text-[6px] uppercase font-bold text-slate-400 tracking-wide mb-px">
                Reg. No.
              </span>
              <span className="font-mono font-medium text-slate-700 block truncate">
                {data.registrationNo}
              </span>
            </div>
            <div>
              <span className="block text-[6px] uppercase font-bold text-slate-400 tracking-wide mb-px">
                Date of Birth
              </span>
              <span className="font-medium text-slate-700">{data.dob}</span>
            </div>
            <div>
              <span className="block text-[6px] uppercase font-bold text-slate-400 tracking-wide mb-px">
                Valid Until
              </span>
              <span className="font-medium text-slate-900">
                {data.validity}
              </span>
            </div>
            <div className="col-span-2 mt-1">
              <span className="block text-[6px] uppercase font-bold text-slate-400 tracking-wide mb-px">
                Address
              </span>
              <span className="font-medium text-slate-600 truncate block w-full text-[8px]">
                {data.address}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Strip */}
      <div className="bg-slate-50 h-[30px] px-5 flex justify-between items-center border-t border-slate-100 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1 h-3 bg-slate-800 rounded-full" />
          <span className="text-[8px] font-bold text-slate-700 uppercase tracking-wide truncate max-w-[180px]">
            {data.institute.name}
          </span>
        </div>
      </div>
    </div>
  );
});

StudentIdMinimal.displayName = "StudentIdMinimal";
