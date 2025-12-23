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

type FormActionsProps<T extends FieldValues> = {
  /** Submit button label */
  submitLabel?: string;
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
  const { form } = useAppForm<T>();

  const handleReset = () => {
    if (onReset) {
      onReset(form);
    } else {
      form.reset();
    }
  };

  return (
    <div className="flex items-center justify-end gap-4">
      {/* Reset */}
      {!hideReset && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" disabled={!form.formState.isDirty}>
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
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleReset}
                className="bg-destructive text-destructive-foreground"
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
        disabled={form.formState.isSubmitting}
        {...submitProps}
      >
        {submitLabel}
      </Button>
    </div>
  );
}
