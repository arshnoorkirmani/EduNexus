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

    user_type: { type: String, default: "institute", required: true },

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
      all: { type: Boolean, default: true },

      profileEdit: { type: Boolean, default: true },
      sendMessage: { type: Boolean, default: true },
      inboxMessage: { type: Boolean, default: true },

      websiteSetting: { type: Boolean, default: true },

      // Teacher Management
      addTeacher: { type: Boolean, default: true },
      editTeacher: { type: Boolean, default: true },
      deleteTeacher: { type: Boolean, default: true },

      // Student Management
      addStudent: { type: Boolean, default: true },
      editStudent: { type: Boolean, default: true },
      deleteStudent: { type: Boolean, default: true },

      // Finance & Results
      salaryManagement: { type: Boolean, default: true },
      feesManagement: { type: Boolean, default: true },
      resultPermission: { type: Boolean, default: true },

      attendance: { type: Boolean, default: true },
      manageUsers: { type: Boolean, default: true },
      settings: { type: Boolean, default: true },

      showStudent: { type: Boolean, default: true },
      showTeacher: { type: Boolean, default: true },
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
