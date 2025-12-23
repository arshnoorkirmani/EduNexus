import { z } from "zod";

/* -------------------------------------------------------------------------- */
/* Reusable helpers                                                           */
/* -------------------------------------------------------------------------- */

const objectId = z.string().min(1, "Invalid ID");

const phoneNumber = z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number");

const timeHHMM = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time format");

/* -------------------------------------------------------------------------- */
/* Enums                                                                      */
/* -------------------------------------------------------------------------- */

const GenderEnum = z.enum(["male", "female", "other"]);
const FeeStatusEnum = z.enum(["paid", "pending", "partial"]);
const DocumentStatusEnum = z.enum(["uploaded", "verified", "rejected"]);
const UserRoleEnum = z.literal("student");

/* -------------------------------------------------------------------------- */
/* Schema                                                                     */
/* -------------------------------------------------------------------------- */

export const studentFormSchema = z
  .object({
    /* ================= AUTH ================= */

    auth: z.object({
      studentId: z.string().min(3),
      password: z.string().min(6),
      role: UserRoleEnum,
      verify: z.object({
        isVerified: z.boolean().default(false),
        isLoginEnabled: z.boolean().default(true),
      }),
    }),

    /* ================= INSTITUTE ================= */

    institute: z.object({
      instituteId: objectId,
      instituteCode: z.string(),
      instituteLogo: z.string().url().optional(),
      instituteName: z.string(),
    }),

    /* ================= PERSONAL ================= */

    personal: z.object({
      firstName: z.string().min(2),
      lastName: z.string().optional(),
      fullName: z.string(),
      gender: GenderEnum,
      dob: z.coerce.date(),
      mobile: phoneNumber,
      email: z.string().email().optional(),

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
    }),

    /* ================= ACADEMIC ================= */

    academic: z.object({
      registrationNo: z.string(),
      rollNo: z.string(),

      timing: timeHHMM.optional(),
      admissionDate: z.coerce.date(),

      course: z
        .object({
          name: z.string(),
          groupTitle: z.string().optional(),
          courseTitle: z.string().optional(),
          baseFee: z.number().nonnegative().optional(),
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
      totalFees: z.coerce.number().nonnegative(),
      paidFees: z.coerce.number().nonnegative(),
      remainingFees: z.coerce.number().nonnegative(),

      status: FeeStatusEnum,
    }),

    /* ================= DOCUMENTS ================= */

    documents: z.array(
      z.object({
        type: z.string(), // Aadhaar, Marksheet, TC, Photo
        name: z.string(),
        url: z.string().url(),
        size: z.number().positive(),
        mimeType: z.string(),
        status: DocumentStatusEnum,
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
      message: "Remaining fees must be totalFees - paidFees",
    }
  );
export type StudentFormData = z.infer<typeof studentFormSchema>;
