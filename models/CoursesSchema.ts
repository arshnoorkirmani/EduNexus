import { CourseDocument } from "@/types/models/course.model";
import { Schema, model, models, Types } from "mongoose";

/* ------------------------------------------------------------------ */
/* COURSE SCHEMA                                                       */
/* ------------------------------------------------------------------ */
const CourseSchema = new Schema<CourseDocument>(
  {
    course_code: {
      type: String,
      required: true,
      uppercase: true,
    },

    course_name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["university", "computer", "skill"],
      required: true,
    },

    duration: {
      value: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        enum: ["year", "month"],
        required: true,
      },
    },
    eligibility: {
      type: String,
    },

    fees: {
      total: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },

    status: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active",
      index: true,
    },

    description: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* ------------------------------------------------------------------ */
/* UNIQUE CONSTRAINT                                                   */
/* ------------------------------------------------------------------ */
// Same course_code cannot repeat in same institute
CourseSchema.index({ institute_code: 1, course_code: 1 }, { unique: true });

/* ------------------------------------------------------------------ */
/* MODEL EXPORT                                                        */
/* ------------------------------------------------------------------ */
export const CourseModel =
  models.Course || model<CourseDocument>("Course", CourseSchema);
