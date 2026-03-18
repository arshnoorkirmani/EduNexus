"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Hammer } from "lucide-react";

import HeaderContainer from "@/components/custom/user-pages/header/HeaderContainer";
import { Card, CardContent } from "@/components/ui/card";

export default function CatchAllPage() {
  const params = useParams();

  // Handle the catch-all route segment
  const pageParam = params?.page;
  const parts = Array.isArray(pageParam)
    ? pageParam
    : typeof pageParam === "string"
    ? [pageParam]
    : ["Page"];
  const pageName = parts[parts.length - 1];

  // Format title (e.g., user-permissions -> User Permissions)
  const title = pageName
    ? pageName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Module";

  return (
    <HeaderContainer
      title={title}
      description={`Manage your ${title.toLowerCase()} settings and operations.`}
    >
      <Card className="mt-8 border-dashed border-border/40 bg-gradient-to-br from-background/70 to-muted/40 backdrop-blur-md shadow-sm">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center min-h-[55vh]">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6 border border-primary/20">
            <Hammer className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {title} Module
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md text-sm">
            This section is currently under development. The complete{" "}
            {title.toLowerCase()} management features will be available in the
            upcoming updates.
          </p>
        </CardContent>
      </Card>
    </HeaderContainer>
  );
}
