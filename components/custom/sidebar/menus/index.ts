// menus/index.ts
import { INSTITUTE_MENU } from "./institute.menu";
import { TEACHER_MENU } from "./teacher.menu";
import { STUDENT_MENU } from "./student.menu";
import { USER_MENU } from "./user.menu";
import { MenuConfig } from "@/types/menu";
import { InstitutePermissions } from "@/types/models/institute.model";
export const MENUS: MenuConfig = {
  institute: INSTITUTE_MENU,
  teacher: TEACHER_MENU,
  student: STUDENT_MENU,
  user: USER_MENU,
};

export const checkPathPermission = (
  permissions: InstitutePermissions | undefined,
  path?: string
): boolean => {
  // No permission path → public access
  if (!path) return true;

  // No permissions loaded
  if (!permissions) return false;

  // Super admin / owner
  if (permissions.super === true) return true;

  // Safe deep access
  const value = path.split(".").reduce((acc: any, key) => {
    if (acc == null) return undefined;
    return acc[key];
  }, permissions);

  return value === true;
};
export function hasMenuPermission({
  role,
  institute,
  itemId,
}: {
  role: string;
  institute: any;
  itemId: string;
}): boolean {
  // Institute → strict permission check
  if (role === "institute") {
    return checkPathPermission(institute?.permissions, itemId);
  }

  // Student / Teacher / User
  // (menus already define allowed routes)
  return true;
}
