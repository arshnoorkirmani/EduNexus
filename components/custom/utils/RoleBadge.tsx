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

/* ---------------------------------------------------------
   ROLE → ICON MAPPING
--------------------------------------------------------- */
export const roleIcons: Record<string, LucideIcon> = {
  institute: Shield,
  teacher: GraduationCap,
  student: UserCheck,
  user: Users2,
  verified: Verified, // ✔ Verified
  pending: Clock, // ⏳ Waiting approval
  blocked: Ban, // 🚫 Blocked
  inactive: UserX,
  unverified: Shield,
};

/* ---------------------------------------------------------
   PROPS
--------------------------------------------------------- */
interface RoleBadgeProps {
  role?: UserType;
  size?: number;
  className?: string;
  showTooltip?: boolean;
  description?: string;
}

/* ---------------------------------------------------------
   COMPONENT
--------------------------------------------------------- */
export function RoleBadge({
  role = "user",
  size = 18,
  className = "",
  showTooltip = true,
  description,
}: RoleBadgeProps) {
  const Icon = roleIcons[role] || Users2;

  const icon = (
    <Icon
      className={`text-neutral-300 opacity-80 ${className}`}
      style={{ width: size, height: size }}
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
