export type ImageKitUploadResult = {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  height?: number;
  width?: number;
  size: number;
  fileType: string;
};

export type VisibilityUser = "institute" | "user" | "student";

export type UploadedBy = {
  name: string;
  email: string;
};

export type StudentDocument = {
  type: string; // Aadhaar, Marksheet, TC
  file: {
    name: string;
    url: string;
    mimeType: string;
    size: number;
  };
  uploadedAt: Date;
  uploadedBy: UploadedBy;
  visibility: VisibilityUser;
};
