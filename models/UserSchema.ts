import { User } from "@/types/models/user.model";
import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema<User>(
  {
    auth: {
      userId: { type: String, required: true, unique: true },
      email: { type: String, default: null },
      password: { type: String, required: true },

      userType: {
        type: String,
        enum: ["admin", "teacher", "student"],
        required: true,
      },

      verify: {
        isVerified: { type: Boolean, default: false },
        isLoginEnabled: { type: Boolean, default: true },
      },

      lastLogin: { type: Date, default: null },
    },

    // Embedded institute details (denormalized)
    institute: {
      instituteId: {
        type: Schema.Types.ObjectId,
        ref: "Institute",
        default: null,
      },
      institute_code: { type: String, default: "" },
      institute_name: { type: String, default: "" },
      owner_name: { type: String, default: "" },
      owner_mobile: { type: String, default: "" },
      owner_email: { type: String, default: "" },
      owner_profile_url: { type: String, default: "" },
      owner_logo: { type: String, default: "" },
    },

    personal: {
      name: { type: String, required: true },
      avatar: { type: String, default: null },
      mobile: { type: String, default: null },
      gender: {
        type: String,
        enum: ["male", "female", "other"],
        default: "male",
      },
      profile_url: { type: String, default: "" },
    },
    documents: {
      profilePhoto: { type: String, default: null },
      aadhaar: { type: String, default: null },
      birthCertificate: { type: String, default: null },
    },

    // Permission map (dynamic)
    permissions: {
      type: Map,
      of: Boolean,
      default: {},
    },

    metadata: {
      createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
      updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    },
  },

  { timestamps: true }
);

// Indexes for speed
UserSchema.index({ "auth.userId": 1 }, { unique: true });
UserSchema.index({ "auth.userType": 1 });
UserSchema.index({ "institute.instituteId": 1 });

export const UserModel =
  mongoose.models.User || mongoose.model<User>("User", UserSchema);
