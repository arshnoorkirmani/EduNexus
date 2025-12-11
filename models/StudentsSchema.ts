import { Student } from "@/types/models/student.model";
import { Schema, model, models } from "mongoose";
const StudentSchema = new Schema<Student>(
  {
    auth: {
      studentId: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      userType: { type: String, default: "student" },
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
      instituteCode: { type: String, required: true },
    },

    personal: {
      firstName: { type: String, required: true },
      lastName: { type: String, default: "" },
      gender: {
        type: String,
        enum: ["male", "female", "other"],
        default: "male",
      },
      dob: { type: Date, required: true },
      mobile: { type: String, required: true },
      email: { type: String, default: null },
      fatherName: { type: String, default: null },
      address: {
        line: { type: String, default: null },
        city: { type: String, default: null },
        state: { type: String, default: null },
        pincode: { type: String, default: null },
        country: { type: String, default: null },
      },
    },

    academic: {
      rollNo: { type: String, required: true },
      className: { type: String, required: true },
      section: { type: String, default: null },
      courseName: { type: String, required: true },
      admissionDate: { type: Date, required: true, default: Date.now },
      previousSchool: { type: String, default: null },
      course: {
        groupTitle: String,
        courseTitle: String,
        baseFee: Number,
      },
    },

    permissions: {
      all: { type: Boolean, default: false },
      profileEdit: { type: Boolean, default: true },
      sendMessage: { type: Boolean, default: true },
      inboxMessage: { type: Boolean, default: true },
      viewFees: { type: Boolean, default: true },
      downloadDocuments: { type: Boolean, default: true },
      viewResults: { type: Boolean, default: true },
      attendanceView: { type: Boolean, default: true },
      assignmentsView: { type: Boolean, default: true },
      timetableView: { type: Boolean, default: true },
    },

    documents: {
      profilePhoto: { type: String, default: null },
      aadhaar: { type: String, default: null },
      birthCertificate: { type: String, default: null },
    },

    fees: {
      totalFees: { type: Number, default: 0 },
      status: { type: String, default: "paid" },
      paidFees: { type: Number, default: 0 },
      remainingFees: { type: Number, default: 0 },
      detail: [
        {
          date: { type: Date, default: Date.now },
          amount: { type: Number, required: true },
          method: { type: String, default: "cash" },
        },
      ],
    },

    status: {
      type: String,
      enum: ["active", "inactive", "left", "terminated"],
      default: "active",
    },

    lastUpdatedBy: { type: Schema.Types.ObjectId, ref: "Teacher" },
  },

  { timestamps: true }
);

// Indexing for performance
StudentSchema.index({ "institute.instituteId": 1 });
StudentSchema.index(
  { "academic.rollNo": 1, "institute.instituteId": 1 },
  { unique: true }
);

export const StudentModel =
  models.Student || model<Student>("Student", StudentSchema);
