export type StudentStatus =
  | "active"
  | "inactive"
  | "passed"
  | "failed"
  | "suspended"
  | "dropout";

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
    timeing: Date;
    admissionDate: Date;
    course?: {
      name: string;
      groupTitle?: string;
      courseTitle?: string;
      baseFee?: number;
    };
  };

  permissions: {
    super: boolean; // grant all student permissions
    profile: {
      show: boolean;
      edit: boolean;
    }; // edit own profile
    communication: {
      sendMessage: boolean; // send messages
      inboxMessage: boolean; // view inbox messages
    };
    fees: {
      view: boolean;
      pay: boolean;
    };
    document: {
      upload: boolean;
      download: boolean;
    };
    result: {
      view: boolean;
    };
    attendance: {
      view: boolean;
    };
    assignments: {
      view: boolean;
    };
    timetable: {
      view: boolean;
    };
  };

  documents: {
    profilePhoto?: {
      url: string;
      uploadedAt: Date;
    };
    aadhaar?: string;
    birthCertificate?: string;
  };

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
