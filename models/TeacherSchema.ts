import { Teacher } from "@/types/models/teacher.model";
import mongoose, { Schema, Document } from "mongoose";

const TeacherSchema = new Schema<Teacher>(
  {
    auth: {
      teacherId: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      userType: { type: String, default: "teacher" },
      verify: {
        isVerify: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
      },
      lastLogin: { type: Date, default: null },
    },

    institute: {
      instituteId: {
        type: Schema.Types.ObjectId,
        ref: "Institute",
        required: true,
      },
    },

    personal: {
      name: { type: String, required: true },
      email: { type: String, default: null },
      mobile: { type: String, default: null },
      gender: {
        type: String,
        enum: ["male", "female", "other"],
        default: "male",
      },
      dob: { type: Date, default: null },

      address: {
        line: { type: String, default: null },
        city: { type: String, default: null },
        state: { type: String, default: null },
        pincode: { type: String, default: null },
        country: { type: String, default: null },
      },
    },

    professional: {
      qualification: { type: String, default: null },
      experience: { type: Number, default: 0 },
      subjects: [{ type: String }],
    },
    documents: {
      profilePhoto: { type: String, default: null },
      aadhaar: { type: String, default: null },
      birthCertificate: { type: String, default: null },
    },
    permissions: {
      all: { type: Boolean, default: false },

      sendMessage: { type: Boolean, default: true },
      inboxMessage: { type: Boolean, default: true },

      attendanceManage: { type: Boolean, default: false },
      assignmentsManage: { type: Boolean, default: false },
      resultManage: { type: Boolean, default: false },

      timetableView: { type: Boolean, default: true },
      studentView: { type: Boolean, default: true },
      studentProfileView: { type: Boolean, default: true },

      studyMaterialUpload: { type: Boolean, default: false },
      studyMaterialDelete: { type: Boolean, default: false },

      profileEdit: { type: Boolean, default: true },
    },

    status: {
      type: String,
      enum: ["active", "inactive", "terminated"],
      default: "active",
    },

    lastUpdatedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
  },

  { timestamps: true }
);

// Index for performance
TeacherSchema.index({ "auth.teacherId": 1 });
TeacherSchema.index({ "institute.instituteId": 1 });

export const TeacherModel =
  mongoose.models.Teacher || mongoose.model<Teacher>("Teacher", TeacherSchema);
