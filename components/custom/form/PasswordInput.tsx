"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Lock, Eye, EyeOff } from "lucide-react";
import React, { forwardRef, useState } from "react";

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  error?: boolean;
  showRequirements?: boolean;
  iconShow?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      error = false,
      showRequirements = false,
      iconShow = true,
      className,
      ...props
    },
    ref
  ) => {
    const [show, setShow] = useState(false);

    return (
      <div
        className={cn(
          "relative w-full mb-10",
          showRequirements ? "mb-10" : "mb-auto"
        )}
      >
        {/* Left Icon */}
        {iconShow && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pr-2 text-muted-foreground border-r">
            <Lock className="h-4.5 w-4.5" />
          </div>
        )}
        {/* INPUT */}
        <Input
          ref={ref}
          {...props}
          type={show ? "text" : "password"}
          data-invalid={error ? "" : undefined}
          className={cn(
            "pl-3 pr-10 w-full placeholder:text-xs",
            className,
            iconShow && "pl-11"
          )}
        />

        {/* TOGGLE BUTTON */}
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-2 right-0 flex items-center justify-center mr-3 rounded-full w-fit h-fit mt-1/2 cursor-pointer text-muted-foreground"
        >
          {show ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>

        {/* REQUIREMENTS */}
        {showRequirements && (
          <p className="text-xs text-muted-foreground mt-2 absolute">
            Password must be at least 8 characters, contain an uppercase letter
            and a number.
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
