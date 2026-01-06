"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

interface PrintButtonProps extends Omit<ButtonProps, "content" | "id"> {
  /**
   * The ID of the element to be printed.
   */
  id: string;

  /**
   * Title of the document during print (browser default filename).
   */
  documentTitle?: string;

  /**
   * If true, only the icon is shown (label is hidden).
   */
  isIconOnly?: boolean;

  /**
   * Label for the button. Defaults to 'Print'.
   */
  label?: string;

  /**
   * Custom styles for the print container.
   */
  printStyles?: string;
}

export default function PrintButton({
  id,
  documentTitle,
  isIconOnly = false,
  label = "Print",
  className,
  variant = "outline",
  printStyles,
  ...props
}: PrintButtonProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  // Helper to handle the print action
  const handlePrint = useCallback(() => {
    // 1. Set document title
    const originalTitle = document.title;
    if (documentTitle) {
      document.title = documentTitle;
    }

    setIsPrinting(true);

    // 2. Wait for a brief moment to ensure any portals/styles are applied
    // Then print
    setTimeout(() => {
      window.print();

      // Cleanup after print dialog closes (or immediately in non-blocking browsers)
      setTimeout(() => {
        setIsPrinting(false);
        document.title = originalTitle;
      }, 500);
    }, 100);
  }, [documentTitle]);

  // Handle cleanup on unmount
  useEffect(() => {
    const onAfterPrint = () => {
      setIsPrinting(false);
    };
    window.addEventListener("afterprint", onAfterPrint);
    return () => window.removeEventListener("afterprint", onAfterPrint);
  }, []);

  // Dynamic Print Styles
  const printCss = `
    @media print {
      body * {
        visibility: hidden;
      }
      /* Target our internal mount */
      #${id}, #${id} * {
        visibility: visible;
      }
      #${id} {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        margin: 0;
        padding: 0;
        z-index: 9999;
      }

      /* User provided customs */
      ${printStyles || ""}
    }
  `;

  return (
    <>
      <Button
        variant={variant}
        className={cn("gap-2 cursor-pointer", className)}
        onClick={handlePrint}
        disabled={isPrinting}
        {...props}
      >
        <Printer className="w-4 h-4" />
        {!isIconOnly && <span>{label}</span>}
      </Button>

      {/* Inject print styles */}
      <style>{printCss}</style>
    </>
  );
}
