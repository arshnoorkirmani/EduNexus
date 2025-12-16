import { Document, Schema } from "mongoose";

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

  instituteId?: Schema.Types.ObjectId; // only for teacher & student

  personal: {
    name: string;
    avatar?: string;
    mobile?: string;
    gender?: "male" | "female" | "other";
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
