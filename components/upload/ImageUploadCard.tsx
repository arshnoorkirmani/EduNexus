"use client";

import { useState } from "react";
import { uploadFileToImageKit } from "@/helper/imagekit.client";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type Props = {
  folder: string;
  onUploaded: (url: string) => void;
};

export function ImageUploadCard({ folder, onUploaded }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleUpload(file: File) {
    setLoading(true);
    const result = await uploadFileToImageKit(file, { folder });
    onUploaded(result.url);
    setLoading(false);
  }

  return (
    <label className="border-dashed border rounded-xl p-4 cursor-pointer">
      <input
        type="file"
        hidden
        accept="image/*"
        onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
      />
      <Button disabled={loading}>
        {loading ? "Uploading..." : "Upload Image"}
      </Button>
    </label>
  );
}
