"use client";

import { useState } from "react";
import { uploadFileToImageKit } from "@/helper/imagekit.client";
import { FilePreview } from "./FilePreview";
import { Button } from "@/components/ui/button";
import { StudentDocument } from "@/types/imagekit";

type Props = {
  studentId: string;
  documentType: string;
  onUploaded: (doc: StudentDocument) => void;
};

export function DocumentUploadCard({
  studentId,
  documentType,
  onUploaded,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function upload() {
    if (!file) return;

    setLoading(true);

    const result = await uploadFileToImageKit(file, {
      folder: `/students/${studentId}/documents/${documentType}`,
    });

    onUploaded({
      type: documentType,
      file: {
        url: result.url,
        mimeType: file.type,
        size: file.size,
      },
      uploadedAt: new Date(),
      uploadedBy: {
        name: "Admin",
        email: "admin@ims.com",
      },
      visibility: "institute",
    });

    setLoading(false);
    setFile(null);
  }

  return (
    <div className="border rounded-xl p-4 space-y-3">
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      {file && <FilePreview file={file} />}

      <Button onClick={upload} disabled={!file || loading}>
        {loading ? "Uploading..." : "Upload Document"}
      </Button>
    </div>
  );
}
