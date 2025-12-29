import { StudentDocument } from "@/types/imagekit";
import { Schema } from "mongoose";

/* ================= FILE INFO ================= */

export const StudentDocumentFileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    size: {
      type: Number, // bytes
      required: true,
    },
  },
  { _id: false }
);

/* ================= UPLOADED BY ================= */

export const UploadedBySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },
  },
  { _id: false }
);

/* ================= STUDENT DOCUMENT ================= */

export const StudentDocumentSchema = new Schema<StudentDocument>(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "Aadhaar Card",
        "Marksheet",
        "10th Marksheet",
        "12th Marksheet",
        "Transfer Certificate",
        "Profile Photo",
        "Other",
      ],
    },

    file: {
      type: StudentDocumentFileSchema,
      required: true,
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },

    uploadedBy: {
      type: UploadedBySchema,
      required: true,
    },
    visibility: {
      type: String,
      enum: ["institute", "user", "student", "public"],
      default: "institute",
    },
  },
  {
    _id: true,
    timestamps: false,
  }
);
