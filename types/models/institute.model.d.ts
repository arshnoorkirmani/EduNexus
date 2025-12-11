import { Document, Mongoose, Schema } from "mongoose";

export interface Institute extends Document {
  _id: Types.ObjectId | string;
  // -------------------------------------
  // INSTITUTE INFORMATION
  // -------------------------------------
  information: {
    institute_name: string;
    short_name?: string | null;
    institute_code?: string | null;

    address?: string | null;
    city?: string | null;
    state?: string | null;
    pincode?: string | null;
    country?: string | null;

    mobile?: string | null;
    email?: string | null;
    website?: string | null;

    currency: string;
    timezone: string;
    working_hours?: string | null;

    institute_type?: string | null;
    affiliation?: string | null;

    established_year: number;

    logo?: string | null;
    profile_url?: string | null;
  };

  // -------------------------------------
  // PRIMARY LOGIN ACCOUNT
  // -------------------------------------
  username: string;
  email: string;
  password: string;
  user_type: "institute";

  // -------------------------------------
  // VERIFICATION & PASSWORD RESET
  // -------------------------------------
  isVerified: boolean;
  verifyCode?: string | null;
  verifyCodeExpiry?: Date | null;

  forgotPasswordCode?: number | null;
  forgotPasswordCodeExpiry?: Date | null;
  forgotPasswordRequest: boolean;

  // -------------------------------------
  // PERMISSIONS FOR INSTITUTE ADMIN
  // -------------------------------------
  permissions: {
    all: boolean;

    profileEdit: boolean;
    sendMessage: boolean;
    inboxMessage: boolean;

    websiteSetting: boolean;

    addTeacher: boolean;
    editTeacher: boolean;
    deleteTeacher: boolean;

    addStudent: boolean;
    editStudent: boolean;
    deleteStudent: boolean;

    salaryManagement: boolean;
    feesManagement: boolean;
    resultPermission: boolean;

    attendance: boolean;
    manageUsers: boolean;
    settings: boolean;

    showStudent: boolean;
    showTeacher: boolean;
  };

  // -------------------------------------
  // SYSTEM FIELDS
  // -------------------------------------
  lastLogin?: Date | null;
  isOnboarded: boolean;
  status: "active" | "inactive" | "blocked" | "pending";

  createdAt?: Date;
  updatedAt?: Date;
}
