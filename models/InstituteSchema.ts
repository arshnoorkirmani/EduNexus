import { Schema, model, models, Model } from "mongoose";
import { Institute } from "@/types/models/institute.model";

const InstituteSchema = new Schema<Institute>(
  {
    // -----------------------------
    // INSTITUTE INFORMATION
    // -----------------------------
    information: {
      institute_name: { type: String, required: true },
      short_name: { type: String, default: null },
      institute_code: { type: String, default: null },

      address: { type: String, default: null },
      city: { type: String, default: null },
      state: { type: String, default: null },
      pincode: { type: String, default: null },
      country: { type: String, default: null },

      mobile: { type: String, default: null },
      email: { type: String, default: null },
      website: { type: String, default: null },

      currency: { type: String, default: "INR" },
      timezone: { type: String, default: "Asia/Kolkata" },
      working_hours: { type: String, default: "9AM - 5PM" },

      institute_type: { type: String, default: null },
      affiliation: { type: String, default: null },

      established_year: {
        type: Number,
        default: () => new Date().getFullYear(),
      },

      logo: { type: String, default: null },
      profile_url: { type: String, default: null },
    },

    // -----------------------------
    // AUTH ACCOUNT (PRIMARY LOGIN)
    // -----------------------------
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    password: { type: String, required: true },

    role: { type: String, default: "institute", required: true },

    // -----------------------------
    // VERIFICATION
    // -----------------------------
    isVerified: { type: Boolean, default: false },
    verifyCode: String,
    verifyCodeExpiry: Date,

    // Password reset
    forgotPasswordCode: Number,
    forgotPasswordCodeExpiry: Date,
    forgotPasswordRequest: { type: Boolean, default: false },

    // -----------------------------
    // PERMISSIONS (ADMIN-LEVEL)
    // -----------------------------
    permissions: {
      super: { type: Boolean, default: true },

      profile: {
        edit: { type: Boolean, default: true },
      },

      communication: {
        send_message: { type: Boolean, default: true },
        inbox_message: { type: Boolean, default: true },
      },

      user_management: {
        show: { type: Boolean, default: true },
        add: { type: Boolean, default: true },
        edit: { type: Boolean, default: true },
        delete: { type: Boolean, default: true },
      },

      student_management: {
        show: { type: Boolean, default: true },
        add: { type: Boolean, default: true },
        edit: { type: Boolean, default: true },
        delete: { type: Boolean, default: true },
        attendance: { type: Boolean, default: true },
        result: { type: Boolean, default: true },
      },

      teacher_management: {
        show: { type: Boolean, default: true },
        add: { type: Boolean, default: true },
        edit: { type: Boolean, default: true },
        delete: { type: Boolean, default: true },
      },

      finance: {
        salary_management: { type: Boolean, default: true },
        fees_management: { type: Boolean, default: true },
      },

      settings: {
        settings: { type: Boolean, default: true },
        website_settings: { type: Boolean, default: true },
      },
    },

    // -----------------------------
    // SYSTEM FIELDS
    // -----------------------------
    lastLogin: { type: Date, default: null },

    status: {
      type: String,
      enum: ["active", "inactive", "blocked", "pending"],
      default: "active",
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//
// INDEXES
//
InstituteSchema.index({ email: 1 }, { unique: true });
InstituteSchema.index({ "information.email": 1 }, { sparse: true });
InstituteSchema.index(
  { "information.institute_code": 1 },
  { unique: true, sparse: true }
);
InstituteSchema.index(
  { "information.profile_url": 1 },
  { unique: true, sparse: true }
);
InstituteSchema.index({
  "information.institute_name": "text",
  "information.short_name": "text",
});
InstituteSchema.index({ isVerified: -1 });
InstituteSchema.index({ createdAt: -1 });
InstituteSchema.index({ updatedAt: -1 });

const InstituteModel =
  (models?.Institute as Model<Institute>) ??
  model<Institute>("Institute", InstituteSchema);

export default InstituteModel;
