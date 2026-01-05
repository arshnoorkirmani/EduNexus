import { Document, Schema, Types } from "mongoose";

export interface User extends Document {
  _id: Types.ObjectId | string;
  auth: {
    userId: string;
    email?: string;
    password: string;
    userType: "admin" | "teacher" | "student";
    verify: {
      isVerified: boolean;
      isLoginEnabled: boolean;
    };
    lastLogin: Date | null;
  };

  institute: {
    instituteId?: Schema.Types.ObjectId;
    institute_code: string;
    institute_name: string;
    owner_name: string;
    owner_mobile: string;
    owner_email: string;
    owner_profile_url: string;
    owner_logo: string;
  }; // only for teacher & student

  personal: {
    name: string;
    avatar?: string;
    mobile?: string;
    gender?: "male" | "female" | "other";
    profile_url: string;
  };

  documents: {
    profilePhoto?: string;
    aadhaar?: string;
    birthCertificate?: string;
  };
  permissions: Record<string, boolean>;

  metadata: {
    createdBy?: Schema.Types.ObjectId;
    updatedBy?: Schema.Types.ObjectId;
  };
}
