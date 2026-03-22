import { uploadToImageKit, deleteImageKitFile } from "@/helper/imagekit.client";
import { ImageKitUploadResult } from "@/types/imagekit";
import { CreateMediaPayload } from "@/types/media";
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
    async (
      file: File,
      fileName?: string,
      folder?: string,
      options?: {
        user?: { institute_name?: string; institute_code?: string; name: string; email: string; role?: string; entity?: string };
        replaceFileId?: string;
        mediaPayload?: Partial<CreateMediaPayload>;
      }
    ) => {
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
          user: options?.user,
          replaceFileId: options?.replaceFileId,
          mediaPayload: options?.mediaPayload,
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

        // Optionally store the options alongside the upload item if retry needs exactly the same user params
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

  const clear = useCallback(async (id: string, deleteFromServer: boolean = true) => {
    let fileIdToDelete: string | undefined;
    let previewUrlToRevoke: string | undefined;

    setUploads((prev) => {
      const item = prev[id];
      if (item) {
        if (item.status === "uploading" && item.controller) {
          item.controller.abort();
        }
        if (deleteFromServer) {
          fileIdToDelete = item.result?.fileId;
        }
        previewUrlToRevoke = item.previewUrl;
      }
      return prev;
    });

    if (fileIdToDelete) {
      try {
        await deleteImageKitFile(fileIdToDelete);
      } catch (error) {
        console.error("Failed to delete media from server:", error);
      }
    }

    if (previewUrlToRevoke) {
      URL.revokeObjectURL(previewUrlToRevoke);
    }

    setUploads((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }, []);

  const clearAll = useCallback(async (deleteFromServer: boolean = true) => {
    let itemsToProcess: UploadItem[] = [];

    setUploads((prev) => {
      itemsToProcess = Object.values(prev);
      return {};
    });

    for (const item of itemsToProcess) {
      if (item.status === "uploading" && item.controller) {
        item.controller.abort();
      }
      if (deleteFromServer && item.result?.fileId) {
        try {
          await deleteImageKitFile(item.result.fileId);
        } catch (error) {
          console.error(`Failed to delete media ${item.result.fileId} from server:`, error);
        }
      }
      if (item.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
    }
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
