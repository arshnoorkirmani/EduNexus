import Image from "next/image";
import { FileText } from "lucide-react";

type Props = {
  file: File;
};

export function FilePreview({ file }: Props) {
  if (file.type.startsWith("image/")) {
    const url = URL.createObjectURL(file);
    return (
      <Image
        src={url}
        alt={file.name}
        width={120}
        height={120}
        className="rounded-lg object-cover"
      />
    );
  }

  if (file.type === "application/pdf") {
    return (
      <div className="flex items-center gap-2 text-sm">
        <FileText className="h-5 w-5" />
        {file.name}
      </div>
    );
  }

  return <span className="text-sm">{file.name}</span>;
}
