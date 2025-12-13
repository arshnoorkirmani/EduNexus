import dbConnect from "@/lib/DatabaseConnection";
import { hashOtp } from "@/config/ApiConfig";
import InstituteModel from "@/models/InstituteSchema";
import { PostCreateInstituteRequest } from "@/types/api/institute/institute-api";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { EmailSender } from "@/config/EmailSendConfig";
import { InstituteConf } from "@/config/InstituteClient";
import mongoose from "mongoose";

const UpdateInstituteSchema = z.object({
  institute_code: z.string().min(1, "Institute code is required"),
  info: z.record(z.string(), z.any()).optional(),
});

// ============================= POST =========================================
export async function POST(request: NextRequest) {
  try {
    const body: PostCreateInstituteRequest = await request.json();
    if (!body) {
      return NextResponse.json(
        { success: false, message: "Invalid input" },
        { status: 400 }
      );
    }

    const { name: username, email, password, institute_name } = body;

    await dbConnect();

    const existingInstitute = await InstituteModel.findOne({ email });

    const code = EmailSender.generateOtp();
    const verifyCode = await EmailSender.generateHash(code);
    const verifyCodeExpiry = EmailSender.generateExpiry();
    const hashedPassword = await EmailSender.generateHash(password);
    const codeResult = await InstituteConf.generateInstituteCode(
      institute_name
    );
    console.log({ codeResult }); //remove
    if (!codeResult.success) {
      console.warn("FALLBACK CODE:", codeResult.message);
    }
    const finalInstituteCode: string = codeResult.institute_code;

    // ==========================================
    // 1️⃣ If email already verified → BLOCK
    // ==========================================
    if (existingInstitute && existingInstitute.isVerified) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    // ==========================================
    // 2️⃣ If email exists but NOT verified → RESEND OTP
    // ==========================================
    if (existingInstitute && !existingInstitute.isVerified) {
      existingInstitute.username = username;
      existingInstitute.password = hashedPassword;
      existingInstitute.verifyCode = verifyCode;
      existingInstitute.verifyCodeExpiry = verifyCodeExpiry;

      Object.assign(existingInstitute.information, {
        institute_code: finalInstituteCode,
        institute_name: institute_name,
      });

      existingInstitute.isVerified = false;

      await existingInstitute.save().then(() => {
        console.log("Institute Information are updated....."); //remove
      });

      const emailRes = await EmailSender.sendEmail({
        code,
        expiry: verifyCodeExpiry,
        to: email,
        purpose: "verify",
        username,
        instituteName: institute_name,
      });

      if (!emailRes.success) {
        return NextResponse.json(
          { success: false, message: emailRes.message },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Verification code re-sent. Please verify your account.",
          data: {
            institute_id: String(existingInstitute._id),
            institute_name: existingInstitute.information.institute_name,
          },
        },
        { status: 200 }
      );
    }

    // ==========================================
    // 3️⃣ CREATE NEW INSTITUTE
    // ==========================================
    const newInstitute = await InstituteModel.create({
      username,
      email,
      password: hashedPassword,
      information: {
        institute_name,
        email,
        institute_code: finalInstituteCode,
      },
      verifyCode,
      verifyCodeExpiry,
      isVerified: false,
    });

    // send OTP
    const emailRes = await EmailSender.sendEmail({
      code,
      expiry: verifyCodeExpiry,
      to: email,
      purpose: "verify",
      username,
      instituteName: institute_name,
    });

    if (!emailRes.success) {
      return NextResponse.json(
        { success: false, error: emailRes.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Institute created successfully. Verification code sent.",
        data: {
          institute_id: String(newInstitute._id),
          institute_name: newInstitute.information.institute_name,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /institute error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
} // ============================= GET ==========================================

// helper to validate ObjectId
function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const identifier = url.searchParams.get("identifier");
    const fieldsParam = url.searchParams.get("fieldsParam");

    if (!identifier) {
      return NextResponse.json(
        { success: false, message: "Identifier is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // -------------------------------------------
    // SAFE ROOT WHITELIST
    // -------------------------------------------
    const safeRootFields = [
      // BASIC PROFILE FIELDS
      "username",
      "email",
      "isVerified",

      // NESTED SAFE GROUPS
      "information",
      "permissions",

      // SYSTEM META (safe)
      "status",
      "isOnboarded",
      "lastLogin",
      "createdAt",
      "updatedAt",
    ];

    // -------------------------------------------
    // BUILD PROJECTION (STRICT MODE)
    // -------------------------------------------
    let projection: Record<string, 1> = {};

    if (fieldsParam) {
      if (fieldsParam === "all") {
        safeRootFields.forEach((key) => (projection[key] = 1));
      } else {
        const requestedFields = fieldsParam.split(",").map((f) => f.trim());

        for (const field of requestedFields) {
          const root = field.split(".")[0];

          // ❗ STRICT CHECK: if root not allowed → do NOT return it
          if (!safeRootFields.includes(root)) {
            continue;
          }

          const isNested = field.includes(".");

          if (isNested) {
            // Remove parent if exists to avoid collision
            delete projection[root];
            projection[field] = 1;
          } else {
            // Remove nested children if parent requested
            Object.keys(projection).forEach((key) => {
              if (key.startsWith(field + ".")) delete projection[key];
            });
            projection[field] = 1;
          }
        }

        // ❗ STRICT MODE:
        // If none of the requested fields were allowed → return ONLY _id
        if (Object.keys(projection).length === 0) {
          projection = { _id: 1 }; // return empty result except id
        }
      }
    } else {
      // No fieldsParam → return safe root fields
      projection = {
        _id: 1,
        "information.institute_code": 1,
        "information.institute_name": 1,
        "information.email": 1,
      };
    }

    // -------------------------------------------
    // IDENTIFIER QUERY (Supports _id, email, code)
    // -------------------------------------------
    let query: any = {
      $or: [
        { email: identifier.toLowerCase() },
        { "information.email": identifier.toLowerCase() },
        { "information.institute_code": identifier.toUpperCase() },
      ],
    };

    if (isValidObjectId(identifier)) {
      query.$or.push({ _id: new mongoose.Types.ObjectId(identifier) });
    }

    // -------------------------------------------
    // FIND ONE
    // -------------------------------------------
    const institute = await InstituteModel.findOne(query, projection).lean();
    console.log({ query: query.$or, projection, institute }); //remove

    if (!institute) {
      return NextResponse.json(
        { success: false, message: "Institute not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Institute found",
        data: { id: String(institute._id), ...institute },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /institute error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// ============================= PUT ==========================================
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const parsed = UpdateInstituteSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json(
        { success: false, message: errors },
        { status: 400 }
      );
    }

    const { institute_code, info = {} } = parsed.data;
    await dbConnect("institutes");

    const updated = await InstituteModel.findOneAndUpdate(
      { institute_code },
      { $set: { information: info } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Institute not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Institute updated successfully",
        user: updated,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PUT /institute error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
