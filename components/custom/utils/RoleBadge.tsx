"use client";

import {
  Ban,
  Clock,
  GraduationCap,
  LucideIcon,
  Shield,
  UserCheck,
  Users2,
  UserX,
  Verified,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { UserType } from "@/types/api/helper/next-auth";

// Define status types separately from user types
type UserStatus =
  | "verified"
  | "pending"
  | "blocked"
  | "inactive"
  | "unverified";

/* ---------------------------------------------------------
   ROLE → ICON MAPPING
--------------------------------------------------------- */
export const roleIcons: Record<UserType | UserStatus, LucideIcon> = {
  // User types
  institute: Shield,
  teacher: GraduationCap,
  student: UserCheck,
  user: Users2,

  // Status types
  verified: Verified,
  pending: Clock,
  blocked: Ban,
  inactive: UserX,
  unverified: Shield,
};

/* ---------------------------------------------------------
   PROPS
--------------------------------------------------------- */
interface RoleBadgeProps {
  role?: UserType | UserStatus;
  size?: number;
  className?: string;
  showTooltip?: boolean;
  description?: string;
}

/* ---------------------------------------------------------
   COMPONENT
--------------------------------------------------------- */
export default function RoleBadge({
  role = "user",
  size = 18,
  className = "",
  showTooltip = true,
  description,
}: RoleBadgeProps) {
  // Safely get the icon, fallback to Users2 if not found
  const Icon = roleIcons[role as keyof typeof roleIcons] || Users2;

  const icon = (
    <Icon
      className={`text-neutral-300 opacity-80 ${className}`}
      style={{ width: size, height: size }}
      aria-label={description || `User role: ${role}`}
    />
  );

  if (!showTooltip) return icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{icon}</TooltipTrigger>
      <TooltipContent side="top" className="capitalize">
        <p>{description || role}</p>
      </TooltipContent>
    </Tooltip>
  );
}

// Export as named export for backward compatibility
export { RoleBadge };
