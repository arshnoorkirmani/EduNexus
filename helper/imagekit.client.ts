import { upload } from "@imagekit/next";
import type { ImageKitUploadResult } from "@/types/imagekit";
import mediaService from "@/config/MediaConfig";
import { CreateMediaPayload, MediaProvider, MediaType, MediaStatus } from "@/types/media";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

// Removed local ImageKitUploadResult in favor of the shared type import

type ImageKitAuthResponse = {
  signature: string;
  token: string;
  expire: number;
};

type UploadParams = {
  fileName: string;
  folder?: string;
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
  user?: {
    institute_name?: string;
    institute_code?: string;
    name: string;
    email: string;
    role?: string;
    entity?: string;
  };
  replaceFileId?: string;
  mediaPayload?: Partial<CreateMediaPayload>;
};

/* -------------------------------------------------------------------------- */
/* Constants                                                                 */
/* -------------------------------------------------------------------------- */

const PUBLIC_KEY = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!;
const URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                   */
/* -------------------------------------------------------------------------- */

async function getImageKitAuth(): Promise<ImageKitAuthResponse> {
  const res = await fetch("/api/imagekit-auth");

  if (!res.ok) {
    throw new Error("ImageKit auth failed");
  }

  return res.json();
}

/* -------------------------------------------------------------------------- */
/* Upload Function                                                           */
/* -------------------------------------------------------------------------- */

export async function uploadToImageKit(
  file: File,
  options: UploadParams
): Promise<ImageKitUploadResult> {
  if (!file) {
    throw new Error("File is required");
  }

  let auth: ImageKitAuthResponse;
  try {
    auth = await getImageKitAuth();
  } catch (error: any) {
    throw new Error(`Failed to authenticate with ImageKit: ${error.message}`);
  }

  // Build payload and cast to any to avoid strict excess property checks
  const payload: any = {
    publicKey: PUBLIC_KEY,
    urlEndpoint: URL_ENDPOINT,

    file,
    fileName: options.fileName,
    folder: options.folder,

    signature: auth.signature,
    token: auth.token,
    expire: auth.expire,

    abortSignal: options.signal,

    onProgress: (e: ProgressEvent) => {
      if (!e.total) return;
      options.onProgress?.(Math.round((e.loaded / e.total) * 100));
    },
  };

  let result: any;
  try {
    result = await upload(payload);
  } catch (error: any) {
    throw new Error(`ImageKit upload failed: ${error.message}`);
  }

  // Validate required fields
  if (
    !result ||
    !result.fileId ||
    !result.name ||
    !result.url ||
    typeof result.size !== "number" ||
    !result.fileType
  ) {
    throw new Error("Invalid upload response from ImageKit");
  }

  // Attempt to store the uploaded media in the database using MediaConfig
  try {
    const mimeType = file.type || result.fileType || "application/octet-stream";
    const type = mimeType.startsWith("image/")
      ? MediaType.IMAGE
      : mimeType === "application/pdf"
      ? MediaType.PDF
      : MediaType.OTHER;

    // Use default values for owner if none are provided to store it temporarily
    const createPayload: CreateMediaPayload = {
      ...options.mediaPayload,
      provider: MediaProvider.IMAGEKIT,
      providerFileId: result.fileId as string,
      name: result.name as string,
      url: result.url as string,
      thumbnailUrl: (result.thumbnailUrl ?? "") as string,
      mimeType,
      size: result.size as number,
      type,
      owner: options.mediaPayload?.owner || {
        entity: options.user?.entity || options.user?.role || "institute", 
        entityId: "draft",
        field: "documents",
      },
    };

    if (options.user) {
      createPayload.uploadedBy = {
        institute_name: options.user.institute_name || "Unknown",
        institute_code: options.user.institute_code,
        name: options.user.name,
        email: options.user.email,
      };
    }

    if (options.replaceFileId) {
      try {
        await mediaService.update({
          providerFileId: options.replaceFileId,
          status: MediaStatus.REPLACED,
        });
      } catch (replaceErr) {
        console.warn("Failed to mark old file as replaced in DB", replaceErr);
      }
    }

    await mediaService.create(createPayload);
  } catch (dbError: any) {
    console.error("Error storing media in database:", dbError);
    // Explicitly handle failure but clarify the image was uploaded
    throw new Error(
      `Image uploaded to ImageKit but failed to save to database. Details: ${dbError.message || dbError}`
    );
  }

  return {
    fileId: result.fileId as string,
    name: result.name as string,
    url: result.url as string,
    // ensure thumbnailUrl is always a string to match the shared ImageKitUploadResult type
    thumbnailUrl: (result.thumbnailUrl ?? "") as string,
    size: result.size as number,
    fileType: result.fileType as string,
  };
}

/* -------------------------------------------------------------------------- */
/* Additional Media Operations                                                */
/* -------------------------------------------------------------------------- */

/**
 * Deletes a file from ImageKit and soft-deletes its record in the database.
 */
export async function deleteImageKitFile(fileId: string): Promise<boolean> {
  try {
    await mediaService.delete(fileId);
    return true;
  } catch (error: any) {
    console.error("Error deleting media:", error);
    throw new Error(`Failed to delete file from ImageKit/Database: ${error.message || error}`);
  }
}

/**
 * Gets media records for a specific owner entity.
 */
export async function getMediaForOwner(entity: string, entityId: string, field: string = "documents") {
  try {
    const response: any = await mediaService.getByOwner({ entity, entityId, field });
    return response?.data || response || [];
  } catch (error: any) {
    console.error("Error fetching media for owner:", error);
    return [];
  }
}
