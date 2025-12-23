"use client";

// =============================
// IMPORTS
// =============================
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

// =============================
// SIZE CONFIG
// =============================
const avatarSizes = {
  sm: {
    avatar: "h-6 w-6",
    roleBadge: "h-2 w-2",
    status: "h-1.5 w-1.5",
    icon: "h-2 w-2",
    offsetRole: "-top-0.5 -right-0.5",
    offsetStatus: "bottom-0 right-0",
  },
  md: {
    avatar: "h-8 w-8",
    roleBadge: "h-3 w-3",
    status: "h-2 w-2",
    icon: "h-2.5 w-2.5",
    offsetRole: "-top-1 -right-1",
    offsetStatus: "bottom-0.5 right-0.5",
  },
  lg: {
    avatar: "h-12 w-12",
    roleBadge: "h-5 w-5",
    status: "h-3 w-3",
    icon: "h-3 w-3",
    offsetRole: "-top-1.5 -right-1.5",
    offsetStatus: "bottom-1 right-1",
  },
};

type AvatarSize = keyof typeof avatarSizes;

// =============================
// HELPERS
// =============================
function collapsedClasses(classes: string) {
  return classes
    .split(" ")
    .map((cls) => `group-data-[collapsible=icon]:${cls}`)
    .join(" ");
}

// =============================
// COMPONENT
// =============================
interface ProfileAvatarProps {
  profileUrl?: string;
  name: string;
  isBadge?: boolean; // green dot
  icon?: LucideIcon; // role badge
  label?: string; // tooltip label
  size?: AvatarSize;
  collapsed?: AvatarSize;
}

export function ProfileAvatar({
  profileUrl,
  name,
  isBadge = true,
  icon: Icon,
  label,
  size = "md",
  collapsed,
}: ProfileAvatarProps) {
  const normal = avatarSizes[size];
  const collapsedSize = collapsed ? avatarSizes[collapsed] : null;

  const showRoleBadge = Boolean(Icon);
  const showStatusDot = isBadge && !Icon;

  return (
    <div className="relative inline-flex">
      {/* AVATAR */}
      <Avatar
        className={cn(
          "border border-white/20 shadow-md transition-all",
          normal.avatar,
          collapsedSize && collapsedClasses(collapsedSize.avatar)
        )}
      >
        <AvatarImage src={profileUrl} alt={name} />
        <AvatarFallback className="uppercase">
          {name.slice(0, 2)}
        </AvatarFallback>
      </Avatar>

      {/* ROLE ICON BADGE */}
      {showRoleBadge && Icon && (
        <div
          className={cn(
            "absolute z-10 flex items-center justify-center rounded-full",
            "bg-black/70 backdrop-blur border border-white/20",
            normal.roleBadge,
            normal.offsetRole,
            collapsedSize && collapsedClasses(collapsedSize.roleBadge),
            collapsedSize && collapsedClasses(collapsedSize.offsetRole)
          )}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Icon
                className={cn(
                  normal.icon,
                  "text-white/80",
                  collapsedSize && collapsedClasses(collapsedSize.icon)
                )}
              />
            </TooltipTrigger>

            {label && <TooltipContent side="top">{label}</TooltipContent>}
          </Tooltip>
        </div>
      )}

      {/* STATUS DOT */}
      {showStatusDot && (
        <Badge
          aria-label="Online"
          className={cn(
            "absolute z-10 rounded-full bg-green-500 p-0",
            normal.status,
            normal.offsetStatus,
            collapsedSize && collapsedClasses(collapsedSize.status),
            collapsedSize && collapsedClasses(collapsedSize.offsetStatus)
          )}
        />
      )}
    </div>
  );
}
