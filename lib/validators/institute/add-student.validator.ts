import { z } from "zod";

/* -------------------------------------------------------------------------- */
/* Reusable helpers                                                           */
/* -------------------------------------------------------------------------- */

const objectId = z
  .string({ message: "ID is required" })
  .min(1, { message: "Invalid ID" });

const phoneNumber = z
  .string({ message: "Mobile number is required" })
  .regex(/^(\+91[\-\s]?)?[6-9]\d{9}$/, { message: "Invalid mobile number" });

const timeHHMM = z
  .string({ message: "Time is required" })
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: "Invalid time format (HH:mm)",
  });

/* -------------------------------------------------------------------------- */
/* Enums                                                                      */
/* -------------------------------------------------------------------------- */

const GenderEnum = z.enum(["male", "female", "other"], {
  message: "Invalid gender value",
});

const FeeStatusEnum = z.enum(["paid", "pending", "partial"], {
  message: "Invalid fee status",
});

const DocumentStatusEnum = z.enum(["uploaded", "verified", "rejected"], {
  message: "Invalid document status",
});

/**
 * Using literal here is correct since role is fixed.
 * Message ensures clarity if payload is tampered with.
 */
const UserRoleEnum = z.literal("student", { message: "Invalid user role" });

/* -------------------------------------------------------------------------- */
/* Schema                                                                     */
/* -------------------------------------------------------------------------- */

export const studentFormSchema = z
  .object({
    /* ================= AUTH ================= */

    auth: z.object({
      studentId: z
        .string({ message: "Student ID is required" })
        .min(1, { message: "Student ID is required" }),
      password: z
        .string({ message: "Password is required" })
        .min(6, { message: "Password must be at least 6 characters long" }),
      role: UserRoleEnum,

      verify: z.object({
        isVerified: z.boolean().default(false),
        isLoginEnabled: z.boolean().default(true),
      }),
    }),

    /* ================= INSTITUTE ================= */

    institute: z.object({
      instituteCode: z
        .string({ message: "Institute code is required" })
        .trim()
        .min(1, { message: "Institute code is required" }),
      instituteLogo: z
        .string()
        .url({ message: "Institute logo must be a valid URL" })
        .optional(),
      instituteName: z
        .string({ message: "Institute name is required" })
        .min(1, { message: "Institute name is required" }),
      address: z.string().optional(),
      ownerName: z.string().optional(),
    }),

    /* ================= PERSONAL ================= */

    personal: z.object({
      firstName: z
        .string({ message: "First name is required" })
        .min(2, { message: "First name must be at least 2 characters" }),

      lastName: z.string().optional(),

      fullName: z
        .string({ message: "Full name is required" })
        .min(1, { message: "Full name is required" }),

      gender: GenderEnum,

      dob: z.coerce.date({
        message: "Date of birth must be a valid date",
      }),

      mobile: phoneNumber,

      email: z
        .string()
        .email({ message: "Email must be a valid email address" })
        .optional(),

      fatherName: z.string().optional(),
      motherName: z.string().optional(),

      address: z.object({
        fullAddress: z.string().optional(),
        line: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        pincode: z.string().optional(),
        country: z.string().default("India"),
      }),
      photoUrl: z
        .string()
        .url({ message: "Photo URL must be a valid URL" })
        .optional(),
    }),

    /* ================= ACADEMIC ================= */

    academic: z.object({
      registrationNo: z
        .string({ message: "Registration number is required" })
        .min(1),

      rollNo: z.string({ message: "Roll number is required" }).min(1),

      timing: timeHHMM.optional(),

      admissionDate: z.coerce.date({
        message: "Admission date must be a valid date",
      }),

      course: z
        .object({
          name: z
            .string({ message: "Course name is required" })
            .min(1, "Course is required"),

          groupTitle: z.string().optional(),
          course_code: z.string().optional(),
          duration: z.object({
            unit: z.string(),
            value: z.number(),
          }),
          baseFee: z
            .number({ message: "Base fee must be a number" })
            .nonnegative({ message: "Base fee cannot be negative" })
            .optional(),
        })
        .optional(),
    }),

    /* ================= PERMISSIONS ================= */

    permissions: z.object({
      superAccess: z.boolean().default(false),

      profile: z.object({
        show: z.boolean(),
        edit: z.boolean(),
      }),

      communication: z.object({
        sendMessage: z.boolean(),
        inboxMessage: z.boolean(),
      }),

      fees: z.object({
        view: z.boolean(),
        pay: z.boolean(),
      }),

      document: z.object({
        upload: z.boolean(),
        download: z.boolean(),
      }),

      result: z.object({ view: z.boolean() }),
      attendance: z.object({ view: z.boolean() }),
      assignments: z.object({ view: z.boolean() }),
      timetable: z.object({ view: z.boolean() }),
    }),

    /* ================= FEES ================= */

    fees: z.object({
      totalFees: z.coerce
        .number({ message: "Total fees must be a number" })
        .nonnegative({ message: "Total fees cannot be negative" }),

      paidFees: z.coerce
        .number({ message: "Paid fees must be a number" })
        .nonnegative({ message: "Paid fees cannot be negative" }),

      remainingFees: z.coerce
        .number({ message: "Remaining fees must be a number" })
        .nonnegative({ message: "Remaining fees cannot be negative" }),

      status: FeeStatusEnum,
    }),

    /* ================= DOCUMENTS ================= */

    documents: z.array(
      z.object({
        type: z.string({ message: "Document type is required" }).min(1),

        file: z.object({
          name: z.string({ message: "File name is required" }),
          url: z
            .string({ message: "File URL is required" })
            .url({ message: "File URL must be valid" }),
          mimeType: z.string(),
          size: z
            .number({ message: "File size must be a number" })
            .nonnegative(),
        }),

        uploadedAt: z.coerce.date({
          message: "Uploaded date must be valid",
        }),

        uploadedBy: z.object({
          name: z.string({ message: "Uploader name is required" }),
          email: z
            .string({ message: "Uploader email is required" })
            .email({ message: "Uploader email must be valid" }),
        }),

        verified: z
          .object({
            status: z.boolean(),
            verifiedAt: z.coerce.date().optional(),
            verifiedBy: z.string().optional(),
          })
          .optional(),

        visibility: z
          .enum(["institute", "user", "student", "public"])
          .optional(),
      })
    ),
  })

  /* ------------------------------------------------------------------------ */
  /* Cross-field refinements                                                   */
  /* ------------------------------------------------------------------------ */

  .refine(
    (data) =>
      data.personal.fullName ===
      [data.personal.firstName, data.personal.lastName]
        .filter(Boolean)
        .join(" "),
    {
      path: ["personal", "fullName"],
      message: "Full name must match first and last name",
    }
  )

  .refine(
    (data) =>
      data.fees.remainingFees === data.fees.totalFees - data.fees.paidFees,
    {
      path: ["fees", "remainingFees"],
      message: "Remaining fees must equal total fees minus paid fees",
    }
  );

export type StudentFormData = z.infer<typeof studentFormSchema>;
