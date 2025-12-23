"use client";

import { useEffect, useState } from "react";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, RotateCcw, FileText, Trash, Check } from "lucide-react";
import type { ImageKitUploadResult } from "@/types/imagekit";
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

type Props<
  T extends FieldValues & {
    auth?: { studentId?: string };
    documents?: unknown[];
  }
> = {
  form: UseFormReturn<T>;
};

export function DocumentUploadCard<
  T extends FieldValues & {
    auth?: { studentId?: string };
    documents?: unknown[];
  }
>({ form }: Props<T>) {
  const [docType, setDocType] = useState("");
  const [customDocName, setCustomDocName] = useState("");
  const [openImage, setOpenImage] = useState<string | null>(null);

  const { uploads, startUpload, retry, cancel, clear, clearAll } =
    useImageKitUpload();
  useEffect(() => {
    const docs = form.getValues("documents" as Path<T>);
    if (!docs || docs.length === 0) {
      clearAll();
    }
  }, [form.watch("documents" as Path<T>)]);
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

    Array.from(files).forEach(async (file) => {
      const folderPath = studentId ? `/students/${studentId}` : undefined;
      console.log("Document Upload", label);
      const result = await startUpload(file, label, folderPath);

      if (!result) return;

      /* ------------------- Save to Form (StudentDocument) ------------------- */

      const existing = (form.getValues("documents" as Path<T>) as any[]) || [];
      const newDoc = {
        type: label,
        file: {
          name: result.name,
          url: result.url,
          mimeType: file.type,
          size: result.size,
        },
        uploadedAt: new Date(),
        uploadedBy: {
          name: "Admin",
          email: "admin@ims.com",
        },
        visibility: "admin",
      };

      form.setValue("documents" as Path<T>, [...existing, newDoc] as any);

      /* ----------------------- Save to Media (Cron) ------------------------- */

      console.log("/api/media", {
        method: "POST",
        body: {
          file: {
            provider: "imagekit",
            providerFileId: result.fileId,
            name: result.name,
            url: result.url,
            thumbnailUrl: result.thumbnailUrl,
            mimeType: file.type,
            size: result.size,
            type: file.type.startsWith("image/")
              ? "image"
              : file.type === "application/pdf"
              ? "pdf"
              : "other",
          },
          owner: {
            entity: "student",
            entityId: studentId ?? "",
            field: "documents",
          },
          status: "uploaded",
          visibility: "admin",
        },
      });
    });

    // Remove an uploaded item: delete from form documents and clear preview
  };
  const removeUploaded = (id: string, result?: ImageKitUploadResult) => {
    if (result) {
      const existing = (form.getValues("documents" as Path<T>) as any[]) || [];
      const filtered = existing.filter((d) => d?.file?.url !== result.url);
      form.setValue("documents" as Path<T>, filtered as any);
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
          <Select value={docType ?? undefined} onValueChange={setDocType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Aadhaar Card">Aadhaar Card</SelectItem>
              <SelectItem value="10th Marksheet">10th Marksheet</SelectItem>
              <SelectItem value="12th Marksheet">12th Marksheet</SelectItem>
              <SelectItem value="Profile Photo">Profile Photo</SelectItem>
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
              <div key={u.id} className="relative border rounded-xl p-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1 z-10 cursor-pointer rounded-2xl hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    cancel(u.id);
                    clear(u.id);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="relative">
                  {u.file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(u.file)}
                      className={`h-32 w-full object-cover rounded-md ${
                        u.status === "uploading"
                          ? "cursor-default opacity-80"
                          : "cursor-pointer"
                      }`}
                      onClick={() =>
                        u.status !== "uploading" &&
                        setOpenImage(URL.createObjectURL(u.file))
                      }
                    />
                  ) : (
                    <div className="h-32 flex items-center justify-center bg-muted rounded-md">
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
