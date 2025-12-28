"use client";

import { useEffect, useState } from "react";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, RotateCcw, FileText } from "lucide-react";
import type { ImageKitUploadResult } from "@/types/imagekit";
import { StudentDocument } from "@/types/models/student.model";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { errorToast } from "@/components/custom/utils/Toast";
import { useImageKitUpload } from "@/hooks/useImageKitUpload";
import { cn } from "@/lib/utils";
import mediaService from "@/config/MediaConfig";
import { useAuth } from "@/hooks/useAuth";
import {
  MediaProvider,
  MediaType,
  MediaStatus,
  MediaVisibility,
  OwnerEntity,
} from "@/types/media";
import { useAppForm } from "../FormContext";

const DOCUMENT_TYPES = [
  "Aadhaar Card",
  "10th Marksheet",
  "12th Marksheet",
  "Profile Photo",
] as const;
const ImagekitFileSize: number =
  Number(process.env.NEXT_PUBLIC_IMAGEKIT_FILE_SIZE) || 5;
export function getMAX_SIZE(size: number) {
  return size * 1024 * 1024;
}
export const formatInstituteName = (value?: string) =>
  value
    ?.trim()
    .replace(/\./g, "") // ❗ remove dots (S.K. → SK)
    .replace(/\s+/g, "-") // spaces → hyphen
    .replace(/[^a-zA-Z0-9-]/g, "") // remove other symbols
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/(^-|-$)/g, "") || // trim
  "Draft";
export const MAX_SIZE = getMAX_SIZE(ImagekitFileSize); // MB → bytes
export const ALLOWED_TYPES = ["image/png", "image/jpeg", "application/pdf"];

type Props<
  T extends FieldValues & {
    auth?: { studentId?: string };
    documents?: StudentDocument[];
  }
> = {
  form: UseFormReturn<T>;
};

export function DocumentUploadCard<
  T extends FieldValues & {
    auth?: { studentId?: string };
    documents?: StudentDocument[];
  }
