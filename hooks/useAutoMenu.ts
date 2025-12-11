// hooks/useAutoMenu.ts
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { setActiveRole } from "@/components/custom/sidebar/menus";
import type { Role } from "@/types/navigation";

/**
 * Auto-detects the user role from the auth slice and sets active role in sidebar slice.
 * Fallback: if no role found, defaults to 'user'.
 */
export const useAutoDetectRole = () => {
  const dispatch = useDispatch();
  const authRole = useSelector(
    (s: RootState) => (s as any).auth?.role as Role | undefined
  );

  useEffect(() => {
    const role: Role = authRole ?? "user";
    dispatch(setActiveRole(role));
  }, [authRole, dispatch]);
};
