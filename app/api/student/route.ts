import { CounterModel } from "./../../../models/CounterSchema";
import dbConnect from "@/lib/DatabaseConnection";
import { StudentModel } from "@/models/StudentsSchema";
import { Student } from "@/types/models/student.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      institute_code,
      payload,
    }: { institute_code: string; payload: any } = await req.json();
    console.log({ institute_code, payload });
    await dbConnect(institute_code);
    const existingStudent = await StudentModel.findOne({
      $or: [
        { "auth.studentId": payload.auth.studentId },
        { "academic.registrationNo": payload.academic.registrationNo },
        { "academic.rollNo": payload.academic.rollNo },
      ],
    });
    if (existingStudent) {
      // StudentId
      if (existingStudent.auth.studentId === payload.auth.studentId) {
        return NextResponse.json(
          {
            success: false,
            error: "Student with this studentId already exists.",
          },
          { status: 409 }
        );
      }
      // RegistrationNo
      if (
        existingStudent.academic.registrationNo ===
        payload.academic.registrationNo
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Student with this registrationNo already exists.",
          },
          { status: 409 }
        );
      }
      // RollNo
      if (existingStudent.academic.rollNo === payload.academic.rollNo) {
        return NextResponse.json(
          {
            success: false,
            error: "Student with this rollNo already exists.",
          },
          { status: 409 }
        );
      }
    }
    const newStudent = await StudentModel.create(payload).then(async (res) => {
      const course_code = res.academic.course.course_code;
      const year = new Date().getFullYear();
      const counter = await Promise.all([
        CounterModel.updateOne(
          { key: `STUDENT:${institute_code}` },
          { $inc: { seq: 1 } },
          { upsert: true }
        ),
        CounterModel.updateOne(
          { key: `ROLL:${year}:${course_code}:${institute_code}` },
          { $inc: { seq: 1 } },
          { upsert: true }
        ),
        CounterModel.updateOne(
          { key: `REG:${year}:${institute_code}` },
          { $inc: { seq: 1 } },
          { upsert: true }
        ),
      ]);
      return res;
    });

    return NextResponse.json(
      {
        success: true,
        message: "Student created successfully",
        data: newStudent,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating student:", error);

    // Handle duplicate key error (E11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        {
          success: false,
          error: `Duplicate value for ${field}. Please use a unique value.`,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
