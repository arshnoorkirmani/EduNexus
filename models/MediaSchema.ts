// models/Media.ts
import { Schema, model, models } from "mongoose";

import {
  MediaProvider,
  MediaType,
  MediaStatus,
  MediaVisibility,
  OwnerEntity,
} from "@/types/media";

/* -------------------------------------------------------------------------- */
/* Schema                                                                     */
/* -------------------------------------------------------------------------- */

const MediaSchema = new Schema(
  {
    /* ---------------- Storage Provider ---------------- */

    provider: {
      type: String,
      enum: Object.values(MediaProvider),
      required: true,
      default: MediaProvider.IMAGEKIT,
    },

    providerFileId: {
      type: String,
      required: true,
      unique: true,
      index: true, // required for delete/replace ops
    },

    url: {
      type: String,
      required: true,
    },

    thumbnailUrl: {
      type: String,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
      min: 0,
    },

    type: {
      type: String,
      enum: Object.values(MediaType),
      required: true,
    },

    /* ---------------- Ownership ---------------- */

    owner: {
      entity: {
        type: String,
        enum: Object.values(OwnerEntity),
        required: true,
      },

      entityId: {
        type: String,
        required: true,
        index: true,
      },

      field: {
        type: String,
        required: true, // e.g. "documents", "profilePhoto"
      },
    },

    /* ---------------- Access Control ---------------- */

    visibility: {
      type: String,
      enum: Object.values(MediaVisibility),
      default: MediaVisibility.INSTITUTE,
      index: true,
    },

    /* ---------------- Lifecycle ---------------- */

    status: {
      type: String,
      enum: Object.values(MediaStatus),
      default: MediaStatus.TEMPORARY,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },

    uploadedBy: {
      institute_name: { type: String },
      name: { type: String },
      email: { type: String },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* -------------------------------------------------------------------------- */
/* Indexes                                                                    */
/* -------------------------------------------------------------------------- */

// Fast lookup for entity-based cleanup
MediaSchema.index({
  "owner.entity": 1,
  "owner.entityId": 1,
});

// Cleanup temporary files
MediaSchema.index({
  status: 1,
  createdAt: 1,
});

/* -------------------------------------------------------------------------- */
/* Model                                                                      */
/* -------------------------------------------------------------------------- */

export const Media = models.Media || model("Media", MediaSchema);
