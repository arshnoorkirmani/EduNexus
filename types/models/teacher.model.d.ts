export interface Teacher extends Document {
  _id: Types.ObjectId | string;
  auth: {
    teacherId: string;
    password: string;
    userType: string;
    verify: {
      isVerified: boolean;
      isLoginEnabled: boolean;
    };
    lastLogin: Date | null;
  };

  institute: {
    instituteId: Schema.Types.ObjectId;
    institute_name: string;
    institute_code: string;
  };

  personal: {
    name: string;
    firstName: string;
    lastName?: string;
    email?: string;
    mobile?: string;
    gender?: string;
    dob?: Date;
    address?: {
      line?: string;
      city?: string;
      state?: string;
      pincode?: string;
      country?: string;
    };
  };

  professional: {
    qualification?: string;
    experience?: number; // years
    subjects?: string[];
  };
  documents: {
    profilePhoto?: string;
    aadhaar?: string;
    birthCertificate?: string;
  };
  permissions: {
    all: boolean;
    sendMessage: boolean;
    inboxMessage: boolean;
    attendanceManage: boolean;
    assignmentsManage: boolean;
    resultManage: boolean;
    timetableView: boolean;
    studentView: boolean;
    studentProfileView: boolean;
    studyMaterialUpload: boolean;
    studyMaterialDelete: boolean;
    profileEdit: boolean;
  };

  status: "active" | "inactive" | "terminated";

  lastUpdatedBy?: Schema.Types.ObjectId;
}
