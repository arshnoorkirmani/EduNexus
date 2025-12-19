export type StudentDocumentFile = {
  name: string;
  url: string;
  mimeType: string;
  size: number; // bytes
};

export type UploadedBy = {
  name: string;
  email: string;
};

export type StudentDocument = {
  type: string; // Aadhaar Card, Marksheet, TC, Profile Photo
  file: StudentDocumentFile;
  uploadedAt: Date;
  uploadedBy: UploadedBy;

  // optional future-ready fields
  verified?: {
    status: boolean;
    verifiedAt?: Date;
    verifiedBy?: string;
  };

  visibility?: "institute" | "user" | "student";
};

export interface Student extends Document {
  _id: Types.ObjectId | string;

  auth: {
    studentId: string;
    password: string;
    role: string;
    verify: {
      isVerified: boolean;
      isLoginEnabled: boolean;
    };
    lastLogin: Date | null;
  };

  institute: {
    instituteId: Schema.Types.ObjectId;
    instituteCode: string;
    instituteLogo: string;
    instituteName: string;
  };

  personal: {
    firstName: string;
    lastName?: string;
    fullName: string;
    gender: "male" | "female" | "other";
    dob: Date;
    mobile: string;
    email?: string;
    fatherName?: string;
    address?: {
      fullAddress?: string;
      line?: string;
      city?: string;
      state?: string;
      pincode?: string;
      country?: string;
    };
  };

  academic: {
    registertionNo: string;
    rollNo: string;
    timing: Date;
    admissionDate: Date;
    course?: {
      name: string;
      groupTitle?: string;
      courseTitle?: string;
      baseFee?: number;
    };
  };

  permissions: {
    super: boolean;
    profile: { show: boolean; edit: boolean };
    communication: { sendMessage: boolean; inboxMessage: boolean };
    fees: { view: boolean; pay: boolean };
    document: { upload: boolean; download: boolean };
    result: { view: boolean };
    attendance: { view: boolean };
    assignments: { view: boolean };
    timetable: { view: boolean };
  };

  /** ✅ NEW STRUCTURE */
  documents: StudentDocument[];

  fees: {
    totalFees: number;
    status: "paid" | "pending" | "partial";
    paidFees: number;
    remainingFees: number;
    detail: {
      date: Date;
      amount: number;
      method: string;
    }[];
  };

  statusHistory: {
    status: StudentStatus;
    date: Date;
    reason?: string;
    updatedBy: ObjectId;
  }[];

  lastUpdatedBy?: Schema.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}
