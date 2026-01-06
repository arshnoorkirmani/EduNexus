import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  onLogout: () => void;
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function LogoutButton({
  onLogout,
  label = "Logout",
  loading = false,
  disabled = false,
  className,
}: LogoutButtonProps) {
  return (
    <AlertDialog>
      {/* Trigger Button */}
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          disabled={loading || disabled}
          className={cn(
            "w-full mt-1 flex items-center gap-2 border border-destructive/40 rounded-lg cursor-pointer",
            "text-destructive transition-all",
            "hover:bg-destructive/20 hover:text-destructive",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            "focus-visible:ring-2 focus-visible:ring-destructive/40",
            className
          )}
        >
          <LogOut
            className={cn(
              "h-4 w-4 transition-opacity",
              loading && "opacity-50"
            )}
          />
          {loading ? "Processing..." : label}
        </Button>
      </AlertDialogTrigger>

      {/* Dialog */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to log out from your account?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={onLogout}
            disabled={loading}
            className={cn(
              "bg-destructive text-white",
              "hover:bg-destructive/90",
              "transition-all",
              "disabled:opacity-60 disabled:cursor-not-allowed"
            )}
          >
            {loading ? "Processing..." : "Logout"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
