import { Student } from "@/types/models/student.model";
import { model, models, Schema } from "mongoose";
import { StudentDocumentSchema } from "./StudentDocument";
import { hash } from "bcryptjs";

const StudentSchema = new Schema<Student>(
  {
    /* ================= AUTH ================= */
    auth: {
      studentId: { type: String, required: true, trim: true },
      password: { type: String, required: true, select: false },
      role: { type: String, default: "student", immutable: true },
      verify: {
        isVerified: { type: Boolean, default: false },
        isLoginEnabled: { type: Boolean, default: true },
      },
      lastLogin: { type: Date, default: null },
    },

    /* ================= INSTITUTE ================= */
    institute: {
      instituteId: {
        type: Schema.Types.ObjectId,
        ref: "Institute",
        required: true,
      },
      instituteCode: { type: String, required: true },
      instituteLogo: { type: String, default: null },
      instituteName: { type: String, required: true },
    },

    /* ================= PERSONAL ================= */
    personal: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, trim: true },
      fullName: { type: String, required: true },
      gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true,
      },
      dob: { type: Date, required: true },
      mobile: { type: String, required: true },
      email: { type: String, lowercase: true, trim: true },
      fatherName: String,
      motherName: String,
      address: {
        fullAddress: String,
        line: String,
        city: String,
        state: String,
        pincode: String,
        country: String,
      },
    },

    /* ================= ACADEMIC ================= */
    academic: {
      registrationNo: { type: String, required: true },
      rollNo: { type: String, required: true },
      timing: { type: String, required: true, trim: true, default: "00:00" },
      admissionDate: { type: Date, required: true },
      course: {
        name: String,
        groupTitle: String,
        course_code: String,
        duration: {
          unit: String,
          value: Number,
        },
        baseFee: Number,
      },
    },

    /* ================= DOCUMENTS ================= */
    documents: {
      type: [StudentDocumentSchema],
      default: [],
    },

    /* ================= FEES ================= */
    fees: {
      totalFees: { type: Number, required: true },
      paidFees: { type: Number, default: 0 },
      remainingFees: { type: Number, default: 0 },
      status: {
        type: String,
        enum: ["paid", "pending", "partial"],
        default: "pending",
      },
      detail: [
        {
          date: { type: Date, required: true },
          amount: { type: Number, required: true },
          method: { type: String, required: true },
        },
      ],
    },
    /* ================= PERMISSIONS ================= */
    permissions: {
      superAccess: { type: Boolean, default: false },

      profile: {
        show: { type: Boolean, default: true },
        edit: { type: Boolean, default: false },
      },

      communication: {
        sendMessage: { type: Boolean, default: false },
        inboxMessage: { type: Boolean, default: false },
      },

      fees: {
        view: { type: Boolean, default: true },
        pay: { type: Boolean, default: false },
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

    /* ================= STATUS ================= */
    currentStatus: {
      type: String,
      enum: ["active", "inactive", "passed", "failed", "suspended", "dropout"],
      default: "active",
    },

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

StudentSchema.pre("save", async function (next) {
  if (this.isModified("auth.password")) {
    this.auth.password = await hash(this.auth.password, 12);
  }
  next();
});

StudentSchema.index(
  { "auth.studentId": 1, "institute.instituteId": 1 },
  { unique: true }
);

StudentSchema.index(
  { "academic.rollNo": 1, "institute.instituteId": 1 },
  { unique: true }
);

StudentSchema.index({ "institute.instituteId": 1 });
StudentSchema.index({ currentStatus: 1 });
StudentSchema.index({ "fees.status": 1 });
StudentSchema.index({ "academic.admissionDate": -1 });

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

StudentSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as any;

  if (update?.fees) {
    update.fees.remainingFees =
      (update.fees.totalFees ?? 0) - (update.fees.paidFees ?? 0);
  }
  next();
});
if (process.env.NODE_ENV === "development" && models.Student) {
  delete models.Student;
}

export const StudentModel =
  models.Student || model<Student>("Student", StudentSchema);
