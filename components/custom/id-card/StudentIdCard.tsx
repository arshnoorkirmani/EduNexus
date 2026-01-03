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

// Standard ID Card Dimensions (Approx CR80 ratio 1.58 - 1.6)
export const CARD_WIDTH = 360;
export const CARD_HEIGHT = 228;

interface StudentIdCardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: StudentIdData;
}

// Helper for consistent image handling
const StudentPhoto = ({ url }: { url?: string }) => {
  if (url) {
    return (
      <img
        src={url}
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
const InstituteLogo = ({ url, alt }: { url?: string; alt: string }) => {
  if (url) {
    return (
      <img
        src={url}
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

/* CLASSIC DESIGN - Revised for Data Density                                   */
/* -------------------------------------------------------------------------- */

export const StudentIdClassic = forwardRef<HTMLDivElement, StudentIdCardProps>(
  ({ data, className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          aspectRatio: `${CARD_WIDTH}/${CARD_HEIGHT}`,
          ...style,
        }}
        className={cn(
          "relative flex-shrink-0 bg-white rounded-xl overflow-hidden select-none border border-slate-300 shadow-sm print:shadow-none print:border-slate-300 text-slate-900 font-sans mx-auto",
          className
        )}
        role="group"
        aria-label="Student ID Card"
        {...props}
      >
        {/* Header Band */}
        <header className="relative h-[70px] bg-[#1e293b] text-white overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/10" />
          {/* Accent Strip */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500" />

          <div className="relative z-10 flex items-center h-full px-3.5 pb-1">
            <div className="w-10 h-10 rounded bg-white p-1 shadow-sm shrink-0 mr-3 flex items-center justify-center">
              <InstituteLogo
                url={data.institute.logoUrl}
                alt={data.institute.name}
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
        <main className="relative px-4 pt-2.5 pb-2 flex gap-3 h-[calc(100%-70px)]">
          {/* Left Column: Photo & ID */}
          <div className="flex flex-col w-[85px] shrink-0">
            <div className="w-[85px] h-[102px] bg-slate-200 border border-slate-300 shadow-sm relative overflow-hidden mb-1.5 rounded-[2px]">
              <StudentPhoto url={data.photoUrl} />
            </div>
            <div className="bg-slate-50 border border-slate-200 p-0.5 rounded-sm text-center">
              <span className="block text-[5px] uppercase font-bold text-slate-500 mb-px">
                Student Id
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
                  S/O {data.fatherName}
                </p>
              )}
              <div className="flex justify-between pt-1">
                <div className="flex flex-col">
                  <span className="text-[6px] text-slate-400 uppercase font-bold">
                    Registration No
                  </span>
                  <span className="text-[8px] font-mono font-semibold text-slate-700 leading-tight">
                    {data.registrationNo}
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[6px] text-slate-400 uppercase font-bold">
                    Roll No
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
                  DOB
                </p>
                <p className="font-semibold text-slate-700 leading-none">
                  {data.dob}
                </p>
              </div>
              <div>
                <p className="text-[6px] uppercase font-bold text-slate-500 tracking-wider mb-px">
                  Contact
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
          <div
            className="font-[cursive] text-sm text-blue-900 leading-none -rotate-2 opacity-80"
            style={{ fontFamily: "Brush Script MT, cursive" }}
          >
            {data.institute.signature && (
              <img
                src={data.institute.signature}
                alt=""
                className="h-6 w-auto object-cover"
              />
            )}
          </div>
          <div className="w-14 h-[1px] bg-slate-300 mt-0.5 mb-px" />
          <p className="text-[5px] uppercase font-bold text-slate-400 tracking-widest">
            {data.institute.signatureLabel || "Authority"}
          </p>
        </div>
      </div>
    );
  }
);

StudentIdClassic.displayName = "StudentIdClassic";

/* -------------------------------------------------------------------------- */
/* MODERN DESIGN - Revised for Data Density                                    */
/* -------------------------------------------------------------------------- */
export const StudentIdModern = forwardRef<HTMLDivElement, StudentIdCardProps>(
  ({ data, className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          aspectRatio: `${CARD_WIDTH}/${CARD_HEIGHT}`,
          ...style,
        }}
        className={cn(
          "relative flex-shrink-0 bg-slate-900 rounded-2xl shadow-xl overflow-hidden select-none print:shadow-none text-white border border-slate-800 mx-auto",
          className
        )}
        {...props}
      >
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-indigo-950 to-slate-900"></div>
        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Content Container */}
        <div className="absolute inset-0 z-10 flex flex-col p-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center p-1.5 shadow-lg shrink-0">
              <InstituteLogo
                url={data.institute.logoUrl}
                alt={data.institute.name}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xs tracking-wide leading-tight text-white/95 uppercase truncate">
                {data.institute.name}
              </h3>
              <p className="text-[7px] text-white/50 font-medium tracking-wider mt-0.5">
                Code: {data.institute.institute_code}
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="flex gap-2 gap-y-1 flex-1 min-h-0">
            {/* Photo */}
            <div className="flex flex-col gap-1.5 shrink-0">
              <div className="w-[84px] h-[100px] rounded-lg p-[2px] bg-gradient-to-br from-white/30 to-white/5 shadow-lg">
                <div className="w-full h-full rounded-[6px] overflow-hidden bg-slate-800">
                  <StudentPhoto url={data.photoUrl} />
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
              {/* Grid */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-2 mt-1">
                <div className="col-span-2 flex justify-between border-b border-white/10 pb-1 mb-0.5 mt-0.5">
                  <div className=" flex flex-col gap-0.5">
                    <span className="text-[6px] text-white/40 uppercase font-bold">
                      Reg No
                    </span>
                    <span className="block font-mono text-[8px] text-white/90">
                      {data.registrationNo}
                    </span>
                  </div>
                  <div className="text-right flex flex-col gap-0.5">
                    <span className="text-[6px] text-white/40 uppercase font-bold">
                      Roll No
                    </span>
                    <span className="block font-mono text-[8px] text-white/90">
                      {data.rollNO}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="block text-[6px] text-white/40 uppercase font-bold">
                    DOB
                  </span>
                  <span className="block text-[8px] text-white/90 font-medium">
                    {data.dob}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-[6px] text-white/40 uppercase font-bold">
                    Valid Thru
                  </span>
                  <span className="block text-[8px] text-emerald-400 font-bold">
                    {data.validity}
                  </span>
                </div>
                <div className="col-span-1">
                  <span className="block text-[6px] text-white/40 uppercase font-bold">
                    Contact
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
            <div className="h-6 opacity-90 mix-blend-screen relative w-20 flex justify-center items-center">
              {data.institute.signature && (
                <img
                  src={data.institute.signature}
                  alt=""
                  className="h-full w-auto object-contain invert brightness-100 grayscale opacity-100"
                />
              )}
            </div>
            <span className="text-[5px] text-white/40 uppercase font-bold mt-0.5 tracking-wider border-t border-white/10 pt-0.5 w-20 text-center">
              Authorized Signature
            </span>
          </div>
        </div>
      </div>
    );
  }
);

StudentIdModern.displayName = "StudentIdModern";

/* -------------------------------------------------------------------------- */
/* MINIMAL DESIGN - Clean & Typography Focused                                */
/* -------------------------------------------------------------------------- */
export const StudentIdMinimal = forwardRef<HTMLDivElement, StudentIdCardProps>(
  ({ data, className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          aspectRatio: `${CARD_WIDTH}/${CARD_HEIGHT}`,
          ...style,
        }}
        className={cn(
          "relative flex-shrink-0 bg-white rounded-xl shadow-md overflow-hidden select-none print:shadow-none flex flex-col border border-slate-200 mx-auto",
          className
        )}
        {...props}
      >
        <div className="flex flex-1 p-5 gap-5 min-h-0">
          {/* Left: Photo & ID */}
          <div className="flex flex-col gap-2.5 w-[90px] shrink-0">
            <div className="w-full h-[110px] bg-slate-50 relative overflow-hidden rounded-sm grayscale-[0.1] border border-slate-100">
              <StudentPhoto url={data.photoUrl} />
            </div>
            <div className="text-center">
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
                />
              </div>
            </div>

            {/* Key Values */}
            <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 text-[9px] flex-1 content-start">
              <div>
                <span className="block text-[6px] uppercase font-bold text-slate-400 tracking-wide mb-px">
                  Roll Number
                </span>
                <span className="font-mono font-medium text-slate-700 block truncate">
                  {data.rollNO}
                </span>
              </div>
              <div>
                <span className="block text-[6px] uppercase font-bold text-slate-400 tracking-wide mb-px">
                  Reg Number
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
          <div>
            {data.institute.signature && (
              <img
                src={data.institute.signature}
                className="h-4 w-auto mix-blend-multiply opacity-80"
                alt="sig"
              />
            )}
          </div>
        </div>
      </div>
    );
  }
);

StudentIdMinimal.displayName = "StudentIdMinimal";
