import { upload } from "@imagekit/next";
import type { ImageKitUploadResult } from "@/types/imagekit";

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

  const auth = await getImageKitAuth();

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

  const result: any = await upload(payload);

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
