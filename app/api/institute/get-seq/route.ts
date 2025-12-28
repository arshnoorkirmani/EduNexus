import dbConnect from "@/lib/DatabaseConnection";
import { CounterModel } from "@/models/CounterSchema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const instituteCode = searchParams.get("institute_code");
    const key = searchParams.get("key");

    if (!instituteCode || !key) {
      return NextResponse.json(
        {
          success: false,
          message: "institute_code and key are required",
          data: null,
        },
        { status: 400 }
      );
    }

    await dbConnect(instituteCode);

    /* ------------------------------------------------------------------ */
    /* ATOMICALLY INCREMENT AND RETURN NEW SEQUENCE                        */
    /* ------------------------------------------------------------------ */
    const counter = await CounterModel.findOne({ key });

    return NextResponse.json(
      {
        success: true,
        message: "Counter incremented",
        data: counter,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /counter error:", error);

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
