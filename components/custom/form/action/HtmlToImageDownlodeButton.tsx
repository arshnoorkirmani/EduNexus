"use client";

import React, { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface HtmlToImageDownloaderProps {
  /** ID of the HTML element to render & export */
  id: string;

  /** Download file name (without extension) */
  fileName?: string;

  /** Button label */
  label?: string;

  /** Image quality */
  pixelRatio?: number;

  /** Disable externally */
  disabled?: boolean;

  /** Button class */
  buttonClassName?: string;

  /** Called before capture */
  onStart?: () => void;

  /** Called after success */
  onSuccess?: () => void;

  /** Called on error */
  onError?: (error: unknown) => void;
}

export function HtmlToImageDownloader({
  id,
  fileName = "download",
  label = "Download",
  pixelRatio = 3,
  disabled = false,
  buttonClassName,
  onStart,
  onSuccess,
  onError,
}: HtmlToImageDownloaderProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = useCallback(async () => {
    const element = document.getElementById(id);
    if (!element || loading) return;

    try {
      setLoading(true);
      onStart?.();

      // Ensure all images are loaded
      const images = element.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map(
          (img) =>
            new Promise<void>((resolve) => {
              if (img.complete) return resolve();
              img.onload = () => resolve();
              img.onerror = () => resolve();
            })
        )
      );

      // Optional: Add a small delay to ensure rendering is stable
      await new Promise((resolve) => setTimeout(resolve, 100));

      const dataUrl = await toPng(element, {
        cacheBust: false, // process locally to avoid reload flickers
        pixelRatio,
        skipAutoScale: true,
        style: {
          margin: "0", // Force reset margin during capture
          transform: "none", // Remove any scaling transforms
        },
      });

      const link = document.createElement("a");
      link.download = `${fileName}.png`;
      link.href = dataUrl;
      link.click();

      onSuccess?.();
    } catch (error) {
      console.error("HTML to Image generation failed:", error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [id, fileName, pixelRatio, loading, onStart, onSuccess, onError]);

  return (
    <Button
      type="button"
      onClick={handleDownload}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(
        "cursor-pointer gap-2 font-semibold active:scale-95 transition-transform",
        buttonClassName
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {loading ? "Generating..." : label}
    </Button>
  );
}
