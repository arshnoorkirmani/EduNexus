"use client";

import { GraduationCap, Shield, UserCheck, Users2 } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

/* ---------------------------------------------------------
   ROLE → ICON MAPPING
--------------------------------------------------------- */
export const roleIcons: Record<string, any> = {
  Administrator: Shield,
  Teacher: GraduationCap,
  Student: UserCheck,
  User: Users2,
};

/* ---------------------------------------------------------
   PROPS
--------------------------------------------------------- */
interface RoleBadgeProps {
  role?: string;
  size?: number;
  className?: string;
  showTooltip?: boolean;
  description?: string;
}

/* ---------------------------------------------------------
   COMPONENT
--------------------------------------------------------- */
export function RoleBadge({
  role = "User",
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

      <TooltipContent side="top">
        <p>{description || role}</p>
      </TooltipContent>
    </Tooltip>
  );
}
