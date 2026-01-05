"use client";

import { FieldValues, Path, UseFormReturn } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TimeInput } from "./timeInput";
import { DateInput } from "./date-input";
import { PasswordInput } from "../PasswordInput";
import { cn } from "@/lib/utils";
import { useAppForm } from "../FormContext";
import { Loader } from "lucide-react";
import { forwardRef } from "react";

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

type FieldType =
  | "text"
  | "email"
  | "number"
  | "password"
  | "textarea"
  | "date"
  | "time";

export interface FieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  type?: FieldType;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  parentClassName?: string;
  /** UX helpers */
  required?: boolean;
  description?: string;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

export function Field<T extends FieldValues>({
  form,
  name,
  label,
  type = "text",
  placeholder,
  disabled = false,
  required = false,
  loading = false,
  description,
  parentClassName,
  className,
}: FieldProps<T>) {
  const { isLoading } = useAppForm<T>?.();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        const value = field.value ?? "";

        return (
          <FormItem className={cn("space-y-1.5", parentClassName)}>
            {/* LABEL */}
            <FormLabel className="text-sm font-medium flex items-center gap-1">
              {label}

              {required && <span className="text-destructive">*</span>}
            </FormLabel>

            {/* OPTIONAL DESCRIPTION */}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}

            <FormControl>
              <FieldWithLoader
                loading={loading}
                type={type}
                field={field}
                value={value}
                placeholder={placeholder}
                disabled={disabled || isLoading}
                className={className}
                error={fieldState.error}
              />
            </FormControl>

            {/* ERROR MESSAGE */}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Render Helper                                                               */
/* -------------------------------------------------------------------------- */
export interface FieldWithLoaderProps {
  type: FieldType;
  field?: any;
  value?: any;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  error?: any;
}

export const FieldWithLoader = forwardRef<
  HTMLInputElement,
  FieldWithLoaderProps
>(
  (
    {
      type,
      field,
      value,
      placeholder,
      disabled = false,
      loading = false,
      className,
      error,
    },
    ref
  ) => {
    const commonClass = cn(
      className,
      (disabled || loading) &&
        "text-base disabled:opacity-70 pointer-events-none",
      error && "border-destructive focus-visible:ring-destructive/20"
    );

    return (
      <div className="relative w-full">
        {(() => {
          switch (type) {
            case "password":
              return (
                <PasswordInput
                  ref={ref}
                  {...field}
                  value={value}
                  placeholder={placeholder}
                  disabled={disabled || loading}
                  iconShow={false}
                  error={!!error}
                  aria-invalid={!!error}
                  className={commonClass}
                />
              );

            case "textarea":
              return (
                <Textarea
                  {...field}
                  value={value}
                  placeholder={placeholder}
                  disabled={disabled || loading}
                  aria-invalid={!!error}
                  className={cn("resize-none", commonClass)}
                />
              );

            case "time":
              return (
                <TimeInput
                  value={field?.value}
                  onChange={field?.onChange}
                  disabled={disabled || loading}
                  aria-invalid={!!error}
                  className={commonClass}
                />
              );

            case "date":
              return (
                <DateInput
                  value={field?.value}
                  onChange={field?.onChange}
                  disabled={disabled || loading}
                  aria-invalid={!!error}
                  className={commonClass}
                />
              );

            default:
              return (
                <Input
                  ref={ref}
                  {...field}
                  value={value}
                  type={type}
                  aria-invalid={!!error}
                  placeholder={placeholder}
                  disabled={disabled || loading}
                  className={commonClass}
                />
              );
          }
        })()}

        {loading && (
          <Loader className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>
    );
  }
);

FieldWithLoader.displayName = "FieldWithLoader";
