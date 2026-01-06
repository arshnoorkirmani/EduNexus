"use client";

import React, { forwardRef, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Printer } from "lucide-react";

export default function PrintAndImagePopup() {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    // const html2canvas = (await import("html2canvas")).default;
    // const canvas = await html2canvas(cardRef.current, {
    //   scale: 3,
    //   useCORS: true,
    // });

    // const link = document.createElement("a");
    // link.download = "student-id-card.png";
    // link.href = canvas.toDataURL("image/png");
    // link.click();
  };

  const handlePrint = () => {
    if (!cardRef.current) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Student ID</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
          </style>
        </head>
        <body>
          ${cardRef.current.outerHTML}
          <script>
            window.onload = () => window.print();
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <Dialog open={true}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Student ID Card
          </DialogTitle>

          <DialogDescription className="pt-2">
            Print or download the generated student ID card.
          </DialogDescription>
        </DialogHeader>

        {/* ID Card Preview */}
        <div className="flex justify-center py-4">
          <StudentId ref={cardRef} />
        </div>

        <DialogFooter className="gap-3">
          <Button onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>

          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const StudentId = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref}>
      <div className="relative group perspective-1000">
        <div
          // ref={cardRef}
          id="id-card"
          className="w-[400px] h-[255px] relative overflow-hidden rounded-[16px] shadow-2xl bg-white text-slate-800 font-sans border border-slate-200"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23f1f5f9' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        >
          {/* Decorative Pattern Backgrounds */}
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-blue-700 to-indigo-800 clip-path-curve -z-0"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl -z-0 translate-x-12 translate-y-12"></div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-4 pb-1 relative z-10 w-full">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-indigo-800 font-bold text-lg">E</span>
              </div>
              <div className="text-white">
                <h1 className="font-bold text-base leading-tight tracking-wide">
                  EDUNEXUS
                </h1>
                <p className="text-[9px] text-blue-100 uppercase tracking-wider font-medium">
                  University of Technology
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/10">
                <p className="text-[9px] text-white font-semibold uppercase tracking-widest">
                  Student ID
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex px-6 pt-3 gap-5 relative z-10">
            {/* Photo Section */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-[105px] h-[125px] rounded-xl border-4 border-white shadow-md overflow-hidden bg-slate-200 relative">
                <img
                  // src={profileImage}
                  alt="Student Photo"
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="flex-1 space-y-1.5 pt-1">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 leading-tight tracking-wide">
                  Arshnoor Kirmani
                </h2>
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                    B.Tech - Computer Science
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                      Validity:
                    </span>
                    <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      2025 - 2029
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-2 gap-x-2 mt-2 pt-2 border-t border-dashed border-slate-200">
                <div className="col-span-2">
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">
                    Student ID
                  </p>
                  <p className="text-base font-bold text-slate-800 font-mono tracking-wide">
                    ENX-882190
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">
                    Date of Birth
                  </p>
                  <p className="text-xs font-bold text-slate-700">
                    12 Aug 2003
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">
                    Blood Group
                  </p>
                  <p className="text-xs font-bold text-slate-700">O+</p>
                </div>
                <div className="col-span-2 pb-1">
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">
                    Contact
                  </p>
                  <p className="text-xs font-bold text-slate-700">
                    +91 98765 43210
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 w-full bg-slate-50 border-t border-slate-100 py-1.5 px-6 flex items-center justify-between">
            <div className="flex flex-col">
              {/* Barcode Mock */}
              <div className="h-5 w-28 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/UPC-A-036000291452.svg/1200px-UPC-A-036000291452.svg.png')] bg-cover opacity-60 grayscale mix-blend-multiply"></div>
              <p className="text-[7px] text-slate-500 font-semibold mt-0.5">
                Registrar / Authorized Signatory
              </p>
            </div>

            <div className="text-right">
              <p className="text-[7px] text-slate-400">www.edunexus.edu.in</p>
              <p className="text-[7px] text-slate-400">
                56, Tech Park, New Delhi
              </p>
            </div>
          </div>

          {/* Holo Effect Overlay (Subtle) */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none skew-x-12 opacity-50"></div>
        </div>
      </div>
      <div className="text-center max-w-md text-slate-400 text-xs mt-8">
        <p>
          Note: This ID card is valid for official use. Use the high-resolution
          download for badge printing.
        </p>
      </div>
    </div>
  );
});

StudentId.displayName = "StudentId";
