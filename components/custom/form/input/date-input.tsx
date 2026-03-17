"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

export interface DateInputProps {
  value?: Date;
  onChange?: (date?: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;

  /** shadcn-style invalid state */
  invalid?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

export const DateInput = React.forwardRef<HTMLButtonElement, DateInputProps>(
  (
    {
      value,
      onChange,
      placeholder = "Pick a date",
      disabled,
      invalid,
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {/* INPUT-LOOK BUTTON */}
          <button
            ref={ref}
            type="button"
            disabled={disabled}
            aria-label="Select date"
            aria-invalid={invalid || undefined}
            data-invalid={invalid || undefined}
            className={cn(
              // Base shadcn input styles
              " h-9 w-full rounded-md border px-3 py-2 text-sm",
              "flex items-center justify-between",
              "bg-input/30 text-foreground",
              "cursor-text",

              // Focus
              "focus-visible:outline-none focus-visible:ring-2",

              // Default state
              "border-input focus-visible:ring-ring",

              // ❌ Invalid state (shadcn pattern)
              invalid && "border-destructive focus-visible:ring-destructive",

              // Disabled
              "disabled:cursor-not-allowed disabled:opacity-50",

              className
            )}
          >
            <span
              className={cn("text-left", !value && "text-muted-foreground")}
            >
              {value ? format(value, "dd/MM/yyyy") : placeholder}
            </span>

            <CalendarIcon
              className={cn(
                "h-4 w-4",
                invalid ? "text-destructive" : "opacity-60"
              )}
            />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-auto rounded-xl p-0 shadow-lg"
        >
          <Calendar
            mode="single"
            selected={value}
            defaultMonth={value}
            onSelect={(date) => {
              if (!date) {
                onChange?.(undefined);
              } else {
                // Ensure we pass a clean Date object (removes time component to avoid timezone shifts)
                onChange?.(new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())));
              }
              setOpen(false); // Hide the calendar after selection
            }}
            initialFocus
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
    );
  }
);

DateInput.displayName = "DateInput";
