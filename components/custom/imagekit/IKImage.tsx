"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { imageService, TransformOptions } from "@/lib/utils/image-service";
import Image, { ImageProps } from "next/image";

interface IKImageProps extends Omit<ImageProps, "src" | "alt"> {
  src?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  skeletonClassName?: string;
  transformation?: TransformOptions;
  fallbackIcon?: React.ReactNode;
}

export function IKImage({
  src,
  alt,
  className,
  containerClassName,
  skeletonClassName,
  transformation,
  fallbackIcon,
  ...props
}: IKImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // If there's no src or it errored out, show fallback immediately
  if (!src || hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-slate-100 text-slate-400 w-full h-full",
          containerClassName,
          className
        )}
      >
        {fallbackIcon || <span className="text-xs font-medium">No Image</span>}
      </div>
    );
  }

  const optimizedSrc = imageService.getImageUrl(src, transformation);

  return (
    <div className={cn("relative overflow-hidden w-full h-full", containerClassName)}>
      {/* Skeleton Loader */}
      {!isLoaded && (
        <div
          className={cn(
            "absolute inset-0 bg-slate-200 animate-pulse",
            skeletonClassName
          )}
        />
      )}

      {/* Actual Image */}
      <Image
        src={optimizedSrc}
        alt={alt}
        fill
        unoptimized // Optimization is primarily handled by the ImageKit edge CDN URLs automatically.
        crossOrigin="anonymous" // Required for html-to-image exports
        className={cn(
          "transition-opacity duration-300 ease-in-out",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setIsLoaded(true);
          setHasError(true);
        }}
        {...props}
      />
    </div>
  );
}
