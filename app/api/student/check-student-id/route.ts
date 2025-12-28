import { StudentModel } from "@/models/StudentsSchema";
import dbConnect from "@/lib/DatabaseConnection";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { InstituteConf } from "@/config/InstituteClient";
import InstituteModel from "@/models/InstituteSchema";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);

    const rawStudentId = url.searchParams.get("studentId");
    const rawInstituteIdentifier = url.searchParams.get("instituteIdentifier");

    const studentId = rawStudentId?.trim();
    let instituteIdentifier = rawInstituteIdentifier?.trim();

    if (!studentId || !instituteIdentifier) {
      return NextResponse.json(
        {
          success: false,
          message: "Student ID and institute identifier are required.",
          data: { isRegistered: false },
        },
        { status: 400 }
      );
    }

    // ---------------- DATABASE CONNECT / RESOLVE INSTITUTE CODE ----------------
    try {
      // Case 1: Provided value is already a valid institute code
      if (InstituteConf.validateInstituteCode(instituteIdentifier)) {
        await dbConnect(instituteIdentifier);
      } else {
        // Otherwise, connect to master DB and resolve institute code
        await dbConnect();

        const orConditions: any[] = [
          { "information.institute_code": instituteIdentifier },
          { "information.email": instituteIdentifier },
        ];

        if (Types.ObjectId.isValid(instituteIdentifier)) {
          orConditions.push({ _id: instituteIdentifier });
        }

        const institute = await InstituteModel.findOne({ $or: orConditions })
          .select("information.institute_code")
          .lean();

        if (!institute) {
          return NextResponse.json(
            {
              success: false,
              message: "Institute not found.",
              data: { isRegistered: false },
            },
            { status: 404 }
          );
        }

        instituteIdentifier = institute.information.institute_code;
        await dbConnect(instituteIdentifier);
      }
    } catch (err) {
      console.error("DB resolution error:", err);
      throw new Error("Database connection failed");
    }

    // ---------------- QUERY STUDENT ----------------
    const student = await StudentModel.findOne({
      "auth.studentId": studentId,
      "institute.institute_code": new RegExp(`^${instituteIdentifier}$`, "i"), // case-insensitive
    })
      .select(
        "_id auth.studentId personal.firstName personal.lastName personal.fullName"
      )
      .lean();

    if (student) {
      return NextResponse.json(
        {
          success: true,
          message: "Student ID already registered.",
          data: { isRegistered: true, student },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Student ID available.",
        data: { isRegistered: false },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /student/check-student-id → Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message ?? "Internal server error.",
        error:
          process.env.NODE_ENV === "development" ? error.toString() : undefined,
      },
      { status: 500 }
    );
  }
}
