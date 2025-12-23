import { uploadToImageKit } from "@/helper/imagekit.client";
import { ImageKitUploadResult } from "@/types/imagekit";
import { useCallback, useState } from "react";
// import { uploadToImageKit } from "@/lib/imagekit/upload";

export type UploadStatus =
  | "idle"
  | "uploading"
  | "success"
  | "error"
  | "cancelled";

export type UploadItem = {
  id: string;
  file: File;
  fileName?: string;
  progress: number;
  status: UploadStatus;
  error?: string;
  result?: ImageKitUploadResult;
  controller?: AbortController;
};
export function useImageKitUpload() {
  const [uploads, setUploads] = useState<Record<string, UploadItem>>({});
  /* -------------------------------------------------------------------------- */
  /* Helpers                                                                    */
  /* -------------------------------------------------------------------------- */

  const update = (id: string, patch: Partial<UploadItem>) => {
    setUploads((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));
  };

  /* -------------------------------------------------------------------------- */
  /* Upload                                                                     */
  /* -------------------------------------------------------------------------- */

  const startUpload = useCallback(
    async (file: File, fileName?: string, folder?: string) => {
      const id = Date.now().toString();
      const controller = new AbortController();

      setUploads((prev) => ({
        ...prev,
        [id]: {
          id,
          file,
          fileName,
          progress: 0,
          status: "uploading",
          controller,
        },
      }));

      try {
        const result = await uploadToImageKit(file, {
          fileName: fileName || file.name,
          folder,
          signal: controller.signal,
          onProgress: (progress) => update(id, { progress }),
        });

        update(id, {
          status: "success",
          progress: 100,
          result,
        });

        return result;
      } catch (err: any) {
        if (err?.name === "AbortError") {
          update(id, { status: "cancelled" });
        } else {
          update(id, {
            status: "error",
            error: err?.message || "Upload failed",
          });
        }
      }
    },
    []
  );

  /* -------------------------------------------------------------------------- */
  /* Controls                                                                   */
  /* -------------------------------------------------------------------------- */

  const retry = (id: string, folder?: string) => {
    const item = uploads[id];
    if (!item) return;
    // pass folder as the third argument; the second arg is fileName
    startUpload(item.file, item?.fileName, folder);
  };

  const cancel = (id: string) => {
    uploads[id]?.controller?.abort();
  };

  const clear = (id: string) => {
    setUploads((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };
  const clearAll = () => {
    Object.keys(uploads).forEach((id) => clear(id));
  };

  return {
    uploads,
    startUpload,
    retry,
    cancel,
    clear,
    clearAll,
  };
}
