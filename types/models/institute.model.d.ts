import { Document, Mongoose, Schema } from "mongoose";
export interface InstitutePermissions {
  super: boolean;

  profile: {
    show: boolean;
    edit: boolean;
  };

  communication: {
    send_message: boolean;
    inbox_message: boolean;
  };

  user_management: {
    show: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
  };

  student_management: {
    show: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
    attendance: boolean;
    result: boolean;
  };

  teacher_management: {
    show: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
  };

  academics: {
    show_courses: boolean;
    add_courses: boolean;
    edit_courses: boolean;
    delete_courses: boolean;
  };

  finance: {
    salary_management: boolean;
    fees_management: boolean;
  };

  settings: {
    settings: boolean;
    website_settings: boolean;
  };
}

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
  role: "institute";

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
  permissions: InstitutePermissions;

  // -------------------------------------
  // SYSTEM FIELDS
  // -------------------------------------
  lastLogin?: Date | null;
  isOnboarded: boolean;
  status: "active" | "inactive" | "blocked" | "pending";

  createdAt?: Date;
  updatedAt?: Date;
}
