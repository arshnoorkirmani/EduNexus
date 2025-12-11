export interface Student extends Document {
  _id: Types.ObjectId | string;
  auth: {
    studentId: string;
    password: string;
    userType: string;
    verify: { isVerify: boolean; isActive: boolean };
    lastLogin: Date | null;
  };

  institute: {
    instituteId: Schema.Types.ObjectId;
    instituteCode: string;
  };

  personal: {
    firstName: string;
    lastName?: string;
    name: string;
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
    rollNo: string;
    className: string;
    section?: string;
    courseName: string;
    admissionDate: Date;
    previousSchool?: string;
    course?: {
      groupTitle?: string;
      courseTitle?: string;
      baseFee?: number;
    };
  };

  permissions: {
    all: boolean; // grant all student permissions
    profileEdit: boolean; // edit own profile
    sendMessage: boolean; // send message to teacher/institute
    inboxMessage: boolean; // receive messages
    viewFees: boolean; // view fees & payment history
    downloadDocuments: boolean; // download study materials, receipts, results
    viewResults: boolean; // view exam results
    attendanceView: boolean; // view attendance
    assignmentsView: boolean; // view assignments/homework
    timetableView: boolean; // view timetable/schedule
  };

  documents: {
    profilePhoto?: string;
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

  status: "active" | "inactive" | "left" | "terminated";
  lastUpdatedBy?: Schema.Types.ObjectId;
}