>({ form }: Props<T>) {
  const [docType, setDocType] = useState("");
  const [customDocName, setCustomDocName] = useState("");
  const [openImage, setOpenImage] = useState<string | null>(null);
  const { user } = useAuth();
  const { isLoading } = useAppForm<T>?.();

  const { uploads, startUpload, retry, cancel, clear, clearAll } =
    useImageKitUpload();

  const documents = form.watch("documents" as Path<T>);
  useEffect(() => {
    if (!documents || (Array.isArray(documents) && documents.length === 0)) {
      clearAll();
    }
  }, [documents, clearAll]);

  const studentId = form.getValues("auth.studentId" as Path<T>) as
    | string
    | undefined;

  const handleFiles = async (files: FileList | null) => {
    if (!files || !docType) return;

    if (docType === "other" && !customDocName.trim()) {
      errorToast("Please enter document name");
      return;
    }

    const label = docType === "other" ? customDocName : docType;

    for (const file of Array.from(files)) {
      // Validation
      if (!ALLOWED_TYPES.includes(file.type)) {
        errorToast(`${docType}: Only PNG, JPG and PDF files are allowed`);
        continue;
      }

      if (file.size > MAX_SIZE) {
        errorToast(`${docType}: File size must be under ${ImagekitFileSize}MB`);
        continue;
      }

      // Duplicate Check
      const existingDocs =
        (form.getValues("documents" as Path<T>) as StudentDocument[]) || [];
      if (
        existingDocs.some(
          (d) =>
            d.type === label ||
            (d.file.name === file.name && d.file.size === file.size)
        )
      ) {
        errorToast(`${label} is already exists in uploaded document`);
        // continue; // Optional: block duplicate uploads
      }

      const folderPath = studentId
        ? `${formatInstituteName(user?.institute_name)}/students/${studentId}`
        : undefined;
      console.log(folderPath, user?.institute_name);
      console.log("Document Upload", label);

      try {
        const result = await startUpload(file, label, folderPath);
        console.log("Document Upload Result", result);
        if (!result) {
          errorToast(`Failed to upload ${docType}`);
          continue;
        }

        /* ------------------- Save to Form (StudentDocument) ------------------- */

        const currentDocs =
          (form.getValues("documents" as Path<T>) as StudentDocument[]) || [];

        const newDoc: StudentDocument = {
          type: label,
          file: {
            name: result.name,
            url: result.url,
            mimeType: file.type,
            size: result.size,
          },
          uploadedAt: new Date(),
          uploadedBy: {
            name: user?.name || "Unknown",
            email: user?.identifier || "Unknown",
          },
          visibility: "public" as const, // Cast to literal if needed
        };

        form.setValue("documents" as Path<T>, [...currentDocs, newDoc] as any, {
          shouldDirty: true,
          shouldTouch: true,
        });

        /* ----------------------- Save to Media (Cron) ------------------------- */
        await mediaService.create({
          provider: MediaProvider.IMAGEKIT,
          providerFileId: result.fileId,
          name: result.name,
          url: result.url,
          thumbnailUrl: result.thumbnailUrl,
          mimeType: file.type,
          size: result.size,
          type: file.type.startsWith("image/")
            ? MediaType.IMAGE
            : file.type === "application/pdf"
            ? MediaType.PDF
            : MediaType.OTHER,
          owner: {
            entity: OwnerEntity.STUDENT,
            entityId: studentId ?? "draft",
            field: "documents",
          },
          status: MediaStatus.TEMPORARY,
          visibility: MediaVisibility.PUBLIC,
          uploadedBy: {
            institute_name: user?.institute_name || "Unknown",
            name: user?.name || "Unknown",
            email: user?.identifier || "Unknown",
          },
        });
      } catch (error) {
        console.error("Upload error:", error);
        errorToast(`Error uploading ${file.name}`);
      }
    }

    // Remove an uploaded item: delete from form documents and clear preview
  };
  const removeUploaded = async (id: string, result?: ImageKitUploadResult) => {
    if (result) {
      const existing =
        (form.getValues("documents" as Path<T>) as StudentDocument[]) || [];
      const filtered = existing.filter((d) => d.file.url !== result.url);
      form.setValue("documents" as Path<T>, filtered as any, {
        shouldDirty: true,
        shouldTouch: true,
      });

      // Call media service to delete
      try {
        await mediaService.delete(result.fileId);
      } catch (error) {
        console.error("Failed to delete media:", error);
      }
    }

    // remove preview entry
    clear(id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[35%_auto] gap-4 rounded-2xl border p-5">
      {/* ---------------- Left: Upload ---------------- */}

      <Card className="rounded-2xl border border-border/60">
        <CardHeader>
          <CardTitle className="text-lg">Document Upload</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select a document type and upload the corresponding file.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* ================= DOCUMENT TYPE ================= */}
          <Select
            value={docType ?? undefined}
            onValueChange={setDocType}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              {DOCUMENT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          {/* ================= CUSTOM NAME ================= */}
          {docType === "other" && (
            <Input
              placeholder="Enter document name (e.g. Migration Certificate)"
              value={customDocName}
              onChange={(e) => setCustomDocName(e.target.value)}
            />
          )}

          {/* ================= UPLOAD ZONE ================= */}
          <label
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-sm transition-all",
              "bg-muted/30 hover:bg-muted/50",
              (!docType || (docType === "other" && !customDocName)) &&
                "cursor-not-allowed opacity-60"
            )}
          >
            <Upload className="h-5 w-5" />
            <span className="font-medium">Upload file</span>
            <span className="text-xs text-muted-foreground">
              PNG, JPG, PDF supported
            </span>

            <Input
              type="file"
              multiple
              className="hidden"
              disabled={!docType || (docType === "other" && !customDocName)}
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>

          {/* ================= HELPER MESSAGE ================= */}
          {(!docType || (docType === "other" && !customDocName)) && (
            <p className="text-center text-xs text-muted-foreground">
              Please select a document type to enable upload
            </p>
          )}
        </CardContent>
      </Card>
      {/* ---------------- Right: Previews ---------------- */}
      <Card
        className={cn(Object.values(uploads).length === 0 && "hidden md:block")}
      >
        <CardContent>
          <div className="grid sm:grid-cols-2 grid-cols-1 md:grid-cols-3 gap-4 ">
            {Object.values(uploads).length === 0 ? (
              <div className="col-span-full h-full items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-4 py-14">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>

                  <div className="text-center space-y-1">
                    <p className="text-sm font-semibold">No documents added</p>
                    <p className="text-xs text-muted-foreground">
                      Choose a document type and upload files to see previews
                      here
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
            {Object.values(uploads).map((u) => (
              <div
                key={u.id}
                className="relative border rounded-xl p-2 aspect-square"
              >
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1 z-10 cursor-pointer rounded-2xl hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    if (u.status === "success" && u.result) {
                      removeUploaded(u.id, u.result);
                    } else {
                      cancel(u.id);
                      clear(u.id);
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="relative aspect-square">
                  {u.file.type.startsWith("image/") ? (
                    <img
                      src={u.previewUrl || ""}
                      className={`h-full w-full object-cover rounded-md ${
                        u.status === "uploading"
                          ? "cursor-default opacity-80"
                          : "cursor-pointer"
                      }`}
                      onClick={() =>
                        u.status !== "uploading" &&
                        u.previewUrl &&
                        setOpenImage(u.previewUrl)
                      }
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-muted rounded-md">
                      <FileText />
                    </div>
                  )}

                  {u.status === "uploading" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-md">
                      <div className="text-white text-sm font-medium">
                        {u.progress}%
                      </div>
                      <div className="w-3/4 h-2 bg-white/30 rounded mt-2">
                        <div
                          className="h-full bg-white rounded transition-all duration-300 ease-out"
                          style={{ width: `${u.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-center mt-2 truncate">
                  {u.fileName}
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {u.status === "error" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        retry(
                          u.id,
                          studentId ? `/students/${studentId}` : undefined
                        )
                      }
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ---------------- Fullscreen Image ---------------- */}
      <Dialog open={!!openImage} onOpenChange={() => setOpenImage(null)}>
        <DialogContent className="w-screen h-screen p-0 bg-black/90">
          <span className="absolute top-4 right-4 text-white text-sm">
            Click outside to close
          </span>
          {openImage && (
            <img
              src={openImage}
              className="max-w-full max-h-full object-contain mx-auto"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
