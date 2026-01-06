import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogOut, Settings, User, Shield } from "lucide-react";
import { signOut } from "next-auth/react";
import { Badge } from "@/components/ui/badge";

import { ProfileAvatar } from "../../utils/ProfileAvtar";
import { useAuth } from "@/hooks/useAuth";
import { UserType } from "@/types/api/helper/next-auth";
import { roleIcons } from "../../utils/RoleBadge";
import { Button } from "@/components/ui/button";

const roleMeta: Record<UserType, { label: string }> = {
  institute: { label: "Institute Admin" },
  teacher: { label: "Teacher" },
  student: { label: "Student" },
  user: { label: "User" },
};

export function ProfileDropdown() {
  const { user, loading } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  if (loading || !user) return null;

  const meta = roleMeta[user.role];

  return (
    <>
      <DropdownMenu>
        {/* TRIGGER */}
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open profile menu"
            className="outline-none rounded-full focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ProfileAvatar
              name={user.name}
              profileUrl={user.avatar || ""}
              size="md"
              icon={roleIcons[user.role]}
              label={meta.label}
            />
          </Button>
        </DropdownMenuTrigger>

        {/* MENU */}
        <DropdownMenuContent
          align="end"
          className="w-72 rounded-xl border border-border/60 p-2 shadow-xl"
        >
          {/* USER HEADER */}
          <DropdownMenuLabel className="px-3 py-2">
            <div className="flex items-start gap-3">
              <ProfileAvatar
                name={user.name}
                profileUrl={user.avatar || ""}
                size="md"
              />

              <div className="flex flex-col min-w-0 gap-0.5">
                <span className="text-sm font-semibold truncate leading-tight">
                  {user.name}
                </span>

                <span className="text-xs text-muted-foreground truncate leading-snug">
                  {user.identifier}
                </span>

                <Badge
                  variant="secondary"
                  className="mt-1 w-fit border-0 bg-secondary/50 px-1.5 py-0 text-[10px] font-medium text-secondary-foreground"
                >
                  {meta.label}
                </Badge>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-2" />

          {/* ACTIONS */}
          <DropdownMenuItem className="gap-2 px-3 py-2.5">
            <User className="h-4 w-4 text-muted-foreground" />
            My Profile
          </DropdownMenuItem>

          <DropdownMenuItem className="gap-2 px-3 py-2.5">
            <Settings className="h-4 w-4 text-muted-foreground" />
            Account Settings
          </DropdownMenuItem>

          {user.role === "institute" && (
            <DropdownMenuItem className="gap-2 px-3 py-2.5">
              <Shield className="h-4 w-4 text-muted-foreground" />
              Institute Settings
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator className="my-2" />

          {/* LOGOUT */}
          <DropdownMenuItem
            onClick={() => setShowLogoutDialog(true)}
            className="
    gap-2 px-3 py-2.5
    cursor-pointer
    transition-all
    focus:bg-red-50 focus:text-red-600
    hover:bg-red-50 hover:text-red-600
    dark:focus:bg-red-500/10 dark:focus:text-red-400
    dark:hover:bg-red-500/10 dark:hover:text-red-400
  "
          >
            <LogOut className="h-4 w-4 opacity-80" />
            <span className="font-medium">Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out from your account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => signOut()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sign out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
