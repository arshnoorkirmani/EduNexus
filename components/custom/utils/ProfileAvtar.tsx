// =============================
// SIZE CONFIG

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

// Convert "h-12 w-12" → "group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:w-12"
function collapsedClasses(sizeString: string) {
  return sizeString
    .split(" ")
    .map((cls) => `group-data-[collapsible=icon]:${cls}`)
    .join(" ");
}

// =============================
// COMPONENT
// =============================
interface ProfileAvatarProps {
  profileUrl: string;
  name: string;
  isBadge?: boolean;
  icon?: LucideIcon;
  label?: string;
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

  const showIconBadge = Boolean(Icon);
  const showGreenDot = isBadge && !Icon;
  return (
    <div className="relative">
      {/* AVATAR */}
      <Avatar
        className={cn(
          "border border-white/20 shadow-xl transition-all",
          normal.avatar,
          "group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8"
          // collapsedSize && collapsedClasses(collapsedSize.avatar)
        )}
      >
        <AvatarImage src={profileUrl} />
        <AvatarFallback className="uppercase">
          {name.slice(0, 2)}
        </AvatarFallback>
      </Avatar>

      {/* ROLE ICON BADGE */}
      {showIconBadge && Icon && (
        <div
          className={cn(
            "absolute bg-black/70 backdrop-blur border border-white/20 flex items-center justify-center rounded-full transition-all",
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

            {label && (
              <TooltipContent side="top">
                <p>{label}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      )}

      {/* STATUS DOT */}
      {showGreenDot && (
        <Badge
          className={cn(
            "absolute bg-green-500 p-0 rounded-full transition-all",
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
