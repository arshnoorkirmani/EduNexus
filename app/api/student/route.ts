import { CounterModel } from "./../../../models/CounterSchema";
import dbConnect from "@/lib/DatabaseConnection";
import { StudentModel } from "@/models/StudentsSchema";
import InstituteModel from "@/models/InstituteSchema";
import { NextRequest, NextResponse } from "next/server";
import { studentFormSchema } from "@/lib/validators/institute/add-student.validator";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const institute_code = rawBody?.institute_code;
    const rawPayload = rawBody?.payload;

    if (!institute_code || typeof institute_code !== "string") {
      return NextResponse.json(
        { success: false, error: "institute_code is required" },
        { status: 400 }
      );
    }

    // 1. Zod Validation (Backend protection)
    const validationResult = studentFormSchema.safeParse(rawPayload);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const payload = validationResult.data;

    console.log({ institute_code, payload });
    // Connect to global DB to check institute
    await dbConnect();

    const institute = await InstituteModel.findOne({ "information.institute_code": institute_code });
    if (!institute) {
      return NextResponse.json({ success: false, error: "Institute not found" }, { status: 404 });
    }

    // Attach instituteId required by Student schema
    const finalPayload = {
      ...payload,
      institute: {
        ...payload.institute,
        instituteId: institute._id,
      }
    };

    // Connect to tenant DB
    await dbConnect(institute_code);

    // Check for existing records outside the transaction (reads are fine)
    const existingStudent = await StudentModel.findOne({
      $or: [
        { "auth.studentId": finalPayload.auth.studentId },
        { "academic.registrationNo": finalPayload.academic.registrationNo },
        { "academic.rollNo": finalPayload.academic.rollNo },
      ],
    });

    if (existingStudent) {
      // StudentId
      if (existingStudent.auth?.studentId === finalPayload.auth.studentId) {
        return NextResponse.json(
          { success: false, error: "Student with this studentId already exists." },
          { status: 409 }
        );
      }
      // RegistrationNo
      if (existingStudent.academic?.registrationNo === finalPayload.academic.registrationNo) {
        return NextResponse.json(
          { success: false, error: "Student with this registrationNo already exists." },
          { status: 409 }
        );
      }
      // RollNo
      if (existingStudent.academic?.rollNo === finalPayload.academic.rollNo) {
        return NextResponse.json(
          { success: false, error: "Student with this rollNo already exists." },
          { status: 409 }
        );
      }
    }

    // 2. MongoDB Transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    let newStudent;

    try {
      // 2a. Create the student inside the transaction
      const createdStudents = await StudentModel.create([finalPayload], { session });
      newStudent = createdStudents[0];

      // 2b. Increment the counters inside the exact same transaction
      const course_code = newStudent.academic.course?.course_code || "UNKNOWN";
      const year = new Date().getFullYear();

      await Promise.all([
        CounterModel.updateOne(
          { key: `STUDENT:${institute_code}` },
          { $inc: { seq: 1 } },
          { upsert: true, session }
        ),
        CounterModel.updateOne(
          { key: `ROLL:${year}:${course_code}:${institute_code}` },
          { $inc: { seq: 1 } },
          { upsert: true, session }
        ),
        CounterModel.updateOne(
          { key: `REG:${year}:${institute_code}` },
          { $inc: { seq: 1 } },
          { upsert: true, session }
        ),
      ]);

      // If all passed, commit the transaction
      await session.commitTransaction();

    } catch (transactionError) {
      // If anything fails, abort and rollback everything
      await session.abortTransaction();
      throw transactionError; // Pass to outer catch block to handle unique key errors or 500
    } finally {
      session.endSession();
    }

    return NextResponse.json(
      {
        success: true,
        message: "Student created successfully",
        data: newStudent,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating student:", error);
    
    const err = error as any;

    // Handle duplicate key error (E11000)
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || "unknown field";
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
        message: err.message || "Internal Server Error",
        error: process.env.NODE_ENV === "development" ? err.toString() : undefined,
      },
      { status: 500 }
    );
  }
}
