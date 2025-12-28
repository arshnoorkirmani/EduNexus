import { uploadToImageKit } from "@/helper/imagekit.client";
import { ImageKitUploadResult } from "@/types/imagekit";
import { useCallback, useState, useEffect } from "react";
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
  previewUrl?: string;
};
function normalizeUploadError(error: unknown): string {
  if (error instanceof DOMException && error.name === "AbortError") {
    return "Upload cancelled";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected upload error";
}

export function useImageKitUpload() {
  const [uploads, setUploads] = useState<Record<string, UploadItem>>({});

  /* -------------------------------------------------------------------------- */
  /* Helpers                                                                    */
  /* -------------------------------------------------------------------------- */

  const update = useCallback((id: string, patch: Partial<UploadItem>) => {
    setUploads((prev) => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: { ...prev[id], ...patch },
      };
    });
  }, []);

  const generateId = () =>
    crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

  /* -------------------------------------------------------------------------- */
  /* Lifecycle Cleanup                                                          */
  /* -------------------------------------------------------------------------- */

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      setUploads((prev) => {
        Object.values(prev).forEach((item) => {
          if (item.previewUrl) {
            URL.revokeObjectURL(item.previewUrl);
          }
        });
        return {};
      });
    };
  }, []);

  /* -------------------------------------------------------------------------- */
  /* Upload                                                                     */
  /* -------------------------------------------------------------------------- */

  const startUpload = useCallback(
    async (file: File, fileName?: string, folder?: string) => {
      const id = generateId();
      const controller = new AbortController();
      const previewUrl = URL.createObjectURL(file);

      setUploads((prev) => ({
        ...prev,
        [id]: {
          id,
          file,
          fileName,
          progress: 0,
          status: "uploading",
          controller,
          previewUrl,
        },
      }));

      try {
        const result = await uploadToImageKit(file, {
          fileName: fileName ?? file.name,
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
      } catch (error) {
        const message = normalizeUploadError(error);

        update(id, {
          status:
            error instanceof DOMException && error.name === "AbortError"
              ? "cancelled"
              : "error",
          error: message,
        });

        // 🔴 Important: allow caller to react
        throw error;
      }
    },
    [update]
  );

  /* -------------------------------------------------------------------------- */
  /* Controls                                                                   */
  /* -------------------------------------------------------------------------- */

  const retry = useCallback(
    (id: string, folder?: string) => {
      setUploads((prev) => {
        const item = prev[id];
        if (!item) return prev;

        startUpload(item.file, item.fileName, folder);
        return prev;
      });
    },
    [startUpload]
  );

  const cancel = useCallback((id: string) => {
    setUploads((prev) => {
      prev[id]?.controller?.abort();
      return prev;
    });
  }, []);

  const clear = useCallback((id: string) => {
    setUploads((prev) => {
      const copy = { ...prev };
      const item = copy[id];
      if (item?.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
      delete copy[id];
      return copy;
    });
  }, []);

  const clearAll = useCallback(() => {
    setUploads((prev) => {
      Object.values(prev).forEach((item) => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
      return {};
    });
  }, []);

  return {
    uploads,
    startUpload,
    retry,
    cancel,
    clear,
    clearAll,
  };
}
