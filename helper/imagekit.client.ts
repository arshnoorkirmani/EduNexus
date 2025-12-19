import ImageKit from "imagekit-javascript";
import type { ImageKitUploadResult } from "@/types/imagekit";

/* -------------------------------------------------------------------------- */
/* SDK TYPE FIX (isolated, intentional)                                        */
/* -------------------------------------------------------------------------- */

type RuntimeUploadResponse = {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  height?: number;
  width?: number;
  size: number;
  fileType: string;
};

type RuntimeUploadOptions = {
  file: File;
  fileName: string;
  folder?: string;
  useUniqueFileName?: boolean;
  tags?: string[];
};

interface ImageKitClientOptions {
  publicKey: string;
  urlEndpoint: string;
  authenticationEndpoint: string;
}

/* -------------------------------------------------------------------------- */
/* ImageKit Client                                                             */
/* -------------------------------------------------------------------------- */

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  authenticationEndpoint: "/api/imagekit-auth",
} as ImageKitClientOptions);

/* -------------------------------------------------------------------------- */
/* Typed Upload Wrapper (THIS is the key)                                      */
/* -------------------------------------------------------------------------- */

async function sdkUpload(
  options: RuntimeUploadOptions
): Promise<RuntimeUploadResponse> {
  return (await imagekit.upload(
    options as unknown as any
  )) as RuntimeUploadResponse;
}

/* -------------------------------------------------------------------------- */
/* Public API (what your app uses)                                             */
/* -------------------------------------------------------------------------- */

export async function uploadFileToImageKit(
  file: File,
  config?: {
    folder?: string;
    tags?: string[];
  }
): Promise<ImageKitUploadResult> {
  const result = await sdkUpload({
    file,
    fileName: file.name,
    folder: config?.folder,
    tags: config?.tags,
    useUniqueFileName: true,
  });

  return result as ImageKitUploadResult;
}
