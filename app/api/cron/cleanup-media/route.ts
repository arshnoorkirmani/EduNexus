import { NextResponse } from "next/server";
import { cleanupOrphanMedia } from "@/services/media.service";

/* -------------------------------------------------------------------------- */
/* GET — Trigger Media Cleanup Cron                                            */
/* -------------------------------------------------------------------------- */

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    // Optional: Add simple security mechanism for the cron route
    // const authHeader = req.headers.get("authorization");
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // Read optional olderThanHours from query params
    const { searchParams } = new URL(req.url);
    const olderThanQuery = searchParams.get("olderThan");
    const olderThanHours = olderThanQuery ? parseInt(olderThanQuery, 10) : 24;

    const result = await cleanupOrphanMedia(olderThanHours);

    return NextResponse.json({
      success: true,
      message: "Media cleanup executed successfully.",
      stats: result,
    });
  } catch (error: any) {
    console.error("Cron Error (cleanup-media):", error.message || error);
    return NextResponse.json(
      { error: "Internal Server Error during media cleanup", details: error.message },
      { status: 500 }
    );
  }
}
