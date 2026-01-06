import dbConnect from "@/lib/DatabaseConnection";
import { CounterModel } from "@/models/CounterSchema";
import { NextRequest, NextResponse } from "next/server";
function generateStudentId(institute_code: string, seq: number) {
  return `${institute_code}${String(Number(seq) + 1).padStart(3, "0")}`; //IMS001
}
function generateRollNo(
  institute_code: string,
  seq: number,
  course_code: string
) {
  return `${institute_code}${course_code}${String(Number(seq) + 1).padStart(
    3,
    "0"
  )}`; //IMSBCA001
}
function generateRegistrationNo(institute_code: string, seq: number) {
  const currentYear = new Date().getFullYear();
  return `${institute_code}/${currentYear}/${String(Number(seq) + 1).padStart(
    3,
    "0"
  )}`; //IMS/2025/001
}
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const institute_code = url.searchParams.get("instituteCode");
    const student_id = url.searchParams.get("studentId");
    // const course_code = url.searchParams.get("courseCode");
    const course_code = "BCA";
    let generate_types = url.searchParams.get("generateType");
    const gentype = generate_types?.split(",");
    if (!institute_code) {
      return NextResponse.json(
        {
          success: false,
          message: "Institute identifier is required",
          data: null,
        },
        { status: 400 }
      );
    }
    await dbConnect(institute_code);
    // await CounterModel.updateOne(
    //   { key: institute_code },
    //   {
    //     $inc: {
    //       "seq.student.studentId": 1,
    //       "seq.student.rollNo.BCA": 1,
    //       "seq.student.registrationId": 1,
    //     },
    //   }
    // );
    const counter = await CounterModel.findOne({
      key: institute_code,
    });
    console.log("counter", counter);

    if (!counter) {
      return NextResponse.json(
        {
          success: false,
          message: "Institute Counter not found",
          data: null,
        },
        { status: 404 }
      );
    }

    const newStudentId = generateStudentId(
      institute_code,
      counter.seq.student.studentId
    );
    const newRollNo = generateRollNo(
      institute_code,
      counter.seq.student.rollNo[course_code],
      course_code
    );
    const newRegistrationNo = generateRegistrationNo(
      institute_code,
      counter.seq.student.registrationId
    );
    console.log("New StudetnId", newStudentId); //remove
    console.log("New RollNo", newRollNo); //remove
    console.log("New RegistrationNo", newRegistrationNo); //remove

    return NextResponse.json(
      {
        success: true,
        message: "Student ID generated successfully",
        data: newStudentId,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
        data: null,
      },
      { status: 500 }
    );
  }
}
