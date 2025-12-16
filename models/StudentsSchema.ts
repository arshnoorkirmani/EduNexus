import { Student } from "@/types/models/student.model";
import { Schema, model, models } from "mongoose";
const StudentSchema = new Schema<Student>(
  {
    // =========================
    // AUTH
    // =========================
    auth: {
      studentId: {
        type: String,
        required: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
        select: false,
      },
      role: {
        type: String,
        default: "student",
        immutable: true,
      },
      verify: {
        isVerified: { type: Boolean, default: false },
        isLoginEnabled: { type: Boolean, default: true },
      },
      lastLogin: { type: Date, default: null },
    },

    // =========================
    // INSTITUTE
    // =========================
    institute: {
      instituteId: {
        type: Schema.Types.ObjectId,
        ref: "Institute",
        required: true,
        index: true,
      },
      instituteCode: { type: String, required: true, index: true },
      instituteLogo: { type: String, default: null },
      instituteName: { type: String, required: true },
    },

    // =========================
    // PERSONAL
    // =========================
    personal: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, trim: true },
      fullName: { type: String, required: true, index: true },
      gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true,
      },
      dob: { type: Date, required: true },
      mobile: { type: String, required: true, index: true },
      email: { type: String, lowercase: true, trim: true },
      fatherName: String,
      address: {
        line: String,
        city: String,
        state: String,
        pincode: String,
        country: String,
      },
    },

    // =========================
    // ACADEMIC
    // =========================
    academic: {
      registrationNo: { type: String, required: true, index: true },
      rollNo: { type: String, required: true, index: true },
      timeing: { type: Date, required: true },
      admissionDate: { type: Date, required: true, index: true },
      course: {
        name: String,
        groupTitle: String,
        courseTitle: String,
        baseFee: Number,
      },
    },

    // =========================
    // PERMISSIONS
    // =========================
    permissions: {
      super: { type: Boolean, default: false },
      profile: {
        show: { type: Boolean, default: true },
        edit: { type: Boolean, default: true },
      },
      communication: {
        sendMessage: { type: Boolean, default: true },
        inboxMessage: { type: Boolean, default: true },
      },
      fees: {
        view: { type: Boolean, default: true },
        pay: { type: Boolean, default: true },
      },
      document: {
        upload: { type: Boolean, default: true },
        download: { type: Boolean, default: true },
      },
      result: { view: { type: Boolean, default: true } },
      attendance: { view: { type: Boolean, default: true } },
      assignments: { view: { type: Boolean, default: true } },
      timetable: { view: { type: Boolean, default: true } },
    },

    // =========================
    // DOCUMENTS
    // =========================
    documents: {
      profilePhoto: {
        url: String,
        uploadedAt: Date,
      },
      aadhaar: String,
      birthCertificate: String,
    },

    // =========================
    // FEES
    // =========================
    fees: {
      totalFees: { type: Number, required: true },
      status: {
        type: String,
        enum: ["paid", "pending", "partial"],
        default: "pending",
        index: true,
      },
      paidFees: { type: Number, default: 0 },
      remainingFees: { type: Number, default: 0 },
      detail: [
        {
          date: { type: Date, required: true },
          amount: { type: Number, required: true },
          method: { type: String, required: true },
        },
      ],
    },

    // =========================
    // STATUS
    // =========================
    // status: {
    //   type: String,
    //   enum: ["active", "inactive", "passed", "failed", "suspended", "dropout"],
    //   default: "active",
    //   index: true,
    // },

    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            "active",
            "inactive",
            "passed",
            "failed",
            "suspended",
            "dropout",
          ],
          required: true,
        },
        date: { type: Date, default: Date.now },
        reason: String,
        updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
      },
    ],

    lastUpdatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Login (safe)
StudentSchema.index(
  { "auth.studentId": 1, "institute.instituteId": 1 },
  { unique: true }
);

// Institute queries
StudentSchema.index({ "institute.instituteId": 1 });

// Roll number
StudentSchema.index(
  { "academic.rollNo": 1, "institute.instituteId": 1 },
  { unique: true }
);

// Dashboards
StudentSchema.index({ "statusHistory.status": 1 });
StudentSchema.index({ "fees.status": 1 });

// Common compound
StudentSchema.index({
  "institute.instituteId": 1,
  status: 1,
});

// Admission timeline
StudentSchema.index({ "academic.admissionDate": -1 });

// Text search
StudentSchema.index(
  {
    "personal.firstName": "text",
    "personal.lastName": "text",
    "academic.rollNo": "text",
    "auth.studentId": "text",
  },
  { name: "StudentSearchIndex" }
);

StudentSchema.pre("save", function (next) {
  if (this.fees) {
    this.fees.remainingFees = this.fees.totalFees - this.fees.paidFees;
  }
  next();
});
export const StudentModel = models.Student || model("Student", StudentSchema);
