import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/DatabaseConnection";
import { User as AuthUser } from "next-auth";
import { saveLoginActivity } from "@/lib/saveLoginActivity";
import { Institute } from "@/types/models/institute.model";
import { Student } from "@/types/models/student.model";
import { Teacher } from "@/types/models/teacher.model";
import { User } from "@/types/models/user.model";
import InstituteModel from "@/models/InstituteSchema";
import { PublicUser } from "@/types/api/helper/public-user";
import { UserType } from "@/types/api/helper/next-auth";
import { TeacherModel } from "@/models/TeacherSchema";
import { StudentModel } from "@/models/StudentsSchema";
// Utility: limit returned user fields
export const publicUser = (
  user: Institute | Student | Teacher | User,
  role: UserType
): PublicUser => {
  const base = {
    id: String(user._id),
    name:
      role === "institute"
        ? (user as Institute).username
        : role === "student"
        ? (user as Student).personal.name
        : (user as Teacher).personal.name,

    profile_url:
      role === "institute"
        ? (user as Institute).information?.profile_url || null
        : (user as Student | Teacher).documents?.profilePhoto || null,

    logo:
      role === "institute"
        ? (user as Institute).information?.logo || null
        : null,

    isVerified:
      (user as Institute)?.isVerified ??
      (user as Student | Teacher | User)?.auth.verify?.isVerify ??
      false,

    isNew: false,
  };

  if (role === "student") {
    return {
      ...base,
      role: "student",
      student_id: (user as Student).auth.studentId,
      logo: null,
    };
  }

  if (role === "teacher") {
    return {
      ...base,
      role: "teacher",
      teacher_id: (user as Teacher).auth.teacherId,
      logo: null,
    };
  }

  // Institute
  return {
    ...base,
    isNew: (user as Institute).isOnboarded,
    role: "institute",
    email: (user as Institute).email,
  };
};

export const authOptions: NextAuthOptions = {
  providers: [
    // ======================================================
    // 1) INSTITUTE LOGIN
    // ======================================================
    CredentialsProvider({
      id: "institute-login",
      name: "Institute",

      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req): Promise<AuthUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email & password required.");
        }

        await dbConnect();

        const institute = await InstituteModel.findOne(
          { email: credentials.email },
          {
            email: 1,
            password: 1,
            isVerified: 1,

            // correct fields:
            username: 1,
            "information.logo": 1,
            "information.profile_url": 1,
            "information.institute_name": 1,
            "information.short_name": 1,
          }
        );

        if (!institute) throw new Error("Institute not found.");
        if (!institute.isVerified)
          throw new Error("Institute account is not verified.");

        const isValid = await bcrypt.compare(
          credentials.password,
          institute.password
        );

        if (!isValid) throw new Error("Invalid password.");

        // update lastLogin
        institute.lastLogin = new Date();
        await institute.save();

        // save login activity
        await saveLoginActivity({
          user: institute,
          role: "institute",
          institute_id: String(institute._id),
          ip: req?.headers?.["x-forwarded-for"]?.toString() || "",
          userAgent: req?.headers?.["user-agent"]?.toString() || "",
        });

        // ---------------------------
        //  RETURN FULL TYPED USER
        // ---------------------------
        return publicUser(institute, "institute");
      },
    }),

    // =======================
    // 2) TEACHER LOGIN
    // =======================
    CredentialsProvider({
      id: "teacher-login",
      name: "Teacher",

      credentials: {
        teacherId: { label: "Teacher ID", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req): Promise<AuthUser | null> {
        if (!credentials?.teacherId || !credentials?.password)
          throw new Error("Teacher ID and password required.");

        await dbConnect();

        const teacher = await TeacherModel.findOne(
          { "auth.teacherId": credentials.teacherId },
          { auth: 1, personal: 1, documents: 1, institute: 1 }
        );

        if (!teacher) throw new Error("Teacher not found.");
        if (!teacher.auth.verify.isActive) throw new Error("Teacher inactive.");

        const valid = await bcrypt.compare(
          credentials.password,
          teacher.auth.password
        );
        if (!valid) throw new Error("Invalid password.");

        teacher.auth.lastLogin = new Date();
        await teacher.save();

        await saveLoginActivity({
          user: teacher,
          role: "teacher",
          institute_id: String(teacher.institute.instituteId),
          ip: req?.headers?.["x-forwarded-for"]?.toString() || "",
          userAgent: req?.headers?.["user-agent"]?.toString() || "",
        });

        return publicUser(teacher, "teacher");
      },
    }),

    // =======================
    // 3) STUDENT LOGIN
    // =======================
    CredentialsProvider({
      id: "student-login",
      name: "Student",

      credentials: {
        studentId: { label: "Student ID", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req): Promise<AuthUser | null> {
        if (!credentials?.studentId || !credentials?.password)
          throw new Error("Student ID and password required.");

        await dbConnect();

        const student = await StudentModel.findOne(
          { "auth.studentId": credentials.studentId },
          { auth: 1, personal: 1, documents: 1, institute: 1 }
        );

        if (!student) throw new Error("Student not found.");
        if (!student.auth.verify.isActive) throw new Error("Account inactive.");

        const valid = await bcrypt.compare(
          credentials.password,
          student.auth.password
        );
        if (!valid) throw new Error("Invalid password.");

        student.auth.lastLogin = new Date();
        await student.save();

        await saveLoginActivity({
          user: student,
          role: "student",
          institute_id: String(student.institute.instituteId),
          ip: req?.headers?.["x-forwarded-for"]?.toString() || "",
          userAgent: req?.headers?.["user-agent"]?.toString() || "",
        });

        return publicUser(student, "student");
      },
    }),
  ],

  // ======================================================
  // PAGES
  // ======================================================
  pages: {
    signIn: "/",
    error: "/",
  },

  // ======================================================
  // CALLBACKS
  // ======================================================
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return baseUrl + url;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },

    async jwt({ token, user }) {
      if (user) Object.assign(token, user);
      return token;
    },

    async session({ session, token }) {
      session.user = token as unknown as PublicUser;
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
