import { z } from "zod";

/* -------------------------------------------------------------------------- */
/* Reusable helpers                                                           */
/* -------------------------------------------------------------------------- */

const objectId = z
  .string({ message: "A valid identification string is required." })
  .min(1, { message: "Please provide a valid, non-empty identifier." });

const phoneNumber = z
  .string({ message: "A valid 10-digit mobile number is required." })
  .regex(/^(\+91[\-\s]?)?[6-9]\d{9}$/, { message: "Please enter a correctly formatted 10-digit mobile number." });

const timeHHMM = z
  .string({ message: "Please specify a valid time." })
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: "Time must be provided in the standard 24-hour format (HH:mm).",
  });

/* -------------------------------------------------------------------------- */
/* Enums                                                                      */
/* -------------------------------------------------------------------------- */

const GenderEnum = z.enum(["male", "female", "other"], {
  message: "Please select a valid gender option from the provided list.",
});

const FeeStatusEnum = z.enum(["paid", "pending", "partial"], {
  message: "Please select a formally recognized fee payment status.",
});

const DocumentStatusEnum = z.enum(["uploaded", "verified", "rejected"], {
  message: "The specified document status is not recognized by the system.",
});

/**
 * Using literal here is correct since role is fixed.
 * Message ensures clarity if payload is tampered with.
 */
const UserRoleEnum = z.literal("student", { message: "The assigned user role is invalid for this specific operation." });

/* -------------------------------------------------------------------------- */
/* Schema                                                                     */
/* -------------------------------------------------------------------------- */

export const studentFormSchema = z
  .object({
    /* ================= AUTH ================= */

    auth: z.object({
      studentId: z
        .string({ message: "A unique Student ID must be generated to proceed." })
        .min(1, { message: "A unique Student ID is required." }),
      password: z
        .string({ message: "Please formulate a secure password for the student portal." })
        .min(6, { message: "For security compliance, the password must contain at least 6 characters." }),
      role: UserRoleEnum,

      verify: z.object({
        isVerified: z.boolean().default(false),
        isLoginEnabled: z.boolean().default(true),
      }),
    }),

    /* ================= INSTITUTE ================= */

    institute: z.object({
      instituteCode: z
        .string({ message: "The associated Institute Code cannot be omitted." })
        .trim()
        .min(1, { message: "An active Institute Code is unconditionally required." }),
      instituteLogo: z
        .string()
        .url({ message: "The institute's logo must be submitted as a valid web address (URL)." })
        .optional(),
      instituteName: z
        .string({ message: "Please provide the officially registered name of the institute." })
        .min(1, { message: "The registered institute name is required." }),
      address: z.string().optional(),
      ownerName: z.string().optional(),
    }),

    /* ================= PERSONAL ================= */

    personal: z.object({
      firstName: z
        .string({ message: "The student's first name is required for registration." })
        .min(2, { message: "The first name must consist of at least 2 characters." }),

      lastName: z.string().optional(),

      fullName: z
        .string({ message: "The student's full aggregated name is required." })
        .min(1, { message: "The student's full name is required." }),

      gender: GenderEnum,

      dob: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
      }, z.date({
        message: "Please select a valid, recognized date of birth from the calendar.",
      })),

      mobile: phoneNumber,

      email: z
        .string()
        .email({ message: "Please enter a properly formatted academic or personal email address (e.g., student@example.com)." })
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
        .url({ message: "The profile photograph must be supplied via a valid, accessible web link." })
        .optional(),
    }),

    /* ================= ACADEMIC ================= */

    academic: z.object({
      registrationNo: z
        .string({ message: "An official Registration Number must be allocated to the student." })
        .min(1),

      rollNo: z.string({ message: "The designated Roll Number is required for academic tracking." }).min(1),

      timing: timeHHMM.optional(),

      admissionDate: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
      }, z.date({
        message: "Please specify a valid official admission induction date.",
      })),

      course: z
        .object({
          name: z
            .string({ message: "Please select a valid academic course from the registered curriculum." })
            .min(1, "An academic course assignment is required."),

          groupTitle: z.string().optional(),
          course_code: z.string().optional(),
          duration: z.object({
            unit: z.string(),
            value: z.number(),
          }),
          baseFee: z
            .number({ message: "The course's base fee must be entered as a numeric value." })
            .nonnegative({ message: "The course's base fee cannot mathematically be a negative amount." })
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
        .number({ message: "The total fee aggregate must be a valid numeric amount." })
        .nonnegative({ message: "Total fees assigned cannot be a negative amount." }),

      paidFees: z.coerce
        .number({ message: "The currently paid fee balance must be a valid numeric value." })
        .nonnegative({ message: "Processed fee payments cannot be recorded as a negative value." }),

      remainingFees: z.coerce
        .number({ message: "The remaining fee deficit must be a numeric value." })
        .nonnegative({ message: "The remaining fees cannot be negative. Please verify your total and paid input amounts." }),

      status: FeeStatusEnum,
    }),

    /* ================= DOCUMENTS ================= */

    documents: z.array(
      z.object({
        type: z.string({ message: "Please specify the exact classification type of the document being uploaded." }).min(1),

        file: z.object({
          name: z.string({ message: "The uploaded file must bear a valid, recognized document name." }),
          url: z
            .string({ message: "The document's file URL linkage is missing." })
            .url({ message: "The document must contain a valid, accessible secure download link." }),
          mimeType: z.string(),
          size: z
            .number({ message: "The document's file size metric must be rendered as a number." })
            .nonnegative(),
        }),

        uploadedAt: z.coerce.date({
          message: "The scheduled document verification and upload date is not correctly recognized.",
        }),

        uploadedBy: z.object({
          name: z.string({ message: "The authorizing administrator's name managing this upload is missing." }),
          email: z
            .string({ message: "The authorizing administrator's email is strictly required." })
            .email({ message: "The administrator's email associated with this secure upload is invalid." }),
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
      message: "The auto-calculated full name does not correspond accurately with the provided first and last name fields.",
    }
  )

  .refine(
    (data) =>
      data.fees.remainingFees === data.fees.totalFees - data.fees.paidFees,
    {
      path: ["fees", "remainingFees"],
      message: "The remaining fees amount violates validation. It must mathematically match the total fees minus the paid fees.",
    }
  );

export type StudentFormData = z.infer<typeof studentFormSchema>;
