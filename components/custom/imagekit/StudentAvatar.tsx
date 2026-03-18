import React from "react";
import { cn } from "@/lib/utils";
import { User2 } from "lucide-react";
import { IKImage } from "./IKImage";

export interface StudentAvatarProps {
  src?: string;
  alt?: string;
  className?: string;
  innerClassName?: string;
  imageClassName?: string;
  size?: number | string;
  width?: number | string;
  height?: number | string;
  shape?: "square" | "portrait";
  uniqueId?: string;
  withHoverZoom?: boolean;
  withGlow?: boolean;
  fallbackIcon?: React.ReactNode;
}

export function StudentAvatar({
  src,
  alt = "Student Avatar",
  className,
  innerClassName,
  imageClassName,
  size,
  width,
  height,
  shape = "square",
  uniqueId,
  withHoverZoom = true,
  withGlow = true,
  fallbackIcon,
}: StudentAvatarProps) {
  const finalUrl = src ? (uniqueId ? `${src}?uid=${uniqueId}` : src) : undefined;

  // Resolve dimensions
  const finalWidth = width ?? size ?? (shape === "square" ? 96 : 85);
  const finalHeight = height ?? size ?? (shape === "square" ? 96 : 102);

  const txWidth = 600;
  const txHeight = shape === "square" ? 600 : 720;

  return (
    <div
      style={{ width: finalWidth, height: finalHeight }}
      className={cn(
        "relative shrink-0 flex flex-col items-center justify-center bg-slate-100",
        shape === "square" ? "rounded-2xl" : "rounded-sm",
        "border border-slate-200",
        withGlow && "shadow-lg shadow-black/5",
        withHoverZoom && "group cursor-default",
        className
      )}
    >
      <IKImage
        src={finalUrl}
        alt={alt}
        containerClassName={cn(
          "w-full h-full shrink-0 overflow-hidden",
          shape === "square" ? "rounded-2xl" : "rounded-sm",
          innerClassName
        )}
        className={cn(
          "object-cover",
          withHoverZoom && "transition-transform duration-500 ease-out group-hover:scale-110",
          imageClassName
        )}
        fallbackIcon={
          fallbackIcon || <User2 className="w-1/2 h-1/2 text-slate-400" />
        }
        transformation={{
          width: txWidth,
          height: txHeight,
          quality: 100,
          focus: "auto",
        }}
      />
    </div>
  );
}
