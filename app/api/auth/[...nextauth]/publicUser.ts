import { Institute } from "@/types/models/institute.model";
import { Student } from "@/types/models/student.model";
import { Teacher } from "@/types/models/teacher.model";
import { User } from "@/types/models/user.model";
import { PublicUser } from "@/types/api/helper/public-user";
import { UserType } from "@/types/api/helper/next-auth";

export function publicUser(user: Institute, role: "institute"): PublicUser;
export function publicUser(user: Student, role: "student"): PublicUser;
export function publicUser(user: Teacher, role: "teacher"): PublicUser;
export function publicUser(user: User, role: "user"): PublicUser;

export function publicUser(
  user: Institute | Student | Teacher | User,
  role: UserType
): PublicUser {
  switch (role) {
    case "institute": {
      const institute = user as Institute;

      return {
        id: String(institute._id),
        role: "institute",
        name: institute.username ?? "Institute",
        email: institute.email,
        profile_url: institute.information?.profile_url ?? null,
        logo: institute.information?.logo ?? null,
        isVerified: institute.isVerified,
        isNew: !institute.isOnboarded,
        institute_name: institute.information?.institute_name ?? "Institute",
        institute_code: institute.information?.institute_code ?? "Institute",
      };
    }

    case "student": {
      const student = user as Student;

      return {
        id: String(student._id),
        role: "student",
        name: student.personal?.fullName ?? "Student",
        student_id: student.auth.studentId,
        profile_url: student.documents?.profilePhoto?.url ?? null,
        logo: null,
        isVerified: student.auth.verify.isVerified,
        isNew: false,
        institute_name: student.institute.institute_name,
        institute_code: student.institute.institute_code,
      };
    }

    case "teacher": {
      const teacher = user as Teacher;

      return {
        id: String(teacher._id),
        role: "teacher",
        name: teacher.personal?.name ?? "Teacher",
        teacher_id: teacher.auth.teacherId,
        profile_url: teacher.documents?.profilePhoto ?? null,
        logo: null,
        isVerified: teacher.auth.verify.isVerified,
        isNew: false,
        institute_name: teacher.institute.institute_name,
        institute_code: teacher.institute.institute_code,
      };
    }

    default:
      throw new Error("Unsupported user role");
  }
}
