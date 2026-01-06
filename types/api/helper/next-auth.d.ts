import { PublicUser } from "./public-user";
export type UserType = "institute" | "student" | "teacher" | "user";

declare module "next-auth" {
  interface User extends PublicUser {}

  interface JWT extends PublicUser {}

  interface Session {
    user: PublicUser;
  }
}
