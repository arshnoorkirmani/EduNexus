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
  description,
  parentClassName,
  className,
}: FieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
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
              {renderField({
                type,
                field,
                value,
                placeholder,
                disabled,
                className,
              })}
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

function renderField({
  type,
  field,
  value,
  placeholder,
  disabled,
  className,
}: {
  type: FieldType;
  field: any;
  value: any;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  switch (type) {
    case "password":
      return (
        <PasswordInput
          {...field}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          iconShow={false}
          className={cn(className)}
        />
      );
    case "textarea":
      return (
        <Textarea
          {...field}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          className={cn("resize-none", className)}
        />
      );

    case "time":
      return (
        <TimeInput
          value={field.value}
          onChange={field.onChange}
          disabled={disabled}
          className={cn(className)}
        />
      );

    case "date":
      return (
        <DateInput
          value={field.value}
          onChange={field.onChange}
          disabled={disabled}
          className={cn(className)}
        />
      );

    default:
      return (
        <Input
          {...field}
          value={value}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(className)}
        />
      );
  }
}
