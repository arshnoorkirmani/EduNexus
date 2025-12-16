"use client";

import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

type NavLink = {
  href: string;
  label: string;
};

const ROOT_ROUTES = new Set(["/institute", "/student", "/teacher", "/admin"]);

export function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => ({
    href: "/" + segments.slice(0, index + 1).join("/"),
    label: segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  }));
}
export default function HeaderBreadcrumb() {
  const pathname = usePathname();
  const navigationLinks = generateBreadcrumbs(pathname);

  const lastIndex = navigationLinks.length - 1;

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-[10px] flex gap-0 md:gap-0">
        {navigationLinks.map((link, index) => {
          const isLast = index === lastIndex;
          const isRoot = ROOT_ROUTES.has(link.href);
          const isCurrent = isLast || isRoot;

          return (
            <React.Fragment key={link.href}>
              <BreadcrumbItem>
                {isCurrent ? (
                  <BreadcrumbPage>{link.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={link.href}
                    className="px-0 hover:text-primary"
                  >
                    {link.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
