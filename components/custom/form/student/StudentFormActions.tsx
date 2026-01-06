"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { FieldValues } from "react-hook-form";
import { useAppForm } from "../FormContext";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type FormActionsProps<T extends FieldValues> = {
  /** Submit button label */
  submitLabel?: string;

  /** Reset button label */
  resetLabel?: string;

  /** Reset confirmation title */
  resetTitle?: string;

  /** Reset confirmation description */
  resetDescription?: string;

  /** Hide reset button */
  hideReset?: boolean;

  /** Custom reset handler (recommended for ID regeneration) */
  onReset?: (form: ReturnType<typeof useAppForm<T>>["form"]) => void;

  /** Custom submit button props */
  submitProps?: React.ComponentProps<typeof Button>;
};

export function FormActions<T extends FieldValues>({
  submitLabel = "Submit",
  resetLabel = "Reset",
  resetTitle = "Reset form?",
  resetDescription = "This will clear all entered data.",
  hideReset = false,
  onReset,
  submitProps,
}: FormActionsProps<T>) {
  const { form, formId, isLoading } = useAppForm<T>();

  const isSubmitting = isLoading || form.formState.isSubmitting;
  const canReset = form.formState.isDirty && !isSubmitting;
  const handleReset = () => {
    if (onReset) {
      onReset(form);
      return;
    }

    const allValues = form.getValues();
    const studentId = allValues.auth?.studentId;
    const registrationNo = allValues.academic?.registrationNo;

    form.reset({
      auth: { studentId },
      academic: { registrationNo },
    } as unknown as T);
  };

  return (
    <div className="flex items-center justify-end gap-4">
      {/* Reset */}
      {!hideReset && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" disabled={!canReset}>
              {resetLabel}
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{resetTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {resetDescription}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel autoFocus>Cancel</AlertDialogCancel>

              <AlertDialogAction
                onClick={handleReset}
                className={cn(
                  "inline-flex items-center justify-center gap-2",
                  "bg-destructive text-destructive-foreground hover:bg-destructive/90 ",
                  "transition-colors duration-200"
                )}
              >
                {resetLabel}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Submit */}
      <Button
        type="submit"
        form={formId}
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        aria-disabled={isSubmitting}
        {...submitProps}
        className={cn(
          "inline-flex items-center justify-center gap-2",
          "min-w-[120px] font-medium",
          "transition-all duration-200",
          isSubmitting && "pointer-events-none opacity-60",
          submitProps?.className
        )}
      >
        {isSubmitting && (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}

        <span className="whitespace-nowrap">
          {isSubmitting ? "Processing…" : submitLabel}
        </span>
      </Button>
    </div>
  );
}
