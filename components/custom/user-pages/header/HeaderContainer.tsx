import React from "react";
import { Separator } from "@/components/ui/separator";

interface HeaderContainerProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function HeaderContainer({
  title,
  description,
  actions,
  children,
}: HeaderContainerProps) {
  return (
    <div className="flex flex-col h-full w-full gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <Separator />
      <div className="flex-1">{children}</div>
    </div>
  );
}
