import dbConnect from "@/lib/DatabaseConnection";
import { CounterModel, CounterSchema } from "@/models/CounterSchema";
import mongoose from "mongoose";
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

    // Connect to the cluster (default DB) without switching global connection
    await dbConnect();

    // Use useDb for tenant-specific connection
    const db = mongoose.connection.useDb(instituteCode, { useCache: true });
    // Compile model on this connection
    const Counter = db.model("Counter", CounterSchema);

    /* ------------------------------------------------------------------ */
    /* ATOMICALLY INCREMENT AND RETURN NEW SEQUENCE                        */
    /* ------------------------------------------------------------------ */
    console.log("Institute Code", instituteCode);

    // Use the locally-scoped model
    const counter = await Counter.findOne({ key });
    console.log("Counter", counter, instituteCode);

    if (!counter) {
      const newCounter = new Counter({
        key,
        seq: 0,
      });
      await newCounter.save();
      return NextResponse.json(
        {
          success: true,
          message: "Counter incremented",
          data: newCounter,
        },
        { status: 200 }
      );
    }
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
