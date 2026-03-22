import dbConnect from "@/lib/DatabaseConnection";
import { Media } from "@/models/MediaSchema";
import ImageKit from "imagekit";

/* -------------------------------------------------------------------------- */
/* ImageKit (server-only)                                                      */
/* -------------------------------------------------------------------------- */

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

/* -------------------------------------------------------------------------- */
/* POST — Create Media (TEMPORARY or DIRECT UPLOAD)                            */
/* -------------------------------------------------------------------------- */

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();

  try {
    const media = await Media.create({
      provider: "imagekit",
      providerFileId: body.providerFileId,
      url: body.url,
      thumbnailUrl: body.thumbnailUrl,
      name: body.name,
      mimeType: body.mimeType,
      size: body.size,
      type: body.type,

      owner: {
        entity: body.owner?.entity,
        entityId: body.owner?.entityId ?? "draft",
        field: body.owner?.field ?? "documents",
      },

      visibility: body.visibility ?? "institute",
      status: body.status ?? "temporary",
      uploadedBy: body.uploadedBy,
    });

    return Response.json(media, { status: 201 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

/* -------------------------------------------------------------------------- */
/* PUT — Finalize / Update Media                                               */
/* -------------------------------------------------------------------------- */

export async function PUT(req: Request) {
  await dbConnect();
  const body = await req.json();

  if (!body.providerFileId) {
    return Response.json(
      { error: "providerFileId is required" },
      { status: 400 }
    );
  }

  try {
    const media = await Media.findOneAndUpdate(
      { providerFileId: body.providerFileId, deletedAt: null },
      {
        ...(body.owner && { owner: body.owner }),
        ...(body.visibility && { visibility: body.visibility }),
        ...(body.status && { status: body.status }),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!media) {
      return Response.json({ error: "Media not found" }, { status: 404 });
    }

    return Response.json(media);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

/* -------------------------------------------------------------------------- */
/* GET — Fetch Media (By owner / fileId / all)                                 */
/* -------------------------------------------------------------------------- */

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const providerFileId = searchParams.get("providerFileId");
  const entity = searchParams.get("entity");
  const entityId = searchParams.get("entityId");
  const field = searchParams.get("field");

  try {
    // 1️⃣ Get by providerFileId
    if (providerFileId) {
      const media = await Media.findOne({
        providerFileId,
        deletedAt: null,
      });

      if (!media) {
        return Response.json({ error: "Media not found" }, { status: 404 });
      }

      return Response.json(media);
    }

    // 2️⃣ Get by owner
    if (entity && entityId) {
      const media = await Media.find({
        "owner.entity": entity,
        "owner.entityId": entityId,
        ...(field && { "owner.field": field }),
        deletedAt: null,
      }).sort({ createdAt: -1 });

      return Response.json(media);
    }

    // 3️⃣ Get all (admin/debug)
    const media = await Media.find({
      deletedAt: null,
    }).sort({ createdAt: -1 });

    return Response.json(media);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

/* -------------------------------------------------------------------------- */
/* DELETE — Soft Delete + ImageKit Cleanup                                     */
/* -------------------------------------------------------------------------- */

export async function DELETE(req: Request) {
  await dbConnect();

  let providerFileId: string | undefined;

  try {
    const body = await req.json();
    providerFileId = body.providerFileId;
  } catch (error) {
    // Body parsing failed (likely empty), fallback to query params
  }

  if (!providerFileId) {
    const { searchParams } = new URL(req.url);
    providerFileId = searchParams.get("providerFileId") || undefined;
  }

  if (!providerFileId) {
    return Response.json(
      { error: "providerFileId is required" },
      { status: 400 }
    );
  }

  const media = await Media.findOne({ providerFileId });

  if (!media) {
    return Response.json({ error: "Media not found" }, { status: 404 });
  }

  try {
    // 1️⃣ Delete from ImageKit
    try {
      await imagekit.deleteFile(media.providerFileId);
    } catch (ikError: any) {
      console.warn("Notice: ImageKit file deletion failed. Continuing with DB delete anyway.", ikError.message || ikError);
    }

    // 2️⃣ Hard delete from DB
    await Media.deleteOne({ _id: media._id });

    return Response.json({ success: true });
  } catch (error: any) {
    console.error("Critical Database Delete Error:", error.message || error);
    return Response.json({ error: "Failed to delete media from database: " + error.message }, { status: 500 });
  }
}
